import React from 'react';

export interface IPageSizeSelector {
  pageSize: number;
  onPageSizeChanged: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PaginationSizeSelector = ({ pageSize, onPageSizeChanged }: IPageSizeSelector) => {
  return (
    <span className="page-size-selector">
      <select
        id="page-size"
        className="page-size-select"
        onChange={onPageSizeChanged}
        defaultValue={pageSize.toString()}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="50">50</option>
      </select>
      <span className="page-size-text">items per page</span>
    </span>
  );
};

export default PaginationSizeSelector;
