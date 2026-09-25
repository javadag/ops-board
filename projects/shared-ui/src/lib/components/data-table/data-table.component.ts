import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ChangeDetectionStrategy
} from '@angular/core'
import { CommonModule } from '@angular/common'

export interface ColumnDef<T = unknown> {
  key: string
  header: string
  sortable?: boolean
  width?: string
  cell?: (item: T) => string | number
}

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = unknown> {
  @Input() columns: ColumnDef<T>[] = []
  @Input() data: T[] = []
  @Input() sortColumn?: string
  @Input() sortOrder: 'asc' | 'desc' = 'asc'
  @Input() rowClickable = false
  @Input() customCellTemplate?: TemplateRef<{
    $implicit: T
    column: ColumnDef<T>
  }>

  @Output() rowClick = new EventEmitter<T>()
  @Output() sortChange = new EventEmitter<{
    column: string
    order: 'asc' | 'desc'
  }>()

  trackByFn(index: number, item: T): unknown {
    return (item as { id?: string | number })?.id ?? index
  }

  onHeaderClick(col: ColumnDef<T>): void {
    if (!col.sortable) return
    const newOrder =
      this.sortColumn === col.key && this.sortOrder === 'asc' ? 'desc' : 'asc'
    this.sortColumn = col.key
    this.sortOrder = newOrder
    this.sortChange.emit({ column: col.key, order: newOrder })
  }

  onRowClick(row: T): void {
    if (this.rowClickable) {
      this.rowClick.emit(row)
    }
  }

  getCellValue(row: T, col: ColumnDef<T>): string | number {
    if (col.cell) {
      return col.cell(row)
    }
    const val = (row as Record<string, unknown>)[col.key]
    return val !== undefined && val !== null ? String(val) : ''
  }

  getAriaSort(key: string): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn !== key) return 'none'
    return this.sortOrder === 'asc' ? 'ascending' : 'descending'
  }
}
