import DebugPanel from '@/components/atoms/DebugPanel';
import { useDatabase } from '@/components/hooks/useDatabase';
import LoadingIndicator from '@/components/molecules/LoadingIndicator';
import VirtualizedGrid from '@/components/molecules/VirtualizedGrid';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { GridPresentationProps } from './types';

const GridPresentation: React.FC<GridPresentationProps> = ({
    config,
    isLoading,
    loadingProgress,
    totalChunks,
    loadedChunks,
    performanceMetrics,
}) => {
    const { isInitialized } = useDatabase();

    // Wait for database to initialize before rendering grid
    if (!isInitialized) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={localStyles.initializingContainer}>
                    <LoadingIndicator
                        loadingProgress={0}
                        totalRows={config.totalRows}
                        loadedChunks={0}
                        totalChunks={totalChunks}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {isLoading && loadingProgress < config.totalRows && (
                <LoadingIndicator
                    loadingProgress={loadingProgress}
                    totalRows={config.totalRows}
                    loadedChunks={loadedChunks}
                    totalChunks={totalChunks}
                />
            )}

            <DebugPanel
                rowsRendered={performanceMetrics.rowsRendered}
                columnsRendered={performanceMetrics.columnsRendered}
                visibleCells={performanceMetrics.visibleCells}
                fps={performanceMetrics.fps}
                dbReadTime={performanceMetrics.dbReadTime}
                cachedCells={performanceMetrics.cachedCells}
            />

            <View style={styles.gridWrapper}>
                <VirtualizedGrid config={config} />
            </View>
        </SafeAreaView>
    );
};

const localStyles = {
    initializingContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
};

export default GridPresentation;
