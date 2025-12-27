import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
    rowsRendered: number;
    columnsRendered: number;
    visibleCells: number;
    fps: number;
    dbReadTime: number;
    cachedCells: number;
}

export const usePerformanceMetrics = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        rowsRendered: 0,
        columnsRendered: 0,
        visibleCells: 0,
        fps: 0,
        dbReadTime: 0,
        cachedCells: 0,
    });

    // FPS tracking
    const frameCount = useRef(0);
    const lastTime = useRef(Date.now());
    const fpsInterval = useRef<NodeJS.Timeout>();

    // DB read time tracking
    const dbReadTimes = useRef<number[]>([]);

    useEffect(() => {
        // Calculate FPS every second
        fpsInterval.current = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTime.current) / 1000;
            const currentFps = Math.round(frameCount.current / delta);

            setMetrics(prev => ({ ...prev, fps: currentFps }));

            frameCount.current = 0;
            lastTime.current = now;
        }, 1000);

        return () => {
            if (fpsInterval.current) {
                clearInterval(fpsInterval.current);
            }
        };
    }, []);

    const incrementFrame = useCallback(() => {
        frameCount.current++;
    }, []);

    const updateRowsRendered = useCallback((count: number) => {
        setMetrics(prev => ({ ...prev, rowsRendered: count }));
    }, []);

    const updateColumnsRendered = useCallback((count: number) => {
        setMetrics(prev => ({ ...prev, columnsRendered: count }));
    }, []);

    const updateVisibleCells = useCallback((rows: number, cols: number) => {
        setMetrics(prev => ({
            ...prev,
            visibleCells: rows * cols,
            rowsRendered: rows,
            columnsRendered: cols,
        }));
    }, []);

    const recordDbReadTime = useCallback((time: number) => {
        dbReadTimes.current.push(time);

        // Keep only last 10 measurements
        if (dbReadTimes.current.length > 10) {
            dbReadTimes.current.shift();
        }

        // Calculate average
        const avg = dbReadTimes.current.reduce((a, b) => a + b, 0) / dbReadTimes.current.length;
        setMetrics(prev => ({ ...prev, dbReadTime: Math.round(avg * 100) / 100 }));
    }, []);

    const updateCachedCells = useCallback((count: number) => {
        setMetrics(prev => ({ ...prev, cachedCells: count }));
    }, []);

    return {
        metrics,
        incrementFrame,
        updateRowsRendered,
        updateColumnsRendered,
        updateVisibleCells,
        recordDbReadTime,
        updateCachedCells,
    };
};
