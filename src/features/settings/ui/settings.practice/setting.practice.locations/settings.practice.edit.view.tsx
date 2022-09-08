import React, { FC, useState } from 'react';
import Steps from 'shared/ui/steps';
import Modal, { IModalProps } from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { SettingsPracticeEditUsers, SettingsPracticeEditAccountForm } from './settings.practice.edit';
import { useIntl } from 'react-intl';
import { IPractice } from 'shared/api/practice';

interface IEditPractice extends IModalProps {
  editable?: boolean;
}

const SettingsPracticeEditView: FC<IEditPractice> = observer(({ open, onClose, editable }) => {
  const intl = useIntl();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [changedPractice, setChangedPractice] = useState();
  const steps = [intl.formatMessage({ id: 'measures.general' }), intl.formatMessage({ id: 'associated.users' })];
  const changeActiveStep = (step) => {
    setActiveStep(step);
  };
  const handleClose = () => {
    if (onClose) {
      onClose(false);
      setActiveStep(1);
    }
  };
  const changePractice = (practice: React.SetStateAction<undefined>) => {
    setChangedPractice(practice);
  };
  const headerSteps = (
    <Steps color="blue" column activeStep={activeStep - 1}>
      {map(steps, (label, i) => (
        <Steps.Step key={i.toString(36)}>{label}</Steps.Step>
      ))}
    </Steps>
  );
  return (
    <Modal open={open} onClose={onClose} className="md:max-w-4xl">
      <div className="bg-yellow-500 dark:bg-yellow-200 text-white dark:text-gray-400 text-2xl flex flex-col p-5">
        {intl.formatMessage({ id: 'add.practice' })}
      </div>
      <Modal.Body>
        {headerSteps}
        {activeStep === 1 ? (
          <SettingsPracticeEditAccountForm changeActiveStep={changeActiveStep} handleClose={handleClose} editable={editable} changePractice={changePractice} />
        ) : (
          <SettingsPracticeEditUsers changeActiveStep={changeActiveStep} handleClose={handleClose} editable={editable} changedPractice={changedPractice} />
        )}
      </Modal.Body>
    </Modal>
  );
});

SettingsPracticeEditView.displayName = 'SettingsPracticeEditView';
export default SettingsPracticeEditView;
