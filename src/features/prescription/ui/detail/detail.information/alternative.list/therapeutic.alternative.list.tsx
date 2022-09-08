import React, { FC, useState } from 'react';
import { isArray } from 'lodash';
import { observer } from 'mobx-react-lite';

import { prescriptionDetailModel } from '../../../../model';
import Button from 'shared/ui/button';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';

const TherapeuticAlternativeList: FC = observer(() => {
  const [expands, setExpands] = useState<string[]>([]);

  const handleExpand = (DrugDescription: string) => {
    if (expands.includes(DrugDescription)) {
      setExpands(expands.filter((expand) => expand !== DrugDescription));
    } else {
      setExpands(expands.concat(DrugDescription));
    }
  };

  return (
    <div className="flex flex-col">
      <span className="mb-[25px] font-medium text-xl">
        The pharmacy is unable to fill the Original Prescription. Please click an appropriate substitution from the list below. If there is no equivalent
        substitution then click Cancel, and Decline the change request. {prescriptionDetailModel.message.messageXml.ChangeReasonText}
      </span>
      <div className="flex justify-between items-center">
        {isArray(prescriptionDetailModel.message.messageXml?.MedicationRequested) &&
          prescriptionDetailModel.message.messageXml?.MedicationRequested?.map((medicationRequested) => (
            <div className="flex">
              <div className="flex flex-col">
                <div className="flex">
                  <span>{medicationRequested.DrugDescription}</span>
                  <Button
                    variant="flat"
                    color="white"
                    shape="smooth"
                    className="!text-black bg-white"
                    onClick={() => handleExpand(medicationRequested.DrugDescription)}
                  >
                    {expands.includes(medicationRequested.DrugDescription) ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  </Button>
                </div>
                {expands.includes(medicationRequested.DrugDescription) && (
                  <div className="m-[5px] p-[15px]">
                    <span className="font-bold">
                      {medicationRequested.Quantity.Value}{' '}
                      {prescriptionDetailModel.getQuantityQualifier(medicationRequested.Quantity.QuantityUnitOfMeasure.Code)}
                    </span>
                    {medicationRequested.NumberOfRefills && (
                      <div className="flex">
                        <span className="xl:w-[40%]">Refill: </span>
                        <span>{medicationRequested.NumberOfRefills}</span>
                      </div>
                    )}
                    {medicationRequested.DaysSupply && (
                      <div className="flex">
                        <span className="xl:w-[40%]">Days Supply: </span>
                        <span>{medicationRequested.DaysSupply}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="xl:w-[40%]">Substitution: </span>
                      <span>
                        {medicationRequested.Substitutions === '0' && 'Allowed'}
                        {medicationRequested.Substitutions === '1' && 'Not Allowed'}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="xl:w-[40%]">Pharmacy Note: </span>
                      <span>{medicationRequested.Note}</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="filled"
                color="blue"
                className="uppercase"
                onClick={(event) => {
                  prescriptionDetailModel.selectMedicationRequested(event, medicationRequested);
                }}
              >
                Select
              </Button>
            </div>
          ))}
        {prescriptionDetailModel.message.messageXml?.MedicationRequested && !isArray(prescriptionDetailModel.message.messageXml?.MedicationRequested) && (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="flex">
                <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugDescription}</span>
                <Button
                  variant="flat"
                  color="white"
                  shape="smooth"
                  className="!text-black bg-white"
                  onClick={() => handleExpand(prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugDescription)}
                >
                  {expands.includes(prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugDescription) ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {expands.includes(prescriptionDetailModel.message.messageXml?.MedicationRequested.DrugDescription) && (
                <div className="m-[5px] p-[15px]">
                  <span className="font-bold">
                    {prescriptionDetailModel.message.messageXml?.MedicationRequested.Quantity.Value}{' '}
                    {prescriptionDetailModel.getQuantityQualifier(
                      prescriptionDetailModel.message.messageXml?.MedicationRequested.Quantity.QuantityUnitOfMeasure.Code
                    )}
                  </span>
                  {prescriptionDetailModel.message.messageXml?.MedicationRequested.NumberOfRefills && (
                    <div className="flex">
                      <span className="xl:w-[40%]">Refill: </span>
                      <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested.NumberOfRefills}</span>
                    </div>
                  )}
                  {prescriptionDetailModel.message.messageXml?.MedicationRequested.DaysSupply && (
                    <div className="flex">
                      <span className="xl:w-[40%]">Days Supply: </span>
                      <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested.DaysSupply}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="xl:w-[40%]">Substitution: </span>
                    <span>
                      {prescriptionDetailModel.message.messageXml?.MedicationRequested.Substitutions === '0' && 'Allowed'}
                      {prescriptionDetailModel.message.messageXml?.MedicationRequested.Substitutions === '1' && 'Not Allowed'}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="xl:w-[40%]">Pharmacy Note: </span>
                    <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested.Note}</span>
                  </div>
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
            {prescriptionDetailModel.message?.alternatives && prescriptionDetailModel.message?.alternatives?.length > 0 && (
              <div>
                <div className="bg-blue-500 xl:font-medium xl:text-xl">Other Suggested Alternative</div>
                <div>
                  {prescriptionDetailModel.message?.alternatives.map((alternative) => (
                    <Button
                      variant="filled"
                      color="blue"
                      className="uppercase"
                      onClick={(event) => {
                        prescriptionDetailModel.alternative(alternative, event);
                      }}
                    >
                      {alternative.LN} {alternative.copayText}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

TherapeuticAlternativeList.displayName = 'TherapeuticAlternativeList';
export default TherapeuticAlternativeList;
