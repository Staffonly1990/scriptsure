import React, { FC } from 'react';
import { Observer } from 'mobx-react-lite';
import { Controller } from 'react-hook-form';

import MaskInput from 'shared/ui/mask.input';
import Select from 'shared/ui/select';
import { defaultOptionsState } from '../add/config';

interface IPharmacyFilterInputProps {
  register?: any;
  label?: string;
  id: string;
  isSelect?: boolean;
  isMask?: boolean;
  options?: {
    mask: string;
  };
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  placeholder?: string;
  control?: any;
}

const PharmacyFilterInput: FC<IPharmacyFilterInputProps> = ({ register, control, ...props }) => {
  if (props.isMask) {
    return (
      <div className="flex flex-col w-1/2 lg:w-auto mb-2 lg:mr-2 lg:mb-0">
        <label className="form-label" htmlFor={props.id}>
          {props.label}
        </label>
        <MaskInput {...register(props.id)} className="form-input" {...props} />
      </div>
    );
  }

  if (props.isSelect) {
    return (
      <div className="w-1/2 lg:w-auto mb-2 lg:mr-2 lg:mb-0">
        <Controller
          control={control}
          name={props.id}
          render={({ field: { value, onChange } }) => (
            <Observer>
              {() => <Select width="w-full" name={props.id} value={value ?? ''} onChange={onChange} {...props} options={defaultOptionsState} />}
            </Observer>
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-1/2 lg:w-auto mb-2 lg:mr-2 lg:mb-0">
      <label className="form-label" htmlFor={props.id}>
        {props.label}
      </label>
      <input {...register(props.id)} className="form-input" {...props} />
    </div>
  );
};

PharmacyFilterInput.displayName = 'PharmacyFilterInput';

export default PharmacyFilterInput;
