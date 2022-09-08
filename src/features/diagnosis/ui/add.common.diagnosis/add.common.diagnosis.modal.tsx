import React, { ChangeEvent, Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import moment from 'moment';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useGetSet } from 'react-use';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';
import { ClipboardListIcon, PlusIcon, XIcon, SortDescendingIcon, SearchIcon, ViewListIcon } from '@heroicons/react/outline';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import Table from 'shared/ui/table';
import Popper from 'shared/ui/popper/popper';
import { ICreateDiagnosis, ISearchDiagnosis } from 'shared/api/diagnosis';
import Modal, { IModalProps } from 'shared/ui/modal';

import { diagnosisStore } from '../../model';
import { OEncounterStatus } from '../../lib/model';
import EditDiagnosisModal from '../edit.diagnosis';
import Alert from 'shared/ui/alert';

interface IAddCommonDiagnosisProps extends IModalProps {
  setIsAddDiagnosisFlag: Dispatch<SetStateAction<boolean>>;
}

const DiagnosisSheet: FC<any> = observer((props) => {
  const intl = useIntl();
  const { data, setIsAddDiagnosisFlag, toggleIsOpenAddPatient } = props;
  const { notify } = useNotifier();

  const columns = [
    {
      Header: `${intl.formatMessage({ id: 'measures.results' })}(${data.length})`,
      id: 'results',
      accessor: 'results',
      // @ts-ignore
      // eslint-disable-next-line react/display-name
      Cell: observer(({ row: { original } }) => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return original.conceptId;
      }),
      classes: {
        header: 'sheet-table_header __name text-blue-600',
        cell: 'sheet-table_cell __text',
      },
    },
    {
      id: 'description',
      accessor: 'description',
      // @ts-ignore
      // eslint-disable-next-line react/display-name
      Cell: observer(({ row: { original } }) => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return original.long ?? original.name;
      }),
      classes: {
        header: 'sheet-table_header __name',
        cell: 'sheet-table_cell __text',
      },
    },
    {
      id: 'buttons',
      accessor: 'buttons',
      // @ts-ignore
      // eslint-disable-next-line react/display-name
      Cell: observer(({ row: { original } }) => {
        const { codingSystem, conceptId, name, long } = original as ISearchDiagnosis;
        const request: ICreateDiagnosis = {
          archive: false,
          isCondition: false,
          codingSystem: codingSystem || 3,
          conceptId,
          name: name || long,
          startDate: moment().toDate(),
        };
        const handleAddDiagnosis = async () => {
          // NoEncounter means that we don't have encounter and we need create it in addDiagnosis
          if (diagnosisStore.encountertStatus.currentPatient === OEncounterStatus.NoEncounter) {
            await diagnosisStore.addDiagnosis(request, true, false);
          } else {
            await diagnosisStore.addDiagnosis(request, false, false);
          }
          setIsAddDiagnosisFlag((prevData) => !prevData);
          notify(
            <Alert.Notification
              actions={(close) => (
                <Button variant="flat" onClick={() => close()}>
                  {intl.formatMessage({ id: 'measures.ok' })}
                </Button>
              )}
            >
              {intl.formatMessage({ id: 'diagnosis.measures.added' })}
            </Alert.Notification>
          );
        };

        const handleOpenEditDiagnosis = () => {
          toggleIsOpenAddPatient(true);
          diagnosisStore.updateCurrentEditDiagnosis(request);
        };
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (
          <div className="flex gap-4">
            <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.add' })}>
              <Button onClick={handleAddDiagnosis} variant="filled" shape="circle" color="green">
                <PlusIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
            <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.addAndEdit' })}>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */}
              <Button onClick={handleOpenEditDiagnosis} variant="filled" shape="circle" color="blue">
                <ClipboardListIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );
      }),
      classes: {
        header: 'sheet-table_header __name',
        cell: 'sheet-table_cell __text',
      },
    },
  ];

  return (
    <Table
      classes={{
        root: 'sheet',
        container: 'sheet_container',
        table: 'sheet-table',
        thead: 'sheet-table_thead',
        row: 'sheet-table_row',
        column: 'sheet-table_column',
        columnSorted: '__sorted',
        pagination: 'sheet-pagination',
      }}
      columns={columns}
      data={data}
      pagination={null}
      sortable
    />
  );
});
DiagnosisSheet.displayName = 'DiagnosisSheet';

const AddCommonDiagnosisModal: FC<Pick<IAddCommonDiagnosisProps, 'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'setIsAddDiagnosisFlag'>> = observer(
  ({ open, unmount, hideBackdrop, onClose, setIsAddDiagnosisFlag }) => {
    const commonDiagnosis = toJS(diagnosisStore.commonDiagnosisList);
    const searchedDiagnosisList = toJS(diagnosisStore.searchedDiagnosisList);

    const [codes, setCodes] = useState<string>('icd10');
    const [isGroups, setIsGroups] = useState<boolean>(false);
    const [isCodes, setIsCodes] = useState<boolean>(true);
    const intl = useIntl();

    const [isOpenEditDiagnosis, setIsOpenEditDiagnosis] = useGetSet<boolean>(false);
    const toggleIsOpenAddPatient = (state?: boolean) => {
      const currentState = isOpenEditDiagnosis();
      setIsOpenEditDiagnosis(state ?? !currentState);
    };

    const handleClose = () => {
      if (onClose) {
        onClose(false);
      }
      diagnosisStore.clearSearchDiagnosis();
    };

    const [isOpenPopper, setIsOpenPopper] = useState<boolean>(false);
    const handleOpenPopper = (value: boolean) => {
      setIsOpenPopper(value);
    };

    const [search, setSearch] = useState<string>('');
    const handleChangeSearchName = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    };

    const handleSearch = async () => {
      await diagnosisStore.searchDiagnosis(search, isGroups, isCodes, 100, codes);
    };

    const handleSetCommonDiagnosis = async () => {
      await diagnosisStore.searchDiagnosis('', false, false, 0, 'common');
    };

    useEffect(() => {
      if (codes === 'icd9') {
        setIsGroups(false);
      }
    }, [codes]);

    const isSearchedDisabled = Boolean(search) && Boolean(codes) && (isCodes || isGroups);

    return (
      <Modal as="div" className="sm:!max-w-[80vw]" unmount={unmount} hideBackdrop={hideBackdrop} onClose={isOpenPopper ? () => {} : onClose} open={open}>
        <Modal.Header>
          <Modal.Title className="text-white">{intl.formatMessage({ id: 'diagnosis.measures.add' })}</Modal.Title>
          <Button onClick={handleClose}>
            <XIcon className="w-5 h-5 color-white" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="flex gap-4 items-center">
            <input
              className="form-input placeholder-search sm:text-lg"
              placeholder={intl.formatMessage({ id: 'diagnosis.measures.findProblem' })}
              autoComplete="off"
              onChange={handleChangeSearchName}
              value={search}
            />
            <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.searchPatient' })}>
              <Button onClick={handleSearch} disabled={!isSearchedDisabled} color="blue">
                <SearchIcon className="w-6 h-6" />
                <span className="sr-only lg:not-sr-only">{intl.formatMessage({ id: 'measures.search' })}</span>
              </Button>
            </Tooltip>
            <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.searchPatient' })}>
              <Button onClick={handleSetCommonDiagnosis} color="blue">
                <ViewListIcon className="w-6 h-6" />
                <span className="sr-only lg:not-sr-only">{intl.formatMessage({ id: 'measures.common' })}</span>
              </Button>
            </Tooltip>
            <Popper
              open={isOpenPopper}
              onOpen={() => handleOpenPopper(true)}
              onClose={() => handleOpenPopper(false)}
              content={
                <>
                  <Popper.Listbox>
                    <>
                      <Popper.ListboxItem as="label" className="uppercase">
                        <input type="checkbox" checked={codes === 'icd10'} onChange={() => setCodes('icd10')} className="form-checkbox m-0 mr-4" />
                        {intl.formatMessage({ id: 'diagnosis.measures.icd10' })}
                      </Popper.ListboxItem>
                      <Popper.ListboxItem as="label" className="uppercase">
                        <input onChange={() => setCodes('icd9')} className="form-checkbox m-0 mr-4" type="checkbox" checked={codes === 'icd9'} />
                        {intl.formatMessage({ id: 'diagnosis.measures.icd9' })}
                      </Popper.ListboxItem>
                      <Popper.ListboxItem as="label" className="uppercase">
                        <input onChange={() => setCodes('snomed')} className="form-checkbox m-0 mr-4" type="checkbox" checked={codes === 'snomed'} />
                        {intl.formatMessage({ id: 'diagnosis.measures.snomed' })}
                      </Popper.ListboxItem>
                    </>
                    <>
                      <Popper.ListboxItem disabled={codes === 'icd9'} as="label">
                        <input
                          disabled={codes === 'icd9'}
                          onChange={(e) => setIsGroups(e.target.checked)}
                          className="form-checkbox m-0 mr-4"
                          type="checkbox"
                          checked={isGroups}
                        />
                        {intl.formatMessage({ id: 'diagnosis.measures.groups' })}
                      </Popper.ListboxItem>
                      <Popper.ListboxItem as="label">
                        <input onChange={(e) => setIsCodes(e.target.checked)} className="form-checkbox m-0 mr-4" type="checkbox" checked={isCodes} />
                        {intl.formatMessage({ id: 'diagnosis.measures.codes' })}
                      </Popper.ListboxItem>
                    </>
                  </Popper.Listbox>
                </>
              }
            >
              <Button color="white">
                <SortDescendingIcon className="w-6 h-6 color-blue-600" />
              </Button>
            </Popper>
            <span>{intl.formatMessage({ id: 'diagnosis.measures.searchCriteria' })}</span>
            <div className="flex border-b-2 pb-1 gap-2 px-1">
              <div className="flex items-center justify-center bg-gray-300 rounded-2xl py-1 px-3 uppercase">{codes}</div>
              {isGroups && (
                <div className="flex items-center justify-center bg-gray-300 rounded-2xl py-1 px-3">
                  {intl.formatMessage({ id: 'diagnosis.measures.groups' })}
                </div>
              )}
              {isCodes && (
                <div className="flex items-center justify-center bg-gray-300 rounded-2xl py-1 px-3">
                  {intl.formatMessage({ id: 'diagnosis.measures.codes' })}
                </div>
              )}
            </div>
          </div>
          <DiagnosisSheet
            data={searchedDiagnosisList.length ? searchedDiagnosisList : commonDiagnosis}
            setIsAddDiagnosisFlag={setIsAddDiagnosisFlag}
            toggleIsOpenAddPatient={toggleIsOpenAddPatient}
          />
          <EditDiagnosisModal
            setIsAddDiagnosisFlag={setIsAddDiagnosisFlag}
            onClose={toggleIsOpenAddPatient}
            open={isOpenEditDiagnosis()}
            hideBackdrop={false}
            unmount
            editable={false}
          />
        </Modal.Body>
      </Modal>
    );
  }
);
AddCommonDiagnosisModal.displayName = 'AddCommonDiagnosisModal';

export default AddCommonDiagnosisModal;
