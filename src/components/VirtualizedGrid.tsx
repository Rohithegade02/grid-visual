import { LegendList } from '@legendapp/list';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useGridData } from '../hooks/useGridData';
import { GRID_CONSTANTS } from '../services/dataFetcher';
import { columnWidthCalculator } from '../utils/columnWidthCalculator';
import { GridRow } from './GridRow';
import { PerformancePanel } from './PerformancePanel';

const CELL_HEIGHT = 50;

export const VirtualizedGrid: React.FC = () => {
    const { getCell, loadCellsInRange, dbReadTime, isLoading } = useGridData();

    const [visibleRowsCount, setVisibleRowsCount] = useState(0);
    const [visibleColumnsCount, setVisibleColumnsCount] = useState(0);

    // Memoize row indices array (0 to 99,999)
    const rowIndices = useMemo(
        () => Array.from({ length: GRID_CONSTANTS.TOTAL_ROWS }, (_, i) => i),
        []
    );

    // Memoize columns configuration
    const columns = useMemo(
        () => columnWidthCalculator.getAllColumns(),
        []
    );

    // Handle viewable columns changed for a specific row
    const handleViewableColumnsChanged = useCallback(
        (rowIndex: number, visibleColumns: number[]) => {
            if (visibleColumns.length > 0) {
                setVisibleColumnsCount(visibleColumns.length);

                const startCol = Math.min(...visibleColumns);
                const endCol = Math.max(...visibleColumns);

                // Load cells for this specific row and visible column range
                loadCellsInRange(rowIndex, rowIndex, startCol, endCol);
            }
        },
        [loadCellsInRange]
    );

    // Memoized render function for rows
    const renderRow = useCallback(
        ({ item: rowIndex }: { item: number }) => {
            return (
                <GridRow
                    rowIndex={rowIndex}
                    columns={columns}
                    getCell={getCell}
                    onViewableColumnsChanged={handleViewableColumnsChanged}
                />
            );
        },
        [columns, getCell, handleViewableColumnsChanged]
    );

    // Memoized key extractor for rows
    const keyExtractor = useCallback((rowIndex: number) => `row-${rowIndex}`, []);

    // Memoized fixed row height getter
    const getFixedItemSize = useCallback(() => CELL_HEIGHT, []);

    // Handle viewable rows changed
    const handleViewableRowsChanged = useCallback(
        ({ viewableItems }: any) => {
            if (viewableItems.length === 0) return;

            const startRow = viewableItems[0].item;
            const endRow = viewableItems[viewableItems.length - 1].item;

            setVisibleRowsCount(viewableItems.length);

            // Load cells for visible rows
            // We'll load a range of columns (0-20 initially, will be updated by column visibility)
            loadCellsInRange(startRow, endRow, 0, 20);
        },
        [loadCellsInRange]
    );

    console.log('VirtualizedGrid rendering with', rowIndices.length, 'rows');

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading initial data...</Text>
                <Text style={styles.loadingSubtext}>Fetching first 5,000 rows</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LegendList
                data={rowIndices}
                renderItem={renderRow}
                keyExtractor={keyExtractor}
                recycleItems
                drawDistance={250}
                getFixedItemSize={getFixedItemSize}
                onViewableItemsChanged={handleViewableRowsChanged}
                showsVerticalScrollIndicator
                style={styles.list}
            />

            <PerformancePanel
                rowsRendered={visibleRowsCount}
                columnsRendered={visibleColumnsCount}
                dbReadTime={dbReadTime}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
});
