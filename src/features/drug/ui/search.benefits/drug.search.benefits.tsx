import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Select from 'shared/ui/select';

export interface IDrugSearchBenefitsProps {
  onSelect: (value: any) => void;
}

const DrugSearchBenefits: FC<IDrugSearchBenefitsProps> = ({ onSelect }) => {
  const intl = useIntl();

  return (
    <Select label={<label className="form-label">{intl.formatMessage({ id: 'benefits' })}</label>} className="form-control" options={[]} onChange={onSelect} />
  );
};

DrugSearchBenefits.displayName = 'DrugSearchBenefits';
export default DrugSearchBenefits;
