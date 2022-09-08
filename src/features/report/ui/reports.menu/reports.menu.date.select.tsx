import React, { ChangeEvent, FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Select from 'shared/ui/select/select';
import { ChevronDownIcon, CalendarIcon } from '@heroicons/react/outline';
import DatePicker from 'shared/ui/date.picker';
import { map } from 'lodash';

const optionList = [
  { value: 'Today', key: 'today' },
  { value: 'Last 7 days', key: '7' },
  { value: 'Last 14 days', key: '14' },
  { value: 'Last 30 days', key: '30' },
  { value: 'Custom date range', key: 'customDate' },
];

interface IReportDateSelect {
  isSelect: string;
  toggleSelect: (value: string) => void;
}
const ReportsMenuDateSelect: FC<IReportDateSelect> = observer(({ isSelect, toggleSelect }) => {
  const [dateStart, setDateStart] = useState<number>();
  const [dateEnd, setDateEnd] = useState<number>();
  const intl = useIntl();

  const handleDateStart = (value) => {
    setDateStart(value);
  };
  const handleDateEnd = (value) => {
    setDateEnd(value);
  };
  const changeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    toggleSelect(newValue);
  };
  return (
    <>
      <Select
        className="m-2"
        label={<label className="text-primary">{intl.formatMessage({ id: 'reports.measures.selectDate' })}</label>}
        value={isSelect}
        width="w-60"
        selectIcon={<ChevronDownIcon />}
        options={map(optionList, (element) => ({
          value: element.value,
          label: intl.formatMessage({ id: `reports.measures.${element.key}` }),
        }))}
        onChange={changeSelect}
      />
      {isSelect === 'Custom date range' && (
        <div className="flex items-center mb-2">
          <label className="form-label" htmlFor="date-start">
            <CalendarIcon className="w-4 h-4 m-2" />
          </label>
          <DatePicker date={dateStart} onDateChange={handleDateStart}>
            {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
          </DatePicker>
          <label className="form-label" htmlFor="date-start">
            <CalendarIcon className="w-4 h-4 m-2" />
          </label>
          <DatePicker date={dateEnd} onDateChange={handleDateEnd}>
            {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
          </DatePicker>
        </div>
      )}
    </>
  );
});

ReportsMenuDateSelect.displayName = 'ReportsMenuDateSelect';

export default ReportsMenuDateSelect;
