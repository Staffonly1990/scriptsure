import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import moment from 'moment';
import { useGetSet } from 'react-use';
import { useIntl } from 'react-intl';
import { map } from 'lodash';

import { ClockIcon, ClipboardIcon } from '@heroicons/react/outline';

import Dropdown from 'shared/ui/dropdown/dropdown';
import Button from 'shared/ui/button';
import Autocomplete from 'shared/ui/autocomplete';
import Popper from 'shared/ui/popper/popper';
import Spinner from 'shared/ui/spinner/spinner';
import { OActionStatus } from 'shared/lib/model';

import {
  AddCommonDiagnosisModal,
  diagnosisStore,
  MedlineInformationModal,
  NotificationDiagnosisModal,
  EditDiagnosisModal,
  DiagnosisSheet,
} from 'features/diagnosis';

/**
 * @view ChartDiagnosis
 */

interface IDiagnosisInformation {
  patientId?: number;
  encounterId?: number;
  conceptId?: string;
  codingSystem?: number;
}

const ChartDiagnosisView: FC = () => {
  const [diagnosisInformation, setDiagnosisInformation] = useState<IDiagnosisInformation>({});
  // this state we use for update diagnosis after all actions
  const [isAddDiagnosisFlag, setIsAddDiagnosisFlag] = useState<boolean>(false);
  const [historyValue, setHistoryValue] = useState<Nullable<string>>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const intl = useIntl();

  const encounterList = toJS(diagnosisStore.diagnosisList.encounterList);
  const searchedDiagnosisList = toJS(diagnosisStore.searchedDiagnosisList);

  const [isNotificationModal, setIsNotificationModal] = useGetSet<boolean>(false);
  const toggleNotificationModal = (state?: boolean) => {
    const currentState = isNotificationModal();
    setIsNotificationModal(state ?? !currentState);
  };

  const [isMedlineInformation, setIsMedlineInformation] = useGetSet<boolean>(false);
  const toggleMedlineInformation = (state?: boolean) => {
    const currentState = isMedlineInformation();
    setIsMedlineInformation(state ?? !currentState);
  };

  const [isCommonDiagnosis, setIsCommonDiagnosis] = useGetSet<boolean>(false);
  const toggleCommonDiagnosis = (state?: boolean) => {
    const currentState = isCommonDiagnosis();
    setIsCommonDiagnosis(state ?? !currentState);
  };

  const [isEditDiagnosis, setIsEditDiagnosis] = useGetSet<boolean>(false);
  const toggleEditDiagnosis = (state?: boolean) => {
    const currentState = isEditDiagnosis();
    setIsEditDiagnosis(state ?? !currentState);
  };

  const getInitialData = async () => {
    await diagnosisStore.getAllDiagnosis();
  };

  const openCommonDiagnosisModal = async () => {
    await diagnosisStore.getCommonDiagnosis();
    toggleCommonDiagnosis(true);
  };

  useEffect(() => {
    getInitialData();
  }, [isAddDiagnosisFlag]);

  useEffect(() => {
    return () => {
      diagnosisStore.clearLists();
    };
  }, []);

  let list;
  switch (historyValue) {
    case 'current':
      list = [...diagnosisStore.diagnosisList.currentList];
      break;
    case 'archive':
      list = [...diagnosisStore.diagnosisList.archivedList];
      break;
    case null:
    default:
      list = [...diagnosisStore.diagnosisList.list];
      break;
  }

  const handleChange = async ({ target: { value } }) => {
    setQuery(value);
    if (value.length >= 3) {
      await diagnosisStore.searchDiagnosis(value[value.length - 1] === ' ' ? value.trim() : value, false, true, 100, 'icd10');
    }
  };

  const handleReset = () => {
    diagnosisStore.clearSearchDiagnosis();
  };

  const onSelect = (name, value) => {
    const payload = {
      conceptId: value.conceptId,
      name: value.long,
      startDate: moment().toDate(),
    };
    setDiagnosisInformation(payload);
    setIsDelete(false);
    toggleNotificationModal(true);
  };

  return (
    <>
      <div>
        <div className="w-full">
          <Dropdown
            list={[
              <Dropdown.Item onClick={() => setHistoryValue(null)}>{intl.formatMessage({ id: 'measures.all' })}</Dropdown.Item>,
              <Dropdown.Item onClick={() => setHistoryValue('archive')}>{intl.formatMessage({ id: 'measures.archive' })}</Dropdown.Item>,
              <Dropdown.Item onClick={() => setHistoryValue('current')}>{intl.formatMessage({ id: 'measures.current' })}</Dropdown.Item>,
            ]}
            placement="bottom-start"
          >
            <div className="flex gap-4 items-center">
              <span>
                {!historyValue && intl.formatMessage({ id: 'diagnosis.measures.allDiagnosis' })}
                {historyValue === 'archive' && intl.formatMessage({ id: `diagnosis.measures.archiveDiagnosis` })}
                {historyValue === 'current' && intl.formatMessage({ id: `diagnosis.measures.currentDiagnosis` })}
              </span>
              <Button variant="filled" shape="circle" color="blue">
                <ClockIcon className="w-5 h-5" />
              </Button>
            </div>
          </Dropdown>
        </div>
        <div className="pt-4">
          <Button onClick={openCommonDiagnosisModal} color="green" className="uppercase">
            {intl.formatMessage({ id: 'diagnosis.measures.add' })}
          </Button>
          <Autocomplete onSelect={onSelect}>
            <Popper
              className="w-[400px] max-h-[400px] overflow-y-auto"
              trigger="focus"
              content={
                <>
                  {searchedDiagnosisList.length > 0 ? (
                    <Popper.Listbox>
                      {map(searchedDiagnosisList, (suggestion) => {
                        return (
                          <Popper.ListboxItem
                            as={Autocomplete.Option}
                            key={suggestion.long}
                            value={suggestion}
                            valueToString={(s) => `${s.conceptId} ${s.short}`}
                            dismissed
                          />
                        );
                      })}
                    </Popper.Listbox>
                  ) : (
                    <Popper.Content>
                      <span>{intl.formatMessage({ id: 'diagnosis.measures.noMatch' })}</span>
                    </Popper.Content>
                  )}
                </>
              }
            >
              {({ ref }) => (
                <span className="inline-flex relative">
                  <Autocomplete.Input
                    placeholder={intl.formatMessage({ id: 'diagnosis.measures.searchForNewDiagnosis' })}
                    ref={ref}
                    className="form-input w-[400px] ml-5 h-[36px] pr-[22px]"
                    onChange={handleChange}
                  />
                  {!!query.length && diagnosisStore.status.getSearchDiagnosis === OActionStatus.Pending && (
                    <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                      <Spinner.Loader className="w-4 h-4" color="blue" size={null} />
                    </span>
                  )}
                  {!!query.length && (
                    <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                      <Autocomplete.Reset onClick={handleReset} className="w-4 h-4 !text-black" />
                    </span>
                  )}
                </span>
              )}
            </Popper>
          </Autocomplete>
        </div>
        <div className="pt-4">
          <div>
            <div className="flex items-center justify-between h-12 px-2 text-white bg-blue-500">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <span>{intl.formatMessage({ id: 'diagnosis.measures.todayDiagnosis' })}</span>
            </div>
            {encounterList.length > 0 ? (
              <DiagnosisSheet
                data={encounterList}
                isEncounter
                setDiagnosisInformation={setDiagnosisInformation}
                toggleEditDiagnosis={toggleEditDiagnosis}
                toggleMedlineInformation={toggleMedlineInformation}
                setIsDelete={setIsDelete}
                toggleNotificationModal={toggleNotificationModal}
              />
            ) : (
              <div className="flex items-center p-8 gap-5 border border-t-0 border-gray-300">
                <ClipboardIcon className="w-20 h-20" />
                <div className="flex flex-col gap-2">
                  <span className="text-4xl text-gray-300">{intl.formatMessage({ id: 'diagnosis.measures.noDiagnosis' })}</span>
                  <div>
                    <Button onClick={openCommonDiagnosisModal} className="uppercase" variant="filled" color="green">
                      {intl.formatMessage({ id: 'diagnosis.measures.add' })} ?
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {list.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between h-12 px-2 text-white bg-blue-500">
                {historyValue === 'current' && intl.formatMessage({ id: 'diagnosis.measures.currentDiagnosis' })}
                {historyValue === 'archive' && intl.formatMessage({ id: 'diagnosis.measures.archiveDiagnosis' })}
                {!historyValue && intl.formatMessage({ id: 'diagnosis.measures.allDiagnosis' })}
              </div>
              <DiagnosisSheet
                data={list}
                isEncounter={false}
                setDiagnosisInformation={setDiagnosisInformation}
                toggleEditDiagnosis={toggleEditDiagnosis}
                toggleMedlineInformation={toggleMedlineInformation}
                setIsDelete={setIsDelete}
                toggleNotificationModal={toggleNotificationModal}
              />
            </div>
          )}
        </div>
      </div>
      <MedlineInformationModal open={isMedlineInformation()} onClose={toggleMedlineInformation} unmount hideBackdrop={false} />
      <AddCommonDiagnosisModal
        open={isCommonDiagnosis()}
        onClose={toggleCommonDiagnosis}
        unmount
        hideBackdrop={false}
        setIsAddDiagnosisFlag={setIsAddDiagnosisFlag}
      />
      <NotificationDiagnosisModal
        open={isNotificationModal()}
        onClose={toggleNotificationModal}
        unmount
        hideBackdrop={false}
        diagnosisInformation={diagnosisInformation}
        isDelete={isDelete}
        setIsAddDiagnosisFlag={setIsAddDiagnosisFlag}
      />
      {isEditDiagnosis() && (
        <EditDiagnosisModal
          setIsAddDiagnosisFlag={setIsAddDiagnosisFlag}
          open={isEditDiagnosis()}
          onClose={toggleEditDiagnosis}
          unmount
          hideBackdrop={false}
          editable
        />
      )}
    </>
  );
};
ChartDiagnosisView.displayName = 'ChartDiagnosisView';

export default observer(ChartDiagnosisView);
