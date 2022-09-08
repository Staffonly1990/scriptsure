import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IPractice } from 'shared/api/practice';

interface IPracticeInput {
  title: string;
  editable: boolean;
  editDefaultValues: Partial<IPractice>;
  styleInput: string;
  maxLength: number;
  register?: any;
  name: string;
  required: boolean;
  helperText: string;
}

const SettingsPracticeInput: FC<IPracticeInput> = observer(
  ({ title, editable, editDefaultValues, styleInput, maxLength, register, name, required, helperText }) => {
    const [isInput, setIsInput] = useState('');
    console.log(isInput.length);
    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setIsInput(event.target.value);
    }, []);
    return (
      <div className={styleInput}>
        <label className={`text-xs opacity-50 form-label ${isInput.length <= maxLength ? '' : '__error'}`} htmlFor={name}>
          {title}
        </label>
        <input
          className={`form-input w-full pl-0 bg-primary ${isInput.length > maxLength ? '__error' : ''}`}
          id={name}
          type="text"
          {...register(name, { required: { required } })}
          onChange={handleInput}
        />
        <div className="flex justify-between">
          <p>{helperText}</p>
          {!editable && isInput.length === 0 && required && <p className="__error">Required</p>}
          <p className={`form-helper-text __end text-xs ${isInput.length > maxLength ? '__error' : ''}`}>
            {editable && isInput.length === 0 ? editDefaultValues?.addressLine1?.length : isInput.length}/{maxLength}
          </p>
        </div>
      </div>
    );
  }
);

SettingsPracticeInput.displayName = 'SettingsPracticeInput';
export default SettingsPracticeInput;
