import React from 'react';
import { shallow } from 'enzyme';
import Pagination from '../src/Pagination';

describe('Pagination', () => {
  it('should render properly', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={1} rowCount={1000} />);
    expect(link).toMatchSnapshot();
  });

  it('should render properly for page 10', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={10} rowCount={1000} />);
    expect(link).toMatchSnapshot();
  });

  it('should render without page size', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={10} rowCount={1000} hidePageSize={true} />);
    expect(link).toMatchSnapshot();
  });

  it('should render without page summary', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={10} rowCount={1000} hidePageSummary={true} />);
    expect(link).toMatchSnapshot();
  });

  it('should render without refresh button', () => {
    const link = shallow(<Pagination pageSize={10} currentPage={10} rowCount={1000} hideRefresh={true} />);
    expect(link).toMatchSnapshot();
  });
});
