import React, { FC, useState, useRef, MutableRefObject, useEffect, ChangeEvent } from 'react';
import { useGetSet } from 'react-use';
import MaskInput from 'shared/ui/mask.input';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { IVitals } from 'shared/api/vital';
import { useIntl } from 'react-intl';
import moment from 'moment';

interface IAddBMI {
  BMIValue: string;
  sendForm(d: {}): void;
}
const AddVitalFormBMI: FC<IAddBMI> = observer(({ sendForm, BMIValue }) => {
  const [innerRefCurrent, setInnerRefCurrent] = useState<MutableRefObject<HTMLInputElement | undefined> | undefined>();
  const [isFocusInput, setIsFocusInput] = useGetSet<boolean>(false);
  const toggleIsFocusInput = (state?: boolean) => {
    const currentState = isFocusInput();
    setIsFocusInput(state ?? !currentState);
  };
  const [isInput, setIsInput] = useState<string>(BMIValue);
  useEffect(() => {
    setIsInput(BMIValue);
    if (BMIValue.length !== 0) {
      sendForm({
        loinc: '39156-5',
        name: 'Body Mass Index',
        measurementValue: BMIValue,
        unitOfMeasure: 'kg/m2',
        archive: false,
        calculateBmi: true,
        dateOfMeasure: moment().format('YYYY-MM-DD'),
        order: 3,
        save: null,
      });
    }
  }, [BMIValue]);
  const intl = useIntl();
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setIsInput(event.target.value);
  };
  const innerRef = useRef();
  useEffect(() => {
    if (!innerRefCurrent?.current) {
      setInnerRefCurrent(innerRef);
    }
  }, []);
  const { register, handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      loinc: '39156-5',
      name: 'Body Mass Index',
      measurementValue: isInput,
      unitOfMeasure: 'kg/m2',
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
      <p className="m-2 capitalize text-xl">
        {intl.formatMessage({
          id: 'vital.measures.bmi.detail',
        })}
      </p>
      <div className="flex flex-col m-2">
        <label
          className={`text-xs opacity-50 form-label ${isFocusInput() && isInput.length <= 4 ? '__blue' : ''}  ${isInput.length > 4 ? '__error' : ''}`}
          htmlFor="bmi"
        >
          {intl.formatMessage({
            id: 'vital.measures.bmi.bmi',
          })}
        </label>
        <MaskInput
          className={`form-input pl-0 bg-primary ${isInput.length > 4 ? '__error' : ''}`}
          id="bmi"
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
    </form>
  );
});
AddVitalFormBMI.displayName = 'AddVitalFormBMI';
export default AddVitalFormBMI;
