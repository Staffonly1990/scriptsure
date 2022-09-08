import React, { FC, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { useStateRef } from 'shared/hooks';
import { ReportsDocumentsFilter } from './reports.documents';
import { reportsStore } from '../model';
import Button from 'shared/ui/button';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Tooltip from 'shared/ui/tooltip';
import { MenuIcon } from '@heroicons/react/outline';
import Dropdown from 'shared/ui/dropdown/dropdown';
import { currentPracticeStore } from 'features/practice';
import { userModel } from 'features/user';
import { patientModel } from 'features/patient';
import { getDoctorsPractice } from 'shared/api/practice';
import { toJS } from 'mobx';

interface IDocuments {
  onClose?: (value: boolean) => void;
  open: boolean;
}

const ReportsDocumentsView: FC<IDocuments> = observer(({ open, onClose }) => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLElement>>(null);
  useEffect(() => {
    async function getPractices() {
      try {
        await userModel.fetch();
      } catch {}
    }
    if (userModel.data?.practices !== null) return;
    getPractices();
  }, []);
  useEffect(() => {
    async function getDoctors() {
      await await userModel.fetch();
      const userData = toJS(userModel?.data?.currentPractice?.id);
      if (userData) {
        await patientModel.getPracticalDoctors(userData);
      }
    }
    if (patientModel?.doctorsPractice.length !== 0) return;
    getDoctors();
  }, []);
  useEffect(() => {
    async function documentTypes() {
      try {
        await reportsStore.getAllDocumentTypes();
      } catch {}
    }
    if (reportsStore.documentTypes.length !== 0) return;
    documentTypes();
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };

  return (
    <Modal innerRef={setInnerRef} open={open} onClose={onClose} className="xs:max-md md:max-w-2xl lg:max-w-4xl">
      <Modal.Header as="h5" className="text-xl text-white">
        {!breakpoints.lg && (
          <Dropdown list={[<ReportsDocumentsFilter innerRef={innerRef} />]} placement="bottom-start">
            <Tooltip content={intl.formatMessage({ id: 'reports.measures.auditLogMenu' })}>
              <Button shape="circle">
                <MenuIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </Dropdown>
        )}
        <span>{intl.formatMessage({ id: 'measures.document' })}</span>
      </Modal.Header>
      <Modal.Body ref={innerRef}>
        <div>
          {breakpoints.lg && <ReportsDocumentsFilter innerRef={innerRef} />}
          <div className="flex justify-end">
            <Button shape="round" onClick={handleClose}>
              {intl.formatMessage({ id: 'measures.close' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

ReportsDocumentsView.displayName = 'ReportsDocumentsView';
export default ReportsDocumentsView;
