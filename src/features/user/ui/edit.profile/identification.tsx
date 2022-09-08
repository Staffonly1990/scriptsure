import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Button from 'shared/ui/button';
import { XIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import Select from 'shared/ui/select';
import { useForm, FieldValues, UseFormReturn, useFormContext } from 'react-hook-form';

import Input from './input';
import DatePicker from 'shared/ui/date.picker';
import { getTime } from 'date-fns';
import MaskInput from 'shared/ui/mask.input';
import { userModel } from '../../model';
import { isNil } from 'lodash';

const defaultOptions = [
  { value: 'Wade Cooper', label: 'Wade Cooper' },
  { value: 'Arlene Mccoy', label: 'Arlene Mccoy' },
  { value: 'Devon Webb', label: 'Devon Webb' },
  { value: 'Tom Cook', label: 'Tom Cook' },
  { value: 'Tanya Fox', label: 'Tanya Fox' },
  { value: 'Hellen Schmidt', label: 'Hellen Schmidt' },
  { value: 'Caroline Schultz', label: 'Caroline Schultz' },
  { value: 'Mason Heaney', label: 'Mason Heaney' },
  { value: 'Claudie Smitham', label: 'Claudie Smitham' },
  { value: 'Emil Schaefer', label: 'Emil Schaefer' },
];

const Identification: FC = observer(() => {
  const form = useFormContext();
  const breakpoints = useBreakpoints();

  const loading = isNil(form.getValues('dea'));
  useEffect(() => {
    if (loading) {
      form.setValue('dea', userModel.dataPlatform?.dea);
      form.setValue('stateLicense', userModel.dataPlatform?.stateLicense);
      form.setValue('stateControlled', userModel.dataPlatform?.stateControlled);
      form.setValue('npi', userModel.dataPlatform?.npi);
      form.setValue('detox', userModel.dataPlatform?.detox);
    }
  }, [loading]);

  const body = (
    <div className="px-6">
      <div className="flex flex-col w-max">
        {/*
        ui-mask="AA9999999"
        */}
        <Input value={form.getValues('dea')} id="dea" label="DEA" form={form} />
        <Input value={form.getValues('stateLicense')} id="stateLicense" maxLength={15} label="State License (Optional)" form={form} />
        <Input value={form.getValues('stateControlled')} id="stateControlled" maxLength={35} label="State Controlled (Optional)" form={form} />
        <Input value={form.getValues('npi')} minLength={10} maxLength={10} id="npi" label="NPI" required form={form} />
        <Input value={form.getValues('detox')} id="detox" maxLength={10} label="Detox (Optional)" form={form} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between">
        <h5 className="title text-white">Identification</h5>
      </div>
      {body}
    </div>
  );
});

Identification.displayName = 'Identification';
export default Identification;
