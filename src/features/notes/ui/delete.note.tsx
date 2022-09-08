import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from '../../../shared/ui/modal';
import Button from 'shared/ui/button';
import { TrashIcon } from '@heroicons/react/outline';
import { chartNotes } from '../model';
import { flowResult } from 'mobx';
import { patientModel } from 'features/patient';
import { useIntl } from 'react-intl';

const DeleteNote: FC = observer(() => {
  const [{ open }, updateArgs] = useState({ open: false });
  const intl = useIntl();
  const handleOpen = () => {
    updateArgs({ open: true });
  };
  const handleClose = (value?: boolean) => {
    updateArgs({ open: value ?? false });
  };

  const deleteNote = async () => {
    try {
      await flowResult(chartNotes.deleteNote(chartNotes.selectedNote!.soapId!));
      await flowResult(chartNotes.getNotes('All Notes', patientModel.currentPatient?.patientId));
    } catch {}
  };

  const header = (
    <Modal.Header className="bg-transparent">
      <Modal.Title as="h5" className="title text-white">
        {intl.formatMessage({ id: 'delete.notes.measures.note' })}
      </Modal.Title>
    </Modal.Header>
  );

  const body = (
    <Modal.Body>
      <div>{intl.formatMessage({ id: 'delete.notes.measures.sureDelete' })}</div>
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
            deleteNote();
            handleClose(false);
          }}
        >
          {intl.formatMessage({ id: 'measures.delete' })}
        </Button>
      </div>
    </Modal.Body>
  );

  return (
    <>
      <Button onClick={handleOpen}>
        <TrashIcon className="w-6 h-6" />
        {intl.formatMessage({ id: 'measures.delete' })}
      </Button>
      <Modal open={open} className="!max-w-none !w-max">
        {header}
        {body}
      </Modal>
    </>
  );
});

DeleteNote.displayName = 'DeleteNote';
export default DeleteNote;
