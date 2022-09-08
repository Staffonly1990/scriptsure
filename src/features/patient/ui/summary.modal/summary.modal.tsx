import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { observer } from 'mobx-react-lite';

import Modal from 'shared/ui/modal/modal';
import { AdjustmentsIcon, XIcon } from '@heroicons/react/solid';
import { IPatientAllergy } from 'shared/api/patient';
import Button from 'shared/ui/button';
import { phoneToMask } from 'shared/lib/mask.phone';
import { patientModel, summaryModalStore } from 'features/patient/model';

const sendMethodStr = {
  1: 'Print',
  2: 'Sent Electronic',
  3: 'Download (Pharmacy)',
  4: 'Download (PBM)',
  5: 'Save Only',
  6: 'Queue',
  7: 'Download (Current)',
  8: 'Drug History Update',
  9: 'In-House Pharmacy',
};

interface ISummaryModalProps {
  open: boolean;
  onClose: () => void;
  goToDiagnosis: () => void;
  goToSetting: () => void;
  goToAllergies: () => void;
  handleCopy: () => void;
  currentPatient: null | IPatientAllergy;
  refToCopy: React.RefObject<HTMLDivElement>;
}

const SummaryModal: FC<ISummaryModalProps> = ({ goToSetting, goToDiagnosis, goToAllergies, open, onClose, currentPatient, handleCopy, refToCopy }) => {
  const intl = useIntl();
  const dob = useMemo(() => moment(currentPatient?.dob).format('MM/DD/YYYY'), []);
  const printDate = useMemo(() => moment(new Date()).format('MM/DD/YYYY hh:mm'), []);
  return (
    <Modal as="div" onClose={onClose} open={open}>
      <Modal.Header>
        <div className="flex justify-between text-white w-full items-center">
          <span>{intl.formatMessage({ id: 'measures.summary' })}</span>
          <Button color="transparent" shape="smooth" variant="filled" onClick={onClose} className="uppercase">
            <XIcon className="w-6 h-6" />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        {((!currentPatient?.hicRoot || currentPatient?.hicRoot.length === 0) &&
          (!currentPatient?.hicSeqn || currentPatient?.hicSeqn.length === 0) &&
          (!currentPatient?.damAlrgnGrp || currentPatient?.damAlrgnGrp.length === 0) &&
          (!currentPatient?.damAlrgnXsense || currentPatient?.damAlrgnXsense.length === 0) &&
          patientModel.currentEncounter?.Allergies &&
          patientModel.currentEncounter.Allergies.length === 0 &&
          summaryModalStore.warningNoAllergyEntered) ||
          (patientModel.currentEncounter?.Diagnoses && patientModel.currentEncounter.Diagnoses.length === 0 && summaryModalStore.warningNoDiagnosisEntered && (
            <div className="flex justify-end">
              {!patientModel.currentEncounter?.Diagnoses.length && summaryModalStore.warningNoDiagnosisEntered && (
                <Button
                  color="red"
                  shape="smooth"
                  variant="filled"
                  onClick={() => {
                    onClose();
                    goToDiagnosis();
                  }}
                  className="uppercase"
                >
                  {intl.formatMessage({ id: 'summary.measures.noDiagnosisEntered' })}
                </Button>
              )}
              {(!currentPatient?.hicRoot || currentPatient?.hicRoot.length === 0) &&
                (!currentPatient?.hicSeqn || currentPatient?.hicSeqn.length === 0) &&
                (!currentPatient?.damAlrgnGrp || currentPatient?.damAlrgnGrp.length === 0) &&
                (!currentPatient?.damAlrgnXsense || currentPatient?.damAlrgnXsense.length === 0) &&
                patientModel.currentEncounter.Allergies &&
                patientModel.currentEncounter.Allergies.length === 0 &&
                summaryModalStore.warningNoAllergyEntered && (
                  <Button
                    color="red"
                    shape="smooth"
                    variant="filled"
                    onClick={() => {
                      onClose();
                      goToAllergies();
                    }}
                    className="uppercase"
                  >
                    {intl.formatMessage({ id: 'summary.measures.noAllergyEntered' })}
                  </Button>
                )}
            </div>
          ))}
        <div ref={refToCopy}>
          <div className="flex flex-col border-b-2">
            <span className="m-1 p-0 text-lg font-medium">
              <b>
                {currentPatient?.lastName || '-'}, {currentPatient?.firstName || '-'} {currentPatient?.suffix && <span>{currentPatient?.suffix}</span>}
              </b>{' '}
              ({dob})
            </span>
            <span className="m-1 p-0 text-xl font-medium">
              {currentPatient?.addressLine1} {currentPatient?.city}, {currentPatient?.state} {currentPatient?.zip}
            </span>
            <span className="m-1 p-0 text-xl">{phoneToMask(currentPatient?.cell || currentPatient?.home || currentPatient?.work)}</span>
            <p className="m-1 p-0">
              {intl.formatMessage({ id: 'summary.measures.chart' })}: {currentPatient?.chartId || currentPatient?.patientId}
            </p>
            <p className="m-1 p-0">
              {intl.formatMessage({ id: 'summary.measures.printedDate' })}: {printDate}
            </p>
          </div>
          {patientModel.currentEncounter?.Prescriptions && patientModel.currentEncounter.Prescriptions.length > 0 && !summaryModalStore.noPrescriptionPrint && (
            <div className="flex flex-col">
              <span className="text-xl uppercase">{intl.formatMessage({ id: 'measures.prescriptions' })}</span>
              {patientModel.currentEncounter.Prescriptions.map((prescription) => (
                <div className="mt-1">
                  {prescription?.PrescriptionDrugs?.map((prescriptionDrug) => (
                    <div>
                      <span>
                        <b>{prescriptionDrug.drugName}</b> {prescription?.PrescriptionScript?.drugFormat}
                      </span>
                    </div>
                  ))}
                  <div>
                    <span>
                      {intl.formatMessage({ id: 'measures.prescriber' })}: {prescription.doctorName}
                    </span>
                  </div>
                  <div>
                    <span>
                      {intl.formatMessage({ id: 'summary.measures.refill' })}: {prescription.refill}
                    </span>
                  </div>
                  <div>
                    <span>{sendMethodStr[prescription.sendMethod]}</span>
                  </div>
                  {prescription.pharmacy && (
                    <div>
                      <span>
                        {intl.formatMessage({ id: 'measures.pharmacy' })}: {prescription.pharmacy}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!!patientModel.currentEncounter?.Allergies?.length && !summaryModalStore.noAllergyPrint && (
            <div className="flex flex-col">
              <span className="text-xl uppercase">{intl.formatMessage({ id: 'measures.allergies' })}</span>
              {patientModel.currentEncounter.Allergies.map((allergy) => (
                <span>{allergy.name}</span>
              ))}
            </div>
          )}
          {!!patientModel.currentEncounter?.Education?.length && !summaryModalStore.noEducationPrint && (
            <div className="flex flex-col">
              <span className="text-xl uppercase">{intl.formatMessage({ id: 'measures.education' })}</span>
              {patientModel.currentEncounter.Education.map((ed) => (
                <span>{ed.name}</span>
              ))}
            </div>
          )}
          {!!patientModel.currentEncounter?.Diagnoses?.length && !summaryModalStore.noDiagnosisPrint && (
            <div className="flex flex-col">
              <span className="text-xl uppercase">{intl.formatMessage({ id: 'measures.Diagnoses' })}</span>
              {patientModel.currentEncounter.Diagnoses.map((diagnosis) => (
                <span>
                  <b>{diagnosis.conceptId}</b> {diagnosis.name}
                </span>
              ))}
            </div>
          )}
          {patientModel.currentEncounter?.Soap && patientModel.currentEncounter.Soap.length > 0 && !summaryModalStore.noDiagnosisPrint && (
            <div className="flex flex-col">
              <span className="text-xl uppercase">{intl.formatMessage({ id: 'measures.notes' })}</span>
              {patientModel.currentEncounter.Soap.map((note) => (
                <span>{note.title}</span>
              ))}
            </div>
          )}
        </div>
        {summaryModalStore.noPrescriptionPrint &&
          summaryModalStore.noAllergyPrint &&
          summaryModalStore.noEducationPrint &&
          summaryModalStore.noDiagnosisPrint &&
          summaryModalStore.noSoapPrint && (
            <>
              <div className="flex m-1 mt-1.5 bg-primary">
                <AdjustmentsIcon className="w-[96px] h-[96px] opacity-20" />
              </div>
              <div className="flex flex-col">
                <span className="opacity-40">{intl.formatMessage({ id: 'summary.measures.allTransactionsNotPrint' })}</span>
                <Button
                  color="gray"
                  shape="smooth"
                  variant="flat"
                  onClick={() => {
                    onClose();
                    goToSetting();
                  }}
                >
                  {intl.formatMessage({ id: 'measures.openSettings' })}
                </Button>
              </div>
            </>
          )}
        <div className="mt-8 flex justify-between">
          <Button color="white" shape="smooth" variant="outlined" onClick={handleCopy} className="uppercase">
            {intl.formatMessage({ id: 'measures.copy' })}
          </Button>
          <div>
            <Button color="gray" shape="smooth" variant="flat" onClick={onClose} className="uppercase">
              {intl.formatMessage({ id: 'measures.cancel' })}
            </Button>
            <Button color="green" shape="smooth" variant="filled" onClick={onClose} className="uppercase">
              {intl.formatMessage({ id: 'measures.print' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

SummaryModal.displayName = 'SummaryModal';
export default observer(SummaryModal);
