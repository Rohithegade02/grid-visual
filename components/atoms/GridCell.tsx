import { CELL_CONSTANTS } from '@/constants/grid.constants';
import { GridCellProps } from '@/types/grid.types';
import { Canvas, RoundedRect, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const GridCell: React.FC<GridCellProps> = ({
    rowIndex,
    columnIndex,
    width,
    height,
    data,
    isLoading,
}) => {
    // Show skeleton if loading or no data
    if (isLoading || !data) {
        return <SkeletonLoader width={width} height={height} />;
    }

    const displayValue = data.value?.toString() || `R${rowIndex}C${columnIndex}`;

    // Use matchFont to get default system font
    const font = matchFont({
        fontFamily: 'System',
        fontSize: 12,
    });

    return (
        <Canvas style={{ width, height }}>
            {/* Cell background */}
            <RoundedRect
                x={0}
                y={0}
                width={width}
                height={height}
                color={CELL_CONSTANTS.BACKGROUND_COLOR}
            />

            {/* Cell border */}
            <RoundedRect
                x={0}
                y={0}
                width={width}
                height={height}
                color={CELL_CONSTANTS.BORDER_COLOR}
                style="stroke"
                strokeWidth={CELL_CONSTANTS.BORDER_WIDTH}
            />

            {/* Cell text */}
            <SkiaText
                x={8}
                y={height / 2 + 6}
                text={displayValue}
                color={CELL_CONSTANTS.TEXT_COLOR}
                font={font}
            />
        </Canvas>
    );
};

// Custom comparison function for memo
const areEqual = (prevProps: GridCellProps, nextProps: GridCellProps): boolean => {
    return (
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.columnIndex === nextProps.columnIndex &&
        prevProps.width === nextProps.width &&
        prevProps.height === nextProps.height &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.data?.value === nextProps.data?.value &&
        prevProps.data?.isLoaded === nextProps.data?.isLoaded
    );
};

export default React.memo(GridCell, areEqual);
