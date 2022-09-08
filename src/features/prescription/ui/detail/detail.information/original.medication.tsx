import React, { FC } from 'react';
import moment from 'moment';
import { isArray } from 'lodash';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { ClipboardListIcon } from '@heroicons/react/solid';
import { prescriptionDetailModel } from '../../../model';
import { medicationDetailModel } from '../../../../medication';

interface IOriginalMedicationProps {
  isMedication: boolean;
}

const OriginalMedication: FC<IOriginalMedicationProps> = observer(({ isMedication }) => {
  const { formatMessage } = useIntl();
  const medicationPrescribed = (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.MedicationPrescribed;

  return (
    <div className={cx(medicationPrescribed.CompoundInformation && 'blue-400', 'shadow flex flex-col w-full')}>
      <div className="flex justify-between p-[16px]">
        <div className="flex flex-col">
          <span className="text-xs xl:text-xl xl:font-bold">{formatMessage({ id: 'original.originalPrescription' })}</span>
          {medicationPrescribed?.WrittenDate?.Date && (
            <span className="text-sm opacity-50">
              {formatMessage({ id: 'reports.measures.writtenDate' })}: {moment(new Date(medicationPrescribed.WrittenDate.Date)).format('MM/DD/YYYY')}
            </span>
          )}
          {medicationPrescribed?.WrittenDate?.DateTime && (
            <span className="text-sm opacity-50">
              {formatMessage({ id: 'reports.measures.writtenDate' })}: {moment(new Date(medicationPrescribed.WrittenDate.DateTime)).format('MM/DD/YYYY')}
            </span>
          )}
          {medicationPrescribed?.LastFillDate?.Date && (
            <span className="text-sm opacity-50">
              {formatMessage({ id: 'original.lastFillDate' })}: {moment(new Date(medicationPrescribed.LastFillDate.Date)).format('MM/DD/YYYY')}
            </span>
          )}
          {medicationPrescribed?.OtherMedicationDate?.OtherMedicationDate.Date && (
            <span className="text-sm opacity-50">
              {formatMessage({ id: 'original.effectiveDate' })}:{' '}
              {moment(new Date(medicationPrescribed.OtherMedicationDate.OtherMedicationDate.Date)).format('MM/DD/YYYY')}
            </span>
          )}
        </div>
        <Button
          color="transparent"
          variant="filled"
          onClick={() => prescriptionDetailModel.showXmlDetail((isMedication ? medicationDetailModel : prescriptionDetailModel).message.requestId)}
        >
          <ClipboardListIcon className="w-5 h-5 mr-1" />
        </Button>
      </div>
      <div className="m-[16px] flex flex-col">
        <div className="flex flex-col">
          <span className="font-bold text-xl">{medicationPrescribed.DrugDescription} </span>
          {medicationPrescribed.CompoundInformation && (
            <div className="flex flex-col ml-[10px] mb-[10px] text-xs">
              <span className="italic underline">{formatMessage({ id: 'original.ingredientList' })}</span>
              {isArray(medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                <>
                  {medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.map((compound) => (
                    <div className="flex">
                      <span>{compound.CompoundIngredient.CompoundIngredientItemDescription} - </span>
                      <span>{compound.Quantity.Value} </span>
                      <span>{prescriptionDetailModel.getQuantityQualifier(compound.Quantity.QuantityUnitOfMeasure.Code)}</span>
                    </div>
                  ))}
                </>
              )}
              {medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed &&
                !isArray(medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                  <span>
                    {medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient.CompoundIngredientItemDescription}
                    {' - '}
                    {medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.Value}{' '}
                    {prescriptionDetailModel.getQuantityQualifier(
                      medicationPrescribed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.QuantityUnitOfMeasure.Code
                    )}
                  </span>
                )}
            </div>
          )}
          <span className="text-xs">{prescriptionDetailModel.getControlledDescription(prescriptionDetailModel.message.drugcode)}</span>
        </div>
        <span className="font-bold">
          {medicationPrescribed.Quantity.Value} {prescriptionDetailModel.getQuantityQualifier(medicationPrescribed.Quantity.QuantityUnitOfMeasure.Code)}
        </span>
        <div className="flex">
          <span>{medicationPrescribed.Sig.SigText}</span>
          <span>{medicationPrescribed.Directions}</span>
        </div>
        {medicationPrescribed.NumberOfRefills && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
            <span>{medicationPrescribed.NumberOfRefills}</span>
          </div>
        )}
        {medicationPrescribed.DaysSupply && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.daysSupply' })}: </span>
            <span>{medicationPrescribed.DaysSupply}</span>
          </div>
        )}
        <div className="flex">
          <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
          <span>
            {medicationPrescribed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
            {medicationPrescribed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
          </span>
        </div>
        {medicationPrescribed?.DrugCoded?.ProductCode?.Code && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
            <span>{medicationPrescribed.DrugCoded.ProductCode.Code}</span>
          </div>
        )}
        {medicationPrescribed.PriorAuthorization && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
            <span>{medicationPrescribed.PriorAuthorization}</span>
          </div>
        )}

        {medicationPrescribed?.Note && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
            <span>{medicationPrescribed.Note}</span>
          </div>
        )}

        {medicationPrescribed?.Diagnosis && (
          <div className="flex">
            <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
            {medicationPrescribed.Diagnosis?.Primary && (
              <span>
                {prescriptionDetailModel.diagnosisDecimal(medicationPrescribed.Diagnosis.Primary.Code)} {medicationPrescribed.Diagnosis.Primary.Description}
              </span>
            )}
            {medicationPrescribed.Diagnosis?.Secondary && (
              <span>
                {prescriptionDetailModel.diagnosisDecimal(medicationPrescribed.Diagnosis.Secondary.Code)} {medicationPrescribed.Diagnosis.Secondary.Description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

OriginalMedication.displayName = 'OriginalMedication';
export default OriginalMedication;
