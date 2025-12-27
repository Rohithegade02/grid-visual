import columnConfig from '../config/columnConfig.json';

export interface ColumnConfig {
    id: number;
    width: number;
    label: string;
}

/**
 * Utility class for column width calculations
 */
export class ColumnWidthCalculator {
    private columns: ColumnConfig[];
    private cumulativeWidths: number[];
    private totalWidth: number;

    constructor() {
        this.columns = columnConfig.columns;
        this.cumulativeWidths = [];
        this.totalWidth = 0;
        this.calculateCumulativeWidths();
    }

    /**
     * Pre-calculates cumulative widths for fast lookup
     */
    private calculateCumulativeWidths(): void {
        let sum = 0;
        for (const column of this.columns) {
            sum += column.width;
            this.cumulativeWidths.push(sum);
        }
        this.totalWidth = sum;
    }

    /**
     * Gets the width of a specific column
     */
    getColumnWidth(columnIndex: number): number {
        return this.columns[columnIndex]?.width || 150;
    }

    /**
     * Gets the x-position of a column
     */
    getColumnXPosition(columnIndex: number): number {
        if (columnIndex === 0) return 0;
        return this.cumulativeWidths[columnIndex - 1] || 0;
    }

    /**
     * Gets the total width of all columns
     */
    getTotalWidth(): number {
        return this.totalWidth;
    }

    /**
     * Finds which columns are visible given a horizontal scroll position and viewport width
     * Uses binary search for efficiency
     */
    getVisibleColumns(scrollX: number, viewportWidth: number): {
        startColumn: number;
        endColumn: number;
    } {
        const startX = scrollX;
        const endX = scrollX + viewportWidth;

        // Binary search for start column
        let startColumn = this.binarySearchColumn(startX);
        let endColumn = this.binarySearchColumn(endX);

        // Add overscan
        startColumn = Math.max(0, startColumn - 2);
        endColumn = Math.min(this.columns.length - 1, endColumn + 2);

        return { startColumn, endColumn };
    }

    /**
     * Binary search to find column at given x position
     */
    private binarySearchColumn(x: number): number {
        let left = 0;
        let right = this.cumulativeWidths.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const cumWidth = this.cumulativeWidths[mid];
            const prevWidth = mid > 0 ? this.cumulativeWidths[mid - 1] : 0;

            if (x >= prevWidth && x < cumWidth) {
                return mid;
            } else if (x < prevWidth) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return Math.min(left, this.columns.length - 1);
    }

    /**
     * Gets all column configurations
     */
    getAllColumns(): ColumnConfig[] {
        return this.columns;
    }
}

// Global instance
export const columnWidthCalculator = new ColumnWidthCalculator();
