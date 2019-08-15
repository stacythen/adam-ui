/* eslint-disable @typescript-eslint/prefer-interface */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
  GridApi,
  GridReadyEvent,
  PaginationChangedEvent,
  SortChangedEvent,
  FilterChangedEvent,
} from 'ag-grid-community';
import DataGridThemeProvider, { IDataGridThemeProvider } from './DataGridThemeProvider/DataGridThemeProvider';
import { MAT_GRID_SIZE } from './DataGridThemeProvider/AdamThemeWrapper';
import { IExtendedDatasource, IRowsParams } from './ExtendedProps';
import { DEFAULT_COL_DEF, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from './constants';
import { isDeepEqual } from './utils';
import QuickTextFilter, { QuickTextFilterHandler } from './QuickTextFilter';
import Pagination, { IPaginationProps } from 'adam-component-pagination';
import merge from 'lodash/merge';

export interface IDataGrid {
  /** Free version of server-side data source */
  extendedDatasource?: IExtendedDatasource;
  quickFilter?: boolean;
  quickFilterPlaceholder?: string;
  resetFilter?: boolean;
  resetSorting?: boolean;
  quickFilterRenderer?: (
    onQuickFilterChanged: (filter: string | undefined) => void,
    ref: React.RefObject<QuickTextFilterHandler>
  ) => JSX.Element;
  resetFilterRenderer?: (onResetFilter: () => void) => JSX.Element;
  resetSortingRenderer?: (onResetSorting: () => void) => JSX.Element;
}

export type ExtendedAgGridReactProps = Partial<AgGridReactProps> & IDataGrid & Pick<IDataGridThemeProvider, 'theme'>;

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
    ...rest
  } = props;
  const gridApi = useRef(new GridApi());

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
    (params: Partial<IRowsParams>) => {
      const mergeRowsParams: IRowsParams = Object.assign({}, rowsParams, params);
      if (!isDeepEqual(rowsParams, mergeRowsParams)) {
        setRowsParams(mergeRowsParams);
      }
    },
    [rowsParams]
  );

  const _onGridReady = (event: GridReadyEvent) => {
    gridApi.current = event.api;

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
      gridApi.current.sizeColumnsToFit();
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
        gridApi.current.showLoadingOverlay();
      } else {
        gridApi.current.hideOverlay();
      }
    }
  };

  const toggleNoRowsOverlay = (toggle: boolean) => {
    if (gridApi) {
      if (toggle) {
        gridApi.current.showNoRowsOverlay();
      } else {
        gridApi.current.hideOverlay();
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

  const onPageChanged = (pageNumber: number, pageSize: number) => {
    if (!extendedDatasource) {
      gridApi.current.paginationGoToPage(pageNumber - 1);
      gridApi.current.paginationSetPageSize(pageSize);
    } else {
      setCustomPagination({
        pageSize: pageSize,
        currentPage: pageNumber,
        rowCount: customPagination.rowCount,
      });
      deepSetRowsParams({
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    }
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
        setRowData([]);
        toggleLoadingOverlay(false);
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
    if (gridApi.current) {
      gridApi.current.setSortModel(null);
    }
  };

  const quickTextFilterRef = useRef<QuickTextFilterHandler>(null);
  const onResetFilter = () => {
    if (gridApi.current) {
      deepSetRowsParams({
        quickFilterText: undefined,
        filterModel: {},
      });
      if (quickTextFilterRef && quickTextFilterRef.current) {
        quickTextFilterRef.current.reset();
      }
      gridApi.current.setFilterModel({});
    }
  };

  //#endregion

  const isAdamTheme = theme === 'ag-theme-adam';
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
              resetFilterRenderer(onResetFilter)
            ) : (
              <button className="ag-custom-panel-filter-button" name={'btnResetFilter'} onClick={onResetFilter}>
                Reset Filters
              </button>
            ))}
          {resetSorting &&
            (resetSortingRenderer ? (
              resetSortingRenderer(onResetSorting)
            ) : (
              <button className="ag-custom-panel-sorting-button" name={'btnResetSorting'} onClick={onResetSorting}>
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
        {pagination && <Pagination {...customPagination} onPageChanged={onPageChanged} />}
      </div>
    </DataGridThemeProvider>
  );
};

export default DataGrid;
