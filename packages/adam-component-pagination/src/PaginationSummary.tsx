/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { IPaginationInfo } from './types';

const PaginationSummary = ({ total_results, first_result, last_result }: IPaginationInfo) => {
  return (
    <span className="pagination-summary">
      {`${total_results ? first_result + 1 : 0} - ${total_results ? last_result + 1 : 0} of ${total_results} items`}
    </span>
  );
};

export default PaginationSummary;
