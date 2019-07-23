import React from 'react';
import { shallow } from 'enzyme';
import DataGrid from '../src/DataGrid';

describe('DataGrid', () => {
  it('should render properly', () => {
    const link = shallow(<DataGrid />);
    expect(link).toMatchSnapshot();
  });
});
