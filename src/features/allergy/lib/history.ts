import moment from 'moment';
import { IAllergy } from 'shared/api/allergy';

/**
 * Determine if newerDate is newer than this.latestHistoryUpdate
 */
export function isMoreRecentUpdate(latestHistoryUpdate, date) {
  return moment(latestHistoryUpdate).isBefore(moment(date));
}

/**
 * Get string for status for an allergy
 */
export function getAllergyStatus(allergy: IAllergy) {
  const now = new Date();
  const end = new Date(allergy.endDate ?? 0);
  let status = 'active';
  if (allergy.archive === 1) {
    status = 'archived';
  } else if (allergy.endDate && end <= now && (!allergy.archive || allergy.archive === 0)) {
    status = 'inactive';
  } else if ((!allergy.endDate || end > now) && (!allergy.archive || allergy.archive === 0)) {
    status = 'active';
  }
  return status;
}
