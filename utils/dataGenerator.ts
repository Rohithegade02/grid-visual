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

/**
 * Generate a chunk of rows (1,000 rows × 100 columns)
 */
export interface CellData {
    row_index: number;
    column_index: number;
    value: string;
}

export const generateChunk = (startRow: number, totalColumns: number = 100): CellData[] => {
    const CHUNK_SIZE = 1000;
    const cells: CellData[] = [];

    console.log(`🏭 Generating chunk starting at row ${startRow}, ${CHUNK_SIZE} rows × ${totalColumns} cols`);

    for (let row = startRow; row < startRow + CHUNK_SIZE; row++) {
        for (let col = 0; col < totalColumns; col++) {
            cells.push({
                row_index: row,
                column_index: col,
                value: generateCellValue(row, col),
            });
        }
    }

    console.log(`✅ Generated ${cells.length} cells. First cell: [${cells[0].row_index}, ${cells[0].column_index}] = "${cells[0].value}"`);
    console.log(`✅ Last cell: [${cells[cells.length - 1].row_index}, ${cells[cells.length - 1].column_index}] = "${cells[cells.length - 1].value}"`);

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
