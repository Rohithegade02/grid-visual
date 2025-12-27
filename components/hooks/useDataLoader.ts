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
 * Starts from chunk 1 since chunk 0 is loaded immediately on init
 */
export const useDataLoader = (): UseDataLoaderResult => {
    const { loadChunk, loadingProgress, totalChunks, isInitialized, loadedChunksCount } = useDatabase();
    const [isLoading, setIsLoading] = useState(false);
    const [currentChunk, setCurrentChunk] = useState(1); // Start from chunk 1
    const [shouldLoad, setShouldLoad] = useState(true);

    /**
     * Start background loading
     */
    const startBackgroundLoading = useCallback(() => {
        setShouldLoad(true);
        setCurrentChunk(Math.max(1, loadedChunksCount)); // Never go below chunk 1
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
        if (!shouldLoad || !isInitialized || currentChunk >= totalChunks) {
            return;
        }

        if (isLoading) {
            return; // Already loading, wait for it to complete
        }

        // Load next chunk
        const loadNext = async () => {
            try {
                setIsLoading(true);
                await loadChunk(currentChunk);
                setCurrentChunk((prev) => prev + 1);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading chunk:', error);
                setIsLoading(false);
                setShouldLoad(false);
            }
        };

        // Small delay between chunks to prevent blocking UI
        const timer = setTimeout(() => {
            loadNext();
        }, 100);

        return () => clearTimeout(timer);
    }, [shouldLoad, isInitialized, currentChunk, totalChunks, isLoading, loadChunk]);

    return {
        isLoading,
        loadingProgress,
        totalChunks,
        loadedChunks: loadedChunksCount,
        startBackgroundLoading,
        stopBackgroundLoading,
    };
};
