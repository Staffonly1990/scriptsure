import React, { FC, MutableRefObject, useEffect, useState, useCallback } from 'react';
import { Observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import cx from 'classnames';
import MaskInput from 'shared/ui/mask.input';
import Select from 'shared/ui/select';
import LineContent from '../line.content';
import InputDefault from '../input.default';
import { patientDemographicsModel } from 'features/patient';
import { remakeDataRelation } from '../../hooks';

interface IEmergencyContentProps {
  register: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  control: any;
}

interface ISelectOption {
  label: string;
  value: any;
}

const EmergencyContent: FC<IEmergencyContentProps> = ({ register, innerRef, control }) => {
  const [defaultRelation, setDefaultRelation] = useState<ISelectOption[]>([]);
  const intl = useIntl();

  const getInitialValues = useCallback(async () => {
    await patientDemographicsModel.getPatientRelation();
    const patientRelation = remakeDataRelation(patientDemographicsModel.patientRelation);
    setDefaultRelation(patientRelation);
  }, []);

  useEffect(() => {
    getInitialValues();
  }, []);

  return (
    <div>
      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.emergencyContact' })}>
          <input className="border-2 border-current w-full form-input" {...register('emergencyContact')} />
        </InputDefault>
      </LineContent>

      <LineContent>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.emergencyPhone' })} 1`}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('phone1Emergency', {
              minLength: 10,
              maxLength: 10,
            })}
            type="text"
            autoComplete="on"
            placeholder="(___) ___-____"
            options={{ mask: '(999) 999-9999' }}
          />
        </InputDefault>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.emergencyPhone' })} 2`}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('phone2Emergency', {
              minLength: 10,
              maxLength: 10,
            })}
            type="text"
            autoComplete="off"
            placeholder="(___) ___-____"
            options={{ mask: '(999) 999-9999' }}
          />
        </InputDefault>
      </LineContent>

      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.kinName' })}>
          <input className="border-2 border-current w-full form-input" {...register('nextOfKinName')} />
        </InputDefault>
        <InputDefault label={intl.formatMessage({ id: 'emergency.content.kinRelationship' })}>
          <Controller
            control={control}
            name="relationId"
            render={({ field: { value, onChange } }) => (
              <Observer>
                {() => (
                  <Select
                    container={innerRef?.current}
                    options={map(defaultRelation, (element) => ({
                      value: element.value,
                      label: element.label,
                    }))}
                    name="relationId"
                    value={value ?? ''}
                    onChange={onChange}
                  />
                )}
              </Observer>
            )}
          />
        </InputDefault>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.kinPhone' })}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('nextOfKinPhone')}
            type="text"
            autoComplete="off"
            placeholder="(___) ___-____"
            options={{ mask: '(999) 999-9999' }}
          />
        </InputDefault>
      </LineContent>
    </div>
  );
};

EmergencyContent.displayName = 'EmergencyContent';

export default EmergencyContent;
