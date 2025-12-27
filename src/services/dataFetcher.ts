import { Q } from '@nozbe/watermelondb';
import { database } from '../database';
import { GridCell } from '../database/models/GridCell';

const TOTAL_ROWS = 100000;
const TOTAL_COLUMNS = 100;
const CHUNK_SIZE = 1000;

/**
 * Simulates API call to fetch a chunk of data
 * In production, this would be a real API endpoint
 */
const simulateAPIFetch = async (
    startRow: number,
    endRow: number
): Promise<Array<{ rowIndex: number; columnIndex: number; value: string }>> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const data: Array<{ rowIndex: number; columnIndex: number; value: string }> = [];

    for (let row = startRow; row < endRow; row++) {
        for (let col = 0; col < TOTAL_COLUMNS; col++) {
            data.push({
                rowIndex: row,
                columnIndex: col,
                value: `R${row}C${col}`,
            });
        }
    }

    return data;
};

/**
 * Fetches a chunk of rows and saves to local database
 */
export const fetchAndStoreChunk = async (chunkIndex: number): Promise<void> => {
    const startRow = chunkIndex * CHUNK_SIZE;
    const endRow = Math.min(startRow + CHUNK_SIZE, TOTAL_ROWS);

    console.log(`Fetching chunk ${chunkIndex}: rows ${startRow}-${endRow}`);

    const startTime = performance.now();

    // Fetch data from "API"
    const data = await simulateAPIFetch(startRow, endRow);

    // Save to database in a batch
    await database.write(async () => {
        const gridCellsCollection = database.get<GridCell>('grid_cells');

        const promises = data.map((cell) =>
            gridCellsCollection.create((record) => {
                record.rowIndex = cell.rowIndex;
                record.columnIndex = cell.columnIndex;
                record.value = cell.value;
            })
        );

        await Promise.all(promises);
    });

    const endTime = performance.now();
    console.log(`Chunk ${chunkIndex} stored in ${(endTime - startTime).toFixed(2)}ms`);
};

/**
 * Fetches all chunks sequentially
 */
export const fetchAllChunks = async (
    onProgress?: (current: number, total: number) => void
): Promise<void> => {
    const totalChunks = Math.ceil(TOTAL_ROWS / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
        await fetchAndStoreChunk(i);
        onProgress?.(i + 1, totalChunks);
    }
};

/**
 * Checks if a chunk is already loaded in the database
 */
export const isChunkLoaded = async (chunkIndex: number): Promise<boolean> => {
    const startRow = chunkIndex * CHUNK_SIZE;
    const gridCellsCollection = database.get<GridCell>('grid_cells');

    const count = await gridCellsCollection
        .query(
            // @ts-ignore - WatermelonDB query types
            Q.where('row_index', Q.gte(startRow)),
            Q.where('row_index', Q.lt(startRow + CHUNK_SIZE))
        )
        .fetchCount();

    return count >= CHUNK_SIZE * TOTAL_COLUMNS;
};

/**
 * Gets cells for a specific range
 */
export const getCellsInRange = async (
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
): Promise<GridCell[]> => {
    const gridCellsCollection = database.get<GridCell>('grid_cells');

    const cells = await gridCellsCollection
        .query(
            // @ts-ignore - WatermelonDB query types
            Q.where('row_index', Q.gte(startRow)),
            Q.where('row_index', Q.lte(endRow)),
            Q.where('column_index', Q.gte(startCol)),
            Q.where('column_index', Q.lte(endCol))
        )
        .fetch();

    return cells;
};

export const GRID_CONSTANTS = {
    TOTAL_ROWS,
    TOTAL_COLUMNS,
    CHUNK_SIZE,
};
