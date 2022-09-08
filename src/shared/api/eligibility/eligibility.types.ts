export interface IEligibilityAddInfo {
  referenceIdentificationQualifier?: string;
  referenceIdentification?: string;
}

export interface IEligibilityAddress {
  address1?: string;
  address2?: null | string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface IEligibilityPhysician {
  additionalInformation?: IEligibilityAddInfo;
  address?: IEligibilityAddress;
  firstName?: string;
  identificationCode?: string;
  identificationCodeQualifier?: string;
  informationRecieverIdentifier?: string;
  informationRecieverQualifier?: string;
  lastName?: string;
  suffix?: null | string;
}

export interface IEligibilityPatient {
  dateQualifiers?: string;
  dob?: string;
  dobFormat?: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
}

export interface IEligibility {
  patient?: IEligibilityPatient;
  patientId?: number | null;
  physician?: IEligibilityPhysician;
}
