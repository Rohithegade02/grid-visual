import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export class GridCell extends Model {
    static table = 'grid_cells';

    @field('row_index') rowIndex!: number;
    @field('column_index') columnIndex!: number;
    @field('value') value!: string;
    @readonly @date('created_at') createdAt!: Date;
}
