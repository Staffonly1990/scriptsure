import React, { ChangeEvent, FC, useEffect, useCallback, useState } from 'react';
import { useGetSet } from 'react-use';
import type { SubmitHandler } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { SearchIcon, ArrowsExpandIcon, DownloadIcon, ViewListIcon, UserIcon } from '@heroicons/react/outline';
import { UserAddIcon } from '@heroicons/react/solid';
import { useIntl } from 'react-intl';

import { routes } from 'shared/config';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import Spinner from 'shared/ui/spinner';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import type { IPatientAdvancedQueryPayload } from 'shared/api/patient';
import { OActionStatus } from 'shared/lib/model';
import {
  patientModel,
  patientStore,
  PatientResultsSheet,
  MergePatients,
  PatientAdvancedSearchForm,
  recentPatientsStore,
  RecentPatient,
} from 'features/patient';
import { AddPatientModal, EligibilityModal } from 'features/patient/add';

import DuplicateModal from '../features/patient/add/ui/duplicate.modal';

/**
 * @view Root
 */
const RootView: FC = () => {
  const breakpoints = useBreakpoints();
  const intl = useIntl();
  useEffect(() => {
    /**
     * cleaning the patient model after we leave the chart
     */
    if (patientModel.currentPatient) {
      patientModel.currentPatient = null;
      patientModel.resetPatientImage();
    }
  }, []);
  useEffect(() => console.log(breakpoints), [breakpoints]);
  const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useGetSet<boolean>(false);
  const toggleIsOpenDuplicate = (state?: boolean) => {
    const currentState = isOpenDuplicateModal();
    setIsOpenDuplicateModal(state ?? !currentState);
  };

  const [isOpenAddPatient, setIsOpenAddPatient] = useGetSet<boolean>(false);
  const toggleIsOpenAddPatient = (state?: boolean) => {
    const currentState = isOpenAddPatient();
    setIsOpenAddPatient(state ?? !currentState);
  };

  const [isMountedEligibility, setIsMountedEligibility] = useGetSet<boolean>(false);
  const toggleIsMountedEligibility = (state?: boolean) => {
    const currentState = isMountedEligibility();
    setIsMountedEligibility(state ?? !currentState);
  };

  const [isOpenAdvancedSearch, setIsOpenAdvancedSearch] = useGetSet<boolean>(false);
  const toggleIsOpenAdvancedSearch = (state?: boolean) => {
    const currentState = isOpenAdvancedSearch();
    setIsOpenAdvancedSearch(state ?? !currentState);
  };

  const [search, setSearch] = useState('');
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);

  const searchPatients = async () => {
    try {
      await patientStore.search(search);
    } catch {}
  };

  const advancedSearchPatients: SubmitHandler<IPatientAdvancedQueryPayload> = async (data) => {
    try {
      await patientStore.advancedSearch(data);
    } catch {}
  };

  const resetPatients = () => patientStore.cleanUpList();

  const searchControl = (
    <div className="form-control mr-2 w-full lg:w-1/3">
      <input
        className="form-input placeholder-search sm:text-lg"
        placeholder={intl.formatMessage({ id: 'home.enterLastName' })}
        autoComplete="off"
        value={search}
        onChange={handleInput}
      />
      <label className="form-label __hidden">{intl.formatMessage({ id: 'home.enterName' })}</label>
    </div>
  );

  const searchBtn = breakpoints.lg ? (
    <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.searchPatient' })}>
      <Button className="uppercase" color="green" shape="smooth" onClick={searchPatients}>
        <SearchIcon className="w-6 h-6 mr-1" />
        <span className="sr-only lg:not-sr-only">{intl.formatMessage({ id: 'home.search' })}</span>
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.searchPatient' })}>
      <Button color="blue" shape="circle" onClick={searchPatients}>
        <SearchIcon className="w-6 h-6" />
        <span className="sr-only lg:not-sr-only">{intl.formatMessage({ id: 'home.search' })}</span>
      </Button>
    </Tooltip>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <p className="capitalize text-xl font-normal">{intl.formatMessage({ id: 'home.findPatient' })}</p>

        <div className="flex items-center mb-4 mt-4">
          {searchControl}

          <div className="hidden lg:block lg:space-x-4">
            {searchBtn}
            <Tooltip content={intl.formatMessage({ id: 'home.addNewPatient' })}>
              <Button className="uppercase inline-flex" color="blue" shape="smooth" onClick={() => toggleIsOpenAddPatient(true)}>
                <UserAddIcon className="w-6 h-6 mr-1" />
                {intl.formatMessage({ id: 'home.addPatient' })}
              </Button>
            </Tooltip>

            <RecentPatient />

            <MergePatients />

            <Tooltip content={intl.formatMessage({ id: 'home.importExportInformation' })}>
              <Button as="a" color="gray" variant="flat" shape="circle" disabled={!patientStore.exportLink} href={patientStore.exportLink} download>
                <DownloadIcon className="w-6 h-6" />
              </Button>
            </Tooltip>

            <Tooltip content={intl.formatMessage({ id: 'home.advanced' })}>
              <Button color="gray" variant="flat" shape="circle" onClick={() => toggleIsOpenAdvancedSearch()}>
                <ViewListIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </div>

          <div className="flex space-x-2 lg:hidden">
            {searchBtn}
            <Tooltip content={intl.formatMessage({ id: 'home.addNewPatient' })}>
              <Button color="blue" shape="circle" onClick={() => toggleIsOpenAddPatient(true)}>
                <UserAddIcon className="w-6 h-6" />
              </Button>
            </Tooltip>

            <MergePatients />

            <Tooltip content={intl.formatMessage({ id: 'home.advanced' })}>
              <Button color="blue" shape="circle" onClick={() => toggleIsOpenAdvancedSearch()}>
                <ViewListIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </div>
        </div>

        <PatientAdvancedSearchForm
          className="mb-4 mt-4"
          open={isOpenAdvancedSearch()}
          onSubmit={advancedSearchPatients}
          onReset={resetPatients}
          onClose={() => toggleIsOpenAdvancedSearch(false)}
        />

        <PatientResultsSheet
          data={[...patientStore.list]}
          actions={{
            // eslint-disable-next-line react/display-name
            Header: () => {
              return <span className="sr-only">{intl.formatMessage({ id: 'measures.select' })}</span>;
            },
            // eslint-disable-next-line react/display-name
            Cell: ({ row: { original: patient } }) => {
              const patientId = Number(patient?.chartId) || Number(patient?.patientId);
              return (
                <Tooltip content={intl.formatMessage({ id: 'home.selectPatient' })}>
                  <Button
                    as={NavLink}
                    className="uppercase"
                    color="green"
                    to={routes.chart.path(patientId)}
                    onClick={() =>
                      recentPatientsStore.add({
                        firstName: patient?.firstName,
                        nextOfKinName: patient?.nextOfKinName,
                        lastName: patient?.lastName,
                        id: patientId,
                      })
                    }
                  >
                    <UserIcon className="w-6 h-6 pr-1" />
                    {intl.formatMessage({ id: 'measures.select' })}
                  </Button>
                </Tooltip>
              );
            },
          }}
        />
      </div>

      <AddPatientModal open={isOpenAddPatient()} onClose={toggleIsOpenAddPatient} unmount hideBackdrop={false} editable={false} />

      <DuplicateModal
        hideBackdrop={false}
        onClose={toggleIsOpenDuplicate}
        open={isOpenDuplicateModal()}
        unmount
        toggleIsOpenAddPatient={toggleIsOpenAddPatient}
      />

      <EligibilityModal open={isMountedEligibility()} onClose={toggleIsMountedEligibility} handleOpenEligibility={toggleIsMountedEligibility} unmount />
      {!isMountedEligibility() && patientModel.status.getEligibility === OActionStatus.Pending && (
        <div className="flex justify-center bg-gray-50 items-center w-full h-full absolute top-0 right-0">
          <Spinner.Loader color="blue" className="w-24 h-24" size="md" />
        </div>
      )}
    </>
  );
};
RootView.displayName = 'RootView';

export default observer(RootView);
