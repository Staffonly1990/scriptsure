import { has, find, isNil } from 'lodash';
import type { IBusinessUnit } from 'shared/api/settings';
import type { IUserData } from 'shared/api/user';

/**
 * Check to ensure that the user is an administrator
 */
export function isBusinessUnitAdministrator(user: IUserData): boolean {
  if (!user?.businessunits || !user?.currentBusinessUnit) return false;

  return !isNil(
    find(user.businessunits, (b) => {
      return b.billingAccountId === user.currentBusinessUnit?.billingAccountId && has(b, 'businessunitadmins');
    })
  );
}

/**
 * Determines if the user is an site administrator of the current business unit for the
 * current practice.
 */
export function isSiteBusinessUnitAdminStatus(businessunits: IBusinessUnit[], businessUnitId: number): boolean {
  const businessunit = find(businessunits, (b) => b.id === businessUnitId);

  if (!isNil(businessunit?.businessunitadmins)) {
    if (has(businessunit?.businessunitadmins, 'siteAdministrator')) {
      if (Boolean(businessunit?.businessunitadmins?.siteAdministrator) === false) return false;
      return true;
    }
  }

  return false;
}
