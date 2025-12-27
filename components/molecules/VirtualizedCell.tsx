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

export default React.memo(VirtualizedCell);
