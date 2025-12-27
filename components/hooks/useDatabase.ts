import {
    getCellsInRange as dbGetCellsInRange,
    loadChunk as dbLoadChunk,
    getLoadedChunksCount,
    getLoadingProgress,
    initDatabase,
    isChunkLoaded
} from '@/database/database';
import { calculateTotalChunks } from '@/utils/dataGenerator';
import { useCallback, useEffect, useState } from 'react';

interface UseDatabaseResult {
    isInitialized: boolean;
    loadingProgress: number;
    totalChunks: number;
    loadedChunksCount: number;
    error: string | null;
    loadChunk: (chunkIndex: number) => Promise<void>;
    getCellsInRange: (startRow: number, endRow: number, startCol: number, endCol: number) => Promise<Map<string, string>>;
    isChunkLoaded: (chunkIndex: number) => boolean;
}

const TOTAL_ROWS = 100000;

// Singleton state to prevent multiple initializations
let globalIsInitialized = false;
let globalLoadingProgress = 0;

export const useDatabase = (): UseDatabaseResult => {
    const [isInitialized, setIsInitialized] = useState<boolean>(globalIsInitialized);
    const [loadingProgress, setLoadingProgress] = useState<number>(globalLoadingProgress);
    const [error, setError] = useState<string | null>(null);

    const totalChunks = calculateTotalChunks(TOTAL_ROWS);
    const loadedChunksCount = getLoadedChunksCount();

    // Initialize database on mount (only once globally)
    useEffect(() => {
        if (globalIsInitialized) {
            setIsInitialized(true);
            setLoadingProgress(globalLoadingProgress);
            return;
        }

        const init = async () => {
            try {
                await initDatabase();
                const progress = await getLoadingProgress();
                globalLoadingProgress = progress;
                globalIsInitialized = true;
                setLoadingProgress(progress);
                setIsInitialized(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Database initialization failed');
                console.error('Database init error:', err);
            }
        };

        init();
    }, []);

    /**
     * Load a chunk of data into the database
     */
    const loadChunk = useCallback(async (chunkIndex: number): Promise<void> => {
        try {
            await dbLoadChunk(chunkIndex);
            const progress = await getLoadingProgress();
            globalLoadingProgress = progress;
            setLoadingProgress(progress);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load chunk');
            throw err;
        }
    }, []);

    /**
     * Get multiple cells in a range (optimized for viewport)
     */
    const getCellsInRange = useCallback(
        async (startRow: number, endRow: number, startCol: number, endCol: number): Promise<Map<string, string>> => {
            return dbGetCellsInRange(startRow, endRow, startCol, endCol);
        },
        []
    );

    return {
        isInitialized,
        loadingProgress,
        totalChunks,
        loadedChunksCount,
        error,
        loadChunk,
        getCellsInRange,
        isChunkLoaded,
    };
};
