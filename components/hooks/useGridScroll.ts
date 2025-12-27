import { useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface ScrollState {
    scrollX: number;
    scrollY: number;
    viewportWidth: number;
    viewportHeight: number;
}

interface UseGridScrollResult {
    scrollState: ScrollState;
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    handleLayout: (event: { nativeEvent: { layout: { width: number; height: number } } }) => void;
}

export const useGridScroll = (): UseGridScrollResult => {
    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollX: 0,
        scrollY: 0,
        viewportWidth: 0,
        viewportHeight: 0,
    });

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = event.nativeEvent;
        setScrollState((prev) => ({
            ...prev,
            scrollX: contentOffset.x,
            scrollY: contentOffset.y,
        }));
    }, []);

    const handleLayout = useCallback((event: { nativeEvent: { layout: { width: number; height: number } } }) => {
        const { width, height } = event.nativeEvent.layout;
        setScrollState((prev) => ({
            ...prev,
            viewportWidth: width,
            viewportHeight: height,
        }));
    }, []);

    return {
        scrollState,
        handleScroll,
        handleLayout,
    };
};
