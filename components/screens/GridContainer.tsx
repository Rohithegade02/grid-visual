import { useDataLoader } from '@/components/hooks/useDataLoader';
import gridConfigData from '@/config/grid.config.json';
import { GridConfig } from '@/types/grid.types';
import React, { useEffect, useMemo } from 'react';
import GridPresentation from './GridPresentation';

const GridContainer: React.FC = () => {
    // Load grid configuration
    const gridConfig: GridConfig = useMemo(() => gridConfigData as GridConfig, []);

    // Initialize data loader
    const {
        isLoading,
        loadingProgress,
        totalChunks,
        loadedChunks,
        startBackgroundLoading,
    } = useDataLoader();

    // Start loading data on mount
    useEffect(() => {
        // Start background loading after a short delay to let UI render
        const timer = setTimeout(() => {
            startBackgroundLoading();
        }, 500);

        return () => clearTimeout(timer);
    }, [startBackgroundLoading]);

    return (
        <GridPresentation
            config={gridConfig}
            isLoading={isLoading}
            loadingProgress={loadingProgress}
            totalChunks={totalChunks}
            loadedChunks={loadedChunks}
        />
    );
};

export default GridContainer;
