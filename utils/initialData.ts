import { generateChunk } from './dataGenerator';

/**
 * Get initial data for first 1000 rows from JSON (synchronous)
 * This provides immediate data while the rest loads in background
 */
export const getInitialData = () => {
    console.log('📋 Loading initial 1000 rows from JSON...');
    const initialChunk = generateChunk(0, 100);
    console.log(`✅ Initial data ready: ${initialChunk.length} cells`);
    return initialChunk;
};
