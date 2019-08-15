import { ColDef } from 'ag-grid-community';

export const DEFAULT_COL_DEF: ColDef = {
  resizable: true,
  sortable: true,
  filterParams: {
    newRowsAction: 'keep',
  },
};
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;
