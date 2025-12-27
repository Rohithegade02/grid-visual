import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFPS } from '../hooks/useFPS';
import { cellCache } from '../services/cacheManager';

interface PerformancePanelProps {
    rowsRendered: number;
    columnsRendered: number;
    dbReadTime: number;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({
    rowsRendered,
    columnsRendered,
    dbReadTime,
}) => {
    const { fps } = useFPS();
    const [isExpanded, setIsExpanded] = useState(true);

    const totalVisibleCells = rowsRendered * columnsRendered;
    const cachedCells = cellCache.size();

    const getFpsColor = (fps: number): string => {
        if (fps >= 55) return '#4CAF50'; // Green
        if (fps >= 30) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.header}
            >
                <Text style={styles.headerText}>
                    {isExpanded ? '▼' : '▶'} Performance Metrics
                </Text>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.metricsContainer}>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>FPS:</Text>
                        <Text style={[styles.metricValue, { color: getFpsColor(fps) }]}>
                            {fps}
                        </Text>
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Rows Rendered:</Text>
                        <Text style={styles.metricValue}>{rowsRendered}</Text>
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Columns Rendered:</Text>
                        <Text style={styles.metricValue}>{columnsRendered}</Text>
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Total Visible Cells:</Text>
                        <Text style={styles.metricValue}>{totalVisibleCells}</Text>
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>DB Read Time:</Text>
                        <Text style={styles.metricValue}>{dbReadTime.toFixed(2)}ms</Text>
                    </View>

                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>Cached Cells:</Text>
                        <Text style={styles.metricValue}>{cachedCells}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 8,
        padding: 12,
        minWidth: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    metricsContainer: {
        marginTop: 12,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    metricLabel: {
        color: '#cccccc',
        fontSize: 12,
    },
    metricValue: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
});
