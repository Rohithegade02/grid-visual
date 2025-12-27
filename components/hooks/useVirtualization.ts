import { GridConfig, ViewportState } from '@/types/grid.types';
import { useMemo } from 'react';

interface UseVirtualizationResult {
    visibleRowStart: number;
    visibleRowEnd: number;
    visibleColumnStart: number;
    visibleColumnEnd: number;
    renderRowStart: number;
    renderRowEnd: number;
    renderColumnStart: number;
    renderColumnEnd: number;
}

export const useVirtualization = (
    viewport: ViewportState,
    config: GridConfig
): UseVirtualizationResult => {
    return useMemo(() => {
        const { scrollY, scrollX, viewportHeight, viewportWidth } = viewport;
        const { rowHeight, columns, overscanRowCount, overscanColumnCount, totalRows, totalColumns } = config;

        // Calculate visible rows
        const visibleRowStart = Math.floor(scrollY / rowHeight);
        const visibleRowEnd = Math.min(
            Math.ceil((scrollY + viewportHeight) / rowHeight),
            totalRows
        );

        // Calculate visible columns based on accumulated widths
        let accumulatedWidth = 0;
        let visibleColumnStart = 0;
        let visibleColumnEnd = 0;

        // Find start column
        for (let i = 0; i < columns.length; i++) {
            if (accumulatedWidth + columns[i].width > scrollX) {
                visibleColumnStart = i;
                break;
            }
            accumulatedWidth += columns[i].width;
        }

        // Find end column
        accumulatedWidth = 0;
        for (let i = 0; i < columns.length; i++) {
            accumulatedWidth += columns[i].width;
            if (accumulatedWidth >= scrollX + viewportWidth) {
                visibleColumnEnd = Math.min(i + 1, totalColumns);
                break;
            }
        }

        // If we didn't find end column, it means we're at the end
        if (visibleColumnEnd === 0) {
            visibleColumnEnd = totalColumns;
        }

        // Apply overscan to prevent whitespace during scrolling
        const renderRowStart = Math.max(0, visibleRowStart - overscanRowCount);
        const renderRowEnd = Math.min(totalRows, visibleRowEnd + overscanRowCount);
        const renderColumnStart = Math.max(0, visibleColumnStart - overscanColumnCount);
        const renderColumnEnd = Math.min(totalColumns, visibleColumnEnd + overscanColumnCount);

        return {
            visibleRowStart,
            visibleRowEnd,
            visibleColumnStart,
            visibleColumnEnd,
            renderRowStart,
            renderRowEnd,
            renderColumnStart,
            renderColumnEnd,
        };
    }, [viewport, config]);
};
