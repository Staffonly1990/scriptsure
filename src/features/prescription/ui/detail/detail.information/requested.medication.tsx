import React, { FC } from 'react';
import moment from 'moment';
import { isArray } from 'lodash';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { prescriptionDetailModel } from '../../../model';

interface IRequestedMedicationProps {
  isMedication: boolean;
}

const RequestedMedication: FC<IRequestedMedicationProps> = observer(({ isMedication }) => {
  const medicationRequested = prescriptionDetailModel.message.messageXml?.MedicationRequested;

  return (
    <div className={cx(medicationRequested.CompoundInformation && 'blue-400', 'shadow flex flex-col w-full')}>
      <div className="flex justify-between p-[16px]">
        <div className="flex flex-col">
          {!medicationRequested.PharmacyRequestedRefills && <span className="text-xs xl:text-xl xl:font-bold">Dispensed to Patient</span>}
          {medicationRequested.PharmacyRequestedRefills && <span className="text-xs xl:text-xl xl:font-bold">Requested Refill</span>}
          {medicationRequested?.WrittenDate?.Date && (
            <span className="text-sm opacity-50">Written Date: {moment(new Date(medicationRequested.WrittenDate.Date)).format('MM/DD/YYYY')}</span>
          )}
          {medicationRequested?.WrittenDate?.DateTime && (
            <span className="text-sm opacity-50">Written Date: {moment(new Date(medicationRequested.WrittenDate.DateTime)).format('MM/DD/YYYY')}</span>
          )}
          {medicationRequested?.LastFillDate?.Date && (
            <span className="text-sm opacity-50">Last Fill Date: {moment(new Date(medicationRequested.LastFillDate.Date)).format('MM/DD/YYYY')}</span>
          )}
          {medicationRequested?.OtherMedicationDate?.OtherMedicationDate.Date && (
            <span className="text-sm opacity-50">
              Effective Date: {moment(new Date(medicationRequested?.OtherMedicationDate?.OtherMedicationDate?.Date)).format('MM/DD/YYYY')}
            </span>
          )}
        </div>
      </div>
      <div className="m-[16px] flex flex-col">
        <div className="flex flex-col">
          {medicationRequested.PharmacyRequestedRefills && (
            <span className="text-red-500">Number of Refills Requested: {medicationRequested.PharmacyRequestedRefills}</span>
          )}

          <span className="font-bold text-xl">{medicationRequested.DrugDescription} </span>
          {medicationRequested.CompoundInformation && (
            <div className="flex flex-col ml-[10px] mb-[10px] text-xs">
              <span className="italic underline">Ingredient List</span>
              {isArray(medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                <>
                  {medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed.map((compound) => (
                    <div className="flex">
                      <span>{compound.CompoundIngredient.CompoundIngredientItemDescription} - </span>
                      <span>{compound.Quantity.Value} </span>
                      <span>{prescriptionDetailModel.getQuantityQualifier(compound.Quantity.QuantityUnitOfMeasure.Code)}</span>
                    </div>
                  ))}
                </>
              )}
              {medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed &&
                !isArray(medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                  <span>
                    {medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient.CompoundIngredientItemDescription}
                    {' - '}
                    {medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.Value}{' '}
                    {prescriptionDetailModel.getQuantityQualifier(
                      medicationRequested.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.QuantityUnitOfMeasure.Code
                    )}
                  </span>
                )}
            </div>
          )}
          <span className="text-xs">{prescriptionDetailModel.getControlledDescription(prescriptionDetailModel.message.drugcode)}</span>
        </div>
        <span className="font-bold">
          {medicationRequested.Quantity.Value} {prescriptionDetailModel.getQuantityQualifier(medicationRequested.Quantity.QuantityUnitOfMeasure.Code)}
        </span>
        <div className="flex">
          <span>{medicationRequested.Sig.SigText}</span>
          <span>{medicationRequested.Directions}</span>
        </div>
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
        {medicationRequested?.DrugCoded?.ProductCode?.Code && (
          <div className="flex">
            <span className="xl:w-[40%]">NDC: </span>
            <span>{medicationRequested.DrugCoded.ProductCode.Code}</span>
          </div>
        )}
        {medicationRequested.PriorAuthorization && (
          <div className="flex">
            <span className="xl:w-[40%]">Prior Authorization: </span>
            <span>{medicationRequested.PriorAuthorization}</span>
          </div>
        )}

        {medicationRequested?.Note && (
          <div className="flex">
            <span className="xl:w-[40%]">Pharmacy Note: </span>
            <span>{medicationRequested.Note}</span>
          </div>
        )}

        {medicationRequested?.Diagnosis && (
          <div className="flex">
            <span className="xl:w-[40%]">Pharmacy Note: </span>
            {medicationRequested.Diagnosis?.Primary && (
              <span>
                {prescriptionDetailModel.diagnosisDecimal(medicationRequested.Diagnosis.Primary.Code)} {medicationRequested.Diagnosis.Primary.Description}
              </span>
            )}
            {medicationRequested.Diagnosis?.Secondary && (
              <span>
                {prescriptionDetailModel.diagnosisDecimal(medicationRequested.Diagnosis.Secondary.Code)} {medicationRequested.Diagnosis.Secondary.Description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

RequestedMedication.displayName = 'RequestedMedication';
export default RequestedMedication;
