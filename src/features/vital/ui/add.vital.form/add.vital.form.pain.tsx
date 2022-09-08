import React, { FC, useState, useCallback, useRef, MutableRefObject, useEffect, ChangeEvent } from 'react';
import { useGetSet } from 'react-use';
import MaskInput from 'shared/ui/mask.input';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { IVitals } from 'shared/api/vital';
import moment from 'moment';
import { useIntl } from 'react-intl';

interface IAddFormPain {
  sendForm(d: {}): void;
}
const AddVitalFormPain: FC<IAddFormPain> = observer(({ sendForm }) => {
  const [innerRefCurrent, setInnerRefCurrent] = useState<MutableRefObject<HTMLInputElement | undefined> | undefined>();
  const [isFocusInput, setIsFocusInput] = useGetSet<boolean>(false);
  const toggleIsFocusInput = (state?: boolean) => {
    const currentState = isFocusInput();
    setIsFocusInput(state ?? !currentState);
  };
  const [isInput, setIsInput] = useState('');
  const intl = useIntl();
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setIsInput(event.target.value);
  }, []);

  const innerRef = useRef();
  useEffect(() => {
    if (!innerRefCurrent?.current) {
      setInnerRefCurrent(innerRef);
    }
  }, []);
  const { register, handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      loinc: '75260-0',
      name: 'Pain Level',
      measurementValue: '',
      unitOfMeasure: '',
      archive: false,
      dateOfMeasure: moment().format('YYYY-MM-DD'),
      order: 9,
      save: null,
    },
  });
  const changeForm = (data) => {
    if (data.measurementValue.length > 3) {
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
          id: 'vital.measures.pain.level',
        })}
      </p>
      <div className="flex flex-col m-2">
        <label
          className={`text-xs opacity-50 form-label ${isFocusInput() && isInput.length <= 3 ? '__blue' : ''}  ${isInput.length > 3 ? '__error' : ''}`}
          htmlFor="pain"
        >
          {intl.formatMessage({
            id: 'vital.measures.pain.enterRate',
          })}
        </label>
        <MaskInput
          className={`form-input pl-0 bg-primary ${isInput.length > 3 ? '__error' : ''}`}
          id="pain"
          type="text"
          options={{
            regex: '[0-9/,/.]+$',
          }}
          onFocus={() => toggleIsFocusInput(true)}
          {...register('measurementValue')}
          onChange={handleInput}
        />
        <div className="flex">
          {isInput.length > 3 ? (
            <span className="form-helper-text __error">
              {intl.formatMessage({
                id: 'vital.measures.maxLength',
              })}{' '}
              3
            </span>
          ) : (
            ''
          )}
          <span className={`form-helper-text __end text-xs ${isInput.length > 3 ? '__error' : ''}`}>{isInput.length}/3</span>
        </div>
      </div>
    </form>
  );
});
AddVitalFormPain.displayName = 'AddVitalFormPain';
export default AddVitalFormPain;
