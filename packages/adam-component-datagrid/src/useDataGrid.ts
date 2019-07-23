/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react';

/**
 *
 * @param url Dynamic Type
 * Url
 */
//, (item: string) => void
const useDataGrid = <TRowData>(url = 'https://api.myjson.com/bins/15psn9'): [TRowData[]] => {
  const [rowData, setRowData] = useState<TRowData[]>([]);
  fetch(url)
    .then(result => result.json())
    .then(rowData => setRowData(rowData));

  return [rowData];
};

export default useDataGrid;
