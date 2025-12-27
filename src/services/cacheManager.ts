import { GridCell } from '../database/models/GridCell';

interface CacheEntry {
    cell: GridCell;
    timestamp: number;
}

/**
 * LRU Cache for grid cells to minimize database reads
 */
export class CellCache {
    private cache: Map<string, CacheEntry>;
    private maxSize: number;

    constructor(maxSize: number = 5000) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    /**
     * Generates cache key from row and column indices
     */
    private getKey(rowIndex: number, columnIndex: number): string {
        return `${rowIndex}-${columnIndex}`;
    }

    /**
     * Gets a cell from cache
     */
    get(rowIndex: number, columnIndex: number): GridCell | null {
        const key = this.getKey(rowIndex, columnIndex);
        const entry = this.cache.get(key);

        if (entry) {
            // Update timestamp for LRU
            entry.timestamp = Date.now();
            return entry.cell;
        }

        return null;
    }

    /**
     * Sets a cell in cache
     */
    set(cell: GridCell): void {
        const key = this.getKey(cell.rowIndex, cell.columnIndex);

        // If cache is full, remove oldest entry
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            this.evictOldest();
        }

        this.cache.set(key, {
            cell,
            timestamp: Date.now(),
        });
    }

    /**
     * Sets multiple cells in cache
     */
    setMany(cells: GridCell[]): void {
        cells.forEach((cell) => this.set(cell));
    }

    /**
     * Evicts the oldest entry from cache
     */
    private evictOldest(): void {
        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * Clears the entire cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Gets current cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Checks if a cell is in cache
     */
    has(rowIndex: number, columnIndex: number): boolean {
        return this.cache.has(this.getKey(rowIndex, columnIndex));
    }
}

// Global cache instance
export const cellCache = new CellCache(5000);
