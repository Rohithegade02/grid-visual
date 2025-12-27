import { calculateTotalChunks, generateChunk } from '@/utils/dataGenerator';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'grid_data.db';
const TOTAL_ROWS = 100000;
const TOTAL_COLUMNS = 100;
const CHUNK_SIZE = 1000;

// Singleton database instance
let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Track loaded chunks globally
const loadedChunks = new Set<number>();
const loadingChunks = new Map<number, Promise<void>>();

/**
 * Initialize the database (singleton pattern)
 */
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) {
        return db;
    }

    if (isInitializing && initPromise) {
        return initPromise;
    }

    isInitializing = true;
    initPromise = (async () => {
        try {
            // Open database
            db = await SQLite.openDatabaseAsync(DB_NAME);

            // Create grid_cells table
            await db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS grid_cells (
          row_index INTEGER NOT NULL,
          column_index INTEGER NOT NULL,
          value TEXT NOT NULL,
          PRIMARY KEY (row_index, column_index)
        );
        
        CREATE INDEX IF NOT EXISTS idx_row ON grid_cells(row_index);
        CREATE INDEX IF NOT EXISTS idx_column ON grid_cells(column_index);
      `);

            // Create metadata table to track loading progress
            await db.execAsync(`
        CREATE TABLE IF NOT EXISTS metadata (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);

            console.log('✅ Database initialized successfully');
            return db;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            db = null;
            throw error;
        } finally {
            isInitializing = false;
        }
    })();

    return initPromise;
};

/**
 * Get database instance
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (!db) {
        return await initDatabase();
    }
    return db;
};

/**
 * Load a chunk with queue management to prevent concurrent transactions
 */
export const loadChunk = async (chunkIndex: number): Promise<void> => {
    // Check if already loaded
    if (loadedChunks.has(chunkIndex)) {
        return;
    }

    // Check if currently loading - return existing promise
    if (loadingChunks.has(chunkIndex)) {
        return loadingChunks.get(chunkIndex)!;
    }

    // Create loading promise
    const loadPromise = (async () => {
        try {
            const database = await getDatabase();
            const startRow = chunkIndex * CHUNK_SIZE;

            // Generate chunk data
            const chunkData = generateChunk(startRow, TOTAL_COLUMNS);

            // Insert data in batches using transaction
            await database.withTransactionAsync(async () => {
                const statement = await database.prepareAsync(
                    'INSERT OR REPLACE INTO grid_cells (row_index, column_index, value) VALUES (?, ?, ?)'
                );

                try {
                    for (const cell of chunkData) {
                        await statement.executeAsync([cell.row_index, cell.column_index, cell.value]);
                    }
                } finally {
                    await statement.finalizeAsync();
                }
            });

            // Update progress
            const newLoadedRows = (chunkIndex + 1) * CHUNK_SIZE;
            await updateLoadingProgress(Math.min(newLoadedRows, TOTAL_ROWS));

            loadedChunks.add(chunkIndex);

            const totalChunks = calculateTotalChunks(TOTAL_ROWS);
            console.log(`✅ Loaded chunk ${chunkIndex + 1}/${totalChunks} (rows ${startRow}-${startRow + CHUNK_SIZE - 1})`);
        } catch (error) {
            console.error(`❌ Failed to load chunk ${chunkIndex}:`, error);
            throw error;
        } finally {
            loadingChunks.delete(chunkIndex);
        }
    })();

    loadingChunks.set(chunkIndex, loadPromise);
    return loadPromise;
};

/**
 * Get cells in a range
 */
export const getCellsInRange = async (
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
): Promise<Map<string, string>> => {
    try {
        const database = await getDatabase();
        const results = await database.getAllAsync<{ row_index: number; column_index: number; value: string }>(
            `SELECT row_index, column_index, value 
       FROM grid_cells 
       WHERE row_index BETWEEN ? AND ? 
       AND column_index BETWEEN ? AND ?`,
            [startRow, endRow, startCol, endCol]
        );

        const cellMap = new Map<string, string>();
        results.forEach((row) => {
            const key = `${row.row_index}-${row.column_index}`;
            cellMap.set(key, row.value);
        });

        return cellMap;
    } catch (err) {
        console.error('Error fetching cells in range:', err);
        return new Map();
    }
};

/**
 * Close database connection
 */
export const closeDatabase = async (): Promise<void> => {
    if (db) {
        await db.closeAsync();
        db = null;
        console.log('Database closed');
    }
};

/**
 * Clear all data from database (for testing)
 */
export const clearDatabase = async (): Promise<void> => {
    const database = await getDatabase();
    await database.execAsync(`
    DELETE FROM grid_cells;
    DELETE FROM metadata;
  `);
    loadedChunks.clear();
    console.log('Database cleared');
};

/**
 * Get loading progress
 */
export const getLoadingProgress = async (): Promise<number> => {
    const database = await getDatabase();
    const result = await database.getFirstAsync<{ value: string }>(
        'SELECT value FROM metadata WHERE key = ?',
        ['loaded_rows']
    );
    return result ? parseInt(result.value, 10) : 0;
};

/**
 * Update loading progress
 */
export const updateLoadingProgress = async (loadedRows: number): Promise<void> => {
    const database = await getDatabase();
    await database.runAsync(
        'INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)',
        ['loaded_rows', loadedRows.toString()]
    );
};

/**
 * Check if chunk is loaded
 */
export const isChunkLoaded = (chunkIndex: number): boolean => {
    return loadedChunks.has(chunkIndex);
};

/**
 * Get loaded chunks count
 */
export const getLoadedChunksCount = (): number => {
    return loadedChunks.size;
};
