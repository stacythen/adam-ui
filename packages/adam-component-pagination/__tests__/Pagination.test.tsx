import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../src/Pagination';

describe('Pagination', () => {
  it('should render properly', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={2} rowCount={100} />);
    expect(link).toMatchSnapshot();
  });
});
