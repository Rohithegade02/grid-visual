import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DebugPanelProps {
    rowsRendered: number;
    columnsRendered: number;
    visibleCells: number;
    fps: number;
    dbReadTime: number;
    cachedCells: number;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
    rowsRendered,
    columnsRendered,
    visibleCells,
    fps,
    dbReadTime,
    cachedCells,
}) => {
    // Color code FPS
    const getFpsColor = (fps: number) => {
        if (fps >= 55) return '#4CAF50'; // Green
        if (fps >= 30) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Performance Metrics</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Rows:</Text>
                <Text style={styles.value}>{rowsRendered}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Columns:</Text>
                <Text style={styles.value}>{columnsRendered}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Visible Cells:</Text>
                <Text style={styles.value}>{visibleCells}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>FPS:</Text>
                <Text style={[styles.value, { color: getFpsColor(fps) }]}>
                    {fps}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>DB Read:</Text>
                <Text style={styles.value}>{dbReadTime}ms</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Cached:</Text>
                <Text style={styles.value}>{cachedCells}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 8,
        padding: 12,
        minWidth: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
    },
    title: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
        paddingBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
    },
    label: {
        color: '#aaa',
        fontSize: 11,
        fontWeight: '500',
    },
    value: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        fontFamily: 'Courier',
    },
});

export default React.memo(DebugPanel);
