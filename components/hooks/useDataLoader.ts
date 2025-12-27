import { useCallback, useEffect, useState } from 'react';
import { useDatabase } from './useDatabase';

interface UseDataLoaderResult {
    isLoading: boolean;
    loadingProgress: number;
    totalChunks: number;
    loadedChunks: number;
    startBackgroundLoading: () => void;
    stopBackgroundLoading: () => void;
}

/**
 * Hook to manage background loading of data chunks
 * Loads data in 1,000-row chunks progressively
 */
export const useDataLoader = (): UseDataLoaderResult => {
    const { loadChunk, loadingProgress, totalChunks, isInitialized, loadedChunksCount } = useDatabase();
    const [isLoading, setIsLoading] = useState(false);
    const [currentChunk, setCurrentChunk] = useState(0);
    const [shouldLoad, setShouldLoad] = useState(false);

    /**
     * Load next chunk
     */
    const loadNextChunk = useCallback(async () => {
        if (currentChunk >= totalChunks || !isInitialized) {
            setIsLoading(false);
            setShouldLoad(false);
            return;
        }

        try {
            setIsLoading(true);
            await loadChunk(currentChunk);
            setCurrentChunk((prev) => prev + 1);
        } catch (error) {
            console.error('Error loading chunk:', error);
            setIsLoading(false);
            setShouldLoad(false);
        }
    }, [currentChunk, totalChunks, isInitialized, loadChunk]);

    /**
     * Start background loading
     */
    const startBackgroundLoading = useCallback(() => {
        setShouldLoad(true);
        setCurrentChunk(loadedChunksCount);
    }, [loadedChunksCount]);

    /**
     * Stop background loading
     */
    const stopBackgroundLoading = useCallback(() => {
        setShouldLoad(false);
        setIsLoading(false);
    }, []);

    /**
     * Auto-load chunks when shouldLoad is true
     */
    useEffect(() => {
        if (shouldLoad && !isLoading && currentChunk < totalChunks && isInitialized) {
            // Small delay between chunks to prevent blocking UI
            const timer = setTimeout(() => {
                loadNextChunk();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [shouldLoad, isLoading, currentChunk, totalChunks, isInitialized, loadNextChunk]);

    return {
        isLoading,
        loadingProgress,
        totalChunks,
        loadedChunks: loadedChunksCount,
        startBackgroundLoading,
        stopBackgroundLoading,
    };
};
