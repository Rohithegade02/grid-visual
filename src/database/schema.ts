import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'grid_cells',
            columns: [
                { name: 'row_index', type: 'number', isIndexed: true },
                { name: 'column_index', type: 'number', isIndexed: true },
                { name: 'value', type: 'string' },
                { name: 'created_at', type: 'number' },
            ],
        }),
    ],
});
