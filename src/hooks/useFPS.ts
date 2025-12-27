import { useCallback, useEffect, useRef, useState } from 'react';

interface FPSMetrics {
    fps: number;
    avgFrameTime: number;
}

/**
 * Custom hook to measure FPS using requestAnimationFrame
 */
export const useFPS = (): FPSMetrics => {
    const [fps, setFps] = useState(60);
    const [avgFrameTime, setAvgFrameTime] = useState(16.67);

    const frameTimesRef = useRef<number[]>([]);
    const lastFrameTimeRef = useRef<number>(performance.now());
    const rafIdRef = useRef<number>(0);

    const measureFPS = useCallback(() => {
        const now = performance.now();
        const delta = now - lastFrameTimeRef.current;

        frameTimesRef.current.push(delta);

        // Keep only last 60 frames
        if (frameTimesRef.current.length > 60) {
            frameTimesRef.current.shift();
        }

        // Calculate FPS every 30 frames
        if (frameTimesRef.current.length >= 30) {
            const avgTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
            const currentFps = Math.round(1000 / avgTime);

            setFps(currentFps);
            setAvgFrameTime(Number(avgTime.toFixed(2)));
        }

        lastFrameTimeRef.current = now;
        rafIdRef.current = requestAnimationFrame(measureFPS);
    }, []);

    useEffect(() => {
        rafIdRef.current = requestAnimationFrame(measureFPS);

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [measureFPS]);

    return { fps, avgFrameTime };
};
