import gridConfigData from '@/config/grid.config.json';
import { GridConfig } from '@/types/grid.types';
import React, { useMemo } from 'react';
import GridPresentation from './GridPresentation';

const GridContainer: React.FC = () => {
    // Load grid configuration
    const gridConfig: GridConfig = useMemo(() => gridConfigData as GridConfig, []);

    return <GridPresentation config={gridConfig} />;
};

export default GridContainer;
