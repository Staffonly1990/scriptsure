import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import Sample from './sample';

afterEach(cleanup);

test('renders with title', () => {
  const title = 'This is title...';
  render(<Sample title={title} />);
  const titleElement = screen.getByText(new RegExp(title, 'i'));
  expect(titleElement).toBeInTheDocument();
});

test('renders with description', () => {
  const description = 'Text here...';
  render(<Sample description={description} />);
  const descriptionElement = screen.getByText(new RegExp(description, 'i'));
  expect(descriptionElement).toBeInTheDocument();
});
