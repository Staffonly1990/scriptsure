import { assign, forIn, isBoolean, isEmpty, isNumber, isString, keys, omit, pickBy } from 'lodash';
import { FieldError } from 'react-hook-form';

import {
  IPatientAllergy,
  IPatientEthnicity,
  IPatientLanguage,
  IPatientMaritalStatus,
  IPatientPreferredCommunicationId,
  IPatientRace,
  IPatientRelation,
  IPatientStatus,
} from 'shared/api/patient';
import { IDoctorData, IPractice } from 'shared/api/practice';
import { IUserData } from 'shared/api/user';
import { IEligibility } from 'shared/api/eligibility';

interface IValidElementError {
  type: string;
  message: string;
  ref: any;
}

interface IValidError {
  addressLine1?: IValidElementError | FieldError;
  city?: IValidElementError | FieldError;
  dob?: IValidElementError | FieldError;
  firstName?: IValidElementError | FieldError;
  gender?: IValidElementError | FieldError;
  home?: IValidElementError | FieldError;
  lastName?: IValidElementError | FieldError;
  patientStatusId?: IValidElementError | FieldError;
  zip?: IValidElementError | FieldError;
}

export const remakeDataStatus = (data: IPatientStatus[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.patientStatusId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataMaritalStatus = (data: IPatientMaritalStatus[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.maritalStatusId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataEthnicity = (data: IPatientEthnicity[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.ethnicityId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataPreferredCommunicationId = (data: IPatientPreferredCommunicationId[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.preferredCommunicationId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataRelation = (data: IPatientRelation[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.relationId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataRace = (data: IPatientRace[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.raceId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataPractices = (data: IPractice[] | undefined) => {
  const newFormDataArray = data?.map((el) => ({ ...el, value: el.id, label: el.name }));

  return newFormDataArray;
};

export const remakeDataLanguage = (data: IPatientLanguage[]) => {
  const newFormDataArray = data.map((el) => ({ value: el.languageId, label: el.descr }));

  return newFormDataArray;
};

export const remakeDataDoctors = (data: IDoctorData[]) => {
  const newFormDataArray = data.map((el) => ({ ...el, value: el.id, label: el.fullName }));

  return newFormDataArray;
};

export const getSelectedRace = (data: IPatientRace[], value: string) => {
  const raceData = data.filter((el) => el.raceId === value);

  return raceData[0];
};

export const getSelectedLanguage = (data: IPatientLanguage[], value: string) => {
  const languageData = data.filter((el) => el.languageId === value);

  return languageData[0];
};

export const getClearData = <T extends {}>(data: T): IPatientAllergy => {
  const numbers = pickBy(data, isNumber);
  const strings = pickBy(data, isString);
  const booleans = pickBy(data, isBoolean);
  const emptyStrings = pickBy(strings, isEmpty);
  const allKeys = keys(emptyStrings);
  const validStrings = omit(strings, allKeys);
  return <IPatientAllergy>(<unknown>assign(numbers, validStrings, booleans));
};

export const getErrorMessages = (data: IValidError) => {
  const textData: string[] = [];
  forIn(data, (value, key) => {
    switch (key) {
      case 'firstName':
        textData.push('First Name');
        break;
      case 'lastName':
        textData.push('Last Name');
        break;
      case 'dob':
        textData.push('Date of Birth');
        break;
      case 'gender':
        textData.push('Gender');
        break;
      case 'zip':
        textData.push('Zip');
        break;
      case 'city':
        textData.push('City');
        break;
      case 'state':
        textData.push('State');
        break;
      case 'home':
        textData.push('Phone');
        break;
      case 'patientStatusId':
        textData.push('Patient Status');
        break;
      case 'hippaComplianceDate':
        textData.push('Hipaa Compliant?');
        break;
      case 'addressLine1':
        textData.push('Address 1');
        break;
      default:
        break;
    }
  });
  const lastText = textData[textData.length - 1];
  let text = textData?.splice(0, textData.length - 2)?.join(', ');
  text += `, ${lastText}.`;
  return text;
};

export const getElegibilityData = (dataAllergy: IPatientAllergy, userData: Nullable<IUserData>): IEligibility => {
  if (userData && userData.currentPractice) {
    const eligibility = {
      patient: {
        address: {
          address1: dataAllergy.addressLine1,
          address2: dataAllergy.addressLine2,
          city: dataAllergy.city,
          state: dataAllergy.city,
          zipCode: dataAllergy.zip,
        },
        dateQualifiers: 'D8',
        dob: dataAllergy.dob,
        dobFormat: 'CCYYMMDD',
        firstName: dataAllergy.firstName,
        gender: dataAllergy.firstName,
        lastName: dataAllergy.lastName,
      },
      patientId: dataAllergy.patientId,
      physician: {
        additionalInformation: {
          referenceIdentification: 'T00000000020105',
          referenceIdentificationQualifier: 'SubmitterIDNumber',
        },
        address: {
          address1: userData?.currentPractice.addressLine1,
          address2: userData?.currentPractice.addressLine2,
          city: userData?.currentPractice.city,
          state: userData?.currentPractice.state,
          zipCode: userData?.currentPractice.zip,
        },
        firstName: userData?.currentPrescriber.firstName,
        identificationCode: userData?.currentPrescriber.npi,
        identificationCodeQualifier: 'ServiceProviderNumber',
        informationRecieverIdentifier: 'Facility',
        informationRecieverQualifier: 'Person',
        lastName: userData?.currentPrescriber.lastName,
        suffix: userData?.currentPrescriber.suffix,
      },
    };

    return eligibility;
  }
  return { patientId: 0 };
};

export const checkDuplicate = (current: Array<string | undefined>, past: Array<string | undefined>) => {
  let count = 0;
  current.forEach((cur, curIndex) => {
    past.forEach((pas, pasIndex) => {
      if (cur === pas && curIndex === pasIndex) {
        count += 1;
      }
    });
  });

  return count === 3;
};
