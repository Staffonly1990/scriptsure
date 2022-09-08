import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { useGetSet } from 'react-use';
import Button from 'shared/ui/button/button';
import Tooltip from 'shared/ui/tooltip/tooltip';
import Dropdown from 'shared/ui/dropdown';
import { ClockIcon, DocumentDownloadIcon, ExclamationIcon } from '@heroicons/react/outline';
import { IVitals } from 'shared/api/vital';
import Table, { Column } from 'shared/ui/table';
import MaskFormat from 'shared/ui/mask.format';
import { VitalStore, AddVitalModal, AddVitalModalArchive } from 'features/vital';
import { useRouter } from 'shared/hooks';
import { toJS } from 'mobx';
import { useIntl } from 'react-intl';

/**
 * @view ChartVitals
 */

interface IVitalsArchived {
  vitalId: string;
  loinc: string;
  archive: boolean;
}

const ChartVitalsView: FC = () => {
  const {
    match: { url },
    query: { patientId },
  } = useRouter<{ patientId: string | number }>();
  const [vitalList, setVitalList] = useState(toJS(VitalStore.list));
  const [isOpenAddVital, setIsOpenAddVital] = useGetSet<boolean>(false);
  const [isAddVitalsFlag, setIsAddVitalsFlag] = useState<boolean>(false);
  const [isOpenArchiveVital, setIsOpenArchiveVital] = useGetSet<boolean>(false);
  const [isArchived, setIsArchived] = useState<IVitalsArchived | any>();
  const intl = useIntl();
  const vitalVariants = ['all', 'current', 'archived'];
  const toggleIsOpenAddVital = (state?: boolean) => {
    const currentState = isOpenAddVital();
    setIsOpenAddVital(state ?? !currentState);
  };
  const toggleIsOpenArchiveVital = (state?: boolean) => {
    const currentState = isOpenArchiveVital();
    setIsOpenArchiveVital(state ?? !currentState);
  };
  const [checkedVar, setCheckedVar] = useState('current');

  const translates = {
    'Body Mass Index': intl.formatMessage({
      id: 'vital.measures.bmi.detail',
    }),
    'Oxygen Saturation': intl.formatMessage({
      id: 'vital.measures.oxygen.saturation',
    }),
    'Weight': intl.formatMessage({
      id: 'vital.measures.weight.weight',
    }),
    'Blood Pressure': intl.formatMessage({
      id: 'vital.measures.pressure.blood',
    }),
    'Pain Level': intl.formatMessage({
      id: 'vital.measures.pain.level',
    }),
    'Height': intl.formatMessage({
      id: 'vital.measures.height.height',
    }),
    'Temperature': intl.formatMessage({
      id: 'vital.measures.temperature.temp',
    }),
    'Heart Rate': intl.formatMessage({
      id: 'vital.measures.heart.rate',
    }),
    'Respiratory Rate': intl.formatMessage({
      id: 'vital.measures.respiratory.rate',
    }),
  };

  useEffect(() => {
    async function fetchMyAPI() {
      await VitalStore.getAllVitals(patientId, checkedVar);
      await setVitalList(toJS(VitalStore.list));
    }

    fetchMyAPI();
  }, []);
  const changeVariant = useCallback(
    async (variant) => {
      setCheckedVar(variant);
      try {
        await VitalStore.getAllVitals(patientId, variant);
        await setVitalList(toJS(VitalStore.list));
      } catch {}
    },
    [checkedVar]
  );
  useEffect(() => {
    changeVariant('current');
  }, [isAddVitalsFlag]);
  const measureValue = (measure) => {
    switch (measure) {
      case '[in_i]':
        return intl.formatMessage({ id: 'vital.measure.height.P[in_i]' });
        break;
      case 'inches':
        return intl.formatMessage({ id: 'vital.measure.height.P[in_i]' });
        break;
      case 'kg':
        return intl.formatMessage({ id: 'vital.measure.weight.Pkg' });
        break;
      case 'cm':
        return intl.formatMessage({ id: 'vital.measure.height.Pcm' });
        break;
      case '[lb_av]':
        return intl.formatMessage({ id: 'vital.measure.weight.P[lb_av]' });
        break;
      case 'lb':
        return intl.formatMessage({ id: 'vital.measure.weight.P[lb_av]' });
        break;
      case '[degF]':
        return intl.formatMessage({ id: 'vital.measures.temperature.[degF]' });
        break;
      case 'Cel':
        return intl.formatMessage({ id: 'vital.measures.temperature.Cel' });
        break;

      default:
        return '';
    }
  };
  const columns = useMemo<Array<Column<IVitals>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'measures.dateAdded' }),
        accessor: 'createdAt',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <MaskFormat textContent={original?.createdAt} options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd', outputFormat: 'mm/dd/yyyy' }} unmasked />
        ),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.title' }),
        accessor: (item) => {
          if (item?.name) {
            if (translates[item?.name]) {
              return translates[item?.name];
            }

            return item.name;
          }

          return '';
        },
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'vital.measures.measurement' }),
        accessor: 'measurementValue',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <p>
            {original.measurementValue} {measureValue(original.unitOfMeasure)}
          </p>
        ),
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        accessor: 'archive',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (original.archive ? 'Archive' : 'Current'),
        classes: {
          header: `sheet-table_header __name break-words`,
          cell: `sheet-table_cell __text break-words`,
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'vital.measures.providedBy' }),
        id: 'doctorName',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          const doctorName = original.PatientVitalHeader.map((item) => item.doctorName);
          return <p>{doctorName}</p>;
        },
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        id: 'actions',
        disableSortBy: true,
        // eslint-disable-next-line react/display-name
        Header: () => {
          return <span className="sr-only">{intl.formatMessage({ id: 'measures.archived' })}</span>;
        },
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          if (original.archive === false) {
            return (
              <Tooltip content={intl.formatMessage({ id: 'measures.archive' })}>
                <Button
                  shape="circle"
                  color="white"
                  onClick={() => {
                    toggleIsOpenArchiveVital(true);
                    setIsArchived({ vitalId: original.vitalId, loinc: original.loinc, archive: true });
                  }}
                >
                  <DocumentDownloadIcon className="w-6 h-6 !text-blue-500" />
                </Button>
              </Tooltip>
            );
          }
          return '';
        },
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
      },
    ],
    [intl]
  );

  const VitalsTable =
    vitalList.length > 0 ? (
      <Table
        classes={{
          root: 'sheet __border',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        columns={columns}
        hiddenColumns={checkedVar === 'current' || checkedVar === 'archived' ? ['archive'] : ['']}
        data={[...vitalList]}
        sortable
      />
    ) : (
      <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
        <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
        <p className="capitalize text-3xl">
          {intl.formatMessage({
            id: 'vital.measures.noHistory',
          })}
        </p>
      </div>
    );

  const vitalsActions = [
    vitalVariants.map((variant) => {
      return (
        <Dropdown.Item className={`uppercase ${variant === checkedVar ? '!text-blue-500' : ''}`} onClick={() => changeVariant(variant)}>
          {intl.formatMessage({ id: `measures.${variant}` })}
        </Dropdown.Item>
      );
    }),
  ];
  return (
    <div className="flex flex-col m-4">
      <div className="flex items-center justify-start">
        <span className="text-xl m-2 capitalize">
          {intl.formatMessage({ id: `measures.${checkedVar}` })} {intl.formatMessage({ id: 'measures.vitals' })}
        </span>
        <Dropdown list={vitalsActions} className="m-2" placement="bottom-start">
          <Tooltip content={intl.formatMessage({ id: 'measures.actions' })}>
            <Button shape="circle">
              <ClockIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </Dropdown>
        <Button className="uppercase m-2" color="green" shape="smooth" onClick={() => toggleIsOpenAddVital(true)}>
          {intl.formatMessage({
            id: 'vital.measures.addVital',
          })}
        </Button>
      </div>
      {VitalsTable}
      <AddVitalModal open={isOpenAddVital()} onClose={toggleIsOpenAddVital} setIsAddVitalsFlag={setIsAddVitalsFlag} patientID={patientId} />
      <AddVitalModalArchive open={isOpenArchiveVital()} isArchived={isArchived} onClose={toggleIsOpenArchiveVital} setIsAddVitalsFlag={setIsAddVitalsFlag} />
    </div>
  );
};

ChartVitalsView.displayName = 'ChartVitalsView';
export default ChartVitalsView;
