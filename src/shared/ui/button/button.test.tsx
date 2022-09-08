import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './button';

afterEach(cleanup);
const onClick = jest.fn();

describe('Button component', () => {
  it('Button default snapshot', () => {
    const button = render(<Button />);
    expect(button).toMatchSnapshot();
  });

  it('renders red button', () => {
    render(<Button color="red">Cancel</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('onClick works', () => {
    render(
      <Button variant="dashed" color="yellow" shape="circle" size="xs" className="capitalize" onClick={onClick}>
        small button
      </Button>
    );
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders with props', () => {
    const button = render(
      <Button variant="dashed" color="yellow" shape="circle" size="xs" className="capitalize">
        small button
      </Button>
    );
    expect(button).toMatchSnapshot();
  });
  it('without component', () => {
    render(<Button />);
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('button green', () => {
    render(
      <Button variant="flat" color="green" shape="square" size="lg" className="lowercase shadow-xl">
        green button
      </Button>
    );
  });
  it('Button disabled', () => {
    render(
      <Button variant="outlined" color="gray" textSize="base" disabled>
        press
      </Button>
    );
  });
});
