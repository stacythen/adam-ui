/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterModel } from './FilterProps';
import { SortModel } from './SortProps';

export interface IExtendedDatasource {
  /** If you know up front pageSize, currentPage, rowCount, filterModel. Otherwise leave blank.*/
  pageSize?: number;
  currentPage?: number;
  rowCount?: number;
  filterModel?: FilterModel;
  /** Callback the grid calls that you implement to fetch rows from the server. See below for params.*/
  getRows(params: IGetExtendedRowsParams): void;
}

/** Params for the above IExtendedDatasource.getRows() */
export interface IGetExtendedRowsParams {
  /** The page number index to get. */
  pageNumber: number;
  /** The page size index to get. */
  pageSize: number;
  /** Callback to call for the result when successful. */
  successCallback(rowsThisPage: any[], pageNumber: number, rowCount: number, pageSize: number): void;
  /** Callback to call when the request fails. */
  failCallback(): void;
  /** If doing server side sorting, contains the sort model */
  sortModel?: SortModel[];
  /** If doing server side filtering, contains the filter model */
  filterModel?: FilterModel;
  /** If doing server side quick filtering, contains the quick filter text */
  quickFilterText?: string;
}

export interface IRowsParams {
  /** The page number index to get. */
  pageNumber: number;
  /** The page size index to get. */
  pageSize: number;
  /** If doing server side sorting, contains the sort model */
  sortModel?: SortModel[];
  /** If doing server side filtering, contains the filter model */
  filterModel?: FilterModel;
  /** If doing server side quick filtering, contains the quick filter text */
  quickFilterText?: string;
}
