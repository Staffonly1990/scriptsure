import React, { FC, useEffect, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';

interface IInput {
  id: string;
  label: string;
  maxLength?: number;
  required?: boolean;
  form: UseFormReturn<FieldValues, object>;
  onBlur?: () => void;
  error?: string;
  comment?: string;
  value?: string;
  width?: 'w-max' | 'w-auto' | 'w-full';
  minLength?: number;
}

const Input: FC<IInput> = ({ comment, form, maxLength, required, label, id, onBlur, error, value, width, minLength }) => {
  const [input, setInput] = useState(value ?? '');
  const requiredLocal = required && !input.length;
  let min;

  if (minLength) {
    min = input.length < minLength;
  }

  useUpdateEffect(() => {
    setInput(value ?? '');
  }, [value]);

  return (
    <div className={`relative flex items-center h-24 ${width}`}>
      <label className={`form-label flex absolute w-full bottom-16 ${requiredLocal || min ? 'text-red-400' : ''}`} htmlFor={id}>
        <div>{label}</div>
        {required ? <div className="text-red-400">*</div> : null}
      </label>
      <input
        className={`form-input ${width}`}
        id={id}
        type="text"
        aria-describedby="helper-text-id-1-a"
        maxLength={maxLength}
        value={input}
        {...form.register(id, {
          required,
        })}
        onBlur={onBlur}
        onChange={(e) => {
          setInput(e.target.value);
          form.setValue(id, e.target.value);
        }}
      />
      <div className="absolute w-full top-16">
        <div className="flex justify-between">
          {error ? <div className="text-red-400 leading-none">{error}</div> : null}
          {requiredLocal ? <div className="text-red-400 leading-none">Required</div> : null}
          {maxLength ? (
            <div className={`text-right w-full leading-none ${requiredLocal || min ? 'text-red-400' : ''}`}>
              {input.length}/{maxLength}
            </div>
          ) : null}
        </div>
        <div className="leading-none">{comment}</div>
      </div>
    </div>
  );
};

Input.displayName = 'Input';
export default Input;
