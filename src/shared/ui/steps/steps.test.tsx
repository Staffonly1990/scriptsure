import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Steps from './steps';

afterEach(cleanup);

describe('Steps Component', () => {
  it('Steps default snapshot', () => {
    const steps = render(
      <Steps color="blue" column={false} activeStep={0}>
        <Steps.Step>text</Steps.Step>
      </Steps>
    );
    screen.debug();
    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(steps).toMatchSnapshot();
  });
});
