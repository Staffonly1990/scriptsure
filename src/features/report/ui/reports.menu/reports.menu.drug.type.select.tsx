import React, { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Select from 'shared/ui/select/select';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { map } from 'lodash';

const optionList = [
  { value: 'Both Scheduled and Non-Scheduled', key: 'bothScheduled' },
  { value: 'Schedule II-V Only', key: 'scheduleOnly' },
  { value: 'Non-Scheduled Only', key: 'nonScheduledOnly' },
];

interface IPatientDrugTypeSelect {
  isSelect: string;
  toggleSelect: (value: string) => void;
}
const ReportsMenuDrugTypeSelect: FC<IPatientDrugTypeSelect> = observer(({ toggleSelect, isSelect }) => {
  const intl = useIntl();
  const changeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    toggleSelect(event.target.value);
  };

  return (
    <Select
      className="m-2"
      label={<label className="text-primary">{intl.formatMessage({ id: 'reports.measures.drugTypes' })}</label>}
      value={isSelect}
      width="w-80"
      selectIcon={<ChevronDownIcon />}
      options={map(optionList, (element) => ({
        value: element.value,
        label: intl.formatMessage({ id: `reports.measures.${element.key}` }),
      }))}
      onChange={changeSelect}
    />
  );
});

ReportsMenuDrugTypeSelect.displayName = 'ReportsMenuDrugTypeSelect';

export default ReportsMenuDrugTypeSelect;
