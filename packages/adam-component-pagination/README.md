# adam-component-pagination

## Overview

React pagination component. [Demo - Storybook coming soon](#)

## Installation

```
npm i adam-component-pagination
```

## Usage

### Quick Start

```tsx
import * as React from 'react';
import Pagination from 'adam-component-pagination';

interface IState {
  pageSize: number;
  currentPage: number;
  rowCount: number;
}
export default class PaginationExample extends React.Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = {
      pageSize: 10,
      currentPage: 1,
      rowCount: 1000,
    };
  }

  onPageChanged = (pageNumber: number, pageSize: number) => {
    this.setState({
      pageSize: pageSize,
      currentPage: pageNumber,
    });
  };

  render() {
    return <Pagination {...this.state} onPageChanged={this.onPageChanged} />;
  }
}
```

Play with this on [CodeSandbox](#https://codesandbox.io/s/adam-ui-examples-2vq0c) and read the documentation to learn more.

### Props

The extended props of the pagination component.

| Name              | Type   | Default | Description                                       |
| ----------------- | ------ | ------- | ------------------------------------------------- |
| pageSize          | number |         | The number of results per page.                   |
| currentPage       | number |         | The selected page number.                         |
| rowCount          | number |         | The total row count to display.                   |
| pageRange         | number | 10      | The number of pages to display.                   |
| onFirstClicked    | func   |         | Callback fired when the first page is clicked.    |
| onPreviousClicked | func   |         | Callback fired when the previous page is clicked. |
| onNextClicked     | func   |         | Callback fired when the next page is clicked.     |
| onLastClicked     | func   |         | Callback fired when the last page is clicked.     |
| onPageChanged     | func   |         | Callback fired when the page number is changed.   |
