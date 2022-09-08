import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface IInput {
  id: string;
  label: string;
  maxLength?: number;
  required?: boolean;
  form: UseFormReturn<FieldValues, object>;
  onBlur?: () => void;
  error?: string;
}

const Input: FC<IInput> = ({ form, maxLength, required, label, id, onBlur, error }) => {
  const [value, setLocalValue] = useState('');
  const intl = useIntl();
  const requiredLocal = required && !value.length;

  return (
    <div className="form-control">
      <label className={`form-label flex ${requiredLocal ? 'text-red-400' : ''}`} htmlFor={id}>
        <div>{label}</div>
        {required ? <div className="text-red-400">*</div> : null}
      </label>
      <input
        className="form-input"
        id={id}
        type="text"
        aria-describedby="helper-text-id-1-a"
        maxLength={maxLength}
        value={value}
        {...form.register(id, {
          required,
        })}
        onBlur={onBlur}
        onChange={(e) => {
          setLocalValue(e.target.value);
          form.setValue(id, e.target.value);
        }}
      />
      <div className="flex justify-between">
        {error ? <div className="text-red-400">{error}</div> : null}
        {requiredLocal ? <div className="text-red-400">{intl.formatMessage({ id: 'fields.error.required' })}</div> : null}
        {maxLength ? (
          <div className={`w-full text-right ${requiredLocal ? 'text-red-400' : ''}`}>
            {value.length}/{maxLength}
          </div>
        ) : null}
      </div>
    </div>
  );
};

Input.displayName = 'Input';
export default Input;
