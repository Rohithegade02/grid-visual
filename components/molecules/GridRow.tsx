import GridCell from '@/components/atoms/GridCell';
import { GridRowProps } from '@/types/grid.types';
import { LegendList } from '@legendapp/list';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

const GridRow: React.FC<GridRowProps> = ({
    rowIndex,
    columns,
    rowHeight,
    visibleColumnStart,
    visibleColumnEnd,
    getCellData,
}) => {
    // Render individual cell
    const renderCell = useCallback(
        ({ item }: { item: { index: number; width: number } }) => {
            const cellData = getCellData(rowIndex, item.index);
            const isLoading = !cellData;

            return (
                <View style={{ width: item.width, height: rowHeight }}>
                    <GridCell
                        rowIndex={rowIndex}
                        columnIndex={item.index}
                        width={item.width}
                        height={rowHeight}
                        data={cellData}
                        isLoading={isLoading}
                    />
                </View>
            );
        },
        [rowIndex, rowHeight, getCellData]
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
        width: '100%',
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
