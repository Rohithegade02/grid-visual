import { CellData } from '@/types/grid.types';
import { useCallback, useState } from 'react';

interface UseGridDataResult {
    getCellData: (rowIndex: number, columnIndex: number) => CellData | undefined;
    isCellLoading: (rowIndex: number, columnIndex: number) => boolean;
    loadCellData: (rowIndex: number, columnIndex: number) => void;
}

export const useGridData = (): UseGridDataResult => {
    // In-memory cache for cell data
    // Key format: "row-column"
    const [cellCache, setCellCache] = useState<Map<string, CellData>>(new Map());
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());

    const getCacheKey = useCallback((rowIndex: number, columnIndex: number): string => {
        return `${rowIndex}-${columnIndex}`;
    }, []);

    const getCellData = useCallback(
        (rowIndex: number, columnIndex: number): CellData | undefined => {
            const key = getCacheKey(rowIndex, columnIndex);
            return cellCache.get(key);
        },
        [cellCache, getCacheKey]
    );

    const isCellLoading = useCallback(
        (rowIndex: number, columnIndex: number): boolean => {
            const key = getCacheKey(rowIndex, columnIndex);
            return loadingCells.has(key);
        },
        [loadingCells, getCacheKey]
    );

    const loadCellData = useCallback(
        (rowIndex: number, columnIndex: number): void => {
            const key = getCacheKey(rowIndex, columnIndex);

            // Skip if already loaded or loading
            if (cellCache.has(key) || loadingCells.has(key)) {
                return;
            }

            // Mark as loading
            setLoadingCells((prev) => new Set(prev).add(key));

            // Simulate async data loading (will be replaced with actual SQLite fetch)
            setTimeout(() => {
                const cellData: CellData = {
                    rowIndex,
                    columnIndex,
                    value: `R${rowIndex}C${columnIndex}`,
                    isLoaded: true,
                };

                setCellCache((prev) => {
                    const newCache = new Map(prev);
                    newCache.set(key, cellData);
                    return newCache;
                });

                setLoadingCells((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            }, 10); // Simulate 10ms DB read time
        },
        [cellCache, loadingCells, getCacheKey]
    );

    return {
        getCellData,
        isCellLoading,
        loadCellData,
    };
};
