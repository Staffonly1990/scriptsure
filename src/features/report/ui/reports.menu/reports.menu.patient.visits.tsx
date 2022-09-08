import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import ReportsMenuProviderSelect from './reports.menu.provider.select';
import ReportsMenuDateSelect from './reports.menu.date.select';
import Button from 'shared/ui/button';
import { IProvider } from 'shared/api/report';
import ReportsMenuPatientSortSelect from './reports.menu.patient.sort.select';

interface IPatientVisits {
  isSelectDate: string;
  toggleSelectDate: (value: string) => void;
  isSelectProviders: IProvider[];
  toggleSelectProviders: (value: IProvider[]) => void;
  isSelectSort: string;
  toggleSelectSort: (value: string) => void;
}

const ReportsMenuPatientVisits: FC<IPatientVisits> = observer(
  ({ isSelectDate, toggleSelectDate, isSelectProviders, toggleSelectProviders, isSelectSort, toggleSelectSort }) => {
    const intl = useIntl();
    const changeSelectDate = (value) => {
      toggleSelectDate(value);
    };
    const changeSelectProviders = (value) => {
      toggleSelectProviders(value);
    };
    const changeSelectSort = (value) => {
      toggleSelectSort(value);
    };
    const handleSubmit = () => {};

    return (
      <div className="flex justify-between items-center mx-3 my-5">
        <div className="flex items-end flex-wrap">
          <ReportsMenuProviderSelect isSelect={isSelectProviders} toggleSelect={changeSelectProviders} />
          <ReportsMenuDateSelect isSelect={isSelectDate} toggleSelect={changeSelectDate} />
          <ReportsMenuPatientSortSelect isSelect={isSelectSort} toggleSelect={changeSelectSort} />
        </div>
        <Button className="uppercase" color="green" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'measures.submit' })}
        </Button>
      </div>
    );
  }
);

ReportsMenuPatientVisits.displayName = 'ReportsMenuPatientVisits';

export default ReportsMenuPatientVisits;
