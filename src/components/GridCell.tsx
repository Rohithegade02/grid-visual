import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GridCellProps {
    rowIndex: number;
    columnIndex: number;
    width: number;
    value: string | null;
    isLoading: boolean;
}

/**
 * Memoized cell component for grid rendering
 * Shows skeleton loader if data not loaded
 */
export const GridCell = React.memo<GridCellProps>(
    ({ rowIndex, columnIndex, width, value, isLoading }) => {
        return (
            <View style={[styles.cell, { width }]}>
                {isLoading ? (
                    <View style={styles.skeleton} />
                ) : (
                    <Text style={styles.cellText} numberOfLines={1}>
                        {value}
                    </Text>
                )}
            </View>
        );
    },
    // Custom comparison function for better memoization
    (prevProps, nextProps) => {
        return (
            prevProps.rowIndex === nextProps.rowIndex &&
            prevProps.columnIndex === nextProps.columnIndex &&
            prevProps.width === nextProps.width &&
            prevProps.value === nextProps.value &&
            prevProps.isLoading === nextProps.isLoading
        );
    }
);

GridCell.displayName = 'GridCell';

const styles = StyleSheet.create({
    cell: {
        height: 50,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
    },
    cellText: {
        fontSize: 14,
        color: '#333333',
    },
    skeleton: {
        height: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
});
