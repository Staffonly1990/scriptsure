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

interface IAddWeight {
  innerRef: MutableRefObject<HTMLInputElement | undefined> | undefined;
  sendForm(d: {}): void;
  changeWeight(d: number): void;
}

const AddVitalFormWeight: FC<IAddWeight> = observer(({ innerRef, sendForm, changeWeight }) => {
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
    const newWeight = Number(event.target.value);
    // send to BMI in kg
    changeWeight(isSelect !== 'kg' ? newWeight * 0.453 : newWeight);
  };

  const toggleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const newSelect = event.target.value;
    setIsSelect(newSelect);
    // send to BMI in lb
    changeWeight(event.target.value === 'kg' ? Number(isInput) : Number(isInput) * 0.453);
  };
  const { register, handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      loinc: '29463-7',
      name: 'Weight',
      measurementValue: '',
      unitOfMeasure: '[lb_av]',
      archive: false,
      calculateBmi: true,
      dateOfMeasure: moment().format('YYYY-MM-DD'),
      order: 2,
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
          id: 'vital.measures.weight.weight',
        })}
      </p>
      <div className="flex items-start">
        <div className="flex flex-col lg:m-2">
          <label
            className={`text-xs opacity-50 form-label ${isFocusInput() && isInput.length <= 5 ? '__blue' : ''}  ${isInput.length > 5 ? '__error' : ''}`}
            htmlFor="vitalWeight"
          >
            {intl.formatMessage({
              id: 'vital.measures.weight.enterWeight',
            })}
          </label>
          <MaskInput
            className={`form-input pl-0 md:w-44 bg-primary ${isInput.length > 5 ? '__error' : ''}`}
            id="vitalWeight"
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
            width="w-32"
            value={intl.formatMessage({ id: 'vital.measure.weight.[lb_av]' })}
            selectIcon={<ChevronDownIcon />}
            options={[
              { value: '[lb_av]', label: intl.formatMessage({ id: 'vital.measure.weight.[lb_av]' }) },
              { value: 'kg', label: intl.formatMessage({ id: 'vital.measure.weight.kg' }) },
            ]}
            {...register('unitOfMeasure')}
            onChange={toggleSelect}
            label={<label className="flex form-label text-xs opacity-50">{intl.formatMessage({ id: 'vital.measures.qualifier' })}</label>}
          />
        </div>
      </div>
    </form>
  );
});
AddVitalFormWeight.displayName = 'AddVitalFormWeight';
export default AddVitalFormWeight;
