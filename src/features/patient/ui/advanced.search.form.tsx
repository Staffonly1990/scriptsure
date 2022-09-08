import React, { FormEvent, FC, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useForm, Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';
import type { SubmitHandler } from 'react-hook-form';
import { observer, Observer } from 'mobx-react-lite';
import { SearchIcon, XIcon, TrashIcon } from '@heroicons/react/outline';
import { isNil, isFunction, map } from 'lodash';
import cx from 'classnames';

import type { IPatientAdvancedQueryPayload } from 'shared/api/patient';
import { OActionStatus } from 'shared/lib/model';
import DatePicker from 'shared/ui/date.picker';
import Toggle from 'shared/ui/toggle';
import Button from 'shared/ui/button';
import Select from 'shared/ui/select';
import MaskInput from 'shared/ui/mask.input';

import { userModel } from 'features/user';
import { patientDemographicsModel } from '../model';

interface IPatientAdvancedSearchFormProps {
  onSubmit?: SubmitHandler<IPatientAdvancedQueryPayload>;
  onReset?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
}

const PatientAdvancedSearchForm: FC<StyledComponentProps<IPatientAdvancedSearchFormProps>> = (props) => {
  const { className, open, onSubmit, onReset, onClose, onOpen } = props;
  const [visible, setVisible] = useState(open ?? false);
  const intl = useIntl();

  useEffect(() => {
    if (
      (patientDemographicsModel.status.getStatus === OActionStatus.Initial || patientDemographicsModel.errors.getStatus !== null) &&
      !patientDemographicsModel.patientStatuses?.length
    ) {
      patientDemographicsModel.getStatus();
    }
  }, []);

  useEffect(() => {
    if (!isNil(open)) setVisible(open);
  }, [open]);

  useUpdateEffect(() => {
    if (!visible && isFunction(onClose)) onClose();
    else if (visible && isFunction(onOpen)) onOpen();
  }, [visible]);

  const { control, register, reset, handleSubmit } = useForm<IPatientAdvancedQueryPayload>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      chartId: '',
      ssn: '',
      zip: '',
      home: '',
      patientStatusId: null,
      practice: '',
      dob: '',
      removeSearch: false,
    },
  });

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    if (isFunction(onSubmit)) handleSubmit(onSubmit)(event);
  };

  const handleReset = () => {
    reset();
    if (isFunction(onReset)) onReset();
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <form
      className={cx(className, 'block overflow-hidden w-full max-w-full bg-secondary sm:rounded sm:shadow', {
        hidden: !visible,
      })}
      onSubmit={handleSend}
    >
      <div className="flex items-center justify-between px-4 py-2 sm:px-6 sm:py-4 text-white bg-blue-500 dark:bg-blue-400">
        {intl.formatMessage({ id: 'search.advancedSearch' })}
      </div>

      <div className="space-y-1 px-2 py-1 md:space-y-4 sm:px-4 sm:py-2">
        <div className="form-group md:__row">
          <div className="form-group md:__row md:w-3/6">
            <div className="form-control md:w-3/6">
              <label className="form-label" htmlFor="param-firstName">
                {intl.formatMessage({ id: 'invite.firstName' })}
              </label>
              <input
                className="form-input"
                id="param-firstName"
                // aria-describedby="helper-text-firstName"
                // placeholder="Text here..."
                type="text"
                {...register('firstName')}
              />
              {/* <span className="form-helper-text" id="helper-text-firstName">
            Helper text
          </span> */}
            </div>

            <div className="form-control md:w-3/6">
              <label className="form-label" htmlFor="param-lastName">
                {intl.formatMessage({ id: 'invite.lastName' })}
              </label>
              <input className="form-input" id="param-lastName" type="text" {...register('lastName')} />
            </div>
          </div>

          <div className="form-group md:__row md:w-3/6">
            <div className="form-control md:w-3/6">
              <label className="form-label" htmlFor="param-chartId">
                {intl.formatMessage({ id: 'search.chartNumber' })}
              </label>
              <input className="form-input" id="param-chartId" type="text" {...register('chartId')} />
            </div>

            <div className="form-control md:w-3/6">
              <label className="form-label" htmlFor="param-ssn">
                {intl.formatMessage({ id: 'demographics.measures.ssn' })}
              </label>
              <MaskInput
                className="form-input"
                id="param-ssn"
                type="text"
                autoComplete="off"
                placeholder="___-__-____"
                options={{ mask: '999-99-9999' }}
                {...register('ssn')}
              />
            </div>
          </div>
        </div>

        <div className="form-group md:__row">
          <div className="form-group md:__row md:w-3/6">
            <div className="form-control md:flex-auto md:w-3/6">
              <label className="form-label" htmlFor="param-zip">
                {intl.formatMessage({ id: 'demographics.measures.zip' })}
              </label>
              <MaskInput
                className="form-input"
                id="param-zip"
                type="text"
                autoComplete="off"
                placeholder="_____"
                options={{ mask: '99999' }}
                {...register('zip')}
              />
            </div>

            <div className="form-control md:flex-auto md:w-3/6">
              <label className="form-label" htmlFor="param-home">
                {intl.formatMessage({ id: 'search.phoneNumber' })}
              </label>
              <MaskInput
                className="form-input"
                id="param-home"
                type="text"
                autoComplete="off"
                placeholder="(___) ___-____"
                options={{ mask: '(999) 999-9999' }}
                {...register('home')}
              />
            </div>
          </div>

          <div className="form-group md:__row md:w-3/6">
            <Controller
              control={control}
              name="practice"
              render={({ field: { value, onChange } }) => (
                <Observer>
                  {() => (
                    <Select
                      className="form-control md:flex-auto md:w-2/6"
                      classes={{ placeholder: 'w-full', options: '!w-auto' }}
                      shape="round"
                      label={<label className="form-label">{intl.formatMessage({ id: 'reports.measures.practice' })}</label>}
                      options={map(userModel.data?.practices, (practice) => ({
                        value: String(practice?.id),
                        label: practice?.name,
                      }))}
                      name="practice"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                </Observer>
              )}
            />

            <Controller
              control={control}
              name="patientStatusId"
              render={({ field: { value, onChange } }) => (
                <Observer>
                  {() => (
                    <Select
                      className="form-control md:flex-auto md:w-2/6"
                      classes={{ placeholder: 'w-full', options: '!w-auto' }}
                      shape="round"
                      label={<label className="form-label">{intl.formatMessage({ id: 'measures.status' })}</label>}
                      options={map(patientDemographicsModel.patientStatuses, (status) => ({
                        value: String(status?.patientStatusId),
                        label: status?.descr,
                      }))}
                      name="patientStatusId"
                      value={value ?? ''}
                      onChange={onChange}
                    />
                  )}
                </Observer>
              )}
            />

            <div className="form-control md:flex-auto md:w-2/6">
              <label className="form-label" htmlFor="param-dob">
                {intl.formatMessage({ id: 'reports.measures.dob' })}
              </label>
              <Controller
                control={control}
                name="dob"
                render={({ field: { value, onChange } }) => (
                  <DatePicker date={value} onDateChange={onChange}>
                    {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="param-dob" {...inputProps} />}
                  </DatePicker>
                )}
              />
            </div>
          </div>
        </div>

        <div className="form-group md:__row">
          <div className="form-control">
            <fieldset className="form-group">
              <Controller
                control={control}
                name="removeSearch"
                render={({ field: { value, onChange } }) => (
                  <Toggle.Group as="span" className="form-control-label">
                    <Toggle
                      // aria-describedby="helper-text-removeSearch"
                      checked={value}
                      onChange={onChange}
                    />
                    <Toggle.Label as="span" className="form-control-label_label ml-2">
                      {intl.formatMessage({ id: 'search.includeRemovedPatients' })}
                    </Toggle.Label>
                  </Toggle.Group>
                )}
              />
            </fieldset>
            {/* <span className="form-helper-text" id="helper-text-removeSearch">
              Helper text
            </span> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse space-y-2 px-2 pb-1 md:flex-row md:items-center md:space-x-4 md:space-y-0 sm:px-4 sm:pb-2">
        <Button className="justify-center md:justify-start" variant="flat" shape="smooth" color="blue" type="button" onClick={handleDismiss}>
          <XIcon className="w-5 h-5 mr-3 md:mr-1" />
          <span>{intl.formatMessage({ id: 'measures.close' })}</span>
        </Button>

        <Button className="justify-center md:justify-start" variant="flat" shape="smooth" color="blue" type="button" onClick={handleReset}>
          <TrashIcon className="w-5 h-5 mr-3 md:mr-1" />
          <span>{intl.formatMessage({ id: 'reports.measures.clear' })}</span>
        </Button>

        <Button className="justify-center md:justify-start" variant="filled" shape="smooth" color="blue" type="submit">
          <SearchIcon className="w-5 h-5 mr-3 md:mr-1" />
          <span>{intl.formatMessage({ id: 'home.search' })}</span>
        </Button>
      </div>
    </form>
  );
};
PatientAdvancedSearchForm.displayName = 'PatientAdvancedSearchForm';

export default observer(PatientAdvancedSearchForm);
