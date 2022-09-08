import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import DetailHistoryPatientCard from '../detail.history.patient.card';
import DetailHistoryPrescriberCard from '../detail.history.prescriber.card';
import DetailHistoryPharmacyCard from '../detail.history.pharmacy.card';
import OriginalMedication from './original.medication';
import DispensedMedication from './dispensed.medication';
import RequestedMedication from './requested.medication';
import HistoricalGenealogyOlder from './historical.genealogy.older';
import MessageReply from './message.reply';
import AlternativeList from './alternative.list/alternative.list';
import { prescriptionDetailModel } from '../../../model';
import { medicationDetailModel } from 'features/medication';

interface IDetailInformationProps {
  register?: any;
  errors?: any;
  trigger?: any;
  getValues?: any;
  isMedication: boolean;
}

const DetailInformation: FC<IDetailInformationProps> = observer(({ register, errors, trigger, isMedication, getValues }) => {
  const isOriginalMedication = (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.MedicationPrescribed?.DrugDescription;
  const isDispensedMedication = (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.MedicationDispensed;
  const isHistoricalGenealogyOlder =
    (isMedication ? medicationDetailModel : prescriptionDetailModel).message.isOldScript &&
    (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageStatus !== 'Pending' &&
    (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageStatus !== 'WaitingApproval' &&
    (isMedication
      ? medicationDetailModel.message.messageHistory && medicationDetailModel.message.messageHistory.length > 0
      : prescriptionDetailModel.message.messageHistory && prescriptionDetailModel.message.messageHistory.length > 0);
  const isRequestedMedication =
    (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.MedicationRequested?.DrugDescription &&
    (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageType === 'RxChangeRequest';
  const isAlternativeList =
    !isMedication &&
    prescriptionDetailModel?.response === 'A' &&
    prescriptionDetailModel.message.messageType === 'RxChangeRequest' &&
    prescriptionDetailModel.message.messageStatus === 'Pending';

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-3 mt-[20px]">
        <DetailHistoryPatientCard isMedication={isMedication} />
        <DetailHistoryPrescriberCard isMedication={isMedication} />
        <DetailHistoryPharmacyCard isMedication={isMedication} />
      </div>
      <div className="flex flex-col xl:flex-row gap-3 mt-[20px] items-stretch">
        {isOriginalMedication && <OriginalMedication isMedication={isMedication} />}
        {isDispensedMedication && <DispensedMedication isMedication={isMedication} />}
        {isRequestedMedication && <RequestedMedication isMedication={isMedication} />}
        {isHistoricalGenealogyOlder && <HistoricalGenealogyOlder isMedication={isMedication} />}
        {!isMedication && <MessageReply register={register} errors={errors} trigger={trigger} getValues={getValues} />}
        {isAlternativeList && <AlternativeList register={register} errors={errors} trigger={trigger} />}
      </div>
    </>
  );
});

DetailInformation.displayName = 'DetailInformation';
export default DetailInformation;
