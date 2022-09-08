import React, { FC, Key, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { map } from 'lodash';
import { useMountedState } from 'react-use';

import Modal, { IModalProps } from 'shared/ui/modal';
import Tabs from 'shared/ui/tabs';
import Button from 'shared/ui/button';
import { OActionStatus } from 'shared/lib/model';
import { patientModel } from 'features/patient';

import LineContent from '../line.content';

interface IEligibilityModal extends IModalProps {
  handleOpenEligibility: (value: boolean) => void;
}

const EligibilityModal: FC<Pick<IEligibilityModal, 'open' | 'unmount' | 'onClose' | 'handleOpenEligibility'>> = observer(
  ({ open, unmount, onClose, handleOpenEligibility }) => {
    const isMounted = useMountedState();
    const [active, setActive] = useState<Key>('Patient');

    const handleChange = (data: Key) => {
      setActive(data);
    };

    const handleClose = () => {
      if (onClose) {
        onClose(false);
      }
    };

    const patientData = toJS(patientModel.currentPatient);
    const eligibilityData = toJS(patientModel.eligibilityData);
    const isEmptyResponse = Object.keys(eligibilityData).length;

    // eslint-disable-next-line consistent-return
    useEffect(() => {
      if (patientModel.status.getEligibility === OActionStatus.Pending) {
        handleOpenEligibility(isMounted());
      } else {
        return () => {
          handleOpenEligibility(false);
        };
      }
    }, [patientModel.status.getEligibility]);

    return (
      <Modal as="div" className="sm:!max-w-[90vw]" open={open} unmount={unmount} onClose={onClose}>
        <Modal.Header>
          <Modal.Title as="h5" className="title text-white">
            Confirmation
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Tabs selectedKey={active} onSelectionChange={handleChange}>
            <Tabs.TabList className="bg-green-600">
              <Tabs.Item key="Patient">Patient</Tabs.Item>
            </Tabs.TabList>

            <Tabs.TabSummary>
              <LineContent>
                <span>{patientData?.firstName}</span>
                <span>{patientData?.lastName}</span>
              </LineContent>
              <LineContent>
                <span>Date of Birth: {patientData?.dob}</span>
              </LineContent>
              <LineContent>
                <span>Gender: {patientData?.gender}</span>
              </LineContent>
              <LineContent>
                <span>{patientData?.addressLine1}</span>
              </LineContent>
              <LineContent>
                <span>{patientData?.city}</span>
                <span>{patientData?.state}</span>
                <span>{patientData?.zip}</span>
              </LineContent>
            </Tabs.TabSummary>

            <Tabs.TabPanels>
              <Tabs.Item key="Patient">
                {isEmptyResponse ? (
                  <span>{eligibilityData[0]}</span>
                ) : (
                  <span>
                    The patient information on file does not match the eligibility response from the insurance company. Please confirm the information then
                    click the insurance that is correct, or click Close if no changes are needed.
                  </span>
                )}
              </Tabs.Item>
            </Tabs.TabPanels>
          </Tabs>
        </Modal.Body>

        <Button className="w-full sm:ml-3 sm:w-auto" variant="flat" shape="smooth" color="blue" type="button" onClick={handleClose}>
          Close
        </Button>
      </Modal>
    );
  }
);

export default EligibilityModal;
