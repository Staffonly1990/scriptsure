import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import InputDefault from 'features/patient/add/ui/input.default';
import { prescriptionDetailModel } from '../../../../model';

interface IPharmacyRequestsPrescriberAuthorizationProps {
  register: any;
  errors: any;
  trigger: any;
}

const PharmacyRequestsPrescriberAuthorization: FC<IPharmacyRequestsPrescriberAuthorizationProps> = observer(({ errors, register, trigger }) => {
  return (
    <div className="flex flex-col">
      <span className="mb-[25px] font-medium text-xl">
        The pharmacy is requesting that the following state/federal identification for the prescriber be validated before dispensing. Enter the identification
        and click SEND:
        {prescriptionDetailModel.messageRequestDescription(prescriptionDetailModel.message.messageXml?.MessageRequestSubCode)}
      </span>
      <InputDefault label="Prescriber Authorization" error={errors.ssPriorAuthorization?.message}>
        <input
          className="form-input w-full"
          value={prescriptionDetailModel.message.ssPrescriberAuthorization}
          {...register('ssPrescriberAuthorization', {
            maxLength: { value: 35, message: 'Max Length Prior Authorization is 35' },
          })}
          onChange={(e) => {
            prescriptionDetailModel.message.ssPrescriberAuthorization = e.target.value;
            trigger('ssPrescriberAuthorization');
          }}
        />
      </InputDefault>
    </div>
  );
});

PharmacyRequestsPrescriberAuthorization.displayName = 'PharmacyRequestsPrescriberAuthorization';
export default PharmacyRequestsPrescriberAuthorization;
