import React from 'react';

export interface IPaginationProps {
  pageSize: number;
  totalPages: number;
  currentPage: number;
  rowCount: number;
}

interface IPaginationDispatchProps {
  onFirstClicked: () => void;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onLastClicked: () => void;
}

type PaginationProps = IPaginationProps & IPaginationDispatchProps;

const Pagination = (props: PaginationProps): React.ReactElement => {
  const {
    pageSize,
    currentPage,
    totalPages,
    rowCount,
    onFirstClicked,
    onPreviousClicked,
    onNextClicked,
    onLastClicked,
  } = props;

  {
    /* << < 1 2 3 > >>
        dropdown items per page
        1 - 10 of 39 items */
  }
  return (
    <>
      <div>
        <button onClick={onFirstClicked} disabled={currentPage === 1}>
          {'<<'}
        </button>
        <button onClick={onPreviousClicked} disabled={currentPage === 1}>
          {'<'}
        </button>
        123
        <button onClick={onNextClicked} disabled={currentPage === totalPages}>
          {'>'}
        </button>
        <button onClick={onLastClicked} id="btLast" disabled={currentPage === totalPages}>
          {'>>'}
        </button>
      </div>
      <div>
        <span>{rowCount ? (currentPage - 1) * pageSize + 1 : 0}</span>
        <span>-</span>
        <span>{Math.min((currentPage - 1) * pageSize + pageSize, rowCount | 0)}</span>
        <span>of {rowCount} items</span>
      </div>
    </>
  );
};

export default Pagination;
