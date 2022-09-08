import React, { Dispatch, FC, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import Toggle from 'shared/ui/toggle';

interface IAddPatientHeader {
  label: Nullable<string>;
  isRemovePatient: boolean;
  checked?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
}

const AddPatientHeader: FC<IAddPatientHeader> = ({ label, isRemovePatient, checked, onChange }) => {
  const intl = useIntl();
  return (
    <div className="flex justify-between items-center pt-4 pb-2">
      <div>
        <span>{label}</span>
      </div>
      {isRemovePatient && (
        <div className="flex items-center gap-1">
          <Toggle checked={checked} onChange={onChange} />
          <span>{intl.formatMessage({ id: 'demographics.measures.removeResults' })}</span>
        </div>
      )}
    </div>
  );
};

AddPatientHeader.displayName = 'AddPatientHeader';

export default AddPatientHeader;
