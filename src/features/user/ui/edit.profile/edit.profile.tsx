import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Button from 'shared/ui/button';
import { XIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon, CreditCardIcon } from '@heroicons/react/outline';
import Modal from 'shared/ui/modal';
import { isNil, map } from 'lodash';
import Steps from 'shared/ui/steps';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import Tooltip from 'shared/ui/tooltip';
import General from './general';
import Security from './security';
import Practices from './practices';
import { userModel, editProfile } from '../../model';
import Applications from './applications';
import PrescribeUsing from './prescribe.using';
import PrescribeFor from './prescribe.for';
import Identification from './identification';
import ServiceLevel from './service.level';
import { useForm, FormProvider } from 'react-hook-form';
import { flowResult } from 'mobx';
import Alert from 'shared/ui/alert';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

interface IEditProfile {
  setOpen: (open: boolean) => void;
  open: boolean;
}

const EditProfile: FC<IEditProfile> = observer(({ open, setOpen }) => {
  const form = useForm();
  const breakpoints = useBreakpoints();
  const [activeStep, setActiveStep] = useState(0);
  const { notify } = useNotifier();
  const intl = useIntl();
  const [openElectronicRegistration, setElectronicRegistration] = useState(false);
  const [errElectronicRegistration, setErrElectronicRegistration] = useState<Nullable<{ message: string; err: boolean }>>(null);
  form.watch([
    'endDate',
    'basicAdministrator',
    'speciality',
    'lastName',
    'firstName',
    'userStatus',
    'prescriber',
    'npi',
    'loginEmail',
    'supportingStaff',
    'supervisor',
    'core',
    'controlled',
    'refill',
    'change',
  ]);

  const serviceLevels = [
    {
      value: 138,
      checked: form.getValues('core'),
    },
    {
      value: 32,
      checked: form.getValues('controlled'),
    },
    {
      value: 4,
      checked: form.getValues('refill'),
    },
    {
      value: 16,
      checked: form.getValues('change'),
    },
  ];

  const alert = () => {
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button variant="flat" onClick={() => close()}>
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
      >
        Error add prescriber
      </Alert.Notification>
    );
  };

  const registerUser = async (
    serLevels?: {
      value: number;
      checked: any;
    }[]
  ) => {
    setErrElectronicRegistration(null);
    if (userModel.dataPlatform?.id) {
      try {
        const message = await flowResult(editProfile.registerUser(userModel.dataPlatform?.id, serLevels));
        if (message) {
          setErrElectronicRegistration({ message, err: true });
        } else if (isNil(message)) {
          setErrElectronicRegistration({
            message: 'Location not registered with SureScripts network',
            err: true,
          });
        } else {
          setErrElectronicRegistration({
            message: 'Location has been successfully registered with SureScripts network',
            err: false,
          });
        }
      } catch (error) {}
    }
  };

  const onClickEdit = async () => {
    if (userModel.dataPlatform) {
      try {
        const resSaveUser = await flowResult(editProfile.saveUser(userModel.dataPlatform, form, serviceLevels));
        const resDetail = await flowResult(editProfile.getBusinessUnitDetail(resSaveUser!.businessUnitId));
        await editProfile.updateSubscription({
          accountCode: isNil(resDetail?.BillingAccount.accountCode) ? null : resDetail!.BillingAccount.accountCode,
          billingAccountId: isNil(resDetail?.billingAccountId) ? null : resDetail!.billingAccountId,
          subscriptionMonthly: isNil(resDetail?.BillingAccount.subscriptionMonthly) ? null : resDetail?.BillingAccount.subscriptionMonthly,
          subscriptionYearly: isNil(resDetail?.BillingAccount.subscriptionYearly) ? null : resDetail?.BillingAccount.subscriptionYearly,
        });
        return true;
      } catch {
        alert();
      }
    }
    return false;
  };

  const register = () => {
    setErrElectronicRegistration(null);
    setElectronicRegistration(true);
    try {
      onClickEdit().then(() => {
        registerUser(serviceLevels);
      });
    } catch (error) {}
  };

  const complete = async () => {
    try {
      const resalt = await flowResult(onClickEdit());
      if (resalt) {
        await setOpen(false);
        await userModel.refreshSession();
        await userModel.fetch();
        await form.reset();
      }
    } catch (error) {}
  };

  const cancel = async () => {
    try {
      setOpen(false);
      await userModel.refreshSession();
      await userModel.fetch();
      await form.reset();
    } catch (error) {}
  };

  const steps = [
    {
      label: 'General',
      page: <General />,
    },
    {
      label: 'Security',
      page: <Security />,
    },
    {
      label: `Practices (${editProfile.practices.length ?? 0})`,
      page: <Practices />,
    },
    {
      label: `Applications  (${editProfile.applications.length ?? 0})`,
      page: <Applications />,
    },
    {
      label: `Prescribe Using (${editProfile.prescribers.length ?? 0})`,
      page: <PrescribeUsing />,
    },
    {
      label: `Prescribe For (${editProfile.prescribeFors.length ?? 0})`,
      page: <PrescribeFor />,
    },
    {
      label: 'Identification',
      page: <Identification />,
    },
    {
      label: 'Service Level',
      page: (
        <ServiceLevel
          serviceLevels={serviceLevels}
          onClickEdit={onClickEdit}
          setElectronicRegistration={setElectronicRegistration}
          registerUser={registerUser}
          openElectronicRegistration={openElectronicRegistration}
          errElectronicRegistration={errElectronicRegistration}
        />
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const settings = {
    nonLinear: true,
    column: true,
    activeStep,
    onSelect: setActiveStep,
  };

  const header = (
    <div>
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white flex justify-between w-full">
          <div>{`Users - ${form.getValues('firstName')} ${form.getValues('lastName')} (${userModel.dataPlatform?.id})`}</div>

          {(Number(form.getValues('userStatus')) === 0 || Number(form.getValues('userStatus')) === 1) &&
            (Number(form.getValues('userStatus')) ? (
              <div className="flex items-center">
                <Tooltip content="Inactive User">
                  <Button className="lg:mr-2" color="red" shape="circle" size={breakpoints.lg ? 'md' : 'xs'}>
                    <XIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                <span className="hidden lg:inline">Inactive</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Tooltip content="Active User">
                  <Button className="lg:mr-2" color="green" shape="circle" size={breakpoints.lg ? 'md' : 'xs'}>
                    <CheckIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                <span className="hidden lg:inline">Active</span>
              </div>
            ))}
        </Modal.Title>
      </Modal.Header>
      <div className="py-6">
        <Steps color="blue" {...settings}>
          {map(steps, ({ label }, i) => (
            <Steps.Step key={i.toString(36)}>{label}</Steps.Step>
          ))}
        </Steps>
      </div>
    </div>
  );

  const footer = (
    <Modal.Description className="flex justify-between px-6">
      <Button size={breakpoints.lg ? 'md' : 'xs'} className="mb-3" onClick={cancel}>
        <XIcon className="w-6 h-6 lg:mr-2" />
        <span className="hidden lg:inline">Cancel</span>
      </Button>

      <div className="flex items-start">
        {activeStep > 0 && (
          <Button size={breakpoints.lg ? 'md' : 'xs'} onClick={handleBack}>
            <ArrowLeftIcon className="w-6 h-6 lg:mr-2" />
            <span className="hidden lg:inline">Back</span>
          </Button>
        )}

        {steps.length < activeStep + 2 && (
          <Button onClick={register} size={breakpoints.lg ? 'md' : 'xs'}>
            <CreditCardIcon className="w-6 h-6 lg:mr-2" />
            <span className="hidden lg:inline">Register</span>
          </Button>
        )}
        <Button onClick={complete} size={breakpoints.lg ? 'md' : 'xs'}>
          <CheckIcon className="w-6 h-6 lg:mr-2" />
          <span className="hidden lg:inline">Complete</span>
        </Button>

        {steps.length > activeStep + 1 && (
          <Button size={breakpoints.lg ? 'md' : 'xs'} onClick={handleNext}>
            <span className="hidden lg:inline">Next</span>
            <ArrowRightIcon className="w-6 h-6 lg:mr-2" />
          </Button>
        )}
      </div>
    </Modal.Description>
  );
  /* 
  stage-platform.scriptsure.com/v1.0/user 
  UserSpi - get spi
  Request URL: https://stage-platform.scriptsure.com/v1.0/organization/detail
   
  https://stage-platform.scriptsure.com/v1.0/registration/prescriber/6371186779005 - this spi
  */
  return (
    <Modal className={styles.modal} open={open}>
      <div className="flex flex-col h-full">
        {header}

        <FormProvider {...form}>
          <div className="!overflow-y-auto h-full">{steps[activeStep].page}</div>
        </FormProvider>

        {footer}
      </div>
    </Modal>
  );
});

EditProfile.displayName = 'EditProfile';
export default EditProfile;
