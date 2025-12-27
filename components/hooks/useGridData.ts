import { CellData } from '@/types/grid.types';
import { getChunkForRow } from '@/utils/dataGenerator';
import { useCallback, useState } from 'react';
import { useDatabase } from './useDatabase';

interface UseGridDataResult {
    getCellData: (rowIndex: number, columnIndex: number) => CellData | undefined;
    isCellLoading: (rowIndex: number, columnIndex: number) => boolean;
    loadCellData: (rowIndex: number, columnIndex: number) => void;
    isInitialized: boolean;
    loadingProgress: number;
    totalChunks: number;
}

export const useGridData = (): UseGridDataResult => {
    const {
        isInitialized,
        loadingProgress,
        totalChunks,
        loadChunk,
        getCellsInRange
    } = useDatabase();

    // In-memory cache for quick access
    const [cellCache, setCellCache] = useState<Map<string, CellData>>(new Map());
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());
    const [loadingChunks, setLoadingChunks] = useState<Set<number>>(new Set());

    const getCacheKey = useCallback((rowIndex: number, columnIndex: number): string => {
        return `${rowIndex}-${columnIndex}`;
    }, []);

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

            // Load the chunk if not already loading
            if (!loadingChunks.has(chunkIndex)) {
                setLoadingChunks((prev) => new Set(prev).add(chunkIndex));

                loadChunk(chunkIndex)
                    .then(async () => {
                        // After chunk is loaded, fetch cells in a range around the requested cell
                        const startRow = Math.max(0, rowIndex - 10);
                        const endRow = rowIndex + 10;
                        const startCol = Math.max(0, columnIndex - 5);
                        const endCol = Math.min(99, columnIndex + 5);

                        const cellsMap = await getCellsInRange(startRow, endRow, startCol, endCol);

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
                        console.error(`Failed to load chunk ${chunkIndex}:`, error);
                        setLoadingCells((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(key);
                            return newSet;
                        });
                    })
                    .finally(() => {
                        setLoadingChunks((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(chunkIndex);
                            return newSet;
                        });
                    });
            }

            // Mark cell as loading
            setLoadingCells((prev) => new Set(prev).add(key));
        },
        [cellCache, loadingCells, loadingChunks, getCacheKey, loadChunk, getCellsInRange]
    );

    return {
        getCellData,
        isCellLoading,
        loadCellData,
        isInitialized,
        loadingProgress,
        totalChunks,
    };
};
