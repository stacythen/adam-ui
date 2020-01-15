/* eslint-disable @typescript-eslint/prefer-interface */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { GridReadyEvent, PaginationChangedEvent, SortChangedEvent, FilterChangedEvent } from 'ag-grid-community';
import DataGridThemeProvider, { IDataGridThemeProvider } from './DataGridThemeProvider/DataGridThemeProvider';
import { MAT_GRID_SIZE } from './DataGridThemeProvider/AdamThemeWrapper';
import { IExtendedDatasource, IRowsParams } from './ExtendedProps';
import { DEFAULT_COL_DEF, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from './constants';
import { isDeepEqual } from './utils';
import QuickTextFilter, { QuickTextFilterHandler } from './QuickTextFilter';
import Pagination, { IPaginationProps, IPaginationConfigProps, IPaginationConfig } from 'adam-component-pagination';
import merge from 'lodash/merge';

export interface IDataGrid {
  /** Free version of server-side data source */
  extendedDatasource?: IExtendedDatasource;
  quickFilter?: boolean;
  quickFilterPlaceholder?: string;
  quickFilterRenderer?: (
    onQuickFilterChanged: (filter: string | undefined) => void,
    ref: React.RefObject<QuickTextFilterHandler>
  ) => JSX.Element;
  resetFilter?: boolean;
  resetFilterRenderer?: (onResetFilter: () => void, disabled: boolean) => JSX.Element;
  resetSorting?: boolean;
  resetSortingRenderer?: (onResetSorting: () => void, disabled: boolean) => JSX.Element;
  paginatorConfig?: IPaginationConfigProps & IPaginationConfig;
}

export type ExtendedAgGridReactProps = Partial<AgGridReactProps> & IDataGrid & Pick<IDataGridThemeProvider, 'theme'>;

let gridApi = null;
/**
 * Wrapper for Ag-Grid
 */
const DataGrid = (props: ExtendedAgGridReactProps): React.ReactElement => {
  const {
    pagination,
    onGridReady,
    onPaginationChanged,
    theme,
    extendedDatasource,
    quickFilter,
    quickFilterPlaceholder,
    resetFilter,
    resetSorting,
    resetFilterRenderer,
    resetSortingRenderer,
    quickFilterRenderer,
    quickFilterText = props.quickFilter ? undefined : props.quickFilterText,
    paginatorConfig = { hidePageSummary: undefined, hidePageSize: undefined, pageRange: undefined },
    ...rest
  } = props;

  const [rowData, setRowData] = useState(extendedDatasource ? [] : props.rowData);

  let defaultPagination: IPaginationProps;
  if (extendedDatasource) {
    defaultPagination = {
      pageSize: extendedDatasource.pageSize || DEFAULT_PAGE_SIZE,
      currentPage: extendedDatasource.currentPage || DEFAULT_PAGE_NUMBER,
      rowCount: extendedDatasource.rowCount || 0,
    };
  } else {
    defaultPagination = {
      pageSize: props.paginationPageSize || DEFAULT_PAGE_SIZE,
      currentPage: props.paginationStartPage || DEFAULT_PAGE_NUMBER,
      rowCount: props.rowData ? props.rowData.length : 0,
    };
  }
  const [customPagination, setCustomPagination] = useState<IPaginationProps>(defaultPagination);
  const [rowsParams, setRowsParams] = useState<IRowsParams>();

  //#region AgGrid Event Handlers

  const deepSetRowsParams = useCallback(
    (params: Partial<IRowsParams>, force = false) => {
      const mergeRowsParams: IRowsParams = Object.assign({}, rowsParams, params);
      if (force || !isDeepEqual(rowsParams, mergeRowsParams)) {
        setRowsParams(mergeRowsParams);
      }
    },
    [rowsParams]
  );

  const _onGridReady = (event: GridReadyEvent) => {
    gridApi = event.api;

    if (extendedDatasource) {
      const filterModel =
        extendedDatasource.filterModel && Object.keys(extendedDatasource.filterModel).length > 0
          ? extendedDatasource.filterModel
          : undefined;
      deepSetRowsParams({
        pageNumber: customPagination.currentPage,
        pageSize: customPagination.pageSize,
        sortModel: event.api.getSortModel(),
        filterModel: filterModel,
      });
      if (filterModel) {
        event.api.setFilterModel(filterModel); // This will trigger AgGrid.onFilterChanged
      }
    }
    if (onGridReady) {
      onGridReady(event);
    }
  };

  const sizeToFit = () => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  };

  const _onFirstDataRendered = () => {
    sizeToFit();
  };

  const _onGridSizeChanged = () => {
    sizeToFit();
  };

  //#endregion

  //#region Overlay

  const toggleLoadingOverlay = (toggle: boolean) => {
    if (gridApi) {
      if (toggle) {
        gridApi.showLoadingOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  };

  const toggleNoRowsOverlay = (toggle: boolean) => {
    if (gridApi) {
      if (toggle) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  };

  //#endregion

  //#region Pagination

  const _onPaginationChanged = (event: PaginationChangedEvent) => {
    if (event.api && !extendedDatasource) {
      setCustomPagination({
        pageSize: event.api.paginationGetPageSize(),
        currentPage: event.api.paginationGetCurrentPage() + 1,
        rowCount: event.api.paginationGetRowCount(),
      });
      if (onPaginationChanged) {
        onPaginationChanged(event);
      }
    }
  };

  const onPageChanged = (pageNumber: number, pageSize: number, force = false) => {
    if (!extendedDatasource) {
      gridApi.paginationGoToPage(pageNumber - 1);
      gridApi.paginationSetPageSize(pageSize);
    } else {
      setCustomPagination({
        pageSize: pageSize,
        currentPage: pageNumber,
        rowCount: customPagination.rowCount,
      });
      deepSetRowsParams(
        {
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
        force
      );
    }
  };

  const onRefresh = (pageNumber: number, pageSize: number) => {
    onPageChanged(pageNumber, pageSize, true);
  };

  //#endregion

  //#region Sorting & Filtering

  const _onSortChanged = (event: SortChangedEvent) => {
    if (event.api && extendedDatasource) {
      deepSetRowsParams({ sortModel: event.api.getSortModel() });
    }
    if (props.onSortChanged) {
      props.onSortChanged(event);
    }
  };

  const _onFilterChanged = (event: FilterChangedEvent) => {
    if (
      event.api &&
      extendedDatasource &&
      !isDeepEqual(rowsParams ? rowsParams.filterModel : undefined, event.api.getFilterModel())
    ) {
      deepSetRowsParams({
        filterModel: event.api.getFilterModel(),
        pageNumber: 1,
      });
    }
    if (props.onFilterChanged) {
      props.onFilterChanged(event);
    }
  };

  //#endregion

  //#region Extended Server Side data source

  useEffect(() => {
    if (extendedDatasource && rowsParams) {
      const { pageNumber, pageSize, filterModel, sortModel, quickFilterText } = rowsParams;
      const successCallback = <T extends object>(
        rowsThisPage: T[],
        pageNumber: number,
        rowCount: number,
        pageSize: number
      ) => {
        setCustomPagination({
          currentPage: pageNumber,
          rowCount: rowCount,
          pageSize: pageSize,
        });
        deepSetRowsParams({
          pageNumber: pageNumber,
          pageSize: pageSize,
        });

        setRowData(rowsThisPage);
        if (rowsThisPage && rowsThisPage.length > 0) {
          toggleLoadingOverlay(false);
        } else {
          toggleNoRowsOverlay(true);
        }
      };

      const failCallback = () => {
        setCustomPagination({
          currentPage: DEFAULT_PAGE_NUMBER,
          rowCount: 0,
          pageSize: pageSize,
        });
        setRowData([]);
        toggleLoadingOverlay(false);
        toggleNoRowsOverlay(true);
      };

      toggleLoadingOverlay(true);
      extendedDatasource.getRows({
        successCallback,
        failCallback,
        pageNumber,
        pageSize,
        filterModel,
        sortModel,
        quickFilterText,
      });
    }
  }, [extendedDatasource, rowsParams, deepSetRowsParams]);

  const onQuickFilterChanged = (filter: string | undefined) => {
    deepSetRowsParams({
      quickFilterText: filter,
    });
  };

  const onResetSorting = () => {
    if (gridApi) {
      gridApi.setSortModel(null);
    }
  };

  const quickTextFilterRef = useRef<QuickTextFilterHandler>(null);
  const onResetFilter = () => {
    if (gridApi) {
      deepSetRowsParams({
        quickFilterText: undefined,
        filterModel: {},
      });
      if (quickTextFilterRef && quickTextFilterRef.current) {
        quickTextFilterRef.current.reset();
      }
      gridApi.setFilterModel({});
    }
  };

  //#endregion

  const isAdamTheme = theme === 'ag-theme-adam';
  const disableFilterButton = !(gridApi && Object.keys(gridApi.getFilterModel()).length > 0);
  const disableSortingButton = !(gridApi && (gridApi.getSortModel() || []).length > 0);
  return (
    <DataGridThemeProvider theme={theme}>
      <div className={`adam-ui-gridwrapper${props.floatingFilter ? ' floatingFilter' : ''}`}>
        <div className="ag-custom-panel">
          {quickFilter &&
            (quickFilterRenderer ? (
              quickFilterRenderer(onQuickFilterChanged, quickTextFilterRef)
            ) : (
              <QuickTextFilter
                ref={quickTextFilterRef}
                filter={quickFilterText}
                quickFilterPlaceholder={quickFilterPlaceholder}
                onQuickFilterChanged={onQuickFilterChanged}
              />
            ))}
          {resetFilter &&
            (resetFilterRenderer ? (
              resetFilterRenderer(onResetFilter, disableFilterButton)
            ) : (
              <button
                className="ag-custom-panel-filter-button"
                name={'btnResetFilter'}
                onClick={onResetFilter}
                disabled={disableFilterButton}
              >
                Reset Filters
              </button>
            ))}
          {resetSorting &&
            (resetSortingRenderer ? (
              resetSortingRenderer(onResetSorting, disableSortingButton)
            ) : (
              <button
                className="ag-custom-panel-sorting-button"
                name={'btnResetSorting'}
                onClick={onResetSorting}
                disabled={disableSortingButton}
              >
                Reset Sorting
              </button>
            ))}
        </div>

        <AgGridReact
          defaultColDef={merge(DEFAULT_COL_DEF, props.defaultColDef)}
          onGridReady={_onGridReady}
          pagination={pagination}
          paginationPageSize={customPagination.pageSize}
          suppressPaginationPanel={pagination}
          onPaginationChanged={_onPaginationChanged}
          reactNext={true}
          domLayout={'autoHeight'}
          onFirstDataRendered={_onFirstDataRendered}
          onGridSizeChanged={_onGridSizeChanged}
          rowData={rowData}
          headerHeight={isAdamTheme ? MAT_GRID_SIZE * 7 : undefined}
          detailRowHeight={isAdamTheme ? MAT_GRID_SIZE * 5 : undefined}
          rowHeight={isAdamTheme ? MAT_GRID_SIZE * 6 : undefined}
          onSortChanged={_onSortChanged}
          onFilterChanged={_onFilterChanged}
          suppressCellSelection={true}
          suppressMovableColumns={true}
          {...rest}
        />
        {pagination && (
          <Pagination {...customPagination} {...paginatorConfig} onPageChanged={onPageChanged} onRefresh={onRefresh} />
        )}
      </div>
    </DataGridThemeProvider>
  );
};

export default DataGrid;
