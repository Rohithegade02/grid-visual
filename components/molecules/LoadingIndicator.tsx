import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingIndicatorProps {
    loadingProgress: number;
    totalRows: number;
    loadedChunks: number;
    totalChunks: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    loadingProgress,
    totalRows,
    loadedChunks,
    totalChunks,
}) => {
    const progressPercentage = ((loadingProgress / totalRows) * 100).toFixed(1);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.text}>
                Loading data: {loadedChunks}/{totalChunks} chunks ({progressPercentage}%)
            </Text>
            <Text style={styles.subText}>
                {loadingProgress.toLocaleString()} / {totalRows.toLocaleString()} rows
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    subText: {
        fontSize: 12,
        color: '#666',
    },
});

export default React.memo(LoadingIndicator);
