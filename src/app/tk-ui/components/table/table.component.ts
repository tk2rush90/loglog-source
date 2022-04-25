import {
  AfterContentChecked,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {BodyColumnDirective} from '@tk-ui/components/table/body-column.directive';
import {HeaderColumnDirective} from '@tk-ui/components/table/header-column.directive';
import {SortOrder} from '@tk-ui/utils/sort.util';

/**
 * The definition for table column.
 */
export interface TableColumn {
  // The key for this column.
  key: string;
  // The label for header column.
  label: string;
  // The `max-width` style value for column.
  maxWidth?: string;
  // Set state of using sort feature.
  sort?: boolean;
}

/**
 * The options for table.
 */
export interface TableOptions {
  columns: TableColumn[];
  // Set state of using multi sort feature.
  multiSort?: boolean;
}

/**
 * The table sort object.
 */
export interface TableSort {
  key: string;
  order: SortOrder;
}

/**
 * The featured table component.
 */
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit, AfterContentChecked {
  // The data of table.
  @Input() data: T[] = [];

  // The table options.
  @Input() options!: TableOptions;

  @Output() sortsChange: EventEmitter<TableSort[]> = new EventEmitter<TableSort[]>();

  // The list of body columns.
  @ContentChildren(BodyColumnDirective) bodyColumnList!: QueryList<BodyColumnDirective>;

  // The list of header columns.
  @ContentChildren(HeaderColumnDirective) headerColumnList!: QueryList<HeaderColumnDirective>;

  // The map of sorts.
  // The `k` is `key` of each column.
  sortMap: { [k: string]: SortOrder } = {};

  constructor() {
  }

  // The table sorts.
  private _sorts: TableSort[] = [];

  /**
   * Set the sorts for table.
   * @param sorts Table sorts.
   */
  @Input() set sorts(sorts: TableSort[]) {
    this._sorts = sorts;
    this._createSortMap();
  }

  // The map of body columns.
  // The `k` is `key` field of BodyColumnDirective which is matched to the `TableColumn`.
  private _bodyColumnMap: { [k: string]: BodyColumnDirective } = {};

  /**
   * Get the map of BodyColumnDirective.
   */
  get bodyColumnMap(): { [k: string]: BodyColumnDirective } {
    return this._bodyColumnMap;
  }

  // THe map of header columns.
  // The `k` is `key` field of HeaderColumnDirective which is matched to the `TableColumn`.
  private _headerColumnMap: { [k: string]: HeaderColumnDirective } = {};

  /**
   * Get the map of HeaderColumnDirective.
   */
  get headerColumnMap(): { [k: string]: HeaderColumnDirective } {
    return this._headerColumnMap;
  }

  /**
   * Get the table columns.
   */
  get columns(): TableColumn[] {
    return this.options.columns;
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this._createContentListMap();
  }

  /**
   * Toggle the sort for a column.
   * @param column The column to change sort.
   */
  toggleSort(column: TableColumn): void {
    if (column.sort) {
      const sort = this._sorts.find(_sort => _sort.key === column.key);
      const {multiSort} = this.options;

      // It handles the case of clicking the column that already has been sorted.
      switch (sort?.order) {
        case 'asc': {
          // When `order` is `asc`, always turn to `desc` whether
          // multi sort feature is used or not.
          this.sortsChange.emit(this._sorts.map(_sort => {
            return {
              key: _sort.key,
              order: _sort.key === sort.key ? 'desc' : _sort.order,
            };
          }));

          break;
        }

        case 'desc': {
          if (multiSort) {
            // When `order` is `desc` and multi sort feature is used,
            // remove the column from the `_sorts` array.
            // If previous sorts was `[{key: 'column', order: 'desc'}]` and user clicked `'column'` column again,
            // then the next sorts will be an empty array.
            this.sortsChange.emit(this._sorts.filter(_sort => _sort.key !== sort.key));
          } else {
            // When `order` is `desc` and multi sort feature isn't used,
            // turn the `order` to `asc`.
            // Since the multi sort feature isn't used, there will be always a single item in the sorts array.
            this.sortsChange.emit([
              {
                ...sort,
                order: 'asc',
              },
            ]);
          }

          break;
        }

        default: {
          const newSort: TableSort = {
            key: column.key,
            order: 'asc',
          };

          // The case of unsorted column is clicked.
          if (multiSort) {
            // If unsorted column clicked when using multi sort feature,
            // add the column to sort column.
            this.sortsChange.emit([
              ...this._sorts,
              newSort,
            ]);
          } else {
            // If unsorted column clicked when multi sort feature is not used,
            // change the sort column with new column.
            this.sortsChange.emit([
              newSort,
            ]);
          }

          break;
        }
      }
    }
  }

  /**
   * Create the sort map with `_sorts`.
   */
  private _createSortMap(): void {
    this.sortMap = {};

    this._sorts.forEach(sort => {
      this.sortMap[sort.key] = sort.order;
    });
  }

  /**
   * Create the content list map for header and body.
   */
  private _createContentListMap(): void {
    this._bodyColumnMap = {};
    this._headerColumnMap = {};

    this.bodyColumnList.forEach(bodyColumn => this._bodyColumnMap[bodyColumn.key] = bodyColumn);
    this.headerColumnList.forEach(headerColumn => this._headerColumnMap[headerColumn.key] = headerColumn);
  }
}
