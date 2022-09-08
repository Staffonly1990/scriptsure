import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from '../../../shared/ui/modal';
import Button from 'shared/ui/button';
import { ViewGridAddIcon } from '@heroicons/react/outline';
import { flowResult } from 'mobx';
import { chartNotes } from '../model';
import moment from 'moment';
import { userModel } from 'features/user';
import { patientModel } from 'features/patient';
import { useIntl } from 'react-intl';

interface IAddAddendum {
  newAddendum: () => void;
}

const AddAddendum: FC<IAddAddendum> = observer(({ newAddendum }) => {
  const [inputValue, setInputValue] = useState('');
  const [{ open }, updateArgs] = useState({ open: false });
  const intl = useIntl();
  const handleOpen = () => {
    updateArgs({ open: true });
  };
  const handleClose = (value?: boolean) => {
    updateArgs({ open: value ?? false });
  };

  const deleteNoteCheckout = async (soapId: number) => {
    try {
      await flowResult(chartNotes.getNotes('All Notes', patientModel.currentPatient?.patientId));
      await flowResult(chartNotes.deleteNoteCheckout(soapId, false));
    } catch {}
  };

  const createAddendum = async () => {
    try {
      await flowResult(
        chartNotes.createAddendum({
          comment: inputValue,
          createdAt: moment().format('MM-DD-YYYY'),
          doctorId: userModel.data?.currentPrescriber.id,
          doctorName: userModel.data?.currentPrescriber.fullName,
          parentSoapId: chartNotes.selectedNote!.soapId!,
          patientId: patientModel.currentPatient?.patientId,
          userId: userModel.data?.user.id,
          userName: `${userModel.data?.user.firstName} ${userModel.data?.user.lastName}`,
        })
      );
    } catch {}
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        <div>{intl.formatMessage({ id: 'notes.measures.addAddendum' })}</div>
      </Modal.Title>
    </Modal.Header>
  );

  const body = (
    <Modal.Body>
      <div className="form-control">
        <label className="form-label" htmlFor="newNoteTitle">
          {intl.formatMessage({ id: 'notes.measures.textAddendum' })}
        </label>
        <input
          className="form-input"
          id="newNoteTitle"
          type="text"
          aria-describedby="helper-text-id-1-a"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            handleClose(false);
            deleteNoteCheckout(chartNotes.selectedNote!.soapId!);
          }}
        >
          {intl.formatMessage({ id: 'measures.cancel' })}
        </Button>
        <Button
          onClick={() => {
            handleClose(false);
            createAddendum().then(() => deleteNoteCheckout(chartNotes.selectedNote!.soapId!));
          }}
        >
          {intl.formatMessage({ id: 'measures.add' })}
        </Button>
      </div>
    </Modal.Body>
  );

  return (
    <>
      <Button
        onClick={() => {
          handleOpen();
          newAddendum();
        }}
      >
        <ViewGridAddIcon className="w-6 h-6" />
        {intl.formatMessage({ id: 'notes.measures.addendum' })}
      </Button>
      <Modal open={open} className="!max-w-none !w-max">
        {header}
        {body}
      </Modal>
    </>
  );
});

AddAddendum.displayName = 'AddAddendum';
export default AddAddendum;
