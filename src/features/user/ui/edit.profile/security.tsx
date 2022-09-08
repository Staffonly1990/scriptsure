import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './edit.profile.module.css';
import MaskInput from 'shared/ui/mask.input';
import Input from './input';
import Select from 'shared/ui/select';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { userModel } from '../../model';
import { useFormContext } from 'react-hook-form';
import { isNil } from 'lodash';

const Security: FC = observer(() => {
  const form = useFormContext();
  const challengeQuestionList = [
    { value: '1', label: `What is the first name of the maid of honor at your wedding?` },
    { value: '2', label: `What is your maternal grandfather's first name?` },
    { value: '3', label: `In what city was your high school?` },
    { value: '4', label: `What is your best friend's first name?` },
    { value: '5', label: `What is the name of your first pet?` },
    { value: '6', label: `In what city were you married? (full name of city only)` },
    { value: '7', label: `What was the name of your High School` },
    { value: '8', label: `What is your maternal grandmother's first name?` },
    { value: '9', label: `What is your father's middle name?` },
    { value: '10', label: `What is the first name of your oldest nephew?` },
    { value: '11', label: `What is the name of the first company you worked for?` },
  ];

  const loading = isNil(form.getValues('prescriber'));

  useEffect(() => {
    if (loading) {
      form.setValue('prescriber', userModel.dataPlatform?.prescriber);
      form.setValue('supportingStaff', !userModel.dataPlatform?.prescriber);
      form.setValue('supervisor', userModel.dataPlatform?.supervisor);
      form.setValue('recoveryPhone', userModel.dataPlatform?.recoveryPhone);
      form.setValue('recoveryEmail', userModel.dataPlatform?.recoveryEmail);
      form.setValue('challengeQuestion1', userModel.dataPlatform?.challengeQuestionOne);
      form.setValue('challengeQuestion2', userModel.dataPlatform?.challengeQuestionTwo);
      form.setValue('answer1', userModel.dataPlatform?.challengeAnswerOne);
      form.setValue('answer2', userModel.dataPlatform?.challengeAnswerTwo);
    }
  }, [loading]);

  const body = (
    <div className="px-6 py-3">
      <div className="py-3">
        <div className="flex py-2 border-2 max-w-max">
          <div className="px-4 py-2 w-1/2">
            <label className="form-control-label __end">
              <input
                className="form-checkbox"
                type="checkbox"
                {...form.register('prescriber')}
                onChange={() => {
                  form.setValue('supportingStaff', false);
                  form.setValue('prescriber', true);
                }}
                aria-describedby="helper-text-id-1-b"
              />
              <div>
                <div className="form-control-label_label text-lg">Prescriber</div>
                <div className="form-helper-text" id="helper-text-id-1-b">
                  You are being registered as a user who can prescribe and dispense medications (Doctor, MD, DO, NP, APRN, PA, Etc.)
                </div>
              </div>
            </label>
          </div>

          <div className="px-4 py-2 w-1/2">
            <label className="form-control-label __end">
              <input
                className="form-checkbox"
                type="checkbox"
                {...form.register('supportingStaff')}
                onChange={() => {
                  form.setValue('prescriber', false);
                  form.setValue('supportingStaff', true);
                  form.setValue('supervisor', false);
                }}
                aria-describedby="helper-text-id-1-b"
              />
              <div>
                <div className="form-control-label_label text-lg">Supporting Staff</div>
                <div className="form-helper-text" id="helper-text-id-1-b">
                  You are being form.registered as a user who will not prescribe and dispense medications (Nurse, Secretary, IT, Supporting Staff, Etc.)
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {form.getValues('prescriber') && (
        <div className="py-3">
          <div className="flex py-2 border-2 max-w-max">
            <div className="px-4 py-2">
              <label className="form-control-label __end">
                <input className="form-checkbox" type="checkbox" {...form.register('supervisor')} aria-describedby="helper-text-id-1-b" />
                <div>
                  <div className="form-control-label_label text-lg">Supervisor</div>
                  <div className="form-helper-text" id="helper-text-id-1-b">
                    Click here if you will be supervising other prescribers dispensing medications
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="py-3">
        <div className="flex max-w-max gap-3">
          <div className="border-2 px-3 py-6 w-1/3">
            <div className="text-2xl">Recovery</div>
            <div className="py-3">
              Please provide a US based phone to receive your security code. We will use this number to send a security code when you need to login from a new
              device to verify access and in circumstances you need to reset your password. In addition, add a recovery email address to be used as an
              alternative authentication process, or in the event you forget your login email.
            </div>

            <div className="h-20 flex items-center">
              <div className="relative h-max">
                <label className="form-label flex absolute w-full bottom-6" htmlFor="recoveryPhone">
                  Recovery Cell Phone
                </label>
                <MaskInput
                  id="recoveryPhone"
                  {...form.register('recoveryPhone', {
                    minLength: 10,
                    maxLength: 10,
                  })}
                  type="text"
                  autoComplete="off"
                  placeholder="(___) ___-____"
                  options={{ mask: '(999) 999-9999' }}
                />
              </div>
            </div>
            <Input value={form.getValues('recoveryEmail')} id="recoveryEmail" label="Recovery Email" form={form} />
          </div>
          <div className="border-2 px-3 py-6 w-1/3">
            <div className="text-2xl">Challenge Questions</div>
            <div className="py-3">Please set 2 challenge questions below</div>

            <div className="flex items-center relative h-20">
              <Select
                classes={{ options: '!z-modalForefront' }}
                width="w-full"
                selectIcon={<ChevronDownIcon />}
                value={form.getValues('challengeQuestion1')}
                options={challengeQuestionList}
                {...form.register('challengeQuestion1')}
                label={<label className="form-label text-xs opacity-50 absolute bottom-14">Challenge Question 1</label>}
              />
            </div>

            <Input id="answer1" label="Answer 1" form={form} />

            <div className="flex items-center relative h-20">
              <Select
                classes={{ options: '!z-modalForefront' }}
                width="w-full"
                selectIcon={<ChevronDownIcon />}
                options={challengeQuestionList}
                value={form.getValues('challengeQuestion2')}
                {...form.register('challengeQuestion2')}
                label={<label className="form-label text-xs opacity-50 absolute bottom-14">Challenge Question 2</label>}
              />
            </div>

            <Input id="answer2" label="Answer 2" form={form} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="title text-white bg-blue-500 px-6 py-4 flex justify-between">
        <h5 className="title text-white">Security</h5>
      </div>
      {body}
    </div>
  );
});

Security.displayName = 'Security';
export default Security;
