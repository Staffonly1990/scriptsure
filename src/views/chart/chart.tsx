import React, { FC, VFC, ComponentProps, lazy, useEffect, useCallback } from 'react';
import { useNotifier } from 'react-headless-notifier';
import { Switch, Redirect, NavLink } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { PencilIcon, ExclamationIcon, PlusIcon, ShieldExclamationIcon, TicketIcon, DocumentAddIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { UserIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { isNil, map } from 'lodash';
import { useGetSet } from 'react-use';
import { useIntl } from 'react-intl';

import { ComponentModel } from 'shared/model';
import { routes } from 'shared/config';
import { OActionStatus } from 'shared/lib/model';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { useRouter } from 'shared/hooks';
import Alert from 'shared/ui/alert';
import Button from 'shared/ui/button';
import Spinner from 'shared/ui/spinner';
import Dropdown from 'shared/ui/dropdown';
import CollapsedMenu from 'shared/ui/collapsed.menu';

import { patientModel, recentPatientsStore } from 'features/patient';
import { settingsModel } from 'features/settings';
import { BannerActions, DemographicPresentation } from 'features/patient/ui/chart.banner';
import { encounterModel, EncountersModal } from 'features/encounter';
import { PrivateRoute } from '../route';

const ChartAllergiesView = lazy(() => import('./allergies'));
const ChartDemographicsView = lazy(() => import('./demographics'));
const ChartDiagnosisView = lazy(() => import('./diagnosis'));
const ChartEducationView = lazy(() => import('./education'));
const ChartNotesView = lazy(() => import('./notes'));
const ChartPharmacyView = lazy(() => import('./pharmacy'));
const ChartPrescriptionsView = lazy(() => import('./prescriptions'));
const ChartVitalsView = lazy(() => import('./vitals'));

const views: Array<{
  pathname: string;
  view: FC<RouteComponentProps<any>> | VFC<RouteComponentProps<any>>;
  icon: FC<ComponentProps<'svg'>> | VFC<ComponentProps<'svg'>>;
  text: string;
}> = [
  {
    pathname: routes.chart.routes.prescriptions.path(),
    view: ChartPrescriptionsView,
    text: 'prescriptions',
    icon: PencilIcon,
  },
  {
    pathname: routes.chart.routes.demographics.path(),
    view: ChartDemographicsView,
    text: 'demographics',
    icon: UserIcon,
  },
  {
    pathname: routes.chart.routes.allergies.path(),
    view: ChartAllergiesView,
    text: 'allergies',
    icon: ExclamationIcon,
  },
  {
    pathname: routes.chart.routes.pharmacy.path(),
    view: ChartPharmacyView,
    text: 'pharmacy',
    icon: PlusIcon,
  },
  {
    pathname: routes.chart.routes.diagnosis.path(),
    view: ChartDiagnosisView,
    text: 'diagnosis',
    icon: ShieldExclamationIcon,
  },
  {
    pathname: routes.chart.routes.vitals.path(),
    view: ChartVitalsView,
    text: 'vitals',
    icon: TicketIcon,
  },
  {
    pathname: routes.chart.routes.notes.path(),
    view: ChartNotesView,
    text: 'notes',
    icon: DocumentAddIcon,
  },
  {
    pathname: routes.chart.routes.education.path(),
    view: ChartEducationView,
    text: 'education',
    icon: QuestionMarkCircleIcon,
  },
];

/**
 * @view Chart
 */
const ChartView: FC = () => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const { notify } = useNotifier();
  const lastLocation = useLastLocation();
  const {
    match: { path, url },
    query: { patientId },
    replace,
    push,
  } = useRouter<{ patientId: string | number }>();

  const [isOpenEncounters, setIsOpenEncounters] = useGetSet<boolean>(false);
  const toggleIsOpenEncounters = (state?: boolean) => {
    const currentState = isOpenEncounters();
    const getInitialData = async () => {
      await encounterModel.getAllEncounters(patientId);
    };
    if (state) {
      getInitialData();
    }
    setIsOpenEncounters(state ?? !currentState);
  };

  useEffect(() => {
    const { appID } = settingsModel;
    const setting = settingsModel.get('CUSTOM_TEMPLATE', 'Organization');
    if (appID || (setting && setting !== 'null')) {
      ComponentModel.getHiddenComponents(appID || setting);
    }
  }, []);

  const initializePatient = useCallback(async () => {
    try {
      await patientModel.getPatient(+patientId);
      recentPatientsStore.add({
        firstName: patientModel.currentPatient?.firstName,
        lastName: patientModel.currentPatient?.lastName,
        nextOfKinName: patientModel.currentPatient?.nextOfKinName,
        id: Number(patientModel.currentPatient?.chartId) || Number(patientModel.currentPatient?.patientId),
      });
    } catch {}

    if (!isNil(patientModel.errors.getPatient)) {
      notify(
        <Alert.Notification shape="smooth" type="error" color="red" border closable>
          {patientModel.errors.getPatient}
        </Alert.Notification>
      );
      if (lastLocation) replace(lastLocation.pathname);
      else replace(routes.root.path());
    }
  }, []);

  useEffect(() => {
    initializePatient();
  }, [patientId]);

  if (patientModel.status.getPatient !== OActionStatus.Fulfilled) {
    return (
      <div className="flex justify-center bg-gray-50 items-center w-full h-full absolute top-0 right-0">
        <Spinner.Loader color="blue" className="w-24 h-24" size="md" />
      </div>
    );
  }

  return (
    <div className="container flex flex-1 mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 max-w-full border border-solid border-gray-300">
        {breakpoints.sm && (
          <CollapsedMenu className="flex-none" classes={{ title: 'h-16 uppercase' }} title={intl.formatMessage({ id: 'chart.measures.chartNavigation' })}>
            {map(views, ({ pathname, text, icon }, index) => (
              <CollapsedMenu.Item
                key={index.toString(36)}
                as={NavLink}
                className="text-primary hover:bg-blue-400"
                activeClassName="!text-white dark:!text-black bg-blue-500"
                to={`${url}${pathname}`}
                text={intl.formatMessage({ id: `measures.${text}` })}
                icon={icon}
              />
            ))}
          </CollapsedMenu>
        )}

        <div className="overflow-x-hidden flex-1 border-l border-solid border-gray-300">
          <div className="flex items-center justify-between h-16 p-1 text-white bg-blue-500 sm:p-2">
            <DemographicPresentation currentPatient={patientModel.currentPatient} views={views} />
            <BannerActions notify={notify} push={push} replace={replace} url={url} toggleIsOpenEncounters={toggleIsOpenEncounters} />
            {!breakpoints.sm && (
              <Dropdown
                list={map(views, ({ pathname, text, icon: Icon }, index) => (
                  <Dropdown.Item key={index.toString(36)} as={NavLink} activeClassName="!text-primary !bg-blue-500" to={`${url}${pathname}`}>
                    <Icon className="w-4 h-4 mr-2" />
                    {intl.formatMessage({ id: `measures.${text}` })}
                  </Dropdown.Item>
                ))}
              >
                <Button variant="flat" shape="circle" color="white" size="xs">
                  <DotsVerticalIcon className="w-4 h-4" />
                </Button>
              </Dropdown>
            )}
          </div>

          <Switch>
            {map(views, ({ pathname, view: View }, index) => (
              <PrivateRoute key={`${patientId}.${index.toString(36)}`} path={`${path}${pathname}`} component={View} />
            ))}
            <Redirect
              to={{
                pathname: `${path}${routes.chart.routes.prescriptions.path()}`,
                state: { preventLastLocation: true },
              }}
            />
          </Switch>
        </div>
      </div>
      <EncountersModal onClose={toggleIsOpenEncounters} unmount={false} open={isOpenEncounters()} modalPatientId={patientId} />
    </div>
  );
};
ChartView.displayName = 'ChartView';

export default observer(ChartView);
