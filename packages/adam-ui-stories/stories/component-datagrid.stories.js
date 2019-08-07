/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from "react";

import { storiesOf } from "@storybook/react";

import DataGrid from "adam-component-datagrid";

var columnDefs = [
  {
    headerName: 'Make',
    field: 'make',
    sortable: true,
    filter: true,
    checkboxSelection: true
  },
  {
    headerName: 'Model',
    field: 'model',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Price',
    field: 'price',
    sortable: true,
    filter: true,
  },
];
storiesOf("DataGrid", module)
  .add("default", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} />)
  .add("with Pagination", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]}  pagination={true} paginationPageSize={10} />)
  .add("with Quick Text Filter", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} quickFilter={true} quickFilterText={'test'} quickFilterPlaceholder={'Search Placeholder'} />)
  .add("with Reset Filter Button", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} resetFilter={true} />)
  .add("with Reset Filter Button (Custom Renderer)", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} resetFilter={true} resetFilterRenderer={(onResetFilter)=> {
    return (<button onClick={onResetFilter}>Custom Reset Filter Button</button>)
  }} />)
  .add("with Reset Sorting Button", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} resetFilter={true} />)
  .add("with Reset Sorting Button (Custom Renderer)", () => <DataGrid theme={'ag-theme-adam'} columnDefs={columnDefs} rowData={[]} resetSorting={true} resetSortingRenderer={(onResetSorting)=> {
    return (<button onClick={onResetSorting}>Custom Reset Sorting Button</button>)
  }} />);
