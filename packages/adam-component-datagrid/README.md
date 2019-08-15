# adam-component-datagrid

## Overview

An ag-Grid extensions with server-side pagination supports. [Demo - Storybook coming soon](#)

See [ag-Grid Documentation](#https://www.ag-grid.com) for more.

## Installation

```
npm i adam-component-datagrid
```

## Usage

### Quick Start

```tsx
import React from 'react';
import { ColDef } from 'ag-grid-community';
import DataGrid, { IExtendedDatasource, IGetExtendedRowsParams } from 'adam-component-datagrid';

interface IState {
  columnDefs: ColDef[];
}

export default class QuickStart extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
          width: 50,
        },
        {
          headerName: 'userId',
          field: 'userId',
          width: 50,
        },
        {
          headerName: 'title',
          field: 'title',
          width: 150,
        },
        {
          headerName: 'completed',
          field: 'completed',
        },
      ],
    };
  }

  render() {
    const dataSource: IExtendedDatasource = {
      pageSize: 10,
      currentPage: 1,
      getRows: (params: IGetExtendedRowsParams) => {
        const url = `https://jsonplaceholder.typicode.com/todos?_page=${params.pageNumber}&_limit=${params.pageSize}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            params.successCallback(data, params.pageNumber, 1000, params.pageSize);
          })
          .catch(error => {
            params.failCallback();
            throw error;
          });
      },
    };

    return (
      <DataGrid
        theme={'ag-theme-adam'}
        columnDefs={this.state.columnDefs}
        extendedDatasource={dataSource}
        pagination={true}
      />
    );
  }
}
```

Play with this on [CodeSandbox](#https://codesandbox.io/s/adam-ui-examples-2vq0c) and read the documentation to learn more.

### Props

The extended props of the DataGrid component.

| Name                   | Type    | Default | Description                                          |
| ---------------------- | ------- | ------- | ---------------------------------------------------- |
| extendedDatasource     | object  |         | Props applied to the server-side pagination feature. |
| quickFilter            | boolean | false   | If true, the quick filter textbox is shown.          |
| quickFilterPlaceholder | string  |         | Quick filter textbox placeholder.                    |
| quickFilterRenderer    | func    |         | Custom filter renderer.                              |
| resetFilter            | boolean | false   | If true, the reset filter button is shown.           |
| resetFilterRenderer    | func    |         | Custom reset filter renderer.                        |
| resetSorting           | boolean | false   | If true, the reset sorting button is shown.          |
| resetSortingRenderer   | func    |         | Custom reset sorting renderer .                      |

Params for the above IDataGrid.extendedDatasource:

| Name        | Type   | Default | Description                                                               |
| ----------- | ------ | ------- | ------------------------------------------------------------------------- |
| pageSize    | number | 10      | Initial page size.                                                        |
| currentPage | number | 1       | Initial page number.                                                      |
| rowCount    | number | 0       | Initial row count.                                                        |
| filterModel | object | 0       | Set filtering on a column.                                                |
| getRows     | object | 0       | Callback the grid calls that you implement to fetch rows from the server. |

Params for the above IExtendedDatasource.getRows():

| Name            | Type   | Default | Description                                                          |
| --------------- | ------ | ------- | -------------------------------------------------------------------- |
| pageNumber      | number |         | The page number index to get.                                        |
| pageSize        | number |         | The page size index to get.                                          |
| successCallback | func   |         | Callback to call for the result when successful.                     |
| failCallback    | func   |         | Callback to call when the request fails.                             |
| sortModel       | object |         | If doing server side sorting, contains the sort model.               |
| filterModel     | object |         | If doing server side filtering, contains the filter model.           |
| quickFilterText | object |         | If doing server side quick filtering, contains the quick filter text |

### Theming

By default, ag-Grid comes with provided themes, see [ag-Grid Theme](#https://www.ag-grid.com/javascript-grid-themes-provided/).

A customized theme (`ag-theme-adam`) added in this library.

Following is a list of Sass variables added in `ag-theme-adam`, their default values, and a short explanation of their purpose.

| Variable Name             | Default Value | Description                                      |
| ------------------------- | ------------- | ------------------------------------------------ |
| anchor-foreground-color   | #3b82de       | anchor link font color                           |
| custom-panel-item-padding | 14.5px 14px   | The padding between elements in custom-panel div |
| custom-panel-item-margin  | 0 0 0 5px     | The margin between elements in custom-panel div  |

#### Customize the Theme Look

The following shows ag-grid setup the theme:

```tsx
import DataGrid from 'adam-component-datagrid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

<div
  className="ag-theme-balham"
  style={{
    height: '500px',
    width: '600px',
  }}
>
  <DataGrid />
</div>;
```

For quick theme setup:

```tsx
import DataGrid from 'adam-component-datagrid';

<DataGrid theme={'adam-theme-adam'} />;
```

### Data Grid Mapping Configuration Class

A convention-based object-object mapper to mapped ag-Grid's `filterModel` and `sortModel` to your defined object.

Example:

```tsx
// configureDataGridMapper.ts

import { DataGridMapperConfiguration } from 'adam-component-datagrid';

interface ISortDescriptor {
  Field: string;
  Direction: string;
}

interface IFilterCriteria {
  Field: string;
  Operator: string;
  Value: string;
}

const DataGridMapper = new DataGridMapperConfiguration()
  .configureSortMap<ISortDescriptor>(
    {
      asc: 'Asc',
      desc: 'Desc',
    },
    'Field',
    'Direction'
  )
  .configureFilterMap<IFilterCriteria>(
    {
      contains: FilterOperator.Contains,
      notContains: FilterOperator.NotEqual,
      equals: FilterOperator.Equal,
      notEqual: FilterOperator.NotEqual,
      startsWith: FilterOperator.StartsWith,
      endsWith: FilterOperator.EndsWith,
      lessThan: FilterOperator.LessThan,
      lessThanOrEqual: FilterOperator.LessThanOrEqual,
      greaterThan: FilterOperator.GreaterThan,
      greaterThanOrEqual: FilterOperator.GreaterThanOrEqual,
      inRange: FilterOperator.In,
    },
    'Field',
    'Operator',
    'Value'
  );

export default DataGridMapper;
```

The `DataGridMapper` usage:

```tsx
const sortModel = [{ colId: 'country', sort: 'asc' }, { colId: 'sport', sort: 'desc' }];
const mappedSortDescriptor = DataGridMapper.sortModelToRestful(sortModel);
// mappedSortDescriptor = [{ Field: 'country', Direction: 'Asc' }, { Field: 'sport', Direction: 'Desc' }];

const filterModel = {
  columnA: {
    filterType: 'text',
    type: 'equals',
    filter: 'abcde',
  },
  columnB: {
    filterType: 'number',
    type: 'equals',
    filter: 123,
  },
  columnC: {
    filterType: 'date',
    type: 'greaterThan',
    dateFrom: '2019-05-24',
  },
};

const mappedFilterCriteria = DataGridMapper.filterModelToRestful(filterModel);
// mappedFilterCriteria = [
//   { Field: 'columnA', Operator: 'Equal', Value: 'abcde' },
//   { Field: 'columnB', Operator: 'Equal', Value: 123 },
//   { Field: 'columnC', Operator: 'GreaterThan', Value: '2019-05-24' },
// ];
```
