/** This file represents what tests are generated for the component Alert */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnnotationIcon } from '@heroicons/react/outline';
import Alert from './alert';
import Button from 'shared/ui/button';

afterEach(cleanup);
const handleClose = jest.fn();

describe('Alert component', () => {
  /** snapshot test that saves a snapshot for the first run
   * and then checks if the component changes unexpectedly or not  */
  it('Alert default snapshot', () => {
    const alert = render(<Alert />);
    screen.debug();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(alert).toMatchSnapshot();
  });

  /** test whether the component works correctly if it gets props  */
  it('renders warn Alert', () => {
    render(<Alert color="yellow" title="Attention!" closable />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  /** test if the function onClick works orrectly  */
  it('onClick works', () => {
    render(
      <Alert closable color="yellow" shape="round" className="capitalize" onClose={handleClose} icon={<AnnotationIcon />}>
        small alert
      </Alert>
    );
    userEvent.click(screen.getByRole('alert'));
  });
  /** test that should not be any mistake if the component is absent  */
  it('without component', () => {
    render(<Alert />);
    expect(screen.queryByRole('alert')).toBeInTheDocument();
  });
  /** test whether the component works correctly if it gets an icon  */
  it('alert with icon', () => {
    render(
      <Alert color="green" shape="smooth" className="lowercase shadow-xl" border icon={<AnnotationIcon />}>
        <p className="mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.
        </p>
      </Alert>
    );
  });
  /** test whether the component works correctly if it gets props actions with a button  */
  it('alert with actions', () => {
    render(
      <Alert
        color="blue"
        shape="round"
        border
        actions={
          <Button variant="flat" shape="smooth" color="purple">
            Dismiss
          </Button>
        }
      >
        <div className="mt-2 text-sm ">
          <ul className="list-disc pl-5 space-y-1">
            <li>Your password must be at least 8 characters</li>
            <li>Your password must include at least one pro wrestling finishing move</li>
          </ul>
        </div>
      </Alert>
    );
    userEvent.click(screen.getByRole('alert'));
  });
});
