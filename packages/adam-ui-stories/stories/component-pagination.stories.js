/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from 'react';

import { storiesOf } from '@storybook/react';

import Pagination from 'adam-component-pagination';

storiesOf('Pagination', module)
  .add('default', () => <Pagination pageSize={10} currentPage={1} rowCount={1000} />)
  .add('hide page summary', () => <Pagination pageSize={10} currentPage={1} rowCount={1000} hidePageSummary={true} />)
  .add('hide page size', () => <Pagination pageSize={10} currentPage={1} rowCount={1000} hidePageSize={true} />)
  .add('hide refresh button', () => <Pagination pageSize={10} currentPage={1} rowCount={1000} hideRefresh={true} />);
