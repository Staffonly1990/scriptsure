import React, { FC } from 'react';
import moment from 'moment';
import { isArray } from 'lodash';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { prescriptionDetailModel } from '../../../model';
import { medicationDetailModel } from 'features/medication';

interface IDispensedMedicationProps {
  isMedication: boolean;
}

const DispensedMedication: FC<IDispensedMedicationProps> = observer(({ isMedication }) => {
  const { formatMessage } = useIntl();
  const breakpoints = useBreakpoints();
  const medicationDispensed = (isMedication ? medicationDetailModel : prescriptionDetailModel).message.messageXml?.MedicationDispensed;
  return (
    <div className="flex flex-col xl:flex-row items-center w-full">
      <>
        <div className={cx(medicationDispensed.CompoundInformation && 'blue-400', 'shadow flex flex-col w-full')}>
          <div className="flex justify-between p-[16px]">
            <div className="flex flex-col">
              {!medicationDispensed.PharmacyRequestedRefills && (
                <span className="text-xs xl:text-xl xl:font-bold">{formatMessage({ id: 'medication.dispensedPatient' })}</span>
              )}
              {medicationDispensed.PharmacyRequestedRefills && (
                <span className="text-xs xl:text-xl xl:font-bold">{formatMessage({ id: 'medication.requestedRefill' })}</span>
              )}
              {medicationDispensed?.WrittenDate?.Date && (
                <span className="text-sm opacity-50">
                  {formatMessage({ id: 'reports.measures.writtenDate' })}: {moment(new Date(medicationDispensed.WrittenDate.Date)).format('MM/DD/YYYY')}
                </span>
              )}
              {medicationDispensed?.WrittenDate?.DateTime && (
                <span className="text-sm opacity-50">
                  {formatMessage({ id: 'reports.measures.writtenDate' })}: {moment(new Date(medicationDispensed.WrittenDate.DateTime)).format('MM/DD/YYYY')}
                </span>
              )}
              {medicationDispensed?.LastFillDate?.Date && (
                <span className="text-sm opacity-50">
                  {formatMessage({ id: 'original.lastFillDate' })}: {moment(new Date(medicationDispensed.LastFillDate.Date)).format('MM/DD/YYYY')}
                </span>
              )}
            </div>
          </div>
          <div className="m-[16px] flex flex-col">
            <div className="flex flex-col">
              {medicationDispensed.PharmacyRequestedRefills && (
                <span className="text-red-500">
                  {formatMessage({ id: 'medication.numberRefillsRequested' })}: {medicationDispensed.PharmacyRequestedRefills}
                </span>
              )}

              <span className="font-bold text-xl">{medicationDispensed.DrugDescription} </span>
              {medicationDispensed.CompoundInformation && (
                <div className="flex flex-col ml-[10px] mb-[10px] text-xs">
                  <span className="italic underline">{formatMessage({ id: 'original.ingredientList' })}</span>
                  {isArray(medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                    <>
                      {medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.map((compound) => (
                        <div className="flex">
                          <span>{compound.CompoundIngredient.CompoundIngredientItemDescription} - </span>
                          <span>{compound.Quantity.Value} </span>
                          <span>{prescriptionDetailModel.getQuantityQualifier(compound.Quantity.QuantityUnitOfMeasure.Code)}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed &&
                    !isArray(medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed) && (
                      <span>
                        {medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient.CompoundIngredientItemDescription}
                        {' - '}
                        {medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.Value}{' '}
                        {prescriptionDetailModel.getQuantityQualifier(
                          medicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.Quantity.QuantityUnitOfMeasure.Code
                        )}
                      </span>
                    )}
                </div>
              )}
              <span className="text-xs">{prescriptionDetailModel.getControlledDescription(prescriptionDetailModel.message.drugcode)}</span>
            </div>
            <span className="font-bold">
              {medicationDispensed.Quantity.Value} {prescriptionDetailModel.getQuantityQualifier(medicationDispensed.Quantity.QuantityUnitOfMeasure.Code)}
            </span>
            <div className="flex">
              <span>{medicationDispensed.Sig.SigText}</span>
              <span>{medicationDispensed.Directions}</span>
            </div>
            {medicationDispensed.NumberOfRefills && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'summary.measures.refill' })}: </span>
                <span>{medicationDispensed.NumberOfRefills}</span>
              </div>
            )}
            {medicationDispensed.DaysSupply && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.daysSupply' })}: </span>
                <span>{medicationDispensed.DaysSupply}</span>
              </div>
            )}
            <div className="flex">
              <span className="xl:w-[40%]">{formatMessage({ id: 'original.substitution' })}: </span>
              <span>
                {medicationDispensed.Substitutions === '0' && formatMessage({ id: 'original.allowed' })}
                {medicationDispensed.Substitutions === '1' && formatMessage({ id: 'original.notAllowed' })}
              </span>
            </div>
            {medicationDispensed?.DrugCoded?.ProductCode?.Code && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.ndc' })}: </span>
                <span>{medicationDispensed.DrugCoded.ProductCode.Code}</span>
              </div>
            )}
            {medicationDispensed.PriorAuthorization && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.priorAuthorization' })}: </span>
                <span>{medicationDispensed.PriorAuthorization}</span>
              </div>
            )}

            {medicationDispensed?.Note && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
                <span>{medicationDispensed.Note}</span>
              </div>
            )}

            {medicationDispensed?.Diagnosis && (
              <div className="flex">
                <span className="xl:w-[40%]">{formatMessage({ id: 'original.pharmacyNote' })}: </span>
                {medicationDispensed.Diagnosis?.Primary && (
                  <span>
                    {prescriptionDetailModel.diagnosisDecimal(medicationDispensed.Diagnosis.Primary.Code)} {medicationDispensed.Diagnosis.Primary.Description}
                  </span>
                )}
                {medicationDispensed.Diagnosis?.Secondary && (
                  <span>
                    {prescriptionDetailModel.diagnosisDecimal(medicationDispensed.Diagnosis.Secondary.Code)}{' '}
                    {medicationDispensed.Diagnosis.Secondary.Description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {(prescriptionDetailModel.message.messageXml?.medicationDispensed || prescriptionDetailModel.message.messageType === 'RxChangeRequest') &&
          (prescriptionDetailModel.response === 'A' || prescriptionDetailModel.response === 'C') &&
          prescriptionDetailModel.message.messageXml?.MedicationPrescribed?.DrugDescription && (
            <div className="mt-2 xl:ml-2 xl:mt-0">
              {!breakpoints.xl && <ArrowDownIcon className="w-6 h-6" />}
              {breakpoints.xl && <ArrowRightIcon className="w-6 h-6" />}
            </div>
          )}
      </>
    </div>
  );
});

DispensedMedication.displayName = 'DispensedMedication';
export default DispensedMedication;
