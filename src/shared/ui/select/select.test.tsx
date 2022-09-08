import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckCircleIcon, SelectorIcon } from '@heroicons/react/outline';
import Select from './select';

const defaultOptions = [
  { value: 'Wade Cooper', label: 'Wade Cooper' },
  { value: 'Arlene Mccoy', label: 'Arlene Mccoy' },
  { value: 'Devon Webb', label: 'Devon Webb' },
  { value: 'Tom Cook', label: 'Tom Cook' },
  { value: 'Tanya Fox', label: 'Tanya Fox' },
  { value: 'Hellen Schmidt', label: 'Hellen Schmidt' },
  { value: 'Caroline Schultz', label: 'Caroline Schultz' },
  { value: 'Mason Heaney', label: 'Mason Heaney' },
  { value: 'Claudie Smitham', label: 'Claudie Smitham' },
  { value: 'Emil Schaefer', label: 'Emil Schaefer' },
];

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messages = require('../../lang/messages/en-GB.json');
  const intlProvider = new reactIntl.IntlProvider(
    {
      locale: 'en',
      messages,
    },
    {}
  );

  return {
    ...reactIntl,
    useIntl: () => {
      return intlProvider.state.intl;
    },
  };
});

afterEach(cleanup);
const onChange = jest.fn();

describe('Select component', () => {
  it('Select default snapshot', () => {
    const select = render(<Select options={defaultOptions} />);
    screen.debug();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(select).toMatchSnapshot();
  });

  it('renders without icons', () => {
    const select = render(<Select options={defaultOptions} color="purple" width="w-full" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(select).toMatchSnapshot();
  });

  it('onChange works', () => {
    render(
      <Select
        options={defaultOptions}
        color="yellow"
        shape="round"
        className="capitalize"
        onChange={onChange}
        checkedIcon={<CheckCircleIcon />}
        selectIcon={<SelectorIcon />}
        iconPosition="left"
      />
    );
    userEvent.click(screen.getByRole('button'));
  });

  it('without component', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });
});
