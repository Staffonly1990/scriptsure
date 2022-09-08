import { isBoolean, isNumber, isString, pickBy, assign } from 'lodash';
import { ICreateEditDiagnosis } from 'shared/api/diagnosis';

export const OEncounterStatus = {
  NoEncounter: 'No Encounter',
  NewEncounterCreated: 'New Encounter Created',
  CurrentEncounter: 'Current Encounter',
} as const;

export type EncounterStatus = typeof OEncounterStatus[keyof typeof OEncounterStatus];

export const getClearData = <T extends {}>(data: T): ICreateEditDiagnosis => {
  const numbers = pickBy(data, isNumber);
  const strings = pickBy(data, isString);
  const booleans = pickBy(data, isBoolean);
  return <ICreateEditDiagnosis>(<unknown>assign(numbers, booleans, strings));
};
