import React from 'react';
import { Paginator } from './paginator';
import { IPaginationInfo } from './types';
import PaginationSizeSelector from './PaginationSizeSelector';
import PaginationSummary from './PaginationSummary';

import './Pagination.css';

export interface IPaginationProps {
  pageSize: number;
  currentPage: number;
  rowCount: number;
}

export interface IPaginationConfig {
  pageRange?: number;
}

interface IPaginationDispatchProps {
  onFirstClicked?: () => void;
  onPreviousClicked?: () => void;
  onNextClicked?: () => void;
  onLastClicked?: () => void;
  onPageChanged?: (pageNumber: number, pageSize: number) => void;
}

const PAGE_RANGE = 10;
type PaginationProps = IPaginationProps & IPaginationDispatchProps & IPaginationConfig;

const Pagination = (props: PaginationProps): React.ReactElement => {
  const {
    pageRange = PAGE_RANGE,
    pageSize,
    currentPage,
    rowCount,
    onFirstClicked,
    onPreviousClicked,
    onNextClicked,
    onLastClicked,
    onPageChanged,
  } = props;

  const paginationInfo = Paginator(pageSize, pageRange, rowCount, currentPage);

  const pageChanged = (currentPage: number, pageSize: number): void => {
    if (onPageChanged) {
      onPageChanged(currentPage, pageSize);
    }
  };

  const handlePageSizeChanged = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const { currentPage, rowCount } = props;

    /**
     * scenario: totalRecords = 100, pageSize = 10, currentPage = 10 (last page), totalPages = 10
     * When user change pageSize = 20, the totalPages = 5, user will be landed in currentPage = 5
     */
    const newPageSize = parseInt(evt.target.value, 10);
    let newCurrentPage = currentPage;

    const totalPages = Math.ceil(rowCount / newPageSize);
    if (totalPages < newCurrentPage) {
      newCurrentPage = totalPages;
    }

    pageChanged(newCurrentPage, newPageSize);
  };

  const onPaginatorClicked = (newPageNumber: number, callback?: () => void) => () => {
    pageChanged(newPageNumber, pageSize);
    if (callback) {
      callback();
    }
  };

  const buildPages = (paginationInfo: IPaginationInfo) => {
    const { currentPage } = props;

    const pager = (
      <React.Fragment>
        {new Array(paginationInfo.last_page).fill({}).map((_, index) => {
          const i = paginationInfo.first_page + index;
          const isActive = currentPage === i ? ' active' : '';
          return (
            <li key={i.toString()} className={'pagination-page' + isActive} onClick={onPaginatorClicked(i)}>
              {i}
            </li>
          );
        })}
      </React.Fragment>
    );
    return (
      <>
        <button
          name="firstPage"
          className="paginator"
          onClick={onPaginatorClicked(1, onFirstClicked)}
          disabled={!paginationInfo.has_previous_page}
        >
          ≪
        </button>
        <button
          name="prevPage"
          className="paginator"
          onClick={onPaginatorClicked(paginationInfo.previous_page, onPreviousClicked)}
          disabled={!paginationInfo.has_previous_page}
        >
          &lt;
        </button>
        <ul className="pagination">{pager}</ul>
        <button
          name="nextPage"
          className="paginator"
          onClick={onPaginatorClicked(paginationInfo.next_page, onNextClicked)}
          disabled={!paginationInfo.has_next_page}
        >
          &gt;
        </button>
        <button
          name="lastPage"
          className="paginator"
          onClick={onPaginatorClicked(paginationInfo.total_pages, onLastClicked)}
          disabled={!(paginationInfo.has_next_page && paginationInfo.current_page !== paginationInfo.total_pages)}
        >
          ≫
        </button>
      </>
    );
  };

  return (
    <div className={`pagination-panel`} style={{ padding: '0 18px' }}>
      {buildPages(paginationInfo)}
      <PaginationSizeSelector pageSize={pageSize} onPageSizeChanged={handlePageSizeChanged} />
      <PaginationSummary {...paginationInfo} />
    </div>
  );
};

export default Pagination;
