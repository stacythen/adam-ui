import React from 'react';

import { IThemeWrapper } from './';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';

const FreshThemeWrapper = (props: IThemeWrapper) => {
  const { children } = props;
  return (
    <div className="ag-theme-fresh" style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export default FreshThemeWrapper;
