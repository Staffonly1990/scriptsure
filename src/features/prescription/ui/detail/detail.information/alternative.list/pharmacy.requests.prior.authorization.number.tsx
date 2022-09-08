import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import InputDefault from 'features/patient/add/ui/input.default';
import { prescriptionDetailModel } from '../../../../model';

interface IPharmacyRequestsPriorAuthorizationNumberProps {
  register: any;
  errors: any;
  trigger: any;
}

const PharmacyRequestsPriorAuthorizationNumber: FC<IPharmacyRequestsPriorAuthorizationNumberProps> = observer(({ errors, register, trigger }) => {
  return (
    <div className="flex flex-col">
      <span className="mb-[25px] font-medium text-xl">
        Pharmacy is requesting that you supply a prior authorization number for the prescription. If the number has not been provided but the medication has
        been approved, then leave the prior authorization number blank and click send:{' '}
      </span>
      <InputDefault label="Prior Authorization" error={errors.ssPriorAuthorization?.message}>
        <input
          className="form-input w-full"
          value={prescriptionDetailModel.message.ssPriorAuthorization}
          {...register('ssPriorAuthorization', {
            maxLength: { value: 35, message: 'Max Length Prior Authorization is 35' },
          })}
          onChange={(e) => {
            prescriptionDetailModel.message.ssPriorAuthorization = e.target.value;
            trigger('ssPriorAuthorization');
          }}
        />
      </InputDefault>
    </div>
  );
});

PharmacyRequestsPriorAuthorizationNumber.displayName = 'PharmacyRequestsPriorAuthorizationNumber';
export default PharmacyRequestsPriorAuthorizationNumber;
