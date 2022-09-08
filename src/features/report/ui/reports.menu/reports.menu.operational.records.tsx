import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import ReportsMenuDateSelect from './reports.menu.date.select';
import ReportsMenuPatientTypeSelect from './reports.menu.patient.type.select';
import Button from 'shared/ui/button';
import ReportsMenuProviderSelect from './reports.menu.provider.select';
import { IProvider } from 'shared/api/report';

interface IReportOperationalRecords {
  isSelectDate: string;
  toggleSelectDate: (value: string) => void;
  isSelectPatient: string;
  toggleSelectPatient: (value: string) => void;
  isSelectProviders: IProvider[];
  toggleSelectProviders: (value: IProvider[]) => void;
}
const ReportsMenuOperationalRecords: FC<IReportOperationalRecords> = observer(
  ({ isSelectDate, toggleSelectDate, isSelectPatient, toggleSelectPatient, isSelectProviders, toggleSelectProviders }) => {
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
    const handleSubmit = () => {};

    return (
      <div className="flex justify-between items-center mx-3 my-5">
        <div className="flex items-end flex-wrap">
          <ReportsMenuProviderSelect isSelect={isSelectProviders} toggleSelect={changeSelectProviders} />
          <ReportsMenuDateSelect isSelect={isSelectDate} toggleSelect={changeSelectDate} />
          <ReportsMenuPatientTypeSelect isSelect={isSelectPatient} toggleSelect={changeSelectPatient} />
        </div>
        <Button className="uppercase" color="green" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'measures.submit' })}
        </Button>
      </div>
    );
  }
);

ReportsMenuOperationalRecords.displayName = 'ReportsMenuOperationalRecords';

export default ReportsMenuOperationalRecords;
