import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import LineContent from '../line.content';
import InputDefault from '../input.default';
import ControlInput from '../control.input';

interface IHealthCommentsContent {
  control: any;
  register: any;
}

const HealthCommentsContent: FC<IHealthCommentsContent> = ({ control, register }) => {
  const intl = useIntl();
  return (
    <div>
      <LineContent>
        <ControlInput control={control} name="generalHealth" label={intl.formatMessage({ id: 'add.patient.generalComment' })} rules={{ maxLength: 150 }}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <div className="flex flex-col space-y-0.5">
              <textarea
                ref={ref}
                name={name}
                value={value}
                className="form-textarea w-full min-h-[1.5rem]"
                maxLength={150}
                rows={2}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <span className="flex items-center justify-end space-x-0.5 text-xs">
                <span>{value?.length ?? 0}</span>
                <span>/</span>
                <span>150</span>
              </span>
            </div>
          )}
        </ControlInput>
      </LineContent>
    </div>
  );
};
HealthCommentsContent.displayName = 'HealthCommentsContent';

export default HealthCommentsContent;
