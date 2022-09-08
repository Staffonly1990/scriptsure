import React, { FC, useState, useRef, MutableRefObject, useEffect, ChangeEvent } from 'react';
import { useGetSet } from 'react-use';
import MaskInput from 'shared/ui/mask.input';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { IVitals } from 'shared/api/vital';
import moment from 'moment';
import { useIntl } from 'react-intl';

interface IAddBloodPressure {
  sendForm(d: {}): void;
}
const AddVitalFormBloodPressure: FC<IAddBloodPressure> = observer(({ sendForm }) => {
  const [innerRefCurrent, setInnerRefCurrent] = useState<MutableRefObject<HTMLInputElement | undefined> | undefined>();
  const [isFocusInput, setIsFocusInput] = useGetSet<boolean>(false);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const intl = useIntl();

  const toggleIsFocusInput = (state?: boolean) => {
    const currentState = isFocusInput();
    setIsFocusInput(state ?? !currentState);
  };
  const handleSystolic = (event: ChangeEvent<HTMLInputElement>) => {
    setSystolic(event.target.value);
  };
  const handleDiastolic = (event: ChangeEvent<HTMLInputElement>) => {
    setDiastolic(event.target.value);
  };
  const innerRef = useRef();
  useEffect(() => {
    if (!innerRefCurrent?.current) {
      setInnerRefCurrent(innerRef);
    }
  }, []);
  const { handleSubmit } = useForm<IVitals>({
    mode: 'onBlur',
    defaultValues: {
      order: 8,
      loinc: '35094-2',
      name: 'Blood Pressure',
      unitOfMeasure: '%',
      dateOfMeasure: moment().format('YYYY-MM-DD'),
      concatValue: '/',
      // PatientVitalGroup: [
      //   {
      //     orderId: 1,
      //     loinc: '8459-0',
      //     name: 'Systolic',
      //     measurementValue: systolic,
      //     unitOfMeasure: 'mm[Hg]',
      //     dateOfMeasure: moment().format('YYYY-MM-DD'),
      //   },
      //   {
      //     orderId: 2,
      //     loinc: '8453-3',
      //     name: 'Diastolic',
      //     measurementValue: diastolic,
      //     unitOfMeasure: 'mm[Hg]',
      //     dateOfMeasure: moment().format('YYYY-MM-DD'),
      //   },
      // ],
    },
  });
  const changeForm = (data) => {
    if (systolic.length !== 0 && systolic.length < 4 && diastolic.length !== 0 && diastolic.length < 4) {
      const pressure = `${systolic}\${diastolic}`;
      const PatientVitalGroup = [
        {
          orderId: 1,
          loinc: '8459-0',
          name: 'Systolic',
          measurementValue: systolic,
          unitOfMeasure: 'mm[Hg]',
          dateOfMeasure: moment().format('YYYY-MM-DD'),
        },
        {
          orderId: 2,
          loinc: '8453-3',
          name: 'Diastolic',
          measurementValue: diastolic,
          unitOfMeasure: 'mm[Hg]',
          dateOfMeasure: moment().format('YYYY-MM-DD'),
        },
      ];
      const newForm = { ...data, PatientVitalGroup, measurementValue: pressure };
      sendForm(newForm);
    }
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
          id: 'vital.measures.pressure.blood',
        })}
      </p>
      <div className="flex items-end">
        <div className="flex flex-col">
          <label
            className={`text-xs opacity-50 form-label ${isFocusInput() && systolic.length <= 3 ? '__blue' : ''}  ${systolic.length > 3 ? '__error' : ''}`}
            htmlFor="systolic"
          >
            {intl.formatMessage({
              id: 'vital.measures.pressure.systolic',
            })}
          </label>
          <MaskInput
            className={`form-input md:w-32 lg:w-40 pl-0 bg-primary ${systolic.length > 3 ? '__error' : ''}`}
            id="systolic"
            type="text"
            options={{
              regex: '[0-9/,/.]+$',
            }}
            onFocus={() => toggleIsFocusInput(true)}
            onChange={handleSystolic}
          />
          <div className="flex">
            {systolic.length > 3 ? (
              <span className="form-helper-text __error">
                {intl.formatMessage({
                  id: 'vital.measures.maxLength',
                })}{' '}
                3
              </span>
            ) : (
              ''
            )}
            <span className={`form-helper-text __end text-xs ${systolic.length > 3 ? '__error' : ''}`}>{systolic.length}/3</span>
          </div>
        </div>
        <span className="mb-4 pl-2 pr-1 text-lg">/</span>
        <div className="flex flex-col">
          <label
            className={`text-xs opacity-50 form-label ${isFocusInput() && diastolic.length <= 3 ? '__blue' : ''}  ${diastolic.length > 3 ? '__error' : ''}`}
            htmlFor="diastolic"
          >
            {intl.formatMessage({
              id: 'vital.measures.pressure.diastolic',
            })}
          </label>
          <MaskInput
            className={`form-input pl-0 md:w-32 lg:w-40 bg-primary ${diastolic.length > 3 ? '__error' : ''}`}
            id="diastolic"
            type="text"
            options={{
              regex: '[0-9/,/.]+$',
            }}
            onFocus={() => toggleIsFocusInput(true)}
            onChange={handleDiastolic}
          />
          <div className="flex">
            {diastolic.length > 3 ? (
              <span className="form-helper-text __error">
                {intl.formatMessage({
                  id: 'vital.measures.maxLength',
                })}{' '}
                3
              </span>
            ) : (
              ''
            )}
            <span className={`form-helper-text __end text-xs ${diastolic.length > 3 ? '__error' : ''}`}>{diastolic.length}/3</span>
          </div>
        </div>
      </div>
    </form>
  );
});
AddVitalFormBloodPressure.displayName = 'AddVitalFormBloodPressure';
export default AddVitalFormBloodPressure;
