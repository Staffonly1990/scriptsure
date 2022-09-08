import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import ReportsMenuDateSelect from './reports.menu.date.select';
import Button from 'shared/ui/button';
import ReportsMenuPatientTypeSelect from './reports.menu.patient.type.select';

interface IReportMedicationUsers {
  isSelectDate: string;
  toggleSelectDate: (value: string) => void;
  isSelectPatient: string;
  toggleSelectPatient: (value: string) => void;
}
const ReportsMenuMedicationUsers: FC<IReportMedicationUsers> = observer(({ isSelectDate, toggleSelectDate, isSelectPatient, toggleSelectPatient }) => {
  const intl = useIntl();
  const changeSelectDate = (value) => {
    toggleSelectDate(value);
  };
  const changeSelectPatient = (value) => {
    toggleSelectPatient(value);
  };
  const handleSubmit = () => {};

  return (
    <div className="flex justify-between items-center mx-3 my-5">
      <div className="flex items-end flex-wrap">
        <ReportsMenuDateSelect isSelect={isSelectDate} toggleSelect={changeSelectDate} />
        <ReportsMenuPatientTypeSelect isSelect={isSelectPatient} toggleSelect={changeSelectPatient} />
        <input type="text" placeholder={intl.formatMessage({ id: 'reports.measures.drugName' })} className="block form-input mb-2" />
      </div>
      <Button className="uppercase" color="green" onClick={handleSubmit}>
        {intl.formatMessage({ id: 'measures.submit' })}
      </Button>
    </div>
  );
});

ReportsMenuMedicationUsers.displayName = 'ReportsMenuMedicationUsers';

export default ReportsMenuMedicationUsers;
