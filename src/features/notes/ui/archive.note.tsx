import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from '../../../shared/ui/modal';
import Button from 'shared/ui/button';
import { ArchiveIcon } from '@heroicons/react/outline';
import { chartNotes } from '../model';
import { flowResult } from 'mobx';
import { patientModel } from 'features/patient';
import { useIntl } from 'react-intl';

const ArchiveNote: FC = observer(() => {
  const [{ open }, updateArgs] = useState({ open: false });
  const intl = useIntl();
  const handleOpen = () => {
    updateArgs({ open: true });
  };
  const handleClose = (value?: boolean) => {
    updateArgs({ open: value ?? false });
  };

  const archiveNote = async () => {
    try {
      await flowResult(chartNotes.archiveNote(chartNotes.selectedNote!.soapId!));
      await flowResult(chartNotes.getNotes('All Notes', patientModel.currentPatient?.patientId));
    } catch {}
  };

  const header = (
    <Modal.Header className="bg-transparent">
      <Modal.Title as="h5" className="title text-white">
        {intl.formatMessage({ id: 'archive.notes.measures.archiveNote' })}
      </Modal.Title>
    </Modal.Header>
  );

  const body = (
    <Modal.Body>
      <div>{intl.formatMessage({ id: 'archive.notes.measures.sureArchiveNote' })}</div>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            handleClose(false);
          }}
        >
          {intl.formatMessage({ id: 'measures.cancel' })}
        </Button>
        <Button
          onClick={() => {
            archiveNote();
            handleClose(false);
          }}
        >
          {intl.formatMessage({ id: 'measures.archive' })}
        </Button>
      </div>
    </Modal.Body>
  );

  return (
    <>
      <Button onClick={handleOpen}>
        <ArchiveIcon className="w-6 h-6" />
        {intl.formatMessage({ id: 'measures.archive' })}
      </Button>
      <Modal open={open} className="!max-w-none !w-max">
        {header}
        {body}
      </Modal>
    </>
  );
});

ArchiveNote.displayName = 'ArchiveNote';
export default ArchiveNote;
