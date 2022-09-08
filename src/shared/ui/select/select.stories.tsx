import React from 'react';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckIcon, SelectorIcon, ChevronDownIcon, CheckCircleIcon, ClipboardCheckIcon } from '@heroicons/react/solid';
import { useForm } from 'react-hook-form';

import Button from 'shared/ui/button';
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

const checkedIcons = {
  null: null,
  check: <CheckIcon />,
  circle: <CheckCircleIcon />,
  clipboard: <ClipboardCheckIcon />,
};
const selectIcons = {
  null: null,
  selector: <SelectorIcon />,
  chevron: <ChevronDownIcon />,
};

const triggerCheck = action('onCheck');

export default {
  title: 'Shared/Select',
  component: Select,
  args: {
    onChange: action('onChange'),
  },
  argTypes: {
    checkedIcon: {
      options: Object.keys(checkedIcons),
      mapping: checkedIcons,
      labels: {
        null: 'noIcon',
        check: 'CheckIcon',
        circle: ' <CheckCircleIcon />',
        clipboard: '<ClipboardCheckIcon />',
      },
      control: { type: 'select' },
    },
    selectIcon: {
      options: Object.keys(selectIcons),
      mapping: selectIcons,
      labels: {
        null: 'noIcon',
        selector: 'Selector',
        chevron: 'Chevron',
      },
      control: { type: 'select' },
    },
    iconPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
    color: {
      options: ['gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'black', 'white'],
      control: { type: 'radio' },
    },
    width: {
      options: ['w-full', 'w-auto', 'w-60', 'w-80', 'w-96'],
      control: { type: 'radio' },
    },
    placement: {
      options: ['auto', 'top', 'bottom', 'right', 'left'],
      control: { type: 'radio' },
    },
    shape: {
      options: ['smooth', 'round', null],
      control: { type: 'radio' },
    },
    options: { control: false },
  },
  parameters: { layout: 'centered', docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = ({ label, onChange, ...args }) => {
  const {
    trigger,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    // defaultValues: { name: defaultOptions[1].name },
  });

  return (
    <div className="form-group __row">
      <div className="form-control">
        <Select
          {...args}
          label={<label className="text-primary">{label}</label>}
          {...register('name', {
            validate: { required: (value) => value?.length > 0 },
            onChange,
          })}
          // value={defaultOptions[1].name}
        />
      </div>

      <Button
        className="self-end"
        size="sm"
        shape="smooth"
        onClick={async () => {
          const isValid = await trigger(['name']);
          triggerCheck({ values: getValues(), errors: isValid ? {} : { name: { type: 'required', message: '' } } });
        }}
      >
        check
      </Button>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  options: defaultOptions,
  label: 'Assigned to',
  iconPosition: 'right',
  selectIcon: <SelectorIcon />,
  width: 'w-60',
  shape: 'round',
};
