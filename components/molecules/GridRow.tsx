import { GridRowProps } from '@/types/grid.types';
import { LegendList } from '@legendapp/list';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import VirtualizedCell from './VirtualizedCell';

const { width } = Dimensions.get('window');

const GridRow: React.FC<GridRowProps> = ({
    rowIndex,
    columns,
    rowHeight,
    visibleColumnStart,
    visibleColumnEnd,
    getCellData,
    loadCellData,
}) => {
    // Render individual cell
    const renderCell = useCallback(
        ({ item }: { item: { index: number; width: number } }) => {
            return (
                <VirtualizedCell
                    rowIndex={rowIndex}
                    columnIndex={item.index}
                    width={item.width}
                    height={rowHeight}
                    getCellData={getCellData}
                    loadCellData={loadCellData}
                />
            );
        },
        [rowIndex, rowHeight, getCellData, loadCellData]
    );

    const keyExtractor = useCallback(
        (item: { index: number; width: number }) => `${rowIndex}-${item.index}`,
        [rowIndex]
    );

    return (
        <View style={[styles.row, { height: rowHeight }]}>
            <LegendList
                data={columns}
                renderItem={renderCell}
                keyExtractor={keyExtractor}
                horizontal
                estimatedItemSize={100}
                recycleItems={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        width: width,
    },
});

// Custom comparison for memo
const areEqual = (prevProps: GridRowProps, nextProps: GridRowProps): boolean => {
    return (
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.rowHeight === nextProps.rowHeight &&
        prevProps.columns.length === nextProps.columns.length
    );
};

export default React.memo(GridRow, areEqual);
