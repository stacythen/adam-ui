import React from 'react';

import { IThemeWrapper } from './';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

const BalhamDarkThemeWrapper = (props: IThemeWrapper) => {
  const { children } = props;
  return (
    <div className="ag-theme-balham-dark" style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export default BalhamDarkThemeWrapper;
