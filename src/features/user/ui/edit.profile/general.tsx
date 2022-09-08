import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Button from 'shared/ui/button';
import { XIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import Select from 'shared/ui/select';
import { useForm, useFormContext, FieldValues, UseFormReturn } from 'react-hook-form';

import Input from './input';
import DatePicker from 'shared/ui/date.picker';
import { getTime } from 'date-fns';
import MaskInput from 'shared/ui/mask.input';
import { userModel, editProfile, addUser } from '../../model';

import moment from 'moment';
import { isNil } from 'lodash';

const salutations = [{ value: 'Dr.' }, { value: 'Mr.' }, { value: 'Mrs.' }, { value: 'Miss.' }, { value: 'Ms.' }];

const timeZone = [
  { value: 'US/Eastern' },
  { value: 'US/Central' },
  { value: 'US/Mountain' },
  { value: 'US/Arizona' },
  { value: 'US/Pacific' },
  { value: 'US/Hawaii' },
  { value: 'America/Puerto_Rico' },
  { value: 'US/Alaska' },
];

const degree = [{ value: 'PhD' }, { value: 'MD' }];

const timeType = [
  { value: 'FT', label: 'Full Time' },
  { value: 'PT', label: 'Part Time' },
];

const userType = [
  { value: 'Administrator' },
  { value: 'Dentist' },
  { value: 'Medical Intern' },
  { value: 'Medical Resident' },
  { value: 'Naturopathic' },
  { value: 'Nurse' },
  { value: 'Nurse Practitioner' },
  { value: 'Optometrist' },
  { value: 'Pharmacist' },
  { value: 'Physician' },
  { value: 'Psychologist' },
  { value: 'Physician Assistant' },
  { value: 'IT' },
  { value: 'Reception' },
  { value: 'Other Staff' },
  { value: 'Other' },
  { value: 'Veterinarian' },
];

const userStatuses = [
  { value: '0', label: 'Active' },
  { value: '1', label: 'Inactive' },
  { value: '3', label: 'Invite Sent' },
  { value: '4', label: 'Email Not Confirmed' },
  { value: '5', label: 'EULA Required' },
  { value: '6', label: 'Suspended' },
];

const General: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const form = useFormContext();

  const taxonomys = () => {
    return editProfile.taxonomys.map((obj) => {
      return { value: obj.code, label: `${obj.type} ${obj.classification} ${obj.specialization}` };
    });
  };

  const endDate = (value: Date | string | null | undefined) => {
    if (value) {
      if (form.getValues('userStatus') === '1' && new Date(value) > new Date()) {
        form.setValue('endDate', getTime(new Date()));
      } else {
        form.setValue('endDate', new Date(value) ?? getTime(new Date()));
      }
    }
  };

  const currentTaxonomy = () => {
    const current = editProfile.taxonomys.find((obj) => obj.code === userModel.dataPlatform?.specialtyCode);
    return current?.code;
  };

  const businessUnits = () => {
    if (editProfile.organization) {
      return editProfile.organization.BusinessUnits.map((unit) => {
        return { value: unit.id.toString(), label: unit.name };
      });
    }
    return [];
  };

  const loading = isNil(form.getValues('firstName'));
  useEffect(() => {
    if (loading) {
      endDate(userModel.dataPlatform?.endDt);
      form.setValue('startDate', userModel.dataPlatform?.startDt ? new Date(userModel.dataPlatform?.startDt) : new Date());
      form.setValue('salutation', userModel.dataPlatform?.salutation);
      form.setValue('firstName', userModel.dataPlatform?.firstName);
      form.setValue('middleName', userModel.dataPlatform?.middleName);
      form.setValue('lastName', userModel.dataPlatform?.lastName);
      form.setValue('suffix', userModel.dataPlatform?.suffix);
      form.setValue('speciality', currentTaxonomy());
      form.setValue('timeZone', userModel.dataPlatform?.timeZone);
      form.setValue('degree', userModel.dataPlatform?.degrees);
      form.setValue('timeType', userModel.dataPlatform?.timeType);
      form.setValue('userType', userModel.dataPlatform?.userType);
      form.setValue('userStatus', userModel.dataPlatform?.userStatus.toString());
      form.setValue('businessUnit', userModel.dataPlatform?.businessUnitId?.toString());
      form.setValue('externalIdentification', userModel.dataPlatform?.userExternalId);
      form.setValue('cellPhone', userModel.dataPlatform?.cellPhone);
      form.setValue('loginEmail', userModel.dataPlatform?.email);
      form.setValue('fullAdministrator', userModel.isAdministrator());
      form.setValue('basicAdministrator', userModel.isBusinessUnitAdmin());
    }
  }, [loading]);

  useEffect(() => {
    if (form.getValues('userStatus') === '1') {
      if (form.getValues('endDate') > new Date()) {
        endDate(new Date());
      }
    }
  }, [form.getValues('userStatus')]);

  const checkEmail = async () => {
    try {
      await addUser.checkEmail(form.getValues('loginEmail'));
    } catch {}
  };

  const content = (
    <div className="px-6">
      <div className="flex gap-2 items-center">
        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={salutations}
            value={form.getValues('salutation')}
            {...form.register('salutation')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">Salutation</label>}
          />
        </div>
        <Input value={form.getValues('firstName')} id="firstName" label="First Name" maxLength={35} required form={form} />
        <Input value={form.getValues('middleName')} id="middleName" label="Middle Name" maxLength={35} form={form} />
        <Input value={form.getValues('lastName')} id="lastName" label="Last Name" maxLength={35} required form={form} />
        <Input value={form.getValues('suffix')} id="suffix" label="Suffix (MD, RN, NP)" maxLength={10} form={form} />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex items-center w-max">
          <div className="flex items-center relative h-24 w-full">
            <Select
              classes={{ options: '!w-auto !z-modalForefront' }}
              width="w-40"
              selectIcon={<ChevronDownIcon />}
              options={taxonomys()}
              value={form.getValues('speciality')}
              {...form.register('speciality')}
              label={<label className="form-label text-xs opacity-50 absolute bottom-16">Speciality</label>}
            />
          </div>
          <Button
            onClick={() => {
              form.setValue('speciality', 'No selected');
            }}
            variant="flat"
            shape="circle"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={timeZone}
            value={form.getValues('timeZone')}
            {...form.register('timeZone')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">Time Zone</label>}
          />
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={degree}
            value={form.getValues('degree')}
            {...form.register('degree')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">Degree</label>}
          />
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={timeType}
            value={form.getValues('timeType')}
            {...form.register('timeType')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">Time Type</label>}
          />
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={userType}
            value={form.getValues('userType')}
            {...form.register('userType')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">User Type</label>}
          />
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={userStatuses}
            value={form.getValues('userStatus')}
            {...form.register('userStatus')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">User Status</label>}
          />
        </div>

        <div className="flex items-center relative h-24">
          <Select
            classes={{ options: '!z-modalForefront' }}
            width="w-40"
            selectIcon={<ChevronDownIcon />}
            options={businessUnits()}
            value={form.getValues('businessUnit')}
            {...form.register('businessUnit')}
            label={<label className="form-label text-xs opacity-50 absolute bottom-16">Business Unit</label>}
          />
        </div>
        <Input value={form.getValues('externalIdentification')} id="externalIdentification" label="External Identification" maxLength={50} form={form} />
      </div>
    </div>
  );

  const contact = (
    <div className="px-6 pb-6">
      <div className="relative flex items-center h-24">
        <label className="form-label flex absolute bottom-16" htmlFor="cellPhone">
          Cell Phone
        </label>
        <MaskInput
          id="cellPhone"
          {...form.register('cellPhone', {
            minLength: 10,
            maxLength: 10,
          })}
          type="text"
          autoComplete="off"
          placeholder="(___) ___-____"
          options={{ mask: '(999) 999-9999' }}
        />
        <div className="absolute top-16">Account alerts and notifications may be sent by SMS text to this number</div>
      </div>

      <Input
        comment="Account alerts and notifications may be sent to this email when enabled"
        id="loginEmail"
        error={addUser.mailError ? 'Email is already taken' : ''}
        value={form.getValues('loginEmail')}
        onBlur={checkEmail}
        form={form}
        required
        label="Login Email"
      />
    </div>
  );

  const duration = (
    <div className="flex px-6 py-6">
      <DatePicker format="dd.MM.yyyy" date={form.getValues('startDate')}>
        {({ inputProps, focused }) => (
          <label htmlFor="startDate" className="flex items-center">
            <div>Start Date</div>
            <CalendarIcon color="gray" className="w-6 h-6" />
            <input disabled id="startDate" className={`form-input${focused ? ' -focused' : ''}`} {...inputProps} />
          </label>
        )}
      </DatePicker>
      <DatePicker format="dd.MM.yyyy" date={form.getValues('endDate')} onDateChange={endDate}>
        {({ inputProps, focused }) => (
          <label htmlFor="endDate" className="flex items-center">
            <div>End Date</div>
            <CalendarIcon color="gray" className="w-6 h-6 cursor-pointer" />
            <input id="endDate" className={`form-input${focused ? ' -focused' : ''}`} {...inputProps} />
          </label>
        )}
      </DatePicker>
    </div>
  );

  const administrator = (
    <div className="flex items-center px-6 py-6">
      <label className="form-control-label __end">
        <input
          className="form-checkbox"
          type="checkbox"
          {...form.register('basicAdministrator')}
          onChange={() => {
            form.setValue('basicAdministrator', !form.getValues('basicAdministrator'));
            form.setValue('fullAdministrator', false);
          }}
          aria-describedby="helper-text-id-1-b"
        />
        <div>
          <span className="form-control-label_label text-lg">Basic Administrator</span>
          <span className="form-helper-text text-gray-300" id="helper-text-id-1-b">
            Check if this user is permitted to change practice and clinical application settings
          </span>
        </div>
      </label>
      {form.getValues('basicAdministrator') && (
        <label className="form-control-label __end">
          <input className="form-checkbox" type="checkbox" {...form.register('fullAdministrator')} aria-describedby="helper-text-id-1-b" />
          <div>
            <span className="form-control-label_label text-lg">Full Administrator</span>
            <span className="form-helper-text text-gray-300" id="helper-text-id-1-b">
              Check if this user is permitted to Add, Invite and Edit users of the organization
            </span>
          </div>
        </label>
      )}
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between">
        <h5 className="title text-white">General</h5>
      </div>
      {content}
      <div>
        <h5 className="title text-gray-500 bg-gray-100 px-6 py-4">Contact</h5>
      </div>
      {contact}
      <div className="flex items-start">
        <div className="w-1/2">
          <div>
            <h5 className="title text-gray-500 bg-gray-100 px-6 py-4">Duration</h5>
          </div>
          {duration}
        </div>
        <div className="w-1/2">
          <div>
            <h5 className="title text-gray-500 bg-gray-100 px-6 py-4">Administrator</h5>
          </div>
          {administrator}
        </div>
      </div>
    </div>
  );
});

General.displayName = 'General';
export default General;
