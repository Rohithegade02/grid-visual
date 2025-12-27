import { useCallback, useEffect, useState } from 'react';
import { GridCell } from '../database/models/GridCell';
import { cellCache } from '../services/cacheManager';
import { fetchAndStoreChunk, getCellsInRange } from '../services/dataFetcher';

interface UseGridDataReturn {
    isLoading: boolean;
    progress: { current: number; total: number };
    getCell: (rowIndex: number, columnIndex: number) => GridCell | null;
    loadCellsInRange: (
        startRow: number,
        endRow: number,
        startCol: number,
        endCol: number
    ) => Promise<void>;
    dbReadTime: number;
}

/**
 * Custom hook for managing grid data fetching and caching
 */
export const useGridData = (): UseGridDataReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 100 });
    const [dbReadTime, setDbReadTime] = useState(0);

    /**
     * Load initial chunks on mount
     */
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            // Load first 5 chunks (5000 rows) on startup
            for (let i = 0; i < 5; i++) {
                await fetchAndStoreChunk(i);
                setProgress({ current: i + 1, total: 5 });
            }
            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    /**
     * Gets a cell from cache
     */
    const getCell = useCallback(
        (rowIndex: number, columnIndex: number): GridCell | null => {
            return cellCache.get(rowIndex, columnIndex);
        },
        []
    );

    /**
     * Loads cells in a specific range from DB and caches them
     */
    const loadCellsInRange = useCallback(
        async (
            startRow: number,
            endRow: number,
            startCol: number,
            endCol: number
        ): Promise<void> => {
            const startTime = performance.now();

            try {
                const cells = await getCellsInRange(startRow, endRow, startCol, endCol);
                cellCache.setMany(cells);

                const endTime = performance.now();
                setDbReadTime(endTime - startTime);
            } catch (error) {
                console.error('Error loading cells:', error);
            }
        },
        []
    );

    return {
        isLoading,
        progress,
        getCell,
        loadCellsInRange,
        dbReadTime,
    };
};
