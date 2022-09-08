import React, { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Select from 'shared/ui/select/select';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { map } from 'lodash';

const optionList = [
  { value: 'Written Date', label: 'writtenDate' },
  { value: 'Patient Last Name', label: 'patientLastName' },
  { value: 'Drug Name', label: 'drugName' },
  { value: 'Doctor Name', label: 'doctorName' },
];

interface IPrescriptionSortSelect {
  isSelect: string;
  toggleSelect: (value: string) => void;
}
const ReportsMenuPrescriptionSortSelect: FC<IPrescriptionSortSelect> = observer(({ toggleSelect, isSelect }) => {
  const intl = useIntl();
  const changeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    toggleSelect(event.target.value);
  };

  const newValue = !!optionList.find((item) => item.value === isSelect);
  return (
    <Select
      className="m-2"
      label={<label className="text-primary">{intl.formatMessage({ id: 'reports.measures.sortBy' })}</label>}
      value={newValue ? isSelect : ''}
      width="w-60"
      selectIcon={<ChevronDownIcon />}
      options={map(optionList, (element) => ({
        value: element.value,
        label: intl.formatMessage({ id: `reports.measures.${element.label}` }),
      }))}
      onChange={changeSelect}
    />
  );
});

ReportsMenuPrescriptionSortSelect.displayName = 'ReportsMenuPrescriptionSortSelect';

export default ReportsMenuPrescriptionSortSelect;
