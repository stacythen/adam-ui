/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useState } from 'react';

import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '../ag-theme-adam.css';

import { GridApi, GridReadyEvent, ColumnApi, PaginationChangedEvent } from 'ag-grid-community';
import useDataGrid from './useDataGrid';
import Pagination, { IPaginationProps } from './Pagination';

interface ITest {
  make: string;
  model: string;
  price: string;
}

/**
 * component description here
 */
const DataGrid = (props: Partial<AgGridReactProps>): React.ReactElement => {
  const { pagination, onGridReady, onPaginationChanged, ...rest } = props;
  const [data] = useDataGrid<ITest>('https://api.myjson.com/bins/15psn9');
  let gridApi: GridApi;
  let gridColumnApi: ColumnApi;

  const [customPagination, setCustomPagination] = useState<IPaginationProps>({
    pageSize: props.paginationPageSize,
    totalPages: props.rowData ? Math.ceil(props.rowData.length / props.paginationPageSize) : 0,
    currentPage: props.paginationStartPage,
    rowCount: props.rowData ? props.rowData.length : 0,
  });

  // const onGridReady = useCallback(() => {
  //   alert('onGridReady');
  // }, [gridApi]);

  const _onGridReady = (params: GridReadyEvent) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;

    // // const httpRequest = new XMLHttpRequest();
    // // const updateData = data => {
    // //   this.setState({ rowData: data });
    // // };

    // // httpRequest.open(
    // //   "GET",
    // //   "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    // // );
    // // httpRequest.send();
    // // httpRequest.onreadystatechange = () => {
    // //   if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    // //     updateData(JSON.parse(httpRequest.responseText));
    // //   }
    // // };
    if (onGridReady) {
      onGridReady(params);
    }
  };

  // // const _onPaginationChanged = useCallback(
  // //   () => (event: PaginationChangedEvent) => {
  // //     alert(event.api);
  // //   },
  // //   [gridApi]
  // // );

  const onPaginationChangedCallback = React.useCallback(
    event => {
      gridApi = event.api;
      if (gridApi) {
        setCustomPagination({
          pageSize: gridApi.paginationGetPageSize(),
          currentPage: gridApi.paginationGetCurrentPage() + 1,
          totalPages: gridApi.paginationGetTotalPages(),
          rowCount: gridApi.paginationGetRowCount(),
        });
      }
      if (onPaginationChanged) {
        onPaginationChanged(event);
      }
    },
    [gridApi, onPaginationChanged]
  );

  const _onPaginationChanged = (event: PaginationChangedEvent) => onPaginationChangedCallback(event);

  const onFirstClicked = useCallback(() => {
    gridApi.paginationGoToFirstPage();
  }, [gridApi]);

  const onLastClicked = useCallback(() => {
    gridApi.paginationGoToLastPage();
  }, [gridApi]);

  const onNextClicked = useCallback(() => {
    gridApi.paginationGoToNextPage();
  }, [gridApi]);

  const onPreviousClicked = useCallback(() => {
    gridApi.paginationGoToPreviousPage();
  }, [gridApi]);

  return (
    <div
      className="ag-theme-balham"
      style={{
        height: '500px',
        width: '600px',
      }}
    >
      <AgGridReact
        {...rest}
        rowData={data}
        pagination={pagination}
        suppressPaginationPanel={pagination}
        onGridReady={_onGridReady}
        onPaginationChanged={_onPaginationChanged}
      ></AgGridReact>
      {pagination && (
        <Pagination
          {...customPagination}
          onFirstClicked={onFirstClicked}
          onPreviousClicked={onPreviousClicked}
          onNextClicked={onNextClicked}
          onLastClicked={onLastClicked}
        />
      )}
    </div>
  );
};

export default DataGrid;
