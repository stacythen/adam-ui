import React from 'react';

import { IThemeWrapper } from './';

import './ag-theme-adam/sass/ag-theme-adam.css';

export const MAT_GRID_SIZE = 6;

const AdamThemeWrapper = (props: IThemeWrapper) => {
  const { children } = props;

  return (
    <div
      id="myGrid"
      style={{
        height: '100%',
        width: '100%',
      }}
      className="ag-theme-balham ag-theme-adam"
    >
      {children}
    </div>
  );
};

export default AdamThemeWrapper;
// // {React.cloneElement<ExtendedAgGridReactProps>(children as React.ReactElement<ExtendedAgGridReactProps>, {
// //   headerHeight: MAT_GRID_SIZE * 7,
// //   detailRowHeight: MAT_GRID_SIZE * 5,
// //   rowHeight: MAT_GRID_SIZE * 6,
// //   pagination: false,
// // })}
