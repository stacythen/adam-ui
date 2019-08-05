import React from 'react';

import MaterialThemeWrapper from './MaterialThemeWrapper';
import AdamThemeWrapper from './AdamThemeWrapper';
import { IThemeWrapper } from '.';

enum THEME {
  ADAM = 'ag-theme-adam',
  MATERIAL = 'ag-theme-material',
}
export type Theme = 'ag-theme-adam' | 'ag-theme-material';
export interface IDataGridThemeProvider extends IThemeWrapper {
  theme?: Theme;
}

const THEME_WRAPPER = {
  [THEME.ADAM]: AdamThemeWrapper,
  [THEME.MATERIAL]: MaterialThemeWrapper,
};

const DataGridThemeProvider = (props: IDataGridThemeProvider) => {
  const { theme, children } = props;
  const ThemeWrapper = THEME_WRAPPER[theme || THEME.ADAM];
  return theme ? <ThemeWrapper>{children}</ThemeWrapper> : children;
};

export default DataGridThemeProvider;
