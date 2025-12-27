import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { GridCell } from './models/GridCell';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
    schema,
    jsi: true, // Use JSI for better performance
    onSetUpError: (error) => {
        console.error('Database setup error:', error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [GridCell],
});
