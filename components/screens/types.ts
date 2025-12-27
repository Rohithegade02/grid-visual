import { GridConfig } from '@/types/grid.types';

export interface GridPresentationProps {
    config: GridConfig;
    isLoading: boolean;
    loadingProgress: number;
    totalChunks: number;
    loadedChunks: number;
    performanceMetrics: {
        rowsRendered: number;
        columnsRendered: number;
        visibleCells: number;
        fps: number;
        dbReadTime: number;
        cachedCells: number;
    };
}