/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback } from 'react';

import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import './DataGrid.scss';

import useDataGrid from './useDataGrid';
import { GridApi, GridReadyEvent, ColumnApi, PaginationChangedEvent } from 'ag-grid-community';

// // interface ISample {
// //   /** properties description here */
// //   children?: React.ReactNode;
// // }

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

  // // const onGridReady = useCallback(() => {
  // //   alert('onGridReady');
  // // }, [gridApi]);

  const _onGridReady = (params: GridReadyEvent) => {
    alert('onGridReady');
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
      alert('_onPaginationChanged');
      alert(event.api);
      gridApi = event.api;
      if (gridApi) {
        alert(`lbLastPageFound = ${gridApi.paginationIsLastPageFound()}`);
        alert(`lbPageSize = ${gridApi.paginationGetPageSize()}`);
        alert(`lbCurrentPage = ${gridApi.paginationGetCurrentPage() + 1}`);
        alert(`lbTotalPages = ${gridApi.paginationGetTotalPages()}`);
        alert(`setLastButtonDisabled = ${gridApi.paginationIsLastPageFound()}`);
      }
      if (onPaginationChanged) {
        onPaginationChanged(event);
      }
    },
    [gridApi, onPaginationChanged]
  );

  const _onPaginationChanged = (event: PaginationChangedEvent) => onPaginationChangedCallback(event);

  const onBtFirst = useCallback(() => {
    gridApi.paginationGoToFirstPage();
  }, [gridApi]);

  const onBtLast = useCallback(() => {
    gridApi.paginationGoToLastPage();
  }, [gridApi]);

  const onBtNext = useCallback(() => {
    gridApi.paginationGoToNextPage();
  }, [gridApi]);

  const onBtPrevious = useCallback(() => {
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
        onGridReady={_onGridReady}
        onPaginationChanged={_onPaginationChanged}
      ></AgGridReact>
      {/* << < 1 2 3 > >>
        dropdown items per page
        1 - 10 of 39 items */}
      <div>
        <button onClick={onBtFirst}>{'<<'}</button>
        <button onClick={onBtPrevious}>{'<'}</button>
        123
        <button onClick={onBtNext}>{'>'}</button>
        <button onClick={onBtLast} id="btLast">
          {'>>'}
        </button>
      </div>
      <div style={{ marginTop: '6px' }}>
        <span className="label">Last Page Found:</span>
        <span className="value" id="lbLastPageFound">
          -
        </span>
        <span className="label">Page Size:</span>
        <span className="value" id="lbPageSize">
          -
        </span>
        <span className="label">Total Pages:</span>
        <span className="value" id="lbTotalPages">
          -
        </span>
        <span className="label">Current Page:</span>
        <span className="value" id="lbCurrentPage">
          -
        </span>
      </div>
    </div>
  );
};

export default DataGrid;
