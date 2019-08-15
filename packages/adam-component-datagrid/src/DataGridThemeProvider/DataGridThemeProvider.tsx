import React from 'react';

import BalhamThemeWrapper from './BalhamThemeWrapper';
import BalhamDarkThemeWrapper from './BalhamDarkThemeWrapper';
import MaterialThemeWrapper from './MaterialThemeWrapper';
import FreshThemeWrapper from './FreshThemeWrapper';
import DarkThemeWrapper from './DarkThemeWrapper';
import BlueThemeWrapper from './BlueThemeWrapper';
import BootstrapThemeWrapper from './BootstrapThemeWrapper';
import AdamThemeWrapper from './AdamThemeWrapper';
import { IThemeWrapper } from '.';

enum THEME {
  BALHAM = 'ag-theme-balham',
  BALHAM_DARK = 'ag-theme-balham-dark',
  MATERIAL = 'ag-theme-material',
  FRESH = 'ag-theme-fresh',
  DARK = 'ag-theme-dark',
  BLUE = 'ag-theme-blue',
  BOOTSTRAP = 'ag-theme-bootstrap',
  ADAM = 'ag-theme-adam',
}
export type Theme =
  | 'ag-theme-balham'
  | 'ag-theme-balham-dark'
  | 'ag-theme-material'
  | 'ag-theme-fresh'
  | 'ag-theme-dark'
  | 'ag-theme-blue'
  | 'ag-theme-bootstrap'
  | 'ag-theme-adam';
export interface IDataGridThemeProvider extends IThemeWrapper {
  theme?: Theme;
}

const THEME_WRAPPER = {
  [THEME.BALHAM]: BalhamThemeWrapper,
  [THEME.BALHAM_DARK]: BalhamDarkThemeWrapper,
  [THEME.MATERIAL]: MaterialThemeWrapper,
  [THEME.FRESH]: FreshThemeWrapper,
  [THEME.DARK]: DarkThemeWrapper,
  [THEME.BLUE]: BlueThemeWrapper,
  [THEME.BOOTSTRAP]: BootstrapThemeWrapper,
  [THEME.ADAM]: AdamThemeWrapper,
};

const DataGridThemeProvider = (props: IDataGridThemeProvider) => {
  const { theme, children } = props;
  const ThemeWrapper = THEME_WRAPPER[theme || THEME.ADAM];
  return theme ? <ThemeWrapper>{children}</ThemeWrapper> : children;
};

export default DataGridThemeProvider;
