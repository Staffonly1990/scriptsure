import React, { FC, MutableRefObject, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer, Observer } from 'mobx-react-lite';
import Select from 'shared/ui/select';
import { reportsStore } from 'features/report';
import DatePicker from 'shared/ui/date.picker';
import Button from 'shared/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { IPhysicianPayload } from 'shared/api/report';
import { patientModel } from 'features/patient';
import { toJS } from 'mobx';
import { useStateRef } from 'shared/hooks';
import moment from 'moment';
import { map } from 'lodash';

interface IMeasurePhysician {
  innerRef?: MutableRefObject<HTMLElement | null>;
  getEPData: (value: {}) => void;
  practice: number;
  changeDoctor: (value: number) => void;
  date: any[];
  changeDate: (value: any[]) => void;
}

const ReportsAutoMeasurePhysician: FC<IMeasurePhysician> = observer(({ innerRef, getEPData, practice, changeDoctor, date, changeDate }) => {
  const intl = useIntl();
  const [dateStart, dateEnd] = date;
  const [start, setStart] = useState<Date>(dateStart);
  const [end, setEnd] = useState<Date>(dateEnd);
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);
  const { control, handleSubmit } = useForm<IPhysicianPayload>({
    mode: 'onChange',
    defaultValues: {
      doctorId: '',
      practiceId: practice,
      startDate: dateStart,
      endDate: dateEnd,
    },
  });
  const changeStart = (data) => {
    setStart(data);
    changeDate([data, end]);
  };
  const changeEnd = (data) => {
    setEnd(data);
    changeDate([start, data]);
  };
  const changeForm = async (data) => {
    changeDoctor(data.doctorId);
    changeDate([start, end]);
    try {
      await reportsStore.getAllPhysicians(data);
    } catch {}
  };
  return (
    <form
      ref={setInnerRef}
      onSubmit={handleSubmit((data) => {
        changeForm(data);
      })}
    >
      <Controller
        control={control}
        name="doctorId"
        render={({ field: { value, onChange } }) => (
          <Observer>
            {() => (
              <Select
                container={formRef?.current}
                className="form-control md:flex-auto md:w-3/6 my-2"
                classes={{ placeholder: 'w-full', options: '!w-auto' }}
                shape="round"
                label={<label className="text-primary form-helper-text">{intl.formatMessage({ id: 'reports.physician' })}</label>}
                options={map(toJS(patientModel.doctorsPractice), (doctorPractice) => ({
                  value: String(doctorPractice?.id),
                  label: doctorPractice?.fullName,
                }))}
                name="doctorId"
                value={value}
                onChange={onChange}
              />
            )}
          </Observer>
        )}
      />
      <div className="flex">
        <div className="flex flex-col">
          <label className="form-helper-text" htmlFor="date-start">
            {intl.formatMessage({ id: 'reports.measures.startDate' })}
          </label>
          <Controller
            control={control}
            name="startDate"
            render={() => (
              <DatePicker date={start} container={innerRef?.current} onDateChange={changeStart}>
                {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
              </DatePicker>
            )}
          />
        </div>
        <div className="flex flex-col  mx-2">
          <label className="form-helper-text" htmlFor="date-end">
            {intl.formatMessage({ id: 'measures.endDate' })}
          </label>
          <Controller
            control={control}
            name="endDate"
            render={() => (
              <DatePicker date={end} container={innerRef?.current} onDateChange={changeEnd}>
                {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
              </DatePicker>
            )}
          />
        </div>
      </div>
      <Button color="green" shape="round" className="capitalize m-2 mt-10" type="submit">
        {intl.formatMessage({ id: 'reports.measures.generate' })}
      </Button>
    </form>
  );
});

ReportsAutoMeasurePhysician.displayName = 'ReportsAutoMeasurePhysician';
export default ReportsAutoMeasurePhysician;
