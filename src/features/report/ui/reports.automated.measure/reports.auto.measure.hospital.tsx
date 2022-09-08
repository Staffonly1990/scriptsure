import React, { FC, MutableRefObject, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Observer, observer } from 'mobx-react-lite';
import Select from 'shared/ui/select';
import { reportsStore } from 'features/report';
import DatePicker from 'shared/ui/date.picker';
import Button from 'shared/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { IPhysicianPayload } from 'shared/api/report';
import { currentPracticeStore } from 'features/practice';
import moment from 'moment';
import { map } from 'lodash';
import { toJS } from 'mobx';
import { useStateRef } from 'shared/hooks';
import { Data } from 'ws';
import { userModel } from 'features/user';
import { StringDecoder } from 'string_decoder';

interface IMeasureHospital {
  innerRef?: MutableRefObject<HTMLElement | null>;
  doctor: number;
  changePractice: (value: string) => void;
  date: any[];
  changeDate: (value: any[]) => void;
}
const ReportsAutoMeasureHospital: FC<IMeasureHospital> = observer(({ innerRef, doctor, changePractice, date, changeDate }) => {
  const intl = useIntl();
  const [dateStart, dateEnd] = date;
  const [start, setStart] = useState<Date>(dateStart);
  const [end, setEnd] = useState<Date>(dateEnd);
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);
  const { control, handleSubmit } = useForm<IPhysicianPayload>({
    mode: 'onChange',
    defaultValues: {
      doctorId: doctor,
      practiceId: '',
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
    changePractice(data.practiceId);
    changeDate([start, end]);
    try {
      await reportsStore.getAllHospital(data);
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
        name="practiceId"
        render={({ field: { value, onChange } }) => (
          <Observer>
            {() => (
              <Select
                container={formRef?.current}
                className="form-control md:flex-auto md:w-3/6 my-2"
                classes={{ placeholder: 'w-full', options: '!w-auto' }}
                shape="round"
                label={<label className="text-primary form-helper-text">{intl.formatMessage({ id: 'reports.measures.practice' })}</label>}
                width="w-40"
                options={map(userModel.data?.practices, (practice) => ({
                  value: String(practice?.id),
                  label: practice?.name,
                }))}
                name="practiceId"
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
        <div className="flex flex-col mx-2">
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

ReportsAutoMeasureHospital.displayName = 'ReportsAutoMeasureHospital';

export default ReportsAutoMeasureHospital;
