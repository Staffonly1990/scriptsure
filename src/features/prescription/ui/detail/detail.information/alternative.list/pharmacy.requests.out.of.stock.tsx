import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { isArray } from 'lodash';

import { prescriptionDetailModel } from '../../../../model';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';

const PharmacyRequestsOutOfStock: FC = observer(() => {
  return (
    <div className="flex flex-col">
      <span className="mb-[25px] font-medium text-xl">
        Pharmacy is out of stock of the prescribed medication. Please select an alternative from below, or close the dialog and send a decline.
      </span>
      <div className="flex justify-between items-center">
        {isArray(prescriptionDetailModel.message.messageXml?.MedicationRequested) &&
          prescriptionDetailModel.message.messageXml?.MedicationRequested?.map((medicationRequested) => (
            <>
              <Tooltip
                content={`#${medicationRequested?.Quantity?.Value} ${prescriptionDetailModel.getQuantityQualifier(
                  medicationRequested?.Quantity?.QuantityUnitOfMeasure?.Code
                )} ${medicationRequested?.Sig?.SigText}`}
              >
                <span>{medicationRequested.DrugDescription}</span>
              </Tooltip>
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
            </>
          ))}
        {prescriptionDetailModel.message.messageXml?.MedicationRequested && !isArray(prescriptionDetailModel.message.messageXml?.MedicationRequested) && (
          <>
            <Tooltip
              content={`#${prescriptionDetailModel.message.messageXml?.MedicationRequested?.Quantity.Value} ${prescriptionDetailModel.getQuantityQualifier(
                prescriptionDetailModel.message.messageXml?.MedicationRequested?.Quantity?.QuantityUnitOfMeasure?.Code
              )} ${prescriptionDetailModel.message.messageXml?.MedicationRequested?.Sig?.SigText}`}
            >
              <span>{prescriptionDetailModel.message.messageXml?.MedicationRequested?.DrugDescription}</span>
            </Tooltip>
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
          </>
        )}
      </div>
    </div>
  );
});

PharmacyRequestsOutOfStock.displayName = 'PharmacyRequestsOutOfStock';
export default PharmacyRequestsOutOfStock;
