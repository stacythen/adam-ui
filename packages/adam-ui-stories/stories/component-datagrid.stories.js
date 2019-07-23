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
  .add("default", () => <DataGrid columnDefs={columnDefs} />)
  .add("with Pagination", () => <DataGrid columnDefs={columnDefs} pagination={true} paginationPageSize={10} />);
