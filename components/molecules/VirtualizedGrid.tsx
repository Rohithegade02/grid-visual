import { useGridData } from '@/components/hooks/useGridData';
import { VirtualizedGridProps } from '@/types/grid.types';
import { LegendList } from '@legendapp/list';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import GridRow from './GridRow';

const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({ config, getCellData: externalGetCellData }) => {
    const { getCellData } = useGridData();

    // Use external data provider if provided, otherwise use internal
    const cellDataProvider = externalGetCellData || getCellData;

    // Generate row data for vertical LegendList
    const rowData = useMemo(() => {
        const rows = [];
        for (let i = 0; i < config.totalRows; i++) {
            rows.push({ rowIndex: i });
        }
        return rows;
    }, [config.totalRows]);

    // Render each row with horizontal LegendList
    const renderRow = useCallback(
        ({ item }: { item: { rowIndex: number } }) => {
            return (
                <GridRow
                    rowIndex={item.rowIndex}
                    columns={config.columns}
                    rowHeight={config.rowHeight}
                    visibleColumnStart={0}
                    visibleColumnEnd={config.totalColumns}
                    getCellData={cellDataProvider}
                />
            );
        },
        [config.columns, config.rowHeight, config.totalColumns, cellDataProvider]
    );

    const keyExtractor = useCallback((item: { rowIndex: number }) => `row-${item.rowIndex}`, []);

    return (
        <View style={styles.container}>
            <LegendList
                data={rowData}
                renderItem={renderRow}
                keyExtractor={keyExtractor}
                estimatedItemSize={config.rowHeight}
                recycleItems={true}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});

export default React.memo(VirtualizedGrid);
