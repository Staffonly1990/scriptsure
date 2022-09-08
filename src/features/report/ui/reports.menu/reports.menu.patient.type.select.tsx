import React, { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Select from 'shared/ui/select/select';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { map } from 'lodash';

const optionList = [
  { value: 'Active', label: 'active' },
  { value: 'All', label: 'all' },
];

interface IPatientTypeSelect {
  isSelect: string;
  toggleSelect: (value: string) => void;
}
const ReportsMenuPatientTypeSelect: FC<IPatientTypeSelect> = observer(({ toggleSelect, isSelect }) => {
  const intl = useIntl();
  const changeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    toggleSelect(event.target.value);
  };

  return (
    <Select
      className="m-2"
      label={<label className="text-primary">{intl.formatMessage({ id: 'reports.measures.patientType' })}</label>}
      value={isSelect}
      width="w-60"
      selectIcon={<ChevronDownIcon />}
      options={map(optionList, (element) => ({
        value: element.value,
        label: intl.formatMessage({ id: `measures.${element.label}` }),
      }))}
      onChange={changeSelect}
    />
  );
});

ReportsMenuPatientTypeSelect.displayName = 'ReportsMenuPatientTypeSelect';

export default ReportsMenuPatientTypeSelect;
