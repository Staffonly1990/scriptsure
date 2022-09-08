import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Observer, observer } from 'mobx-react-lite';
import { Controller, useForm } from 'react-hook-form';
import Select from 'shared/ui/select';
import { defaultOptionsState } from 'features/patient/add/config';
import MaskInput from 'shared/ui/mask.input';
import { XIcon, ArrowRightIcon } from '@heroicons/react/outline';
import Button from 'shared/ui/button';
import { toJS } from 'mobx';
import { practiceModel } from 'features/practice';
import { useStateRef } from 'shared/hooks';
import { useIntl } from 'react-intl';
import SettingsPracticeInput from './settings.practice.input';
import settingsUserModel from 'features/settings/model/settings.user.model';

interface IEditPracticeForm {
  changeActiveStep: (value: number) => void;
  handleClose: (value: boolean) => void;
  editable?: boolean;
  changePractice: (value: any) => void;
}

const SettingsPracticeEditAccountForm: FC<IEditPracticeForm> = observer(({ changeActiveStep, handleClose, editable, changePractice }) => {
  const intl = useIntl();
  const [checkedAppriss, setCheckedAppriss] = useState(false);
  const practice = toJS(practiceModel.currentAdminPractice);
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);
  const [pmpLogin, setPmpLogin] = useState('');
  const [pmpPassword, setPmpPassword] = useState('');

  const editDefaultValues = {
    addressLine1: practice?.addressLine1,
    addressLine2: practice?.addressLine2,
    businessUnitId: practice?.businessUnitId,
    city: practice?.city,
    contactName: practice?.contactName,
    countryCode: practice?.countryCode,
    facilityNpi: practice?.facilityNpi,
    fax: practice?.fax,
    footNote: practice?.footNote,
    id: practice?.id,
    invitePracticeId: practice?.invitePracticeId,
    name: practice?.name,
    otherInfo: practice?.otherInfo,
    phone: practice?.phone,
    practiceExternalId: practice?.practiceExternalId,
    practiceStatus: practice?.practiceStatus,
    prescribingName: practice?.prescribingName,
    state: practice?.state,
    taxId: practice?.taxId,
    updatedAt: new Date(),
    zip: practice?.zip,
  };

  const { register, control, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: editable ? editDefaultValues : {},
  });
  const sendAppriss = () => {
    try {
      settingsUserModel.saveApplicationSettings([
        { practiceID: practice?.id, settingID: 134, value: pmpLogin },
        { practiceID: practice?.id, settingID: 135, value: pmpPassword },
      ]);
    } catch {}
  };

  return (
    <div>
      <div className="bg-yellow-500 dark:bg-yellow-200 text-white dark:text-gray-400 text-2xl flex flex-col p-5 mb-2">
        {intl.formatMessage({ id: 'reports.measures.practice' })}
      </div>
      <form
        ref={setInnerRef}
        className="shadow-xl"
        onSubmit={handleSubmit((data) => {
          changeActiveStep(2);
          changePractice(data);
          sendAppriss();
        })}
      >
        <p className="p-5 text-xl">{intl.formatMessage({ id: 'account.details' })}</p>
        <div className="flex justify-between">
          <SettingsPracticeInput
            title={`${intl.formatMessage({ id: 'practice.measures.practiceName' })} *`}
            editable
            required
            editDefaultValues={editDefaultValues}
            styleInput="form-control m-3 w-full"
            maxLength={35}
            register={register}
            name="name"
            helperText={intl.formatMessage({ id: 'practice.name.description.printed' })}
          />
          <SettingsPracticeInput
            title={`${intl.formatMessage({ id: 'practice.measures.practice.nickName' })} *`}
            editable
            required
            editDefaultValues={editDefaultValues}
            styleInput="form-control m-3 w-full"
            maxLength={35}
            register={register}
            name="prescribingName"
            helperText={intl.formatMessage({ id: 'practice.nickname.description.presented' })}
          />
        </div>

        <p className="text-xl text-blue-600 dark:blue-300 m-4">{intl.formatMessage({ id: 'demographics.measures.address' })}</p>
        <SettingsPracticeInput
          title={`${intl.formatMessage({ id: 'address.line' })} 1`}
          editable
          editDefaultValues={editDefaultValues}
          styleInput="form-control mx-3 w-5/6"
          maxLength={35}
          register={register}
          name="addressLine1"
          required
          helperText=""
        />
        <SettingsPracticeInput
          title={`${intl.formatMessage({ id: 'address.line' })} 2`}
          editable
          editDefaultValues={editDefaultValues}
          styleInput="form-control mx-3 w-5/6"
          maxLength={35}
          register={register}
          name="addressLine2"
          required={false}
          helperText=""
        />
        <div className="flex justify-between">
          <SettingsPracticeInput
            title={`${intl.formatMessage({ id: 'demographics.measures.zip' })} *`}
            editable
            editDefaultValues={editDefaultValues}
            styleInput="mx-3 w-full"
            maxLength={5}
            register={register}
            name="zip"
            required
            helperText=""
          />
          <SettingsPracticeInput
            title={`${intl.formatMessage({ id: 'demographics.measures.city' })} *`}
            editable
            editDefaultValues={editDefaultValues}
            styleInput="mx-3 w-full"
            maxLength={35}
            register={register}
            name="city"
            required
            helperText=""
          />
          <Controller
            control={control}
            name="state"
            render={({ field: { value, onChange } }) => (
              <Observer>
                {() => (
                  <Select
                    container={formRef?.current}
                    className="w-full mx-3"
                    width="w-full"
                    name="state"
                    label={
                      <label className="text-xs opacity-50 text-primary form-label flex">{intl.formatMessage({ id: 'demographics.measures.state' })} *</label>
                    }
                    value={value ?? ''}
                    onChange={onChange}
                    options={defaultOptionsState}
                  />
                )}
              </Observer>
            )}
          />
        </div>

        <p className="text-xl text-blue-600 dark:blue-300 m-4">{intl.formatMessage({ id: 'contacts' })}</p>
        <div className="flex">
          <div className="form-control mx-3">
            <label className="text-xs opacity-50 form-label" htmlFor="practice-phone">
              {intl.formatMessage({ id: 'phone' })} *
            </label>
            <MaskInput
              className="form-input"
              id="practice-phone"
              type="text"
              autoComplete="off"
              placeholder="(___)-___-____"
              options={{ mask: '999-999-9999' }}
              {...register('phone', { required: true })}
            />
          </div>
          <div className="form-control mx-3">
            <label className="text-xs opacity-50 form-label" htmlFor="practice-fax">
              {intl.formatMessage({ id: 'fax' })} *
            </label>
            <MaskInput
              className="form-input"
              id="practice-fax"
              type="text"
              autoComplete="off"
              placeholder="(___)-___-____"
              options={{ mask: '999-999-9999' }}
              {...register('fax', { required: true })}
            />
          </div>
        </div>

        <p className="text-xl text-blue-600 dark:blue-300 m-4">{intl.formatMessage({ id: 'other.information' })}</p>
        <div>
          <div className="flex justify-between">
            <SettingsPracticeInput
              title={intl.formatMessage({ id: 'other.information' })}
              editable
              editDefaultValues={editDefaultValues}
              styleInput="form-control mx-3 w-full"
              maxLength={35}
              register={register}
              name="otherInfo"
              required={false}
              helperText=""
            />
            <SettingsPracticeInput
              title={intl.formatMessage({ id: 'footnote' })}
              editable
              editDefaultValues={editDefaultValues}
              styleInput="form-control mx-3 w-full"
              maxLength={35}
              register={register}
              name="footNote"
              required={false}
              helperText=""
            />
          </div>
          <div className="flex justify-between">
            <SettingsPracticeInput
              title={intl.formatMessage({ id: 'tax.id' })}
              editable
              editDefaultValues={editDefaultValues}
              styleInput="form-control mx-3 w-full"
              maxLength={35}
              register={register}
              name="taxId"
              required={false}
              helperText=""
            />
            <SettingsPracticeInput
              title={intl.formatMessage({ id: 'facility.npi' })}
              editable
              editDefaultValues={editDefaultValues}
              styleInput="form-control mx-3 w-full"
              maxLength={35}
              register={register}
              name="facilityNpi"
              required={false}
              helperText=""
            />
          </div>
          <div className="flex justify-between">
            <Controller
              control={control}
              name="practiceStatus"
              render={({ field: { value, onChange } }) => (
                <Observer>
                  {() => (
                    <Select
                      container={formRef?.current}
                      label={<label className="text-primary text-xs opacity-50 form-label flex">{intl.formatMessage({ id: 'measures.status' })} *</label>}
                      className="mx-3 mt-1 w-full"
                      width="w-full"
                      name="practiceStatus"
                      value={value ?? ''}
                      onChange={onChange}
                      options={[
                        { value: 0, label: intl.formatMessage({ id: 'diagnosis.measures.active' }) },
                        { value: 1, label: intl.formatMessage({ id: 'diagnosis.measures.inactive' }) },
                      ]}
                    />
                  )}
                </Observer>
              )}
            />
            <Controller
              control={control}
              name="businessUnitId"
              render={({ field: { value, onChange } }) => (
                <Observer>
                  {() => (
                    <Select
                      container={formRef?.current}
                      label={<label className="text-primary text-xs opacity-50 form-label">{intl.formatMessage({ id: 'business.unit' })} *</label>}
                      className="mx-3 mt-1 w-full"
                      width="w-full"
                      name="businessUnitId"
                      value={value ?? ''}
                      onChange={onChange}
                      options={[
                        { value: 'CureIt South', label: 'CureIt South' },
                        { value: 'CureIt North', label: 'CureIt North' },
                      ]}
                    />
                  )}
                </Observer>
              )}
            />
            <SettingsPracticeInput
              title={intl.formatMessage({ id: 'external.identification' })}
              editable
              editDefaultValues={editDefaultValues}
              styleInput="form-control mx-3 w-full"
              maxLength={50}
              register={register}
              name="practiceExternalId"
              required={false}
              helperText=""
            />
          </div>
        </div>

        <p className="text-xl text-blue-600 dark:blue-300 m-4">{intl.formatMessage({ id: 'appriss.health' })}</p>
        <div className="flex items-center m-2">
          <input type="checkbox" checked={checkedAppriss} className="form-checkbox" onChange={() => setCheckedAppriss(!checkedAppriss)} />
          <p>{intl.formatMessage({ id: 'appriss.pmp.integration' })}</p>
        </div>
        {checkedAppriss && (
          <div className="m-3">
            <div className="flex justify-between">
              <div className="form-control w-full mx-3">
                <label className="text-xs opacity-50 form-label" htmlFor="practice-appriss-login">
                  {intl.formatMessage({ id: 'practice.login' })}
                </label>
                <input className="form-input" id="practice-appriss-login" type="text" onChange={(e) => setPmpLogin(e.target.value)} />
                <p className="flex justify-end">({intl.formatMessage({ id: 'if.available' })})</p>
                <p>{intl.formatMessage({ id: 'appriss.note.username' })}</p>
              </div>
              <div className="form-control w-full mx-3">
                <label className="text-xs opacity-50 form-label" htmlFor="practice-appriss-password">
                  {intl.formatMessage({ id: 'practice.password' })}
                </label>
                <input className="form-input" id="practice-appriss-password" type="text" onChange={(e) => setPmpPassword(e.target.value)} />
                <p className="flex justify-end">({intl.formatMessage({ id: 'if.available' })})</p>
                <p>{intl.formatMessage({ id: 'appriss.note.password' })}</p>
              </div>
            </div>
            <p className="m-3">*{intl.formatMessage({ id: 'appriss.note.facility' })}</p>
          </div>
        )}
        <div className="flex justify-between">
          <Button className="m-2" onClick={() => handleClose(false)} shape="smooth" color="gray" variant="flat">
            <XIcon className="w-6 h-6 mr-2" />
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
          <Button type="submit" className="m-2" shape="smooth">
            <ArrowRightIcon className="w-6 h-6 mr-2" />
            {intl.formatMessage({ id: 'next' })}
          </Button>
        </div>
      </form>
    </div>
  );
});

SettingsPracticeEditAccountForm.displayName = 'SettingsPracticeEditAccountForm';
export default SettingsPracticeEditAccountForm;
