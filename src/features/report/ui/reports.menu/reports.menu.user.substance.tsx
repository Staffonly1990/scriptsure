import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import ReportsMenuProviderSelect from './reports.menu.provider.select';
import ReportsMenuDateSelect from './reports.menu.date.select';
import Button from 'shared/ui/button';
import { IProvider } from 'shared/api/report';
import ReportsMenuPrescriptionSortSelect from './reports.menu.prescription.sort.select';

interface IUserSubstance {
  isSelectDate: string;
  toggleSelectDate: (value: string) => void;
  isSelectProviders: IProvider[];
  toggleSelectProviders: (value: IProvider[]) => void;
  isSelectSort: string;
  toggleSelectSort: (value: string) => void;
}

const ReportsMenuUserSubstance: FC<IUserSubstance> = observer(
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
          <ReportsMenuPrescriptionSortSelect isSelect={isSelectSort} toggleSelect={changeSelectSort} />
        </div>
        <Button className="uppercase" color="green" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'measures.submit' })}
        </Button>
      </div>
    );
  }
);

ReportsMenuUserSubstance.displayName = 'ReportsMenuUserSubstance';

export default ReportsMenuUserSubstance;
