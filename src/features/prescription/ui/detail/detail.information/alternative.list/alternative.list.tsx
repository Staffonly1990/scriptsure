import React, { FC } from 'react';
import cx from 'classnames';

import { prescriptionDetailModel } from '../../../../model';
import PharmacyRequestsPriorAuthorizationNumber from './pharmacy.requests.prior.authorization.number';
import PharmacyRequestsPrescriberAuthorization from './pharmacy.requests.prescriber.authorization';
import PharmacyRequestsOutOfStock from './pharmacy.requests.out.of.stock';
import PharmacyRequestDrugUseEvaluation from './pharmacy.request.drug.use.evaluation';
import PharmacyRequestGenericSubstitution from './pharmacy.request.generic.substitution';
import PharmacyRequestScriptClarification from './pharmacy.request.script.clarification';
import TherapeuticAlternativeList from './therapeutic.alternative.list';

interface IAlternativeListProps {
  register: any;
  errors: any;
  trigger: any;
}

const AlternativeList: FC<IAlternativeListProps> = ({ register, errors, trigger }) => {
  return (
    <div>
      <div
        className={cx(
          prescriptionDetailModel.getMessageRequestColor(prescriptionDetailModel.message.messageXml?.MessageRequestCode),
          'flex items-start w-full p-[16px] bg-blue-500'
        )}
      >
        <span className="xl:text-xl">
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'T' && 'Pharmacy Suggested Alternative'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'P' && 'Prior Authorization'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'U' && 'Prescriber Authorization'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'OS' && 'Out of Stock'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'D' && 'Drug Use Evaluation'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'G' && 'Generic Substitution'}
          {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'S' && 'Script Clarification'}
        </span>
      </div>
      <div className="w-full shadow p-[16px]">
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'P' && (
          <PharmacyRequestsPriorAuthorizationNumber register={register} errors={errors} trigger={trigger} />
        )}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'U' && (
          <PharmacyRequestsPrescriberAuthorization register={register} errors={errors} trigger={trigger} />
        )}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'OS' && <PharmacyRequestsOutOfStock />}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'D' && <PharmacyRequestDrugUseEvaluation />}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'S' && <PharmacyRequestScriptClarification />}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'G' && <PharmacyRequestGenericSubstitution />}
        {prescriptionDetailModel.message.messageXml?.MessageRequestCode === 'T' && <TherapeuticAlternativeList />}
      </div>
    </div>
  );
};

AlternativeList.displayName = 'AlternativeList';
export default AlternativeList;
