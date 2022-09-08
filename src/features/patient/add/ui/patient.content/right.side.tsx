import React, { Dispatch, FC, MutableRefObject, SetStateAction, ChangeEvent, useEffect, useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { observer, Observer } from 'mobx-react-lite';
import { Controller } from 'react-hook-form';
import { parse } from 'date-fns';
import { map, isFunction } from 'lodash';
import { toJS } from 'mobx';
import { CameraIcon } from '@heroicons/react/outline';

import { OActionStatus } from 'shared/lib/model';
import Autocomplete from 'shared/ui/autocomplete';
import Spinner from 'shared/ui/spinner';
import Popper from 'shared/ui/popper';
import Button from 'shared/ui/button';
import Select from 'shared/ui/select';
import Toggle from 'shared/ui/toggle';
import DatePicker from 'shared/ui/date.picker';
import { patientModel, patientDemographicsModel } from 'features/patient';

import LineContent from '../line.content';
import InputDefault from '../input.default';
import ControlInput from '../control.input';
import ControlSuggestions from '../control.suggestions';
import { remakeDataStatus, remakeDataEthnicity, remakeDataMaritalStatus, remakeDataRace, remakeDataLanguage } from '../../hooks';
import demographicStore from '../../../model/demographics.store';

interface IRightSideProps {
  control: any;
  trigger: any;
  register: any;
  setValue: any;
  getValues: any;
  watch: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  setPictureFormData: Dispatch<SetStateAction<FormData | undefined>>;
}

interface ISelectOption {
  label: string;
  value: any;
}

const xhrFactory = () => {
  let xhr: XMLHttpRequest;
  return () => {
    if (xhr && xhr?.abort) xhr.abort();
    xhr = new XMLHttpRequest();
    return xhr;
  };
};

const RightSide: FC<IRightSideProps> = ({ control, trigger, register, setValue, getValues, watch, innerRef, setPictureFormData }) => {
  const [defaultPatientStatuses, setDefaultPatientStatuses] = useState<ISelectOption[]>([]);
  const [defaultMaritalStatus, setDefaultMaritalStatus] = useState<ISelectOption[]>([]);
  const [defaultPatientEthnicity, setDefaultPatientEthnicity] = useState<ISelectOption[]>([]);

  const [imageDescription, setImageDescription] = useState<string>('');
  const [languageOptions, setLanguageOptions] = useState<ISelectOption[]>([]);
  const [raceOptions, setRaceOptions] = useState<ISelectOption[]>([]);
  const [alternativeRaceOptions, setAlternativeRaceOptions] = useState<ISelectOption[]>([]);
  const intl = useIntl();

  const [xhrGetUserLanguage] = useState<() => XMLHttpRequest>(() => xhrFactory());
  const [xhrGetUserRace] = useState<() => XMLHttpRequest>(() => xhrFactory());
  // TODO: come up an idea for a memo date
  const currentDate = new Date().toISOString().substring(0, 10);

  const getInitialData = useCallback(async () => {
    try {
      if (patientModel.currentPatient?.patientId) patientModel.getPatientImage(patientModel.currentPatient.patientId);
      await patientDemographicsModel.getStatus();
      await patientDemographicsModel.getMaritalStatus();
      await patientDemographicsModel.getEthnicity();

      const patientStatuses = remakeDataStatus(toJS(patientDemographicsModel.patientStatuses));
      const patientEthnicity = remakeDataEthnicity(toJS(patientDemographicsModel.patientEthnicity));
      const patientMaritalStatus = remakeDataMaritalStatus(toJS(patientDemographicsModel.patientMaritalStatus));

      setDefaultPatientStatuses(patientStatuses);
      setDefaultPatientEthnicity(patientEthnicity);
      setDefaultMaritalStatus(patientMaritalStatus);
    } catch {}
  }, []);

  const handleSetPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();

    if (event.target.files) {
      formData.append('file', event.target.files[0]);
      setImageDescription(event.target.files[0].name);
      setPictureFormData(formData);
    }
  };

  const handleRemovePicture = () => {
    if (patientModel.currentPatient?.patientId) patientModel.removePatientImage(patientModel.currentPatient.patientId);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (patientModel.currentPatient?.selectedLanguage)
      // @ts-ignore
      setLanguageOptions(remakeDataLanguage([patientModel.currentPatient.selectedLanguage]));
    // @ts-ignore
  }, [patientModel.currentPatient?.selectedLanguage]);

  useEffect(() => {
    // @ts-ignore
    if (patientModel.currentPatient?.selectedRace)
      // @ts-ignore
      setRaceOptions(remakeDataRace([patientModel.currentPatient.selectedRace]));
    // @ts-ignore
  }, [patientModel.currentPatient?.selectedRace]);

  useEffect(() => {
    // @ts-ignore
    if (patientModel.currentPatient?.selectedAlternateRace)
      // @ts-ignore
      setAlternativeRaceOptions(remakeDataRace([patientModel.currentPatient.selectedAlternateRace]));
    // @ts-ignore
  }, [patientModel.currentPatient?.selectedAlternateRace]);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <LineContent>
        <ControlInput
          control={control}
          name="patientStatusId"
          label={intl.formatMessage({ id: 'demographics.measures.patientStatus' })}
          rules={{ required: intl.formatMessage({ id: 'fields.error.required' }) }}
          required
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Select
              classes={{ placeholder: 'w-full' }}
              container={innerRef?.current}
              options={map(defaultPatientStatuses, (element) => ({
                value: element.value.toString(),
                label: element.label,
              }))}
              name={name}
              value={value ? String(value) : ''}
              onChange={(val) => {
                handleBlur();
                handleChange(val);
              }}
            />
          )}
        </ControlInput>
        <ControlInput control={control} name="maritalStatusId" label={intl.formatMessage({ id: 'demographics.measures.maritalStatus' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Select
              classes={{ placeholder: 'w-full' }}
              container={innerRef?.current}
              options={map(defaultMaritalStatus, (element) => ({
                value: element.value,
                label: element.label,
              }))}
              name={name}
              value={value ? String(value) : ''}
              onChange={(val) => {
                handleBlur();
                handleChange(val);
              }}
            />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <input type="hidden" {...register('selectedRace')} />
        <ControlInput control={control} name="raceId" label={intl.formatMessage({ id: 'demographics.measures.race' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <ControlSuggestions
              container={innerRef?.current}
              name={name}
              value={value ? String(value) : ''}
              options={raceOptions}
              loading={patientDemographicsModel.status.getUserRace === OActionStatus.Pending}
              onReset={() => {
                handleBlur();
                handleChange('');
                setRaceOptions([]);
                // @ts-ignore
                setValue('selectedRace', {
                  raceId: undefined,
                  descr: undefined,
                });
              }}
              onSelect={(val, rawValue) => {
                handleBlur();
                handleChange(rawValue?.value);
                setRaceOptions([rawValue]);
                // @ts-ignore
                setValue('selectedRace', {
                  raceId: rawValue?.value ?? '0',
                  descr: rawValue?.label ?? 'Unspecified',
                });
              }}
              onChange={async (val) => {
                if (val?.length >= 3) {
                  await patientDemographicsModel.getUserRace(val, 'alternateRace', xhrGetUserRace);
                  const patientRace = remakeDataRace(toJS(patientDemographicsModel.patientAlternativeRace));
                  setRaceOptions(patientRace);
                  return;
                }
                if (!val?.length) setRaceOptions([]);
              }}
            />
          )}
        </ControlInput>
        <input type="hidden" {...register('selectedAlternateRace')} />
        <ControlInput control={control} name="alternateRaceId" label={intl.formatMessage({ id: 'demographics.measures.altRace' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <ControlSuggestions
              container={innerRef?.current}
              name={name}
              value={value ? String(value) : ''}
              options={alternativeRaceOptions}
              loading={patientDemographicsModel.status.getUserRace === OActionStatus.Pending}
              onReset={() => {
                handleBlur();
                handleChange('');
                setAlternativeRaceOptions([]);
                // @ts-ignore
                setValue('selectedAlternateRace', {
                  raceId: undefined,
                  descr: undefined,
                });
              }}
              onSelect={(val, rawValue) => {
                handleBlur();
                handleChange(rawValue?.value);
                setAlternativeRaceOptions([rawValue]);
                // @ts-ignore
                setValue('selectedAlternateRace', {
                  raceId: rawValue?.value ?? '0',
                  descr: rawValue?.label ?? 'Unspecified',
                });
              }}
              onChange={async (val) => {
                if (val?.length >= 3) {
                  await patientDemographicsModel.getUserRace(val, 'race', xhrGetUserRace);
                  const patientRace = remakeDataRace(toJS(patientDemographicsModel.patientRace));
                  setAlternativeRaceOptions(patientRace);
                  return;
                }
                if (!val?.length) setRaceOptions([]);
              }}
            />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.ethnicity' })}>
          <Controller
            control={control}
            name="ethnicityId"
            render={({ field: { name, value, onChange } }) => (
              <Observer>
                {() => {
                  return (
                    <Select
                      name={name}
                      value={value ? String(value) : ''}
                      onChange={onChange}
                      classes={{ placeholder: 'w-full' }}
                      container={innerRef?.current}
                      options={defaultPatientEthnicity}
                      {...register('ethnicityId')}
                    />
                  );
                }}
              </Observer>
            )}
          />
        </InputDefault>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.altEthnicity' })}>
          <Controller
            control={control}
            name="alternateEthnicityId"
            render={({ field: { name, value, onChange } }) => (
              <Observer>
                {() => (
                  <Select
                    classes={{ placeholder: 'w-full' }}
                    container={innerRef?.current}
                    options={map(defaultPatientEthnicity, (element) => ({
                      value: element.value,
                      label: element.label,
                    }))}
                    name={name}
                    value={value ? String(value) : ''}
                    onChange={onChange}
                  />
                )}
              </Observer>
            )}
          />
        </InputDefault>
      </LineContent>

      <LineContent>
        <ControlInput control={control} name="sexualOrientation" label={intl.formatMessage({ id: 'demographics.measures.sexual' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Select
              classes={{ placeholder: 'w-full' }}
              container={innerRef?.current}
              options={map(demographicStore.sexualOrientations, (element) => ({
                value: element.code,
                key: element.code,
              })).map((element) => ({
                value: element.value,
                label: intl.formatMessage({ id: `user.gender.identity.${element.key}` }),
              }))}
              name={name}
              value={value ? String(value) : ''}
              onChange={(val) => {
                handleBlur();
                handleChange(val);
              }}
            />
          )}
        </ControlInput>
        <ControlInput control={control} name="genderIdentity" label={intl.formatMessage({ id: 'demographics.measures.genderIdentity' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <Select
              classes={{ placeholder: 'w-full' }}
              container={innerRef?.current}
              options={map(demographicStore.genderIdentities, (element) => ({
                value: element.code,
                key: element.code,
              })).map((element) => ({
                value: element.value,
                label: intl.formatMessage({ id: `user.gender.identity.${element.key}` }),
              }))}
              name={name}
              value={value ? String(value) : ''}
              onChange={(val) => {
                handleBlur();
                handleChange(val);
              }}
            />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <input type="hidden" {...register('selectedLanguage')} />
        <ControlInput control={control} name="languageId" label={intl.formatMessage({ id: 'demographics.measures.prefLang' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <ControlSuggestions
              container={innerRef?.current}
              name={name}
              value={value ? String(value) : ''}
              options={languageOptions}
              loading={patientDemographicsModel.status.getUserLanguage === OActionStatus.Pending}
              onReset={() => {
                handleBlur();
                handleChange('');
                setLanguageOptions([]);
                // @ts-ignore
                setValue('selectedLanguage', {
                  languageId: undefined,
                  descr: undefined,
                });
              }}
              onSelect={(val, rawValue) => {
                handleBlur();
                handleChange(rawValue?.value);
                setLanguageOptions([rawValue]);
                // @ts-ignore
                setValue('selectedLanguage', {
                  languageId: rawValue?.value ?? '0',
                  descr: rawValue?.label ?? 'Unspecified',
                });
              }}
              onChange={async (val) => {
                if (val?.length >= 3) {
                  await patientDemographicsModel.getUserLanguage(val, xhrGetUserLanguage);
                  const patientLanguages = remakeDataLanguage(toJS(patientDemographicsModel.patientLanguage));
                  setLanguageOptions(patientLanguages);
                  return;
                }
                if (!val?.length) setLanguageOptions([]);
              }}
            />
          )}
        </ControlInput>
        <InputDefault label={intl.formatMessage({ id: 'demographics.measures.profilePicture' })}>
          <div className="flex items-end gap-2">
            <div className="p-1 flex relative justify-center items-center bg-blue-400 hover:opacity-90 active:opacity-80 rounded-full">
              <CameraIcon className="w-7" />
              <input className="absolute top-0 right-0 w-full h-full opacity-0" onChange={handleSetPicture} type="file" name="picture" accept="image/*" />
            </div>
            <span className="border-b-2 border-fuchsia-600 border-dashed w-full max-w-[16vw] truncate">{imageDescription}</span>
          </div>
        </InputDefault>
      </LineContent>

      {patientModel.currentPatientImage && (
        <div className="flex flex-col justify-center w-1/2 ml-auto space-y-2">
          <img className="inline-block w-20 h-20 rounded-md" src={patientModel.currentPatientImage} alt="Current profile" />
          <div className="flex items-center justify-between space-x-2">
            <span>{intl.formatMessage({ id: 'demographics.measures.currentPicture' })}</span>
            <Button shape="smooth" type="button" disabled={patientModel.status.image === OActionStatus.Pending} onClick={handleRemovePicture}>
              {intl.formatMessage({ id: 'measures.delete' })}
            </Button>
          </div>
        </div>
      )}

      <LineContent>
        <ControlInput control={control} name="motherFirstName" label={intl.formatMessage({ id: `demographics.measures.motherName` })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
        <ControlInput control={control} name="motherLastName" label={intl.formatMessage({ id: 'demographics.measures.motherLast' })}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <input ref={ref} name={name} value={value} className="form-input w-full" onBlur={handleBlur} onChange={handleChange} />
          )}
        </ControlInput>
      </LineContent>

      <LineContent>
        <ControlInput className="flex items-end" control={control} name="hippaCompliance" label={null}>
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <div className="flex items-center gap-1 w-full">
              <Toggle
                name={name}
                checked={value}
                onChange={(val) => {
                  handleChange(val);
                  handleBlur();
                }}
              />
              <span>{intl.formatMessage({ id: 'demographics.measures.hipaaCompliant' })}</span>
            </div>
          )}
        </ControlInput>
        <ControlInput
          control={control}
          name="hippaComplianceDate"
          label={intl.formatMessage({ id: 'demographics.measures.complianceDate' })}
          defaultValue={currentDate}
        >
          {({ field: { ref, name, value, onChange: handleChange, onBlur: handleBlur } }) => (
            <DatePicker
              date={new Date(value)}
              format="MM/dd/yyyy"
              placement="auto-start"
              container={innerRef?.current}
              onDateChange={(val) => {
                handleChange(val);
                handleBlur();
              }}
            >
              {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} {...inputProps} />}
            </DatePicker>
          )}
        </ControlInput>
      </LineContent>
    </div>
  );
};

RightSide.displayName = 'RightSide';

export default observer(RightSide);
