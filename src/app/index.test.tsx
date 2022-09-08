import React from 'react';
import { render, cleanup } from '@testing-library/react';

import App from 'app';

describe('testing something in the App', () => {
  afterEach(cleanup);

  it('should take a snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
