import { DateFilterModel, NumberFilterModel, TextFilterModel } from 'ag-grid-community';

export enum FILTER_TYPE {
  text = 'text',
  number = 'number',
  date = 'date',
}

export type FilterModel = Record<string, TextFilterModel | NumberFilterModel | DateFilterModel>;
