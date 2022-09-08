import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { prescriptionDetailModel } from '../../../../model';
import Button from 'shared/ui/button';

const PharmacyRequestDrugUseEvaluation: FC = observer(() => {
  return (
    <div className="flex flex-col">
      <span className="mb-[25px] font-medium text-xl">
        Pharmacy has modified the directions for the prescription. Please confirm that the medication is clinically valid and click SEND.
      </span>
      <div className="flex flex-col m-[20px] items-end">
        <div className="flex w-full flex-col mb-[20px]">
          <div className="flex flex-col">
            <span className="xl:text-xl xl:font-bold">{prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugDescription}</span>
            <span className="text-red-500 text-xs">{prescriptionDetailModel.getControlledDescription(prescriptionDetailModel.message?.drugcode)}</span>
          </div>
          <span className="text-sm">
            {prescriptionDetailModel.message.messageXml?.MedicationRequested?.Quantity?.Value}{' '}
            {prescriptionDetailModel.getQuantityQualifier(
              prescriptionDetailModel.message.messageXml?.MedicationRequested?.Quantity?.QuantityUnitOfMeasure?.Code
            )}
          </span>
          <span className="text-sm">{prescriptionDetailModel.message.messageXml?.MedicationRequested?.Sig?.SigText}</span>
          <div className="flex">
            <span className="text-sm w-[40%]">Refill:</span>
            {prescriptionDetailModel.message.messageXml?.MedicationRequested?.NumberOfRefills}
          </div>
          <div className="flex">
            <span className="text-sm w-[40%]">Substitution:</span>
            {prescriptionDetailModel.message.messageXml?.MedicationRequested?.Substitutions === '0' && 'Allowed'}
            {prescriptionDetailModel.message.messageXml?.MedicationRequested?.Substitutions === '1' && 'Not Allowed'}
          </div>
          <div className="flex">
            <span className="text-sm xl:w-[40%]">Pharmacy Note: </span>
            <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested?.Note}</span>
          </div>
          <div className="flex">
            <span className="xl:w-[40%]">NDC: </span>
            <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugCoded?.ProductCode?.Code}</span>
          </div>
          {prescriptionDetailModel.message.messageXml?.MedicationRequested?.PriorAuthorization && (
            <div className="flex items-center">
              <span className="xl:w-[40%]">Prior Authorization:</span>
              <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested?.PriorAuthorization}</span>
            </div>
          )}
        </div>
        <Button
          variant="filled"
          color="blue"
          className="uppercase"
          onClick={(event) => {
            prescriptionDetailModel.selectMedicationRequested(event, prescriptionDetailModel.message.messageXml?.MedicationRequested);
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
});

PharmacyRequestDrugUseEvaluation.displayName = 'PharmacyRequestDrugUseEvaluation';
export default PharmacyRequestDrugUseEvaluation;
