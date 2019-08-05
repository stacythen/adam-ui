import React from 'react';

import { IThemeWrapper } from './';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const MaterialThemeWrapper = (props: IThemeWrapper) => {
  const { children } = props;
  return (
    <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export default MaterialThemeWrapper;
