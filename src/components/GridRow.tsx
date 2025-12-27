import { LegendList } from '@legendapp/list';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GridCell as GridCellModel } from '../database/models/GridCell';
import { ColumnConfig, columnWidthCalculator } from '../utils/columnWidthCalculator';
import { GridCell } from './GridCell';

interface GridRowProps {
    rowIndex: number;
    columns: ColumnConfig[];
    getCell: (rowIndex: number, columnIndex: number) => GridCellModel | null;
    onViewableColumnsChanged?: (rowIndex: number, visibleColumns: number[]) => void;
}

/**
 * Memoized row component that renders a horizontal list of cells
 */
export const GridRow = React.memo<GridRowProps>(
    ({ rowIndex, columns, getCell, onViewableColumnsChanged }) => {
        // Memoize column indices array
        const columnIndices = useMemo(
            () => columns.map((col) => col.id),
            [columns]
        );

        // Memoize total width calculation
        const totalWidth = useMemo(
            () => columnWidthCalculator.getTotalWidth(),
            []
        );

        // Memoized render function for cells
        const renderCell = useCallback(
            ({ item: columnIndex }: { item: number }) => {
                const cell = getCell(rowIndex, columnIndex);
                const width = columnWidthCalculator.getColumnWidth(columnIndex);

                return (
                    <GridCell
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        width={width}
                        value={cell?.value || null}
                        isLoading={!cell}
                    />
                );
            },
            [rowIndex, getCell]
        );

        // Memoized key extractor
        const keyExtractor = useCallback(
            (columnIndex: number) => `cell-${rowIndex}-${columnIndex}`,
            [rowIndex]
        );

        // Memoized fixed item size getter
        const getFixedItemSize = useCallback(
            (index: number) => {
                return columnWidthCalculator.getColumnWidth(index);
            },
            []
        );

        // Handle viewable columns changed
        const handleViewableItemsChanged = useCallback(
            ({ viewableItems }: any) => {
                if (onViewableColumnsChanged && viewableItems.length > 0) {
                    const visibleColumns = viewableItems.map((item: any) => item.item);
                    onViewableColumnsChanged(rowIndex, visibleColumns);
                }
            },
            [rowIndex, onViewableColumnsChanged]
        );

        return (
            <View style={styles.row}>
                <LegendList
                    data={columnIndices}
                    renderItem={renderCell}
                    keyExtractor={keyExtractor}
                    horizontal
                    recycleItems
                    drawDistance={300}
                    getFixedItemSize={getFixedItemSize}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    showsHorizontalScrollIndicator
                    style={{ width: '100%' }}
                />
            </View>
        );
    },
    // Custom comparison - only re-render if rowIndex or getCell changes
    (prevProps, nextProps) => {
        return (
            prevProps.rowIndex === nextProps.rowIndex &&
            prevProps.getCell === nextProps.getCell &&
            prevProps.columns === nextProps.columns
        );
    }
);

GridRow.displayName = 'GridRow';

const styles = StyleSheet.create({
    row: {
        height: 50,
        width: '100%',
    },
});
