import { getLoadedChunksCount, getLoadingProgress, initDatabase, isChunkLoaded, loadChunk } from '@/database/database';
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
let isLoadingInitialData = false;

export const useDatabase = (): UseDatabaseResult => {
    const [isInitialized, setIsInitialized] = useState<boolean>(globalIsInitialized);
    const [loadingProgress, setLoadingProgress] = useState<number>(globalLoadingProgress);
    const [error, setError] = useState<string | null>(null);

    const totalChunks = calculateTotalChunks(TOTAL_ROWS);
    const loadedChunksCount = getLoadedChunksCount();

    // Initialize database and load first chunk immediately
    useEffect(() => {
        if (globalIsInitialized || isLoadingInitialData) {
            setIsInitialized(true);
            setLoadingProgress(globalLoadingProgress);
            return;
        }

        isLoadingInitialData = true;

        const init = async () => {
            try {
                // Initialize database
                await initDatabase();

                // Load first 1000 rows immediately from JSON
                console.log('🚀 Loading first 1000 rows immediately...');
                await loadChunk(0);

                const progress = await getLoadingProgress();
                globalLoadingProgress = progress;
                globalIsInitialized = true;
                setLoadingProgress(progress);
                setIsInitialized(true);

                console.log('✅ Initial data loaded! Grid ready to display.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Database initialization failed');
                console.error('Database init error:', err);
            } finally {
                isLoadingInitialData = false;
            }
        };

        init();
    }, []);

    /**
     * Load a chunk of data into the database
     */
    const loadChunkWrapper = useCallback(async (chunkIndex: number): Promise<void> => {
        try {
            await loadChunk(chunkIndex);
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
            const { getCellsInRange: dbGetCellsInRange } = await import('@/database/database');
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
        loadChunk: loadChunkWrapper,
        getCellsInRange,
        isChunkLoaded,
    };
};
