import GridCell from '@/components/atoms/GridCell';
import { CellData } from '@/types/grid.types';
import React, { useEffect } from 'react';
import { View } from 'react-native';

interface VirtualizedCellProps {
    rowIndex: number;
    columnIndex: number;
    width: number;
    height: number;
    getCellData: (rowIndex: number, columnIndex: number) => CellData | undefined;
    loadCellData?: (rowIndex: number, columnIndex: number) => void;
}

const VirtualizedCell: React.FC<VirtualizedCellProps> = ({
    rowIndex,
    columnIndex,
    width,
    height,
    getCellData,
    loadCellData,
}) => {
    const cellData = getCellData(rowIndex, columnIndex);
    const isLoading = !cellData;

    // Trigger data loading if cell is not in cache
    useEffect(() => {
        if (!cellData && loadCellData) {
            loadCellData(rowIndex, columnIndex);
        }
    }, [cellData, loadCellData, rowIndex, columnIndex]);

    return (
        <View style={{ width, height }}>
            <GridCell
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                width={width}
                height={height}
                data={cellData}
                isLoading={isLoading}
            />
        </View>
    );
};

// Custom comparison - only re-render if cell data actually changes
const areEqual = (prevProps: VirtualizedCellProps, nextProps: VirtualizedCellProps): boolean => {
    // Always re-render if position changes
    if (prevProps.rowIndex !== nextProps.rowIndex || prevProps.columnIndex !== nextProps.columnIndex) {
        return false;
    }

    // Check if cell data changed
    const prevData = prevProps.getCellData(prevProps.rowIndex, prevProps.columnIndex);
    const nextData = nextProps.getCellData(nextProps.rowIndex, nextProps.columnIndex);

    // If both undefined, don't re-render
    if (!prevData && !nextData) {
        return true;
    }

    // If one is undefined and other isn't, re-render
    if (!prevData || !nextData) {
        return false;
    }

    // If both have data, compare values
    return prevData.value === nextData.value;
};

export default React.memo(VirtualizedCell, areEqual);
