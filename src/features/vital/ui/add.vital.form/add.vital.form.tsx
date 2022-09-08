import React, { FC, useState, useRef, MutableRefObject, useEffect, SetStateAction, Dispatch } from 'react';

import Button from 'shared/ui/button/button';
import Modal, { IModalProps } from 'shared/ui/modal';
import Alert from 'shared/ui/alert';
import { observer } from 'mobx-react-lite';
import AddVitalFormHeight from './add.vital.form.height';
import AddVitalFormWeight from './add.vital.form.weight';
import AddVitalFormBMI from './add.vital.form.bmi';
import AddVitalFormHeartRate from './add.vital.form.heart';
import AddVitalFormTemperature from './add.vital.form.temperature';
import AddVitalFormRespiratory from './add.vital.form.respiratory';
import AddVitalFormOxygen from './add.vital.form.oxygen';
import AddVitalFormBloodPressure from './add.vital.form.pressure';
import AddVitalFormPain from './add.vital.form.pain';
import { VitalStore } from 'features/vital';
import { useNotifier } from 'react-headless-notifier';
import merge from 'lodash.merge';
import { useIntl } from 'react-intl';

interface IAddVital extends IModalProps {
  setIsAddVitalsFlag: Dispatch<SetStateAction<boolean>>;
  patientID: string | number;
}
const date = new Date();

const AddVitalModal: FC<Pick<IAddVital, 'open' | 'onClose' | 'setIsAddVitalsFlag' | 'patientID'>> = observer(
  ({ open, onClose, setIsAddVitalsFlag, patientID }) => {
    const { notify } = useNotifier();
    const [innerRefCurrent, setInnerRefCurrent] = useState<MutableRefObject<HTMLInputElement | undefined> | undefined>();
    const innerRef = useRef();
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [filledForm, setFilledForm] = useState<any>([]);
    const intl = useIntl();
    useEffect(() => {
      if (!innerRefCurrent?.current) {
        setInnerRefCurrent(innerRef);
      }
    }, []);
    const handleClose = () => {
      if (onClose) {
        onClose(false);
      }
    };
    // const defaultValues = {
    //   vitalId: '',
    //   archive: false,
    //   createdAt: date.toISOString(),
    //   PatientVitalHeader: [
    const defaultValues = [
      {
        vitalId: '',
        patientId: patientID,
        encounterId: 0,
        userId: '',
        userName: '',
        doctorId: '',
        doctorName: '',
        archive: false,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        calculateBmi: true,
        dateOfMeasure: date.toISOString(),
        save: null,
      },
    ];
    // };
    const sendAddedVitals = async () => {
      handleClose();
      const sendVitals = { patientId: Number(patientID), archive: false, encounterId: 0, PatientVital: filledForm };
      await VitalStore.addVital(sendVitals);
      setFilledForm([]);
      setIsAddVitalsFlag((prevData) => !prevData);
      notify(
        <Alert.Notification
          actions={(close) => (
            <Button variant="flat" onClick={() => close()}>
              {intl.formatMessage({
                id: 'measures.ok',
              })}
            </Button>
          )}
        >
          <p>
            {intl.formatMessage({
              id: 'vital.measures.vitalsAdded',
            })}
          </p>
        </Alert.Notification>
      );
      setWeight(0);
      setHeight(0);
    };
    const changeHeight = (data) => {
      setHeight(data);
    };
    const changeWeight = (data) => {
      setWeight(data);
    };
    const sendForm = (data) => {
      const changeState = filledForm.filter((item) => item.loinc !== data.loinc);
      if (data.measurementValue.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return setFilledForm(changeState);
      }
      const newForm = merge(defaultValues, data);
      return setFilledForm([...changeState, { ...newForm }]);
    };
    // BMI formula =  weight (kg) / [height (m)]2 - Kilograms and meters
    const BMIValue = weight > 1 && height > 1 ? (weight / height ** 2).toFixed(1) : '';
    return (
      <Modal open={open} onClose={onClose} className="md:max-w-3xl lg:max-w-4xl overflow-x-hidden">
        <Modal.Header as="h5" className="title bg-blue-400 text-white text-2xl">
          {intl.formatMessage({
            id: 'measures.vitals',
          })}
        </Modal.Header>
        <Modal.Body ref={innerRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AddVitalFormHeight innerRef={innerRefCurrent} changeHeight={changeHeight} sendForm={sendForm} />
            <AddVitalFormWeight innerRef={innerRefCurrent} changeWeight={changeWeight} sendForm={sendForm} />
            <AddVitalFormBMI BMIValue={BMIValue} sendForm={sendForm} />
            <AddVitalFormTemperature innerRef={innerRefCurrent} sendForm={sendForm} />
            <AddVitalFormHeartRate sendForm={sendForm} />
            <AddVitalFormRespiratory sendForm={sendForm} />
            <AddVitalFormOxygen sendForm={sendForm} />
            <AddVitalFormBloodPressure sendForm={sendForm} />
            <AddVitalFormPain sendForm={sendForm} />
          </div>
          <div className="flex justify-between m-4">
            <Button variant="flat" size="lg" color="gray" className="uppercase" type="button" onClick={handleClose}>
              {intl.formatMessage({
                id: 'measures.cancel',
              })}
            </Button>
            <Button shape="smooth" size="lg" className="uppercase" onClick={sendAddedVitals}>
              {intl.formatMessage({
                id: 'vital.measures.save',
              })}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
);
AddVitalModal.displayName = 'AddVitalModal';
export default AddVitalModal;
