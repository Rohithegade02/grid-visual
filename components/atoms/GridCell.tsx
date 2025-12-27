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
        fontWeight: '400',
    });

    // Safety check for font
    if (!font) {
        return <SkeletonLoader width={width} height={height} />;
    }

    return (
        <Canvas style={{ width, height }}>
            {/* Cell background */}
            <RoundedRect
                x={CELL_CONSTANTS.BORDER_WIDTH}
                y={CELL_CONSTANTS.BORDER_WIDTH}
                width={width - CELL_CONSTANTS.BORDER_WIDTH * 2}
                height={height - CELL_CONSTANTS.BORDER_WIDTH * 2}
                r={2}
                color={CELL_CONSTANTS.BACKGROUND_COLOR}
            />

            {/* Cell border */}
            <RoundedRect
                x={0}
                y={0}
                width={width}
                height={height}
                r={2}
                color={CELL_CONSTANTS.BORDER_COLOR}
                style="stroke"
                strokeWidth={CELL_CONSTANTS.BORDER_WIDTH}
            />

            {/* Cell text */}
            <SkiaText
                x={8}
                y={height / 2 + 6}
                text={displayValue}
                font={font}
                color={CELL_CONSTANTS.TEXT_COLOR}
            />
        </Canvas>
    );
};

export default React.memo(GridCell);
