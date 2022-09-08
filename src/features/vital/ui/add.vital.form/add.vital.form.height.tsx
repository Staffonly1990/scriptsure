import React, { FC, useState, MutableRefObject, ChangeEvent } from 'react';
import { useGetSet } from 'react-use';
import { ChevronDownIcon } from '@heroicons/react/outline';
import MaskInput from 'shared/ui/mask.input';
import Select from 'shared/ui/select';
import { observer } from 'mobx-react-lite';
import { IVitals } from 'shared/api/vital';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useIntl } from 'react-intl';

interface IAddHeight {
  innerRef: MutableRefObject<HTMLInputElement | undefined> | undefined;

  sendForm(d: {}): void;

  changeHeight(d: number): void;
}

const AddVitalFormHeight: FC<IAddHeight> = observer(({ innerRef, sendForm, changeHeight }) => {
  const [isFocusInput, setIsFocusInput] = useGetSet<boolean>(false);
  const [isInput, setIsInput] = useState('');
  const [isSelect, setIsSelect] = useState('');
  const intl = useIntl();
  const toggleIsFocusInput = (state?: boolean) => {
    const currentState = isFocusInput();
    setIsFocusInput(state ?? !currentState);
  };
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setIsInput(event.target.value);
    const newHeight = Number(event.target.value);
    // send to BMI in m
    const cmMeasure = isSelect === 'cm' ? newHeight : Number(newHeight) * 2.54;
    changeHeight(cmMeasure * 0.01);
  };
  const toggleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelect = event.target.value;
    setIsSelect(newSelect);
    // send to BMI in meters
    const cmMeasure = event.target.value === 'cm' ? Number(isInput) : Number(isInput) * 2.54;
    changeHeight(cmMeasure * 0.01);
  };
  const { register, handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      order: 1,
      loinc: '8302-2',
      name: 'Height',
      measurementValue: '',
      unitOfMeasure: '[in_i]',
      archive: false,
      calculateBmi: true,
      dateOfMeasure: moment().format('YYYY-MM-DD'),
      save: null,
    },
  });
  const changeForm = (data) => {
    if (data.measurementValue.length > 4) {
      const newData = { ...data, measurementValue: '' };
      return sendForm(newData);
    }
    return sendForm(data);
  };
  return (
    <form
      className="p-4 shadow-md"
      onBlur={handleSubmit((data) => {
        changeForm(data);
        toggleIsFocusInput(false);
      })}
    >
      <p className="m-2 text-xl">
        {intl.formatMessage({
          id: 'vital.measures.height.height',
        })}
      </p>
      <div className="flex items-start">
        <div className="flex flex-col lg:m-2">
          <label
            className={`text-xs opacity-50 form-label ${isFocusInput() && isInput.length <= 4 ? '__blue' : ''}  
               ${isInput.length > 4 ? '__error' : ''}`}
            htmlFor="vitalHeight"
          >
            {intl.formatMessage({
              id: 'vital.measures.height.enterHeight',
            })}
          </label>
          <MaskInput
            className={`form-input md:w-44 pl-0 bg-primary ${isInput.length > 4 ? '__error' : ''}`}
            id="vitalHeight"
            type="text"
            options={{
              regex: '[0-9/,/.]+$',
            }}
            value={isInput}
            onFocus={() => toggleIsFocusInput(true)}
            {...register(`measurementValue`)}
            onChange={handleInput}
          />
          <div className="flex">
            {isInput.length > 4 ? (
              <span className="form-helper-text __error">
                {intl.formatMessage({
                  id: 'vital.measures.maxLength',
                })}{' '}
                4
              </span>
            ) : (
              ''
            )}
            <span className={`form-helper-text __end text-xs ${isInput.length > 4 ? '__error' : ''}`}>{isInput.length}/4</span>
          </div>
        </div>
        <div className="xs:px-2 md:px-1 lg:m-2">
          <Select
            container={innerRef?.current}
            width="w-36"
            value={intl.formatMessage({ id: 'vital.measure.height.[in_i]' })}
            selectIcon={<ChevronDownIcon />}
            options={[
              { value: '[in_i]', label: intl.formatMessage({ id: 'vital.measure.height.[in_i]' }) },
              { value: 'cm', label: intl.formatMessage({ id: 'vital.measure.height.cm' }) },
            ]}
            {...register('unitOfMeasure')}
            label={<label className="flex form-label text-xs opacity-50">{intl.formatMessage({ id: 'vital.measures.qualifier' })}</label>}
            onChange={toggleSelect}
          />
        </div>
      </div>
    </form>
  );
});
AddVitalFormHeight.displayName = 'AddVitalFormHeight';
export default AddVitalFormHeight;
