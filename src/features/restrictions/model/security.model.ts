import { makeAutoObservable, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { reduce, each, find, isNil, isArray } from 'lodash';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import type { IUser } from 'shared/api/user';
import {
  IRole,
  IUserRole,
  IRoleRestriction,
  IRestrictionGroup,
  IRestriction,
  getRestrictions,
  saveRestriction,
  addRole,
  deleteRole,
  getRoles,
  getRolesUsers,
  getUserRoles,
  getUserRestrictions,
  getEmergencyAccessRestrictions,
} from 'shared/api/restrictions';

class SecurityModel {
  public emergencyAccessOn: Nullable<boolean> = null;

  private _currentPracticeID: number | undefined = undefined;

  private _organizationId: number | undefined = undefined;

  private _restrictions: IRoleRestriction[] = [];

  public userRoles: Nullable<IRole[]> = null;

  public roleRestriction: Nullable<IRestrictionGroup[]> = null;

  public status: Record<
    'addRole' | 'deleteRole' | 'getRoles' | 'getUserRoles' | 'getRolesUsers' | 'getRestrictionGroups' | 'getEmergencyAccessRestrictions' | 'saveSecurity',
    ActionStatus
  > = {
    addRole: OActionStatus.Initial,
    deleteRole: OActionStatus.Initial,
    getRoles: OActionStatus.Initial,
    getUserRoles: OActionStatus.Initial,
    getRolesUsers: OActionStatus.Initial,
    getRestrictionGroups: OActionStatus.Initial,
    getEmergencyAccessRestrictions: OActionStatus.Initial,
    saveSecurity: OActionStatus.Initial,
  };

  public errors: Record<
    'addRole' | 'deleteRole' | 'getRoles' | 'getUserRoles' | 'getRolesUsers' | 'getRestrictionGroups' | 'getEmergencyAccessRestrictions' | 'saveSecurity',
    Nullable<string>
  > = {
    addRole: null,
    deleteRole: null,
    getRoles: null,
    getUserRoles: null,
    getRolesUsers: null,
    getRestrictionGroups: null,
    getEmergencyAccessRestrictions: null,
    saveSecurity: null,
  };

  constructor() {
    makeAutoObservable<SecurityModel, '_restrictions' | '_currentPracticeID' | '_organizationId'>(
      this,
      { _restrictions: observable, _currentPracticeID: observable, _organizationId: observable },
      { autoBind: true }
    );
  }

  /**
   * Determines if under the current user based on their assigned roles
   * returned during login inside of the req.session, whether or not
   * the user is restricted from performing the task.
   * @param identifier - String identifier referenced in the Restriction table on the
   * PLATFORM
   * @returns {boolean} - TRUE - User is allowed to perform task FALSE - user is not
   * allowed to perform task
   */
  can = computedFn((identifier: string): boolean => {
    const restriction = this.detect(identifier);
    if (!isNil(restriction)) return false;
    return true;
  });

  detect = computedFn((identifier: string) => {
    const restriction = find(this._restrictions, {
      practiceID: this._organizationId,
      organizationId: this._organizationId,
      identifier,
    });
    return restriction;
  });

  loadRestrictions(restrictions?: IRoleRestriction[]) {
    if (this.emergencyAccessOn === null) {
      if (isArray(restrictions) && restrictions.length > 0) {
        this.emergencyAccessOn = false;
      }
    }
    this._restrictions = restrictions ?? [];
  }

  setCurrentPractice(practiceID?: number, organizationId?: number) {
    if (this._currentPracticeID !== practiceID) {
      this.emergencyAccessOn = null;
    }
    this._currentPracticeID = practiceID;
    this._organizationId = organizationId;
  }

  /**
   * Gets the security for the current user logged in. When the user is collecting
   * security the user identification is sent into the procedure. When the user switches
   * over to emergency access then the User Identification is set to -1. A hard coded emergency
   * access group is sent with the application. Defaults are assigned to the emergency access
   * but the administrator can change it in the group administrator screen.
   */
  switchEmergencyAccess() {
    this.emergencyAccessOn = !this.emergencyAccessOn;
    return this.emergencyAccessOn;
  }

  /**
   * @param restrictionGroups - Array of groups and associated restrictions that have been
   * selected for the Role
   * @param roleId - Role identification
   */
  *saveSecurity(roleRestrictions: IRoleRestriction[], roleId: number, userRoles: IUserRole[]) {
    this.status.saveSecurity = OActionStatus.Pending;
    this.errors.saveSecurity = null;
    let response: IRestrictionGroup[] = [];
    try {
      // const roleRestrictions: IRoleRestriction[] = reduce<IRestrictionGroup, IRoleRestriction[]>(
      //   restrictionGroups,
      //   (acc, restrictionGroup) => {
      //     each(restrictionGroup.Restriction, (restriction: IRestriction) => {
      //       if (restriction.isSelected) {
      //         acc.push({
      //           restrictionID: restriction.id,
      //           roleID: roleId,
      //         });
      //       }
      //     });
      //     return acc;
      //   },
      //   []
      // );

      // const userRoles: IUserRole[] = reduce<IUser, IUserRole[]>(
      //   users ?? [],
      //   (acc, user) => {
      //     if (user.isSelected) {
      //       acc.push({
      //         userID: user.id as number,
      //         roleID: roleId,
      //       });
      //     }
      //     console.log(acc);
      //     return acc;
      //   },
      //   []
      // );

      const output: AjaxResponse<IRestrictionGroup[]> = yield lastValueFrom(saveRestriction({ roleId, userRoles, roleRestrictions }).pipe(startWith([])));
      this.status.saveSecurity = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.saveSecurity = OActionStatus.Rejected;
      this.errors.saveSecurity = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /**
   * @param role - Role entity to add to back end
   */
  *addRole(role: IRole) {
    this.status.addRole = OActionStatus.Pending;
    this.errors.addRole = null;
    let response: IRole[] = [];
    try {
      const output: AjaxResponse<IRole[]> = yield lastValueFrom(addRole(role).pipe(startWith([])));
      this.status.addRole = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.addRole = OActionStatus.Rejected;
      this.errors.addRole = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /**
   * @param role - Role entity to add to back end
   */
  *deleteRole(role: IRole) {
    this.status.deleteRole = OActionStatus.Pending;
    this.errors.deleteRole = null;
    let response: IRole[] = [];
    try {
      const output: AjaxResponse<IRole[]> = yield lastValueFrom(deleteRole(role).pipe(startWith([])));
      this.status.deleteRole = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.deleteRole = OActionStatus.Rejected;
      this.errors.deleteRole = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param organizationId - Practice identification */
  *getRoles(organizationId: number) {
    this.status.getRoles = OActionStatus.Pending;
    this.errors.getRoles = null;
    let response: IRole[] = [];
    try {
      const output: AjaxResponse<IRole[]> = yield lastValueFrom(getRoles(organizationId).pipe(startWith([])));
      this.status.getRoles = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.getRoles = OActionStatus.Rejected;
      this.errors.getRoles = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param roleId - Role identification */
  *getRolesUsers(roleId: number) {
    this.status.getRolesUsers = OActionStatus.Pending;
    this.errors.getRolesUsers = null;
    let response: IRole[] = [];
    try {
      const output: AjaxResponse<IRole[]> = yield lastValueFrom(getRolesUsers(roleId).pipe(startWith([])));
      this.status.getRolesUsers = OActionStatus.Fulfilled;
      response = output.response ?? [];
      this.userRoles = output.response;
    } catch (error: unknown) {
      this.status.getRolesUsers = OActionStatus.Rejected;
      this.errors.getRolesUsers = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param roleId - Role identification */
  *getRestrictions(roleId: number) {
    this.status.getRestrictionGroups = OActionStatus.Pending;
    this.errors.getRestrictionGroups = null;
    let response: IRestrictionGroup[] = [];
    try {
      const output: AjaxResponse<IRestrictionGroup[]> = yield lastValueFrom(getRestrictions(roleId).pipe(startWith([])));
      this.status.getRestrictionGroups = OActionStatus.Fulfilled;
      response = output.response ?? [];
      this.roleRestriction = output.response;
    } catch (error: unknown) {
      this.status.getRestrictionGroups = OActionStatus.Rejected;
      this.errors.getRestrictionGroups = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param roleId - Role identification */
  *getRestrictionGroups(roleId: number) {
    this.status.getRestrictionGroups = OActionStatus.Pending;
    this.errors.getRestrictionGroups = null;
    let response: IRestrictionGroup[] = [];
    try {
      const output: AjaxResponse<IRestrictionGroup[]> = yield lastValueFrom(getUserRestrictions(roleId).pipe(startWith([])));
      this.status.getRestrictionGroups = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.getRestrictionGroups = OActionStatus.Rejected;
      this.errors.getRestrictionGroups = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param practiceId - Practice identification */
  *getEmergencyAccessRestrictions(practiceId: number) {
    this.status.getEmergencyAccessRestrictions = OActionStatus.Pending;
    this.errors.getEmergencyAccessRestrictions = null;
    let response: IRestrictionGroup[] = [];
    try {
      const output: AjaxResponse<IRestrictionGroup[]> = yield lastValueFrom(getEmergencyAccessRestrictions(practiceId).pipe(startWith([])));
      this.status.getEmergencyAccessRestrictions = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.getEmergencyAccessRestrictions = OActionStatus.Rejected;
      this.errors.getEmergencyAccessRestrictions = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }

  /** @param roleId - Role identification */
  *getUserRoles(roleId: number) {
    this.status.getUserRoles = OActionStatus.Pending;
    this.errors.getUserRoles = null;
    let response: IUserRole[] = [];
    try {
      const output: AjaxResponse<IUserRole[]> = yield lastValueFrom(getUserRoles(roleId).pipe(startWith([])));
      this.status.getUserRoles = OActionStatus.Fulfilled;
      response = output.response ?? [];
    } catch (error: unknown) {
      this.status.getUserRoles = OActionStatus.Rejected;
      this.errors.getUserRoles = (error as AjaxError)?.response?.message ?? null;
    }
    return response;
  }
}

const securityModel = new SecurityModel();
export default securityModel;
