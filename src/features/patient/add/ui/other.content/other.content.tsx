import React, { FC, MutableRefObject, useEffect, useState } from 'react';
import { toJS } from 'mobx';
import { Observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import Select from 'shared/ui/select';
import { patientModel } from 'features/patient';
import { userModel } from 'features/user';

import LineContent from '../line.content';
import InputDefault from '../input.default';
import ControlInput from '../control.input';
import { remakeDataDoctors, remakeDataPractices } from '../../hooks';
import DatePicker from 'shared/ui/date.picker';

interface IOtherContent {
  control: any;
  register: any;
  getValues: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
}

const OtherContent: FC<IOtherContent> = ({ innerRef, getValues, control }) => {
  const [defaultDoctorsPractice, setDefaultDoctorsPractice] = useState<any>(null);
  const [defaultDoctors, setDefaultDoctors] = useState<any>(null);
  const [isDeathDate, setIsDeathDate] = useState<boolean>(false);
  const [deathDateData, setDeathDateData] = useState<string>('');
  const intl = useIntl();

  const getInitialValues = () => {
    if (userModel.data) {
      const practices = remakeDataPractices(userModel.data.practices);
      setDefaultDoctorsPractice(practices);
    }

    const doctors = remakeDataDoctors(toJS(patientModel.doctorsPractice));
    setDefaultDoctors(doctors);
  };

  const getDoctorsForPractices = async (data: number) => {
    await patientModel.getPracticalDoctors(data);

    const doctors = remakeDataDoctors(toJS(patientModel.doctorsPractice));
    if (doctors.length) {
      setDefaultDoctors(doctors);
    }
  };

  const getCurrentPractice = () => {
    setIsDeathDate(!isDeathDate);
  };

  useEffect(() => {
    const value = getValues('practiceId');
    if (value) {
      setDeathDateData(value);
    }

    if (!defaultDoctorsPractice) {
      getInitialValues();
    }
  }, [isDeathDate]);

  useEffect(() => {
    getDoctorsForPractices(Number(deathDateData));
  }, [deathDateData]);

  return (
    <div>
      <LineContent>
        <ControlInput control={control} name="deathDate" label={intl.formatMessage({ id: 'add.patient.deathDate' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <DatePicker
              date={value ? new Date(value) : undefined}
              format="MM/dd/yyyy"
              placement="auto-start"
              container={innerRef?.current}
              onDateChange={(val) => {
                handleChange(val);
                handleBlur();
              }}
            >
              {({ inputProps, focused }) => <input className={`form-input w-auto${focused ? ' -focused' : ''}`} {...inputProps} />}
            </DatePicker>
          )}
        </ControlInput>
        {/* <div className="flex flex-col">
          <span>{intl.formatMessage({ id: 'add.patient.deathDate' })}</span>
          <Controller
            control={control}
            name="deathDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker container={innerRef?.current} date={value} onDateChange={onChange}>
                {({ inputProps, focused }) => (
                  <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="deathDate" {...inputProps} />
                )}
              </DatePicker>
            )}
          />
        </div> */}
        {/* <InputDefault label="Death Date">
          <input type="date" {...register('deathDate')} />
        </InputDefault> */}
      </LineContent>

      <LineContent>
        <ControlInput control={control} name="deathCause" label={intl.formatMessage({ id: 'add.patient.preliminaryCauseDeath' })} rules={{ maxLength: 45 }}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <div className="flex flex-col space-y-0.5">
              <textarea
                ref={ref}
                name={name}
                value={value}
                className="form-textarea w-full min-h-[1.5rem]"
                maxLength={45}
                rows={1}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <span className="flex items-center justify-end space-x-0.5 text-xs">
                <span>{value?.length ?? 0}</span>
                <span>/</span>
                <span>45</span>
              </span>
            </div>
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'reports.measures.practice' })}>
          <div role="button" tabIndex={0} onKeyDown={getCurrentPractice} onClick={getCurrentPractice}>
            <Controller
              control={control}
              name="practiceId"
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <Observer>
                  {() => (
                    <Select
                      container={innerRef?.current}
                      options={map(defaultDoctorsPractice || [], (element) => ({
                        value: element.value.toString(),
                        label: element.label,
                      }))}
                      name="practiceId"
                      value={String(value) ?? ''}
                      onChange={onChange}
                    />
                  )}
                </Observer>
              )}
            />
          </div>
        </InputDefault>
      </LineContent>

      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'add.patient.doctor' })}>
          <Controller
            control={control}
            name="doctorId"
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <Observer>
                {() => (
                  <Select
                    container={innerRef?.current}
                    options={map(defaultDoctors || [], (element) => ({
                      value: element.value.toString(),
                      label: element.label,
                    }))}
                    name="doctorId"
                    value={String(value) ?? ''}
                    onChange={onChange}
                  />
                )}
              </Observer>
            )}
          />
        </InputDefault>
      </LineContent>
    </div>
  );
};
OtherContent.displayName = 'OtherContent';

export default OtherContent;
