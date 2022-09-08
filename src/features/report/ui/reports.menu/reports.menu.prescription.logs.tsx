import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import ReportsMenuProviderSelect from './reports.menu.provider.select';
import ReportsMenuDateSelect from './reports.menu.date.select';
import ReportsMenuPatientTypeSelect from './reports.menu.patient.type.select';
import Button from 'shared/ui/button';
import ReportsMenuDrugTypeSelect from './reports.menu.drug.type.select';
import { IProvider } from 'shared/api/report';
import ReportsMenuPrescriptionSortSelect from './reports.menu.prescription.sort.select';

interface IPrescriptionLogs {
  isSelectDate: string;
  toggleSelectDate: (value: string) => void;
  isSelectPatient: string;
  toggleSelectPatient: (value: string) => void;
  isSelectProviders: IProvider[];
  toggleSelectProviders: (value: IProvider[]) => void;
  isSelectSort: string;
  toggleSelectSort: (value: string) => void;
  isSelectDrug: string;
  toggleSelectDrug: (value: string) => void;
}

const ReportsMenuPrescriptionLogs: FC<IPrescriptionLogs> = observer(
  ({
    isSelectDate,
    toggleSelectDate,
    isSelectPatient,
    toggleSelectPatient,
    isSelectProviders,
    toggleSelectProviders,
    isSelectSort,
    toggleSelectSort,
    isSelectDrug,
    toggleSelectDrug,
  }) => {
    const intl = useIntl();
    const changeSelectDate = (value) => {
      toggleSelectDate(value);
    };
    const changeSelectPatient = (value) => {
      toggleSelectPatient(value);
    };
    const changeSelectProviders = (value) => {
      toggleSelectProviders(value);
    };
    const changeSelectSort = (value) => {
      toggleSelectSort(value);
    };
    const changeDrug = (value) => {
      toggleSelectDrug(value);
    };
    const handleSubmit = () => {};

    return (
      <div className="flex justify-between items-center mx-3 my-5">
        <div className="flex items-end flex-wrap">
          <ReportsMenuProviderSelect isSelect={isSelectProviders} toggleSelect={changeSelectProviders} />
          <ReportsMenuDateSelect isSelect={isSelectDate} toggleSelect={changeSelectDate} />
          <ReportsMenuPrescriptionSortSelect isSelect={isSelectSort} toggleSelect={changeSelectSort} />
          <ReportsMenuPatientTypeSelect isSelect={isSelectPatient} toggleSelect={changeSelectPatient} />
          <ReportsMenuDrugTypeSelect isSelect={isSelectDrug} toggleSelect={changeDrug} />
        </div>
        <Button className="uppercase" color="green" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'measures.submit' })}
        </Button>
      </div>
    );
  }
);

ReportsMenuPrescriptionLogs.displayName = 'ReportsMenuPrescriptionLogs';

export default ReportsMenuPrescriptionLogs;
