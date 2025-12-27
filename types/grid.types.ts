export interface CellData {
    rowIndex: number;
    columnIndex: number;
    value: string | number;
    isLoaded: boolean;
}

export interface ColumnConfig {
    index: number;
    width: number;
}

export interface GridConfig {
    totalRows: number;
    totalColumns: number;
    rowHeight: number;
    columns: ColumnConfig[];
    overscanRowCount: number;
    overscanColumnCount: number;
}

export interface ViewportState {
    scrollX: number;
    scrollY: number;
    viewportWidth: number;
    viewportHeight: number;
    visibleRowStart: number;
    visibleRowEnd: number;
    visibleColumnStart: number;
    visibleColumnEnd: number;
}

export interface GridCellProps {
    rowIndex: number;
    columnIndex: number;
    width: number;
    height: number;
    data?: CellData;
    isLoading: boolean;
}

export interface GridRowProps {
    rowIndex: number;
    columns: ColumnConfig[];
    rowHeight: number;
    visibleColumnStart: number;
    visibleColumnEnd: number;
    getCellData: (rowIndex: number, columnIndex: number) => CellData | undefined;
}

export interface VirtualizedGridProps {
    config: GridConfig;
    getCellData?: (rowIndex: number, columnIndex: number) => CellData | undefined;
}
