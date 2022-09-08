import React, { Dispatch, FC, SetStateAction } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';
import { ArchiveIcon, InformationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { DotsVerticalIcon } from '@heroicons/react/solid';

import { diagnosisStore } from '../model';
import Alert from 'shared/ui/alert';
import Tooltip from 'shared/ui/tooltip';
import Table from 'shared/ui/table';
import Button from 'shared/ui/button';
import { IPatientEncounter } from 'shared/api/diagnosis';
import Dropdown from 'shared/ui/dropdown/dropdown';

interface IDiagnosisInformation {
  patientId?: number;
  encounterId?: number;
  conceptId?: string;
  codingSystem?: number;
}

interface IDiagnosisSheet {
  data: IPatientEncounter[];
  isEncounter: boolean;
  toggleMedlineInformation: (data: boolean) => void;
  toggleNotificationModal: (data: boolean) => void;
  toggleEditDiagnosis: (data: boolean) => void;
  setDiagnosisInformation: Dispatch<SetStateAction<IDiagnosisInformation>>;
  setIsDelete: Dispatch<SetStateAction<boolean>>;
}

const DiagnosisSheet: FC<IDiagnosisSheet> = observer((props) => {
  const intl = useIntl();
  const { notify } = useNotifier();
  const { data, isEncounter, toggleEditDiagnosis, toggleNotificationModal, setDiagnosisInformation, toggleMedlineInformation, setIsDelete } = props;
  const columns = [
    {
      Header: intl.formatMessage({ id: 'measures.date' }),
      id: 'date',
      accessor: 'date',
      // @ts-ignore
      // eslint-disable-next-line react/display-name
      Cell: observer(({ row: { original } }) => {
        const date = moment(original?.createdAt).format('MM/DD/YYYY');
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return date;
      }),
      classes: {
        header: 'sheet-table_header __name',
        cell: 'sheet-table_cell __text',
      },
    },
    {
      Header: intl.formatMessage({ id: 'measures.description' }),
      id: 'description',
      accessor: 'description',
      // @ts-ignore
      // eslint-disable-next-line react/display-name
      Cell: observer(({ row: { original } }) => {
        const description = `${original.conceptId} ${original.name}`;
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (
          <div className="flex items-center gap-2">
            {original.archive && (
              <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.archive' })}>
                <div className="bg-red-500 !min-w-[2rem] !min-h-[2rem] rounded-full	flex items-center justify-center">
                  <ArchiveIcon className="w-5 h-5 text-white" />
                </div>
              </Tooltip>
            )}
            {description}
          </div>
        );
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
        const { codingSystem, conceptId, name, id, patientId, encounterId } = original;
        const type = codingSystem === 3 ? 'snomed' : 'icd-10';

        const handleOpenMedline = async () => {
          const request = {
            problemCodingSystem: type,
            problemCode: conceptId,
            problemName: name,
            languageCode: 'en',
          };
          await diagnosisStore.getMedlineInformation(request);
          toggleMedlineInformation(true);
        };

        const handleArchiveDiagnosis = async () => {
          await diagnosisStore.setArchiveDiagnosis(id);
          notify(
            <Alert.Notification
              actions={(close) => (
                <Button variant="flat" onClick={() => close()}>
                  {intl.formatMessage({ id: 'measures.ok' })}
                </Button>
              )}
            >
              {intl.formatMessage({ id: 'diagnosis.measures.archive' })}
            </Alert.Notification>
          );
        };

        const handleDelete = () => {
          toggleNotificationModal(true);
          const payload = {
            patientId,
            encounterId,
            conceptId,
            codingSystem,
          };
          setDiagnosisInformation(payload);
          setIsDelete(true);
        };

        const handleEdit = () => {
          diagnosisStore.setCurrentEditable(original);
          toggleEditDiagnosis(true);
        };

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return !original.archive ? (
          <>
            <div className="lg:hidden">
              <Dropdown
                list={[
                  <Dropdown.Item onClick={handleOpenMedline}>{intl.formatMessage({ id: 'diagnosis.measures.medlineInfo' })}</Dropdown.Item>,
                  <Dropdown.Item onClick={handleEdit}>{intl.formatMessage({ id: 'diagnosis.measures.edit' })}</Dropdown.Item>,
                  isEncounter ? (
                    <Dropdown.Item onClick={handleDelete}>{intl.formatMessage({ id: 'measures.delete' })}</Dropdown.Item>
                  ) : (
                    <Dropdown.Item onClick={handleArchiveDiagnosis}>{intl.formatMessage({ id: 'diagnosis.measures.archiveDiagnos' })}</Dropdown.Item>
                  ),
                ]}
              >
                <Button variant="flat" shape="circle" color="black" size="xs">
                  <DotsVerticalIcon className="w-4 h-4" />
                </Button>
              </Dropdown>
            </div>
            <div className="flex justify-end gap-5 hidden lg:flex">
              <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.medlineInfo' })}>
                <Button onClick={handleOpenMedline} variant="filled" shape="circle" color="blue">
                  <InformationCircleIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
              <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.edit' })}>
                <Button onClick={handleEdit} variant="filled" shape="circle" color="blue">
                  <PencilIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
              {isEncounter ? (
                <Tooltip content={intl.formatMessage({ id: 'measures.delete' })}>
                  <Button onClick={handleDelete} variant="filled" shape="circle" color="blue">
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip content={intl.formatMessage({ id: 'diagnosis.measures.archiveDiagnos' })}>
                  <Button onClick={handleArchiveDiagnosis} variant="filled" shape="circle" color="blue">
                    <ArchiveIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              )}
            </div>
          </>
        ) : null;
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

export default DiagnosisSheet;
