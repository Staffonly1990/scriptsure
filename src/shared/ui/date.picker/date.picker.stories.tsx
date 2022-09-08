import React from 'react';
import { addMonths, subMonths, getTime } from 'date-fns';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DatePicker from './date.picker';

const initialDate = getTime(new Date());
const initialMinimumDate = getTime(subMonths(initialDate, 1));
const initialMaximumDate = getTime(addMonths(initialDate, 1));

export default {
  title: 'Shared/DatePicker',
  component: DatePicker,
  args: {
    date: initialDate,
    minimumDate: initialMinimumDate,
    maximumDate: initialMaximumDate,
    format: 'dd.MM.yyyy',
    // locale: 'en-US',
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    date: { control: { type: 'date' } },
    minimumDate: { control: { type: 'date' } },
    maximumDate: { control: { type: 'date' } },
    format: { control: { type: 'text' } },
    // locale: {
    //   options: ['en', 'ru'],
    //   control: { type: 'radio' },
    // },
    locale: { control: false },
    onDateChange: { control: false },
  },
  parameters: { docs: { source: { type: 'code' } } },
  // decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof DatePicker>;

const onDateChange = action('onDateChange');

const Template: ComponentStory<typeof DatePicker> = ({ ...args }) => {
  const [{ date }, updateArgs] = useArgs();

  const handleDateChange = (value) => {
    updateArgs({ date: value });
    onDateChange(value);
  };

  return (
    <DatePicker {...args} date={date} onDateChange={handleDateChange}>
      {({ inputProps, focused }) => <input className={`form-input${focused ? ' -focused' : ''}`} aria-invalid="false" {...inputProps} />}
    </DatePicker>
  );
};

export const Default = Template.bind({});
