import React, { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useState, useCallback, FocusEvent, useContext } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useIntl } from 'react-intl';
import { useUpdateEffect } from 'react-use';
import { observer, Observer } from 'mobx-react-lite';
import { map, some } from 'lodash';
import { useWatch } from 'react-hook-form';
import { remakeDataPreferredCommunicationId } from '../../hooks';
import { toJS } from 'mobx';
import { lightFormat } from 'date-fns';

import Select from 'shared/ui/select';
import Toggle from 'shared/ui/toggle/toggle';
import MaskInput from 'shared/ui/mask.input';
import DatePicker from 'shared/ui/date.picker';

import LineContent from '../line.content';
import ControlInput from '../control.input';
import { patientDemographicsModel } from 'features/patient';
import { defaultOptionsGender, defaultOptionsState } from '../../config';
import { LangContext } from 'shared/lib/locales';

interface IIsBlurChangeData {
  first: boolean;
  last: boolean;
  dob: boolean;
}

interface ISelectOption {
  label: string;
  value: any;
}

interface ILeftSideProps {
  control: any;
  trigger: any;
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  watch: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  isMedHistory: boolean;
  setIsMedHistory: Dispatch<SetStateAction<boolean>>;
  setIsChangeDataBlur: Dispatch<SetStateAction<IIsBlurChangeData>>;
  setListWatchedFields: Dispatch<SetStateAction<string[]>>;
}

const LeftSide: FC<ILeftSideProps> = ({
  control,
  trigger,
  register,
  setValue,
  getValues,
  watch,
  innerRef,
  isMedHistory,
  setIsChangeDataBlur,
  setIsMedHistory,
  setListWatchedFields,
}) => {
  const { lang } = useContext(LangContext);

  const intl = useIntl();
  // const forceUpdate = useUpdate();

  const zip = useWatch({
    control,
    name: 'zip',
    defaultValue: undefined,
  });

  const [defaultPreferredCommunicationId, setDefaultPreferredCommunicationId] = useState<ISelectOption[]>([]);
  const getInitialValues = useCallback(async () => {
    await patientDemographicsModel.getPreferredCommunicationId();

    const patientPreferredCommunicationId = remakeDataPreferredCommunicationId(toJS(patientDemographicsModel.patientPreferredCommunicationId));

    setDefaultPreferredCommunicationId(patientPreferredCommunicationId);
  }, []);

  const onBlur = (e: FocusEvent<HTMLInputElement>, name: string) => {
    setListWatchedFields((prevState) => [...prevState, e.target.value]);
    setIsChangeDataBlur((prevState) => ({ ...prevState, [name]: true }));
  };

  const onFocus = (name: string) => {
    setIsChangeDataBlur((prevState) => ({ ...prevState, [name]: false }));
  };

  useEffect(() => {
    getInitialValues();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      if (zip?.length === 5) {
        await patientDemographicsModel.getCityStateByZIP(Number(zip));
      }

      const cityStateFromZip = toJS(patientDemographicsModel.cityStateByZip);
      if (cityStateFromZip) {
        // setValue('city', undefined, { shouldValidate: false, shouldDirty: false });
        // setValue('state', undefined, { shouldValidate: false, shouldDirty: false });

        setValue('city', cityStateFromZip.City, { shouldValidate: true, shouldDirty: true });
        setValue('state', cityStateFromZip.StateCode, { shouldValidate: true, shouldDirty: true });
      }
    })();
  }, [zip, setValue]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <LineContent>
        <ControlInput
          control={control}
          name="firstName"
          label={intl.formatMessage({ id: 'demographics.measures.first' })}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              onBlur={(e) => {
                onBlur(e, 'first');
                handleBlur();
              }}
              onFocus={() => onFocus('first')}
              onChange={handleChange}
            />
          )}
        </ControlInput>
        <ControlInput control={control} name="middleName" label={intl.formatMessage({ id: 'demographics.measures.middle' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="lastName"
          label={intl.formatMessage({ id: 'demographics.measures.last' })}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              onBlur={(e) => {
                onBlur(e, 'last');
                handleBlur();
              }}
              onFocus={() => onFocus('last')}
              onChange={handleChange}
            />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput control={control} name="suffix" label={intl.formatMessage({ id: 'demographics.measures.suffix' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="ssn"
          label={intl.formatMessage({ id: 'demographics.measures.ssn' })}
          rules={{
            minLength: {
              value: 9,
              message: intl.formatMessage({ id: 'fields.string.min' }, { value: 9 }),
            },
            maxLength: {
              value: 9,
              message: intl.formatMessage({ id: 'fields.string.max' }, { value: 9 }),
            },
          }}
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <MaskInput
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              autoComplete="off"
              placeholder="___-__-____"
              options={{ mask: '999-99-9999' }}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="dob"
          label={intl.formatMessage({ id: 'demographics.measures.dob' })}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <DatePicker.Input
              name={name}
              value={value}
              min={new Date(1900, 1, 1)}
              max={new Date()}
              className="form-input w-full"
              autoComplete="off"
              format={lang === 'ru' ? 'мм/дд/гггг' : 'MM/dd/yyyy'}
              onBlur={(e) => {
                onBlur(e, 'dob');
                handleBlur();
              }}
              onFocus={() => onFocus('dob')}
              onChange={(val) => handleChange(val ? lightFormat(val, 'yyyy-MM-dd') : '')}
            />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="gender"
          label={intl.formatMessage({ id: 'demographics.measures.gender' })}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Observer>
              {() => (
                <Select
                  classes={{ placeholder: 'w-full' }}
                  container={innerRef?.current}
                  options={map(defaultOptionsGender, (element) => ({
                    value: element.value,
                    label: intl.formatMessage({ id: `user.gender.identity.${element.key}` }),
                  }))}
                  name={name}
                  value={value ?? ''}
                  onChange={(val) => {
                    handleBlur();
                    handleChange(val);
                  }}
                />
              )}
            </Observer>
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput
          control={control}
          name="addressLine1"
          label={`${intl.formatMessage({ id: 'demographics.measures.address' })} 1`}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput control={control} name="addressLine2" label={`${intl.formatMessage({ id: 'demographics.measures.address' })} 2`}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput
          control={control}
          name="zip"
          label={intl.formatMessage({ id: 'demographics.measures.zip' })}
          rules={{
            required: intl.formatMessage({ id: 'fields.error.required' }),
            minLength: { value: 5, message: intl.formatMessage({ id: 'fields.string.min' }, { value: 5 }) },
            maxLength: { value: 9, message: intl.formatMessage({ id: 'fields.string.max' }, { value: 9 }) },
          }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <MaskInput
              name={name}
              value={value}
              className="form-input w-full"
              autoComplete="off"
              placeholder="_____-____"
              options={{ mask: '99999-9999' }}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="city"
          label={intl.formatMessage({ id: 'demographics.measures.city' })}
          // rules={{ required: 'Required', deps: ['zip'] }}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="state"
          label={intl.formatMessage({ id: 'demographics.measures.state' })}
          // rules={{ required: 'Required', deps: ['zip'] }}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Observer>
              {() => (
                <Select
                  classes={{ placeholder: 'w-full' }}
                  container={innerRef?.current}
                  options={map(defaultOptionsState, (element) => ({
                    value: element.value,
                    label: element.label,
                  }))}
                  name={name}
                  value={value ?? ''}
                  onChange={(val) => {
                    handleBlur();
                    handleChange(val);
                  }}
                />
              )}
            </Observer>
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput
          control={control}
          name="home"
          label={intl.formatMessage({ id: 'demographics.measures.homePhone' })}
          rules={{
            minLength: {
              value: 10,
              message: intl.formatMessage(
                { id: 'demographics.measures.mustBeDigits' },
                { name: intl.formatMessage({ id: 'demographics.measures.homePhone' }), value: 10 }
              ),
            },
            validate: {
              required: (v) => {
                const [cell, work] = getValues(['cell', 'work']);
                const hasAnyPhone = some([v, cell, work], (s) => s?.length > 0);
                return hasAnyPhone || intl.formatMessage({ id: 'demographics.measures.phoneRequired' });
              },
            },
          }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <MaskInput
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              autoComplete="off"
              placeholder="(___) ___-____"
              options={{ mask: '(999) 999-9999' }}
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e);
                trigger(['home', 'cell', 'work']);
              }}
            />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="cell"
          label={intl.formatMessage({ id: 'demographics.measures.cellPhone' })}
          rules={{
            minLength: {
              value: 10,
              message: intl.formatMessage(
                { id: 'demographics.measures.mustBeDigits' },
                { name: intl.formatMessage({ id: 'demographics.measures.cellPhone' }), value: 10 }
              ),
            },
            validate: {
              required: (v) => {
                const [home, work] = getValues(['home', 'work']);
                const hasAnyPhone = some([v, home, work], (s) => s?.length > 0);
                return hasAnyPhone || intl.formatMessage({ id: 'demographics.measures.phoneRequired' });
              },
            },
          }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <MaskInput
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              autoComplete="off"
              placeholder="(___) ___-____"
              options={{ mask: '(999) 999-9999' }}
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e);
                trigger(['home', 'cell', 'work']);
              }}
            />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="work"
          label={intl.formatMessage({ id: 'demographics.measures.workPhone' })}
          rules={{
            minLength: {
              value: 10,
              message: intl.formatMessage(
                { id: 'demographics.measures.mustBeDigits' },
                { name: intl.formatMessage({ id: 'demographics.measures.workPhone' }), value: 10 }
              ),
            },
            validate: {
              required: (v) => {
                const [home, cell] = getValues(['home', 'cell']);
                const hasAnyPhone = some([v, home, cell], (s) => s?.length > 0);
                return hasAnyPhone || intl.formatMessage({ id: 'demographics.measures.phoneRequired' });
              },
            },
          }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <MaskInput
              ref={ref}
              name={name}
              value={value}
              className="form-input w-full"
              autoComplete="off"
              placeholder="(___) ___-____"
              options={{ mask: '(999) 999-9999' }}
              onBlur={handleBlur}
              onChange={(e) => {
                handleChange(e);
                trigger(['home', 'cell', 'work']);
              }}
            />
          )}
        </ControlInput>
      </LineContent>

      <div className="flex items-center gap-1">
        <Toggle checked={isMedHistory} onChange={setIsMedHistory} />
        <span>{intl.formatMessage({ id: 'demographics.measures.downloadHistory' })}</span>
      </div>

      <LineContent>
        <ControlInput control={control} name="email" label={intl.formatMessage({ id: 'demographics.measures.primaryEmail' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="preferredCommunicationId"
          label={intl.formatMessage({ id: 'demographics.measures.communication' })}
          defaultValue="P"
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Select
              classes={{ placeholder: 'w-full' }}
              container={innerRef?.current}
              options={map(defaultPreferredCommunicationId, (element) => ({
                value: element.value,
                label: element.label,
              }))}
              name={name}
              value={value ?? ''}
              onChange={(val) => {
                handleBlur();
                handleChange(val);
              }}
            />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput control={control} name="generalComment" label={intl.formatMessage({ id: 'measures.comment' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <>
              <TextareaAutosize
                ref={ref}
                name={name}
                value={value}
                className="form-textarea w-full"
                rows={1}
                onBlur={handleBlur}
                onChange={handleChange}
                {...register('generalComment', {
                  maxLength: {
                    value: 150,
                    message: intl.formatMessage({ id: 'medication.maxLengthComment' }, { value: 150 }),
                  },
                })}
              />
              <div className="flex justify-end w-full">
                <span>{watch('generalComment')?.length || 0}/150</span>
              </div>
            </>
          )}
        </ControlInput>
      </LineContent>

      <input disabled className="hidden" {...register('consent', { value: isMedHistory ? 1 : null })} />
    </div>
  );
};
LeftSide.displayName = 'LeftSide';

export default observer(LeftSide);
