import React, { FC, Key, useState, useRef, useEffect, MutableRefObject, useMemo } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import Tabs from 'shared/ui/tabs';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';
import { observer } from 'mobx-react-lite';
import { IProvider, IPhysicianMeasure, IHospitalMeasure } from 'shared/api/report';
import { CheckIcon, MenuIcon, DownloadIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationIcon } from '@heroicons/react/outline';
import { map } from 'lodash';
import Table, { Column } from 'shared/ui/table';
import { toJS } from 'mobx';
import Tooltip from 'shared/ui/tooltip';
import { userModel } from 'features/user';
import { useStateRef } from 'shared/hooks';
import moment from 'moment';
import { reportsStore } from '../model';
import { ReportsAutoMeasureHospital, ReportsAutoMeasurePhysician } from './reports.automated.measure';
import { useBreakpoints } from 'shared/lib/media.breakpoints';

interface IMeasureView {
  onClose?: (value: boolean) => void;
  open: boolean;
}

const ReportsAutoMeasureView: FC<IMeasureView> = observer(({ open, onClose }) => {
  const breakpoints = useBreakpoints();

  const [active, setActive] = useState<Key>('EP');
  const [expEP, setExpEP] = useState({});
  const [practice, setPractice] = useState<number | any>();
  const [doctor, setDoctor] = useState<number | any>();

  const [date, setDate] = useState<any[]>([]);
  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLElement>>(null);
  const intl = useIntl();

  const physicians = toJS(reportsStore.physiciansList);
  const hospitals = toJS(reportsStore.hospitalsList);

  useEffect(() => {
    const newDate = moment().format();
    setDate([newDate, newDate]);
  }, []);

  const fetchUser = async () => {
    try {
      await userModel.fetch();
    } catch {}
  };
  useEffect(() => {
    if (userModel?.data?.practices?.length === 0) {
      fetchUser();
    }
    const practiceID = userModel?.data?.currentPractice?.id;
    setPractice(practiceID);
  }, []);

  const handleChange = (data: Key) => {
    setActive(data);
  };
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const getEPData = (data) => {
    setExpEP(data);
  };
  const changePractice = (data) => {
    setPractice(data);
  };
  const changeDoctor = (data) => {
    setDoctor(data);
  };
  const changeDate = (data) => {
    setDate(data);
  };

  const exportPhysicians = async (data) => {
    // const title = data === 'CPOE - Medication' ? 'cpoe' : 'eprescribing';
    // const request = `${title}?doctorId=${expEP?.doctorId}&endDate=${expEP?.endDate}&startDate=${expEP?.startDate}`;
    // try {
    //   await reportsStore.exportPhysicians(request, expEP);
    // } catch {}
  };

  const columns = useMemo<Array<Column<IPhysicianMeasure | IHospitalMeasure>>>(
    () => [
      {
        Header: intl.formatMessage({ id: 'measures.title' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => (
          <div>
            <p> {original.title} </p> <p> {original.stage} </p>
          </div>
        ),
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.eligible' }),
        accessor: 'patients',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          if (original.patients) {
            return (
              <div className="flex items-center">
                {original.patients}
                {original.patients > 0 && (
                  <Tooltip content={intl.formatMessage({ id: 'messages.export' })} className="uppercase">
                    <Button color="gray" variant="flat" shape="circle" className="ml-3" onClick={() => exportPhysicians(original.title)}>
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            );
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
        Header: intl.formatMessage({ id: 'measures.numerator' }),
        accessor: 'numerator',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.denominator' }),
        accessor: 'denominator',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.goal' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => <p> {original.goal} %</p>,
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
      {
        Header: intl.formatMessage({ id: 'measures.status' }),
        accessor: 'status',
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex">
              {original.status === 'Success' ? (
                <CheckIcon className="bg-green-400 text-white w-6 h-6 mr-2" />
              ) : (
                <ExclamationCircleIcon className="bg-red-400 text-white w-6 h-6 mr-2" />
              )}
              {original.status}
            </div>
          );
        },
        classes: {
          header: `sheet-table_header __name break-words`,
          cell: `sheet-table_cell __text break-words`,
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'measures.percentage' }),
        // eslint-disable-next-line react/display-name
        Cell: ({ row: { original } }) => <p> {original.percentage} %</p>,
        classes: {
          header: 'sheet-table_header __name',
          cell: 'sheet-table_cell __text',
        },
      },
    ],
    [intl]
  );

  const MeasureTable = (
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
      data={active === 'EP' ? [...physicians] : [...hospitals]}
      sortable
    />
  );

  const tabsFilter = (
    <div className="m-2">
      <Tabs selectedKey={active} onSelectionChange={handleChange}>
        <Tabs.TabList>
          <Tabs.Item key="EP">
            <p className="uppercase">{intl.formatMessage({ id: `reports.measures.physician` })}</p>
          </Tabs.Item>
          <Tabs.Item key="EH">
            <p className="uppercase">{intl.formatMessage({ id: `reports.measures.hospital` })}</p>
          </Tabs.Item>
        </Tabs.TabList>

        <Tabs.TabPanels keep>
          <Tabs.Item key="EP">
            <ReportsAutoMeasurePhysician
              innerRef={innerRef}
              getEPData={getEPData}
              practice={practice}
              changeDoctor={changeDoctor}
              date={date}
              changeDate={changeDate}
            />
          </Tabs.Item>
          <Tabs.Item key="EH">
            <ReportsAutoMeasureHospital innerRef={innerRef} doctor={doctor} changePractice={changePractice} date={date} changeDate={changeDate} />
          </Tabs.Item>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  );

  const infoBlock = (
    <div className="flex items-center mt-2 text-gray-300 bg-white drop-shadow-md">
      <ExclamationIcon className="h-28 w-28 mx-8 my-4" />
      <p className="capitalize text-3xl">{intl.formatMessage({ id: 'measures.noResults' })}</p>
    </div>
  );

  return (
    <Modal innerRef={setInnerRef} open={open} onClose={onClose} className="xs:max-md md:max-w-2xl lg:max-w-6xl">
      <Modal.Header as="h5" className="text-xl text-white">
        <div className="flex items-center">
          {!breakpoints.md && (
            <Dropdown ref={innerRef} list={[tabsFilter]} placement="bottom-start">
              <Tooltip content={intl.formatMessage({ id: 'reports.measures.measureMenu' })}>
                <Button shape="circle">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </Tooltip>
            </Dropdown>
          )}
          <span>{intl.formatMessage({ id: 'reports.measures.automatedMeasure' })}</span>
        </div>
      </Modal.Header>

      <Modal.Body ref={innerRef}>
        <div>
          <div className="flex items-start justify-start">
            {breakpoints.md && tabsFilter}
            <div className="flex flex-col justify-center">
              <div className="text-lg bg-blue-500 text-white m-5 p-5 w-full">{intl.formatMessage({ id: 'measures.results' })}</div>
              {active === 'EP' && physicians?.length !== 0 && MeasureTable}
              {active === 'EH' && hospitals?.length !== 0 && MeasureTable}
              {physicians?.length !== 0 || hospitals?.length !== 0 ? '' : infoBlock}
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="lg" className="uppercase m-3" shape="round" type="button" onClick={handleClose}>
              {intl.formatMessage({ id: 'measures.close' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

ReportsAutoMeasureView.displayName = 'ReportsAutoMeasureView';
export default ReportsAutoMeasureView;
