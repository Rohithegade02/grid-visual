import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VirtualizedGrid } from '../src/components/VirtualizedGrid';

const GridLayout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedGrid />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});

export default GridLayout;