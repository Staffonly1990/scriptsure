import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { IProvider } from 'shared/api/report';

import {
  ReportsMenuAudit,
  ReportsMenuMedicationUsers,
  ReportsMenuOperationalRecords,
  ReportsMenuPatientList,
  ReportsMenuPatientVisits,
  ReportsMenuPrescriberPrescription,
  ReportsMenuUserSubstance,
  ReportsMenuPrescriptionLogs,
} from './reports.menu';

interface IReportViews {
  checkedItem: string;
}
const ReportsViews: FC<IReportViews> = observer(({ checkedItem }) => {
  const intl = useIntl();
  const [isSelectDate, setIsSelectDate] = useState<string>(intl.formatMessage({ id: 'reports.measures.today' }));
  const [isSelectPatient, setIsSelectPatient] = useState(intl.formatMessage({ id: 'diagnosis.measures.active' }));
  const [isSelectProviders, setIsSelectProviders] = useState<IProvider[]>([]);
  const [isSelectSort, setIsSelectSort] = useState(intl.formatMessage({ id: 'reports.measures.patientLastName' }));
  const [isSelectDrug, setIsSelectDrug] = useState(intl.formatMessage({ id: 'reports.measures.bothLastName' }));

  const toggleSelectDate = (value) => {
    setIsSelectDate(value);
  };
  const toggleSelectPatient = (value) => {
    setIsSelectPatient(value);
  };
  const toggleSelectProviders = (value) => {
    setIsSelectProviders(value);
  };
  const toggleSelectSort = (value) => {
    setIsSelectSort(value);
  };
  const toggleSelectDrug = (value) => {
    setIsSelectDrug(value);
  };
  const views = [
    {
      view: <ReportsMenuAudit isSelect={isSelectDate} toggleSelect={toggleSelectDate} />,
      text: intl.formatMessage({ id: 'reports.measures.auditLog' }),
    },
    {
      view: (
        <ReportsMenuMedicationUsers
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectPatient={isSelectPatient}
          toggleSelectPatient={toggleSelectPatient}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.medicationUsers' }),
    },
    {
      view: (
        <ReportsMenuOperationalRecords
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectPatient={isSelectPatient}
          toggleSelectPatient={toggleSelectPatient}
          isSelectProviders={isSelectProviders}
          toggleSelectProviders={toggleSelectProviders}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.operationalRecord' }),
    },
    {
      view: (
        <ReportsMenuPatientList
          isSelectPatient={isSelectPatient}
          toggleSelectPatient={toggleSelectPatient}
          isSelectSort={isSelectSort}
          toggleSelectSort={toggleSelectSort}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.patientList' }),
    },
    {
      view: (
        <ReportsMenuPatientVisits
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectProviders={isSelectProviders}
          toggleSelectProviders={toggleSelectProviders}
          isSelectSort={isSelectSort}
          toggleSelectSort={toggleSelectSort}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.patientVisits' }),
    },
    {
      view: (
        <ReportsMenuPrescriptionLogs
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectPatient={isSelectPatient}
          toggleSelectPatient={toggleSelectPatient}
          isSelectProviders={isSelectProviders}
          toggleSelectProviders={toggleSelectProviders}
          isSelectSort={isSelectSort}
          toggleSelectSort={toggleSelectSort}
          isSelectDrug={isSelectDrug}
          toggleSelectDrug={toggleSelectDrug}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.prescriptionLogs' }),
    },
    {
      view: (
        <ReportsMenuPrescriberPrescription
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectProviders={isSelectProviders}
          toggleSelectProviders={toggleSelectProviders}
          isSelectSort={isSelectSort}
          toggleSelectSort={toggleSelectSort}
          isSelectDrug={isSelectDrug}
          toggleSelectDrug={toggleSelectDrug}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.logsPrescriber' }),
    },
    {
      view: (
        <ReportsMenuUserSubstance
          isSelectDate={isSelectDate}
          toggleSelectDate={toggleSelectDate}
          isSelectProviders={isSelectProviders}
          toggleSelectProviders={toggleSelectProviders}
          isSelectSort={isSelectSort}
          toggleSelectSort={toggleSelectSort}
        />
      ),
      text: intl.formatMessage({ id: 'reports.measures.userSubstance' }),
    },
  ];

  const componentView = views.find((item) => item.text === checkedItem);
  return <div className="my-3 mx-5">{componentView?.view}</div>;
});

ReportsViews.displayName = 'ReportsViews';
export default ReportsViews;
