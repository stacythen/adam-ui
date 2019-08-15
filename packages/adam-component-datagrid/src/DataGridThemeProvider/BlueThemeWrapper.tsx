import React from 'react';

import { IThemeWrapper } from './';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

const BlueThemeWrapper = (props: IThemeWrapper) => {
  const { children } = props;
  return (
    <div className="ag-theme-blue" style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export default BlueThemeWrapper;
