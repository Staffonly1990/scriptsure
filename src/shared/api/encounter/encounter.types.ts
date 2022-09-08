import { IPatientEncounter } from '../diagnosis';
import { IAllergy } from '../allergy';
import { IPrescription } from '../prescription';
import { ISoapNote } from '../soap';
import { IEducation } from '../education';

/**
 * ICreateEncounterPayload is for creating a new encounter
 */
export interface ICreateEncounterPayload {
  patientId?: number | null;
  practiceId?: number;
  userId?: number;
  userName?: string;
  doctorId?: number;
  doctorName?: string;
  encounterStatus?: string;
}

/**
 * IUpdateEncounterPayload is for updating a new encounter
 */
export interface IUpdateEncounterPayload extends ICreateEncounterPayload {
  encounterId: number;
}

/**
 * IEncounter contains all the information of an Encounter
 */
export interface IEncounter extends ICreateEncounterPayload {
  isCurrent?: boolean;
  isExpanded?: boolean;
  encounterId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Prescriptions?: IPrescription[];
  Diagnoses?: IPatientEncounter[];
  Soap?: ISoapNote[];
  Allergies?: IAllergy[];
  Education?: IEducation[];
}

/**
 * IEncounterResult
 */
export interface IEncounterResult {
  successMsg: string;
  savedEncounterObj: any;
}

/**
 * IEncounterCacheItem
 */
export interface IEncounterCacheItem {
  time: string;
  encounter: IEncounter;
}

export interface IEncounterCurrent {
  savedEncounterObj?: IEncounter;
  successMsg: string;
}
