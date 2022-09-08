import React, { FC, MutableRefObject } from 'react';
import { Observer } from 'mobx-react-lite';
import { map } from 'lodash';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import LineContent from '../line.content';
import InputDefault from '../input.default';
import Select from 'shared/ui/select';
import MaskInput from 'shared/ui/mask.input';
import cx from 'classnames';
import { defaultOptionsState } from '../../config';

interface IWorkContent {
  register: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  control: any;
  trigger: any;
  setValue: any;
}

const WorkContent: FC<IWorkContent> = ({ setValue, trigger, register, innerRef, control }) => {
  const intl = useIntl();
  return (
    <div>
      <LineContent>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.workAddress' })} 1`}>
          <input className="border-2 border-current w-full form-input" {...register('addressLine1Work')} />
        </InputDefault>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.workAddress' })} 2`}>
          <input className="border-2 border-current w-full form-input" {...register('addressLine2Work')} />
        </InputDefault>
      </LineContent>
      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.zip' })}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('zipWork')}
            type="text"
            autoComplete="off"
            placeholder="_____"
            options={{ mask: '99999' }}
          />
        </InputDefault>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.city' })}>
          <input className="border-2 border-current w-full form-input" {...register('cityWork')} />
        </InputDefault>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.state' })}>
          <Controller
            control={control}
            name="stateWork"
            render={({ field: { value, onChange } }) => (
              <Observer>
                {() => (
                  <Select
                    container={innerRef?.current}
                    options={map(defaultOptionsState, (element) => ({
                      value: element.value,
                      label: element.label,
                    }))}
                    name="workState"
                    value={value ?? ''}
                    onChange={onChange}
                  />
                )}
              </Observer>
            )}
          />
        </InputDefault>
      </LineContent>
      <LineContent>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.workPhone' })} 1`}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('work')}
            type="text"
            autoComplete="off"
            placeholder="(___) ___-____"
            options={{ mask: '(999) 999-9999' }}
            onChange={(e) => {
              setValue('work', e.target.value);
              trigger(['home', 'cell']);
            }}
          />
        </InputDefault>
        <InputDefault label={`${intl.formatMessage({ id: 'demographics.measures.workPhone' })} 2`}>
          <MaskInput
            id="input-phone"
            className={cx('form-input')}
            {...register('phone2Work', {
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
    </div>
  );
};

WorkContent.displayName = 'WorkContent';

export default WorkContent;
