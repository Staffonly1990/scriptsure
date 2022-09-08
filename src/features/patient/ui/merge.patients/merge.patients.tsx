import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import styles from './merge.patients.module.css';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { ArrowsExpandIcon, SearchIcon, UserIcon, ViewListIcon, XIcon, ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/outline';
import Modal from 'shared/ui/modal';
import { map, debounce } from 'lodash';
import Steps from 'shared/ui/steps';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { patientDemographicsModel, PatientResultsSheet, patientStore, PatientAdvancedSearchForm } from 'features/patient';
import { useGetSet } from 'react-use';
import type { SubmitHandler } from 'react-hook-form';
import { IPatientAdvancedQueryPayload } from 'shared/api/patient';
import { flowResult } from 'mobx';
import { useNotifier } from 'react-headless-notifier';
import Alert from 'shared/ui/alert';

const MergePatients: FC = observer(() => {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [search, setSearch] = useState('');
  const breakpoints = useBreakpoints();
  const { notify } = useNotifier();
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }, []);
  const [isOpenAdvancedSearch, setIsOpenAdvancedSearch] = useGetSet<boolean>(false);
  const intl = useIntl();
  const resetPatients = () => {
    patientStore.cleanUpListMerge();
  };

  const steps = [
    intl.formatMessage({ id: 'home.primaryPatient' }),
    intl.formatMessage({ id: 'home.duplicatePatients' }),
    intl.formatMessage({ id: 'home.confirmation' }),
  ];

  const alert = () => {
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        {intl.formatMessage({ id: 'home.duplicatePatientAddedList' })}
      </Alert.Notification>
    );
  };

  const toggleIsOpenAdvancedSearch = (state?: boolean) => {
    const currentState = isOpenAdvancedSearch();
    setIsOpenAdvancedSearch(state ?? !currentState);
  };

  const MergePatient = async () => {
    try {
      await flowResult(patientStore.mergePatient());
    } catch {}
  };

  const searchPatients = async () => {
    try {
      await patientStore.searchMerge(search);
    } catch {}
  };

  const advancedSearchPatients: SubmitHandler<IPatientAdvancedQueryPayload> = async (data) => {
    try {
      await patientStore.advancedSearchMerge(data);
    } catch {}
  };

  const header = (
    <Steps color="blue" column activeStep={activeStep - 1}>
      {map(steps, (label, i) => (
        <Steps.Step key={i.toString(36)}>{label}</Steps.Step>
      ))}
    </Steps>
  );

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

  const table = (
    <div>
      <div>{intl.formatMessage({ id: 'home.findPrimaryPatient' })}</div>
      <div className="flex items-center mb-4 mt-4">
        {searchControl}
        <div className="hidden lg:block lg:space-x-4">
          {searchBtn}
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
        showUp
        data={[...patientStore.listMerge]}
        actions={{
          // eslint-disable-next-line react/display-name
          Header: () => {
            return <span className="sr-only">{intl.formatMessage({ id: 'home.setSelect' })}</span>;
          },
          // eslint-disable-next-line react/display-name
          Cell: ({ row: { original: patient } }) => {
            if (activeStep === 2 && patient.patientId !== patientStore.patientMerge?.patientId) {
              return (
                <Button
                  as="div"
                  className="uppercase"
                  color="yellow"
                  onClick={() => {
                    patientStore.addPatientIdChild(patient);
                    alert();
                  }}
                >
                  <UserIcon className="w-6 h-6 pr-1" />
                  {intl.formatMessage({ id: 'home.selectDuplicatePatient' })}
                </Button>
              );
            }
            return (
              <Button
                as="div"
                className="uppercase"
                color="green"
                onClick={() => {
                  setActiveStep(2);
                  patientStore.setAsPrimary(patient);
                }}
              >
                <UserIcon className="w-6 h-6 pr-1" />
                {intl.formatMessage({ id: 'home.setPrimary' })}
              </Button>
            );
          },
        }}
      />
    </div>
  );

  const confirmation = (
    <div className="flex justify-between items-center">
      <div className="border-2 border-gray-500">
        <div className="bg-yellow-600 text-white p-6">{intl.formatMessage({ id: 'home.duplicatePatients' })}</div>
        {patientStore.patientChild.map((child) => (
          <div className="p-6">
            <div>{`${child.firstName} ${child.lastName}`}</div>
            <div className="py-3">
              <div>{child?.chartId || child?.patientId}</div>
              <div>{patientDemographicsModel.patientStatuses[child.patientStatusId!]?.descr || null}</div>
              <div>{child.dob}</div>
              <div>{child.home}</div>
              <div>{child.addressLine1}</div>
              <div>{`${child.city}, ${child.state} ${child.zip}`}</div>
              <div className="text-red-600">{intl.formatMessage({ id: 'home.afterMerge' })}</div>
            </div>
            <Button
              onClick={() => {
                if (patientStore.patientChild.length === 1) {
                  setActiveStep(2);
                }
                patientStore.removePatientChild(child);
              }}
            >
              <TrashIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'invite.remove' })}
            </Button>
          </div>
        ))}
      </div>
      <ArrowRightIcon className="w-12 h-12" />
      <div className="border-2 border-gray-500">
        <div className="bg-green-600 text-white p-6">{intl.formatMessage({ id: 'home.primaryPatient' })}</div>

        <div className="p-6">
          <div>{`${patientStore.patientMerge.firstName} ${patientStore.patientMerge.lastName}`}</div>
          <div className="py-3">
            <div>{patientStore.patientMerge?.chartId || patientStore.patientMerge?.patientId}</div>
            <div>
              {/* {patientDemographicsModel.
                patientStatuses[patientStore.patientMerge.patientStatusId!]?.descr || null} */}
            </div>
            <div>{patientStore.patientMerge.dob}</div>
            <div>{patientStore.patientMerge.home}</div>
            <div>{patientStore.patientMerge.addressLine1}</div>
            <div>{`${patientStore.patientMerge.city}, 
            ${patientStore.patientMerge.state} ${patientStore.patientMerge.zip}`}</div>
            <div className="text-red-600">{intl.formatMessage({ id: 'home.afterMergeDuplicate' })}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-between pl-6 pr-6">
      <Button
        className="mb-3"
        onClick={() => {
          patientStore.setAsPrimary();
          patientStore.addPatientIdChild();
          patientStore.cleanUpListMerge();
          setActiveStep(1);
          setOpen(false);
        }}
      >
        <XIcon className="w-6 h-6" />
        {intl.formatMessage({ id: 'measures.cancel' })}
      </Button>
      {activeStep >= 2 ? (
        <div className="flex">
          <Button
            className="mb-3 mr-1"
            onClick={() => {
              if (activeStep === 2) {
                patientStore.addPatientIdChild();
                patientStore.setAsPrimary();
              }
              setActiveStep(activeStep - 1);
            }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
            {intl.formatMessage({ id: 'home.back' })}
          </Button>
          {activeStep === 3 ? (
            <>
              <Button
                onClick={() => {
                  setOpenConfirm(true);
                }}
                className="mb-3 ml-1"
              >
                {intl.formatMessage({ id: 'home.completeMerge' })}
                <ArrowRightIcon className="w-6 h-6" />
              </Button>
              <Modal open={openConfirm}>
                <Modal.Body>
                  <Modal.Header className="!bg-transparent !px-0 ">
                    <Modal.Title as="h5" className="title text-gray-900">
                      {intl.formatMessage({ id: 'home.confirm' })}
                    </Modal.Title>
                  </Modal.Header>
                  {intl.formatMessage({ id: 'home.sureMerge' })}
                </Modal.Body>
                <div className="flex justify-end px-6">
                  <Button
                    className="mb-3 mr-1"
                    onClick={() => {
                      setOpenConfirm(false);
                    }}
                  >
                    {intl.formatMessage({ id: 'no' })}
                  </Button>
                  <Button
                    className="mb-3 ml-1"
                    onClick={() => {
                      MergePatient();
                      setActiveStep(1);
                      setOpenConfirm(false);
                      setOpen(false);
                    }}
                  >
                    {intl.formatMessage({ id: 'yes' })}
                  </Button>
                </div>
              </Modal>
            </>
          ) : (
            <Button
              className="mb-3 ml-1"
              onClick={() => {
                setActiveStep(patientStore.patientChild.length !== 0 ? 3 : 2);
              }}
            >
              {intl.formatMessage({ id: 'home.next' })}
              <ArrowRightIcon className="w-6 h-6" />
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden lg:inline lg:space-x-4">
        <Tooltip content={intl.formatMessage({ id: 'home.mergeDuplicate' })}>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            color="gray"
            variant="flat"
            shape="circle"
          >
            <ArrowsExpandIcon className="w-6 h-6" />
          </Button>
        </Tooltip>
      </div>
      <div className="space-x-2 lg:hidden">
        <Tooltip content={intl.formatMessage({ id: 'home.mergeDuplicate' })}>
          <Button
            onClick={() => {
              setOpen(true);
            }}
            color="blue"
            shape="circle"
          >
            <ArrowsExpandIcon className="w-6 h-6" />
          </Button>
        </Tooltip>
      </div>

      <Modal className="!h-screen !max-h-screen !max-w-none !m-0 !overflow-y-auto" open={open}>
        {header}
        <Modal.Body>{activeStep < 3 ? table : confirmation}</Modal.Body>
        {footer}
      </Modal>
    </>
  );
});

MergePatients.displayName = 'MergePatients';
export default MergePatients;
