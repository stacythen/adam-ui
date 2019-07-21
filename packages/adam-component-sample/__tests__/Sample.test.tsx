import React from 'react';
import { shallow } from 'enzyme';
import Sample from '../src/Sample';

describe('Sample', () => {
  it('should render properly', () => {
    const link = shallow(<Sample>Link to Google</Sample>);
    expect(link).toMatchSnapshot();
  });
});
