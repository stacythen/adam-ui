export enum FILTER_TYPE {
  text = 'text',
  number = 'number',
  date = 'date',
}

export interface IFilterModel {
  /** search term */
  filter: string; //* search term
  /** Data type: text */
  filterType: string; //* text
  /** Filter options: contains, ... */
  type: string; //* contains
}

export type FilterModel = Record<string, IFilterModel>;
