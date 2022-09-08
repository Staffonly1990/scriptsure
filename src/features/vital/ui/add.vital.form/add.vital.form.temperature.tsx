import React, { FC, useState, useCallback, MutableRefObject, ChangeEvent } from 'react';
import { useGetSet } from 'react-use';
import { ChevronDownIcon } from '@heroicons/react/outline';
import MaskInput from 'shared/ui/mask.input';
import Select from 'shared/ui/select';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { IVitals } from 'shared/api/vital';
import moment from 'moment';
import { useIntl } from 'react-intl';

interface IAddTemperature {
  innerRef: MutableRefObject<HTMLInputElement | undefined> | undefined;
  sendForm(d: {}): void;
}

const AddVitalFormTemperature: FC<IAddTemperature> = observer(({ innerRef, sendForm }) => {
  const [isFocusInput, setIsFocusInput] = useGetSet<boolean>(false);
  const [isInput, setIsInput] = useState('');
  const intl = useIntl();

  const toggleIsFocusInput = (state?: boolean) => {
    const currentState = isFocusInput();
    setIsFocusInput(state ?? !currentState);
  };
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsInput(event.target.value);
  }, []);
  const { register, handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      loinc: '8310-5',
      name: 'Temperature',
      measurementValue: '',
      unitOfMeasure: '[degF]',
      archive: false,
      dateOfMeasure: moment().format('YYYY-MM-DD'),
      order: 4,
      save: null,
    },
  });
  const changeForm = (data) => {
    if (data.measurementValue.length > 5) {
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
          id: 'vital.measures.temperature.temp',
        })}
      </p>
      <div className="flex items-start">
        <div className="flex flex-col lg:m-2">
          <label
            className={`text-xs opacity-50 form-label ${isFocusInput() && isInput.length <= 5 ? '__blue' : ''}  ${isInput.length > 5 ? '__error' : ''}`}
            htmlFor="vitalTemp"
          >
            {intl.formatMessage({
              id: 'vital.measures.temperature.enterTemp',
            })}
          </label>
          <MaskInput
            className={`form-input md:w-40 pl-0 bg-primary ${isInput.length > 5 ? '__error' : ''}`}
            id="vitalTemp"
            type="text"
            options={{
              regex: '[0-9/,/.]+$',
            }}
            onFocus={() => toggleIsFocusInput(true)}
            {...register(`measurementValue`)}
            onChange={handleInput}
          />
          <div className="flex">
            {isInput.length > 5 ? (
              <span className="form-helper-text __error">
                {intl.formatMessage({
                  id: 'vital.measures.maxLength',
                })}{' '}
                5
              </span>
            ) : (
              ''
            )}
            <span className={`form-helper-text __end text-xs ${isInput.length > 5 ? '__error' : ''}`}>{isInput.length}/5</span>
          </div>
        </div>
        <div className="xs:px-2 md:px-1 lg:m-2">
          <Select
            container={innerRef?.current}
            width="w-40"
            value={intl.formatMessage({ id: 'vital.measures.temperature.[degF]' })}
            selectIcon={<ChevronDownIcon />}
            options={[
              { value: '[degF]', label: intl.formatMessage({ id: 'vital.measures.temperature.[degF]' }) },
              { value: 'Cel', label: intl.formatMessage({ id: 'vital.measures.temperature.Cel' }) },
            ]}
            {...register('unitOfMeasure')}
            label={<label className="flex form-label text-xs opacity-50">{intl.formatMessage({ id: 'vital.measures.qualifier' })}</label>}
          />
        </div>
      </div>
    </form>
  );
});
AddVitalFormTemperature.displayName = 'AddVitalFormTemperature';
export default AddVitalFormTemperature;
