import React, { FC, useRef, useEffect, useState, useMemo, MutableRefObject } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useNotifier } from 'react-headless-notifier';
import { values, cloneDeep, isFunction } from 'lodash';

import Modal, { IModalProps } from 'shared/ui/modal';
import Button from 'shared/ui/button';
import Alert from 'shared/ui/alert';
import { IPatientAllergy } from 'shared/api/patient';
import { userModel } from 'features/user';
import { IUserData } from 'shared/api/user';
import { OActionStatus } from 'shared/lib/model';

import FormContent from '../form.content';
import { patientModel, patientDemographicsModel, patientStore } from 'features/patient';
import { getSelectedRace, getSelectedLanguage, getClearData, getElegibilityData, getErrorMessages, checkDuplicate } from '../../hooks';
import { defaultData, triggerValues } from '../../config';
import demographicStore from '../../../model/demographics.store';
import { routes } from 'shared/config';
import { useRouter, useStateRef } from 'shared/hooks';

interface IIsBlurChangeData {
  first: boolean;
  last: boolean;
  dob: boolean;
}

interface IPatientModal extends IModalProps {
  editable: boolean;
}

const AddPatientModal: FC<Pick<IPatientModal, 'open' | 'unmount' | 'hideBackdrop' | 'onClose' | 'editable'>> = ({
  open,
  unmount,
  hideBackdrop,
  onClose,
  editable,
}) => {
  const { replace } = useRouter();
  const intl = useIntl();
  const currentPatient = toJS(patientModel.currentPatient) ?? {};
  const { notify } = useNotifier();

  const methods = useForm<IPatientAllergy>({
    defaultValues: editable
      ? cloneDeep(currentPatient)
      : {
          ethnicityId: '0',
          maritalStatusId: 'U',
          patientStatusId: 0,
          alternateRaceId: '0',
          raceId: '0',
          languageId: '0',
        },
    mode: 'onTouched',
  });
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    reset,
    trigger,
    watch,
    control,
    formState: { errors, isValid, isSubmitted, isSubmitSuccessful, isSubmitting, submitCount },
  } = methods;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [pictureFormData, setPictureFormData] = useState<FormData>();
  // whene modal open we can have notifications and if we click on it our modal closed,
  // this state help me watch and if our notification is opened, i block close function
  // in nClose={isActiveNotifications ? () => {} : onClose}
  const [isActiveNotifications, setIsActiveNotifications] = useState<boolean>(false);

  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLDivElement>>(null);
  // this fields are required for open history modal with patient with a similar date
  const [listWatchedFields, setListWatchedFields] = useState<string[]>([]);
  const watchedFields = watch(['firstName', 'lastName', 'dob']);
  const errorsCount = Object.keys(errors).length;

  const [isChangeDataBlur, setIsChangeDataBlur] = useState<IIsBlurChangeData>({
    first: false,
    last: false,
    dob: false,
  });

  // useEffect(() => {
  //   if (editable && isMounted && isFunction(reset)) {
  //     const data = toJS(patientModel.currentPatient) ?? {};
  //     reset(cloneDeep(data), {
  //       keepDefaultValues: true,
  //       keepValues: false,
  //       // keepErrors: true,
  //       // keepDirty: true,
  //       // keepTouched: true,
  //       // keepIsValid: true,
  //       // keepIsSubmitted: true,
  //       // keepSubmitCount: true,
  //     });
  //   }
  // }, [editable, isMounted, reset, patientModel.currentPatient]);

  // // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   if (isMounted && isFunction(watch) && isFunction(reset) && isFunction(setValue)) {
  //     // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //     const subscription = watch(async (value, { name, type }) => {
  //       console.log(value, name, type);
  //       if (name === 'zip' && type === 'change') {
  //         const zip = value[name];
  //         if (zip?.length === 5) {
  //           await patientDemographicsModel.getCityStateByZIP(Number(zip));
  //         }

  //         const cityStateFromZip = toJS(patientDemographicsModel.cityStateByZip);
  //         if (cityStateFromZip) {
  //           // reset(
  //           //   { city: undefined, state: undefined },
  //           //   {
  //           //     keepDefaultValues: true,
  //           //     keepValues: true,
  //           //     keepErrors: true,
  //           //     keepDirty: true,
  //           //     keepTouched: true,
  //           //     keepIsValid: true,
  //           //     keepIsSubmitted: true,
  //           //     keepSubmitCount: true,
  //           //   }
  //           // );

  //           setValue('city', cityStateFromZip.City, { shouldValidate: true, shouldDirty: true });
  //           setValue('state', cityStateFromZip.StateCode, { shouldValidate: true, shouldDirty: true });
  //         }
  //       }
  //     });
  //     return () => subscription.unsubscribe();
  //   }
  // }, [isMounted, watch, reset, setValue]);

  useEffect(() => {
    if (isMounted && isFunction(trigger)) trigger(triggerValues);
  }, [isMounted, trigger]);

  const handleClose = () => {
    // console.log(getValues());
    setIsMounted(false);
    if (onClose) onClose(false);
    reset();
  };

  const handleCloseAlert = () => {
    setIsActiveNotifications(false);
  };

  const getInitialValues = async () => {
    const userData = toJS(userModel.data);
    if (userData?.currentPractice) {
      await patientModel.getPracticalDoctors(userData?.currentPractice.id);
    }
  };

  const createPatientRequests = async (data: IPatientAllergy) => {
    const userData: Nullable<IUserData> = toJS(userModel.data);
    if (editable) {
      await patientModel.updatePatient(data);
    } else {
      await patientModel.createPatient(data);
    }
    if (data?.patientId) {
      await patientModel.getPatient(data.patientId);
      demographicStore.updateCurrentPatient();
    }
    // await patientModel.refreshPatientAllergies();

    if (patientModel.status.addPatient === OActionStatus.Fulfilled) {
      if (editable) reset(cloneDeep(toJS(patientModel.currentPatient) ?? {}));
      handleClose();
      const savedPatient = toJS(patientModel.currentPatient);
      if (pictureFormData?.get('file')) {
        const formData = pictureFormData;
        // @ts-ignore
        formData?.append('patientId', savedPatient?.patientId?.toString());
        await patientModel.sendPatientImage(pictureFormData);

        if (patientModel.status.image === OActionStatus.Rejected) {
          notify(
            <Alert.Notification shape="smooth" type="error" color="red" border closable>
              <span>{intl.formatMessage({ id: 'demographics.measures.imageHeavy' })}</span>
            </Alert.Notification>
          );
        }
      }

      // @ts-ignore
      const dataAllergy: IPatientAllergy = {
        ...defaultData,
        ...savedPatient,
        // @ts-ignore
        selectedAlternateRace: savedPatient.selectedAlternateRace || { raceId: '0', descr: 'Unspecified' },
        // @ts-ignore
        selectedLanguage: savedPatient.selectedLanguage || { languageId: '0', descr: 'Unspecified' },
        // @ts-ignore
        selectedRace: savedPatient.selectedRace || { raceId: '0', descr: 'Unspecified' },
      };
      if (userData) {
        const eligibility = getElegibilityData(dataAllergy, userData);
        await patientModel.createPatientAllergy(dataAllergy);

        const allergyResponse = toJS(patientModel.allergyPatientData);
        if (allergyResponse.showEligibility) {
          await patientModel.createPatientEligibility(eligibility);
        }
      }
    } else {
      notify(
        <Alert.Notification shape="smooth" type="error" color="red" border closable>
          {patientModel.status.addPatient}
        </Alert.Notification>
      );
    }
    if (!editable && patientModel.currentPatient?.patientId) replace(routes.chart.path(patientModel.currentPatient.patientId));
  };

  const onSubmit: SubmitHandler<IPatientAllergy> = (fvalues, ferrors) => {
    const clearValues = getClearData(fvalues);
    const practiceId = getValues('practiceId');
    const doctorId = getValues('doctorId');
    const alternateRace = getValues('alternateRaceId');
    const language = getValues('languageId');
    const race = getValues('raceId');
    const selectedAlternateRace = getSelectedRace(toJS(patientDemographicsModel.patientAlternativeRace), alternateRace);
    const selectedRace = getSelectedRace(toJS(patientDemographicsModel.patientRace), race);
    const selectedLanguage = getSelectedLanguage(toJS(patientDemographicsModel.patientLanguage), language);

    const userData = toJS(userModel.data);
    // console.log('DEBUG', userData, { doctorId, practiceId }, ferrors);
    const data: IPatientAllergy = {
      ...clearValues,
      hippaComplianceDate: getValues('hippaComplianceDate'),
      doctorId: doctorId || userData?.user?.id,
      practiceId: practiceId || userData?.currentPractice?.id,
      selectedAlternateRace: selectedAlternateRace || null,
      selectedLanguage: selectedLanguage || null,
      selectedRace: selectedRace || null,
      patientSource: 1,
    };
    const editData = {
      ...currentPatient,
      ...fvalues,
    };

    createPatientRequests(editable ? editData : data);
  };

  useEffect(() => {
    // console.log({ isValid, isSubmitted, isSubmitSuccessful, isSubmitting, submitCount, errors }, errorsCount);
    const doctorPractise = toJS(patientModel.doctorsPractice);
    const userData = toJS(userModel.data);
    if (!userData || !doctorPractise.length) {
      getInitialValues();
    }

    if (submitCount > 0 && errorsCount > 0) {
      const errorMessages = getErrorMessages(errors);
      setIsActiveNotifications(true);
      notify(
        <Alert.Notification shape="smooth" type="error" color="red" border closable onClose={handleCloseAlert}>
          <div>
            <h3>{intl.formatMessage({ id: 'demographics.measures.requiredFields' })}</h3>
            {/* eslint-disable-next-line max-len */}
            <span>
              {`${intl.formatMessage({ id: 'demographics.measures.requiredFieldsCompleted' })}
               ${errorMessages}`}
            </span>
            <br />
            <span>{intl.formatMessage({ id: 'demographics.measures.pleaseCorrect' })}</span>
          </div>
        </Alert.Notification>
      );
    }
  }, [isMounted, submitCount]);

  // this useEffect i use for duplicate modal
  useEffect(() => {
    const duplicateRequest: Array<string | undefined> = toJS(patientStore.duplicateRequest);
    const fullData = watchedFields.filter((el) => el !== '');
    const bluredData = values(isChangeDataBlur).filter((el) => el === true);
    const isSendRequest = checkDuplicate(fullData, duplicateRequest);

    if (fullData.length === 3 && bluredData.length === 3 && !isSendRequest) {
      const request = {
        dob: getValues('dob') ?? '',
        lastName: getValues('lastName') ?? '',
        firstName: getValues('firstName') ?? '',
      };
      const sendData = async () => {
        await patientStore.searchDuplicate(request, fullData);
        if (toJS(patientStore.duplicateList).length > 0) {
          handleClose();
        }
      };

      sendData();
    }
  }, [listWatchedFields.length]);

  return (
    <Modal
      as="form"
      className="sm:!max-w-[90vw]"
      innerRef={setInnerRef}
      open={open}
      unmount={unmount}
      hideBackdrop={hideBackdrop}
      onClose={isActiveNotifications ? () => {} : handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {editable ? intl.formatMessage({ id: 'demographics.measures.editPatient' }) : intl.formatMessage({ id: 'demographics.measures.addNew' })}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormContent
          control={control}
          trigger={trigger}
          errors={errors}
          register={register}
          setValue={setValue}
          getValues={getValues}
          watch={watch}
          innerRef={innerRef}
          setIsMounted={setIsMounted}
          setPictureFormData={setPictureFormData}
          setIsChangeDataBlur={setIsChangeDataBlur}
          setListWatchedFields={setListWatchedFields}
        />
      </Modal.Body>

      <div className="px-3 py-3 sm:px-4 sm:py-2.5 sm:flex sm:justify-between">
        <Button className="w-full sm:ml-3 sm:w-auto" variant="flat" shape="smooth" color="blue" type="button" onClick={handleClose}>
          {intl.formatMessage({ id: 'measures.close' })}
        </Button>
        <Button
          className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
          variant="filled"
          shape="smooth"
          color="green"
          type="submit"
          disabled={isSubmitted && !isValid}
        >
          {intl.formatMessage({ id: 'measures.submit' })}
        </Button>
      </div>
    </Modal>
  );
};
AddPatientModal.displayName = 'AddPatientModal';

export default observer(AddPatientModal);
