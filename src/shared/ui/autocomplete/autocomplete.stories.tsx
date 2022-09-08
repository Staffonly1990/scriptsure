import React from 'react';
import { map, filter, includes } from 'lodash';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Popper from 'shared/ui/popper';
import Spinner from 'shared/ui/spinner';
import Autocomplete from './autocomplete';

export default {
  title: 'Shared/Autocomplete',
  component: Autocomplete,
  args: {
    placement: 'bottom-end',
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    placement: {
      options: [
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
      control: { type: 'radio' },
    },
    keyboard: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
  },
  parameters: { docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Autocomplete>;

const onChange = action('onChange');
const onSelect = action('onSelect');

const data = [
  { value: 'white' },
  { value: 'black' },
  { value: 'red' },
  { value: 'orange' },
  { value: 'yellow' },
  { value: 'green' },
  { value: 'blue' },
  { value: 'cyan' },
  { value: 'purple' },
  { value: 'pink' },
];

const Template: ComponentStory<typeof Autocomplete> = ({ ...args }) => {
  const [{ query }, updateArgs] = useArgs();

  const handleChange = ({ target: { value } }) => {
    updateArgs({ query: value });
    onChange(value);
  };

  // const suggestions =
  //   query?.length > 0 ? filter(data, ({ value }) => includes(value?.toLowerCase(), query?.toLowerCase())) : data;
  const suggestions = query?.length > 0 ? filter(data, ({ value }) => value?.toLowerCase()?.indexOf(query?.toLowerCase()) > -1) : data;

  return (
    <Autocomplete onSelect={onSelect}>
      <Popper
        className="w-[200px] max-h-[200px] overflow-y-auto"
        trigger="focus"
        content={
          <>
            {suggestions.length > 0 ? (
              <Popper.Listbox as={Autocomplete.ListBox}>
                {map(suggestions, (suggestion) => (
                  <Popper.ListboxItem as={Autocomplete.Option} key={suggestion.value} value={suggestion} valueToString={(s) => s?.value as string} dismissed />
                ))}
              </Popper.Listbox>
            ) : (
              <Popper.Content>
                <span>No match</span>
              </Popper.Content>
            )}
          </>
        }
        // hidden={suggestions.length === 1}
      >
        {({ ref, visible }) => (
          <span className="inline-flex relative" aria-expanded={visible}>
            <Autocomplete.Input ref={ref} className="form-input w-[200px] pr-5" onChange={handleChange} />
            {query ? (
              <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                <Autocomplete.Reset className="w-4 h-4" arial-label="Clear" />
              </span>
            ) : (
              <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                <Spinner.Loader className="w-4 h-4" color="blue" size={null} />
              </span>
            )}
          </span>
        )}
      </Popper>
    </Autocomplete>
  );
};

export const Default = Template.bind({});
