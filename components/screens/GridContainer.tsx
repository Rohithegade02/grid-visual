import { useDataLoader } from '@/components/hooks/useDataLoader';
import { useGridData } from '@/components/hooks/useGridData';
import { usePerformanceMetrics } from '@/components/hooks/usePerformanceMetrics';
import gridConfigData from '@/config/grid.config.json';
import { GridConfig } from '@/types/grid.types';
import React, { useEffect } from 'react';
import GridPresentation from './GridPresentation';

// Type assertion for JSON import
const gridConfig = gridConfigData as GridConfig;

const GridContainer: React.FC = () => {
    const { isLoading, loadingProgress, totalChunks, loadedChunks } = useDataLoader();

    const {
        metrics,
        updateVisibleCells,
        recordDbReadTime,
        updateCachedCells,
        incrementFrame,
    } = usePerformanceMetrics();

    const { getCachedCellsCount } = useGridData(recordDbReadTime);

    // Update cached cells count periodically
    useEffect(() => {
        const interval = setInterval(() => {
            updateCachedCells(getCachedCellsCount());
        }, 1000);

        return () => clearInterval(interval);
    }, [getCachedCellsCount, updateCachedCells]);

    // Increment frame counter on each render
    useEffect(() => {
        incrementFrame();
    });

    // Calculate visible cells based on viewport
    useEffect(() => {
        // Approximate visible cells based on screen size
        const estimatedVisibleRows = Math.ceil(800 / gridConfig.rowHeight); // ~800px viewport height
        const estimatedVisibleCols = 8; // Approximate visible columns
        updateVisibleCells(estimatedVisibleRows, estimatedVisibleCols);
    }, [updateVisibleCells]);

    return (
        <GridPresentation
            config={gridConfig}
            isLoading={isLoading}
            loadingProgress={loadingProgress}
            totalChunks={totalChunks}
            loadedChunks={loadedChunks}
            performanceMetrics={metrics}
        />
    );
};

export default GridContainer;
