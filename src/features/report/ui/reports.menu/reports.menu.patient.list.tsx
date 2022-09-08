import React, { ChangeEvent, FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Select from 'shared/ui/select/select';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Button from 'shared/ui/button';
import ReportsMenuPatientSortSelect from './reports.menu.patient.sort.select';
import { map } from 'lodash';

interface IPatientList {
  isSelectPatient: string;
  toggleSelectPatient: (value: string) => void;
  isSelectSort: string;
  toggleSelectSort: (value: string) => void;
}

const ReportsMenuPatientList: FC<IPatientList> = observer(({ isSelectPatient, toggleSelectPatient, isSelectSort, toggleSelectSort }) => {
  const intl = useIntl();
  const changeSelectPatient = (event: ChangeEvent<HTMLInputElement>) => {
    toggleSelectPatient(event.target.value);
  };
  const changeSelectSort = (value) => {
    toggleSelectSort(value);
  };
  const handleSubmit = () => {};

  const patientOption = [
    { value: 'All', label: 'all' },
    { value: 'Active', label: 'active' },
    { value: 'Inactive', label: 'inactive' },
  ];

  return (
    <div className="flex justify-between items-center mx-3 my-5">
      <div className="flex items-end flex-wrap">
        <Select
          className="m-2"
          label={<label className="text-primary">{intl.formatMessage({ id: 'reports.measures.patientType' })}</label>}
          value={isSelectPatient}
          width="w-60"
          selectIcon={<ChevronDownIcon />}
          options={map(patientOption, (element) => ({
            value: element.value,
            label: intl.formatMessage({ id: `measures.${element.label}` }),
          }))}
          onChange={changeSelectPatient}
        />
        <ReportsMenuPatientSortSelect isSelect={isSelectSort} toggleSelect={changeSelectSort} />
      </div>
      <Button className="uppercase" color="green" onClick={handleSubmit}>
        {intl.formatMessage({ id: 'measures.submit' })}
      </Button>
    </div>
  );
});

ReportsMenuPatientList.displayName = 'ReportsMenuPatientList';

export default ReportsMenuPatientList;
