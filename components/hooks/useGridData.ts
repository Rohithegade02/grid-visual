import { isChunkLoaded } from '@/database/database';
import { CellData } from '@/types/grid.types';
import { getChunkForRow } from '@/utils/dataGenerator';
import { useCallback, useRef, useState } from 'react';
import { useDatabase } from './useDatabase';

interface UseGridDataResult {
    getCellData: (rowIndex: number, columnIndex: number) => CellData | undefined;
    isCellLoading: (rowIndex: number, columnIndex: number) => boolean;
    loadCellData: (rowIndex: number, columnIndex: number) => void;
    isInitialized: boolean;
    loadingProgress: number;
    totalChunks: number;
    getCachedCellsCount: () => number;
    onDbReadComplete?: (time: number) => void;
}

export const useGridData = (onDbReadComplete?: (time: number) => void): UseGridDataResult => {
    const { isInitialized, loadingProgress, totalChunks, getCellsInRange } = useDatabase();

    // In-memory cache for quick access
    const [cellCache, setCellCache] = useState<Map<string, CellData>>(new Map());
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());

    // Track ongoing range fetches to prevent duplicates
    const fetchingRanges = useRef<Set<string>>(new Set());

    const getCacheKey = useCallback((rowIndex: number, columnIndex: number): string => {
        return `${rowIndex}-${columnIndex}`;
    }, []);

    const getRangeKey = useCallback((startRow: number, endRow: number, startCol: number, endCol: number): string => {
        return `${startRow}-${endRow}-${startCol}-${endCol}`;
    }, []);

    const getCachedCellsCount = useCallback(() => {
        return cellCache.size;
    }, [cellCache]);

    /**
     * Get cell data from cache
     */
    const getCellData = useCallback(
        (rowIndex: number, columnIndex: number): CellData | undefined => {
            const key = getCacheKey(rowIndex, columnIndex);
            return cellCache.get(key);
        },
        [cellCache, getCacheKey]
    );

    /**
     * Check if cell is currently loading
     */
    const isCellLoading = useCallback(
        (rowIndex: number, columnIndex: number): boolean => {
            const key = getCacheKey(rowIndex, columnIndex);
            return loadingCells.has(key);
        },
        [loadingCells, getCacheKey]
    );

    /**
     * Load cell data from database
     */
    const loadCellData = useCallback(
        (rowIndex: number, columnIndex: number): void => {
            const key = getCacheKey(rowIndex, columnIndex);

            // Skip if already loaded or loading
            if (cellCache.has(key) || loadingCells.has(key)) {
                return;
            }

            // Determine which chunk this cell belongs to
            const chunkIndex = getChunkForRow(rowIndex);

            // Check if chunk is loaded
            if (!isChunkLoaded(chunkIndex)) {
                return; // Don't try to fetch if chunk isn't loaded
            }

            // Calculate range
            const startRow = Math.max(0, rowIndex - 10);
            const endRow = Math.min(99999, rowIndex + 10);
            const startCol = Math.max(0, columnIndex - 5);
            const endCol = Math.min(99, columnIndex + 5);

            const rangeKey = getRangeKey(startRow, endRow, startCol, endCol);

            // Skip if this range is already being fetched
            if (fetchingRanges.current.has(rangeKey)) {
                return;
            }

            // Mark cell as loading
            setLoadingCells((prev) => new Set(prev).add(key));

            // Mark range as being fetched
            fetchingRanges.current.add(rangeKey);

            // Track DB read time
            const startTime = performance.now();

            // Fetch cells
            getCellsInRange(startRow, endRow, startCol, endCol)
                .then((cellsMap) => {
                    const endTime = performance.now();
                    const readTime = endTime - startTime;

                    // Report DB read time
                    if (onDbReadComplete) {
                        onDbReadComplete(readTime);
                    }

                    // Update cache with fetched cells
                    setCellCache((prev) => {
                        const newCache = new Map(prev);
                        cellsMap.forEach((value, cellKey) => {
                            const [r, c] = cellKey.split('-').map(Number);
                            newCache.set(cellKey, {
                                rowIndex: r,
                                columnIndex: c,
                                value,
                                isLoaded: true,
                            });
                        });
                        return newCache;
                    });

                    setLoadingCells((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(key);
                        return newSet;
                    });
                })
                .catch((error) => {
                    console.error(`❌ Failed to fetch cells:`, error);
                    setLoadingCells((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(key);
                        return newSet;
                    });
                })
                .finally(() => {
                    // Remove range from fetching set
                    fetchingRanges.current.delete(rangeKey);
                });
        },
        [cellCache, loadingCells, getCacheKey, getRangeKey, getCellsInRange, onDbReadComplete]
    );

    return {
        getCellData,
        isCellLoading,
        loadCellData,
        isInitialized,
        loadingProgress,
        totalChunks,
        getCachedCellsCount,
    };
};
