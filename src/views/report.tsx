import React, { FC, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Button from 'shared/ui/button/button';
import { ClipboardListIcon, DocumentDuplicateIcon, TableIcon, InformationCircleIcon, DotsVerticalIcon, MenuIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { ReportsViews, ReportsAutoMeasureView, reportsStore, ReportsAuditLogView, ReportsDocuments } from 'features/report';
import Dropdown from 'shared/ui/dropdown';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Tooltip from 'shared/ui/tooltip';
import { useGetSet } from 'react-use';
/**
 * @view Report
 */

const ReportView: FC = observer(() => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const [checkedItem, setCheckedItem] = useState('');
  const [isOpenMeasure, setIsOpenMeasure] = useGetSet<boolean>(false);
  const [isOpenAudit, setIsOpenAudit] = useGetSet<boolean>(false);
  const [isOpenDocuments, setIsOpenDocuments] = useGetSet<boolean>(false);

  useEffect(() => {
    async function fetchAPI() {
      try {
        await reportsStore.getAllProviders();
      } catch {}
    }
    fetchAPI();
  }, []);

  const toggleIsOpenMeasure = (state?: boolean) => {
    const currentState = isOpenMeasure();
    setIsOpenMeasure(state ?? !currentState);
  };
  const toggleIsOpenAudit = (state?: boolean) => {
    const currentState = isOpenAudit();
    setIsOpenAudit(state ?? !currentState);
  };
  const toggleIsOpenDocuments = (state?: boolean) => {
    const currentState = isOpenDocuments();
    setIsOpenDocuments(state ?? !currentState);
  };
  const views = [
    intl.formatMessage({ id: 'reports.measures.auditLog' }),
    intl.formatMessage({ id: 'reports.measures.medicationUsers' }),
    intl.formatMessage({ id: 'reports.measures.operationalRecord' }),
    intl.formatMessage({ id: 'reports.measures.patientList' }),
    intl.formatMessage({ id: 'reports.measures.patientVisits' }),
    intl.formatMessage({ id: 'reports.measures.prescriptionLogs' }),
    intl.formatMessage({ id: 'reports.measures.logsPrescriber' }),
    intl.formatMessage({ id: 'reports.measures.userSubstance' }),
  ];
  const buttonGroups = (
    <>
      <Tooltip content={intl.formatMessage({ id: 'reports.measures.automatedMeasure' })}>
        <Button className="uppercase p-4" shape="round" onClick={() => toggleIsOpenMeasure(true)}>
          <TableIcon className="w-6 h-6" />
          <span className="xs:hidden lg:inline">{intl.formatMessage({ id: 'reports.measures.automatedMeasure' })}</span>
        </Button>
      </Tooltip>
      <Tooltip content={intl.formatMessage({ id: 'reports.measures.auditLog' })}>
        <Button className="uppercase p-4" shape="round" onClick={() => toggleIsOpenAudit(true)}>
          <ClipboardListIcon className="w-6 h-6" />
          <span className="xs:hidden lg:inline">{intl.formatMessage({ id: 'reports.measures.auditLog' })}</span>
        </Button>
      </Tooltip>
      <Tooltip content={intl.formatMessage({ id: 'reports.measures.documents' })}>
        <Button className="uppercase p-4" shape="round" onClick={() => toggleIsOpenDocuments(true)}>
          <DocumentDuplicateIcon className="w-6 h-6" />
          <span className="xs:hidden lg:inline">{intl.formatMessage({ id: 'reports.measures.documents' })}</span>
        </Button>
      </Tooltip>
    </>
  );
  return (
    <div className="mt-4 mx-2">
      <div className="flex justify-between items-center bg-blue-500 text-white text-2xl dark:bg-blue-400">
        <div className="text-xl p-5">
          <span>{intl.formatMessage({ id: 'reports.measures.report' })}</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="capitalize text-sm lg:text-lg mr-10">{checkedItem}</div>
          <div>
            {breakpoints.md && buttonGroups}
            {!breakpoints.lg && (
              <Dropdown
                list={[
                  views.map((item, index) => (
                    <Dropdown.Item key={index.toString(36)} className="capitalize p-2" onClick={() => setCheckedItem(item)}>
                      {item}
                    </Dropdown.Item>
                  )),
                ]}
                placement="bottom-end"
              >
                <Tooltip content={intl.formatMessage({ id: 'reports.measures.reportMenu' })}>
                  <Button shape="circle">
                    <MenuIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
              </Dropdown>
            )}
            {!breakpoints.md && (
              <Dropdown
                list={[
                  <Dropdown.Item onClick={() => toggleIsOpenMeasure(true)}>
                    <TableIcon className="w-6 h-6 mr-1" onClick={() => toggleIsOpenMeasure(true)} />
                    {intl.formatMessage({ id: 'reports.measures.automatedMeasure' })}
                  </Dropdown.Item>,
                  <Dropdown.Item onClick={() => toggleIsOpenAudit(true)}>
                    <ClipboardListIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'reports.measures.auditLog' })}
                  </Dropdown.Item>,
                  <Dropdown.Item onClick={() => toggleIsOpenDocuments(true)}>
                    <DocumentDuplicateIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'reports.measures.documents' })}
                  </Dropdown.Item>,
                ]}
                placement="bottom-end"
              >
                <Button variant="flat" shape="circle" color="white" size="xs">
                  <DotsVerticalIcon className="w-6 h-6" />
                </Button>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {breakpoints.lg && (
          <div className="shadow-lg w-96">
            <div className="flex flex-col justify-start h-screen overflow-y-auto overflow-x-hidden mt-3">
              {views.map((item, index) => (
                <Button color="gray" variant="flat" key={index.toString(36)} size="lg" className="capitalize p-2" onClick={() => setCheckedItem(item)}>
                  {item}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="w-full lg:max-w-3/4">
          <div className="my-3 mx-5">
            <ReportsViews checkedItem={checkedItem} />
          </div>
          <div className="shadow-lg p-4 m-3">
            <p className="text-2xl">{intl.formatMessage({ id: 'reports.measures.reports' })}</p>
            <div className="flex flex-col items-center">
              <InformationCircleIcon className="w-16 h-16" />
              {intl.formatMessage({ id: 'reports.measures.chooseReport' })}
            </div>
          </div>
        </div>
      </div>
      <ReportsAutoMeasureView open={isOpenMeasure()} onClose={toggleIsOpenMeasure} />
      <ReportsAuditLogView open={isOpenAudit()} onClose={toggleIsOpenAudit} />
      <ReportsDocuments open={isOpenDocuments()} onClose={toggleIsOpenDocuments} />
    </div>
  );
});

ReportView.displayName = 'ReportView';

export default ReportView;
