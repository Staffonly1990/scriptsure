import React from 'react';
import { useForm } from 'react-hook-form';
import cx from 'classnames';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import MaskInput from './mask.input';

const triggerCheck = action('onCheck');

export default {
  title: 'Shared/MaskInput',
  component: MaskInput,
  args: {
    onChange: action('onChange'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
  },
  parameters: { docs: { source: { type: 'code' } }, controls: { hideNoControlsWarning: true } },
} as ComponentMeta<typeof MaskInput>;

const Template: ComponentStory<typeof MaskInput> = ({ onChange, ...args }) => {
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  return (
    <div className="form-group __row">
      <div className="form-control">
        <label className="form-label" htmlFor="input-phone" id="label-phone">
          Phone
        </label>
        <MaskInput
          id="input-phone"
          className={cx('form-input', { __error: errors.phone })}
          {...register('phone', {
            minLength: 10,
            maxLength: 10,
            onChange,
          })}
          type="text"
          placeholder="(___) ___-____"
          autoComplete="off"
          aria-invalid={Boolean(errors.phone)}
          aria-labelledby="label-phone"
          options={{ mask: '(999) 999-9999' }}
          {...args}
        />
      </div>

      <Button
        className="self-end"
        size="sm"
        shape="smooth"
        onClick={() => {
          triggerCheck({ values: getValues(), errors });
        }}
      >
        check
      </Button>
    </div>
  );
};

export const Default = Template.bind({});
