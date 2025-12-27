/**
 * Generate a chunk of rows (1,000 rows × 100 columns)
 */
export interface CellData {
    row_index: number;
    column_index: number;
    value: string;
}

/**
 * Generate mock data for a single cell
 */
export const generateCellValue = (rowIndex: number, columnIndex: number): string => {
    const patterns = [
        `Cell-${rowIndex}-${columnIndex}`,
        `R${rowIndex}C${columnIndex}`,
        `${rowIndex * columnIndex}`,
        `Data ${rowIndex}`,
        `Col ${columnIndex}`,
    ];

    const patternIndex = (rowIndex + columnIndex) % patterns.length;
    return patterns[patternIndex];
};



export const generateChunk = (startRow: number, totalColumns: number = 100): CellData[] => {
    const CHUNK_SIZE = 1000;
    const cells: CellData[] = [];

    for (let row = startRow; row < startRow + CHUNK_SIZE; row++) {
        for (let col = 0; col < totalColumns; col++) {
            cells.push({
                row_index: row,
                column_index: col,
                value: generateCellValue(row, col),
            });
        }
    }

    return cells;
};

/**
 * Calculate total number of chunks needed
 */
export const calculateTotalChunks = (totalRows: number): number => {
    const CHUNK_SIZE = 1000;
    return Math.ceil(totalRows / CHUNK_SIZE);
};

/**
 * Get chunk number for a given row
 */
export const getChunkForRow = (rowIndex: number): number => {
    const CHUNK_SIZE = 1000;
    return Math.floor(rowIndex / CHUNK_SIZE);
};
