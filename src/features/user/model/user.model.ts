import { makeAutoObservable, onBecomeObserved, onBecomeUnobserved, observable, reaction, computed, action } from 'mobx';
import localStorage from 'mobx-localstorage';
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { auditTime, startWith } from 'rxjs/operators';
import { isNil, isArray, values, find } from 'lodash';
import moment from 'moment';
import type { unitOfTime } from 'moment';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import Cookie from 'shared/lib/mobx.cookie';
import {
  fetchUserData,
  setPracticeAndPrescriber,
  IUserData,
  IUser,
  fetchUserDataPlatform,
  IUserPlatform,
  fetchTaxonomy,
  getUserDetailFull,
} from 'shared/api/user';
import { IPractice } from 'shared/api/practice';
import { verifyLogin, refreshUserSession, IUserLogin } from 'shared/api/login';
import { logout } from 'shared/api/logout';
import { settingsModel } from 'features/settings';
import { securityModel } from 'features/restrictions';

class UserModel {
  private _cookieToken: Cookie = new Cookie('connect.sid');

  private _expiredInterval: number | undefined = undefined;

  private _expired = true;

  public data: Nullable<IUserData> = null;

  // TODO: developer (Demin) - add UserPlatform
  public dataPlatform: Nullable<IUserPlatform> = null;

  public status: Record<'fetch' | 'refreshUser' | 'setPracticeAndPrescriber' | 'login' | 'logout', ActionStatus> = {
    fetch: OActionStatus.Initial,
    refreshUser: OActionStatus.Initial,
    setPracticeAndPrescriber: OActionStatus.Initial,
    login: OActionStatus.Initial,
    logout: OActionStatus.Initial,
  };

  public errors: Record<'fetch' | 'refreshUser' | 'setPracticeAndPrescriber' | 'login' | 'logout', Nullable<string>> = {
    fetch: null,
    refreshUser: null,
    setPracticeAndPrescriber: null,
    login: null,
    logout: null,
  };

  /**
   * Determines if the current user is an administrator of the business unit
   */
  public isAdministrator = () => {
    if (!this.data || !this.data.businessunits) {
      return false;
    }
    // Iterate through the list of practices to determine if the user
    // has security to access them. A user has access to make changes to
    // the practice if they have been set as a businessUnitAdmin. Note: the
    // loop is not necessary because at this point a user can only be
    // associated with one business unit. But the loop is left for future
    // compatibility when we allow more than one businessUnit association
    // for a user
    const isAdministrator = find(this.data.businessunits, (businessUnit) => {
      return businessUnit.id === this.data?.currentBusinessUnit?.id;
    });
    if (isAdministrator && isAdministrator.businessunitadmins) {
      if (isAdministrator.businessunitadmins.siteAdministrator) {
        return Boolean(isAdministrator.businessunitadmins.siteAdministrator) !== false;
      }
    }
    return false;
  };

  /**
   * Determines if the user is an administrator of the current business unit for the
   * current practice. If so then the COPY FORMAT LIST is activated
   * @returns {boolean}
   */
  public isBusinessUnitAdmin = (): boolean => {
    if (!this.data || !this.data.businessunits) {
      return false;
    }
    // Iterate through the list of practices to determine if the user
    // has security to access them. A user has access to make changes to
    // the practice if they have been set as a businessUnitAdmin. Note: the
    // loop is not necessary because at this point a user can only be
    // associated with one business unit. But the loop is left for future
    // compatibility when we allow more than one businessUnit association
    // for a user
    const isAdministrator = find(this.data.businessunits, (businessunit) => {
      return businessunit.id === this.data?.currentPractice?.businessUnitId;
    });
    if (isAdministrator) {
      if (isAdministrator.businessunitadmins) {
        return true;
      }
    }
    return false;
  };

  constructor() {
    makeAutoObservable<UserModel, '_resumeExpired' | '_suspendExpired' | '_actualizeExpired' | '_expiredInterval' | '_expired' | '_cookieToken'>(
      this,
      {
        _resumeExpired: false,
        _suspendExpired: false,
        _actualizeExpired: action,
        _expiredInterval: observable,
        _expired: observable,
        _cookieToken: observable,
        data: observable.struct,
        status: observable.shallow,
        errors: observable.shallow,
        isSessionExpired: computed,
        isLoggedIn: computed,
        signupCmm: computed,
      },
      { autoBind: true }
    );

    onBecomeObserved(this, '_expired', this._resumeExpired);
    onBecomeUnobserved(this, '_expired', this._suspendExpired);
    this._actualizeExpired(); // Initial tick.

    if (!this.isSessionExpired) this.fetch();
  }

  get token() {
    return this._cookieToken.value;
  }

  get isUserLock() {
    return localStorage.has('userLock') ? JSON.parse(localStorage.getItem('userLock')) : false;
  }

  get isUserExists() {
    return !isNil(this.data);
  }

  get isSessionExpired() {
    return !this.token || this._expired;
  }

  get isLoggedIn() {
    return !this.isSessionExpired && this.isUserExists;
  }

  private _resumeExpired = () => {
    if (this._expiredInterval) return;
    this._expiredInterval = setInterval(() => {
      if (this.isUserLock) return;
      this._actualizeExpired();
    }, 15000) as unknown as number;
  };

  private _suspendExpired = () => {
    clearInterval(this._expiredInterval);
    this._expiredInterval = undefined;
    this._expired = true;
  };

  private _actualizeExpired() {
    const sessionExpires = localStorage.has('userSessionExpires') ? localStorage.getItem('userSessionExpires') : undefined;
    const expired = isNil(sessionExpires) || moment(sessionExpires) < moment().milliseconds(0);
    if (this._expired !== expired) this._expired = expired;
  }

  get signupCmm() {
    if (this.data?.user?.prescriber === false) {
      return false;
    }

    return this.data?.authToken === true;
  }

  lock() {
    localStorage.setItem('userLock', true);
  }

  unlock() {
    localStorage.setItem('userLock', false);
  }

  /** Get the current user */
  *fetch() {
    this.status.fetch = OActionStatus.Pending;
    this.errors.fetch = null;
    try {
      const output: AjaxResponse<IUserData> = yield lastValueFrom(fetchUserData().pipe(startWith(null)));
      this.status.fetch = OActionStatus.Fulfilled;
      this.data = { ...(output.response ?? null) };
      if (this.isSessionExpired) {
        const timeoutUnit = (settingsModel?.get('USER_TIMEOUT_UNITS', 'Practice') ?? 'hours') as unitOfTime.DurationConstructor;
        const timeoutAmount = settingsModel?.get('USER_TIMEOUT_AMOUNT', 'Practice') ?? String(1);
        // const timeoutUnit = 'seconds';
        // const timeoutAmount = String(30);

        const now = moment().milliseconds(0);
        const sessionExpires = moment(now).add(Number(timeoutAmount), timeoutUnit).toJSON();

        localStorage.setItem('timeoutUnit', timeoutUnit);
        localStorage.setItem('timeoutAmount', timeoutAmount);
        localStorage.setItem('userSessionExpires', sessionExpires);

        this._actualizeExpired();
      }
    } catch (error: unknown) {
      this.data = null;
      this.status.fetch = OActionStatus.Rejected;
      this.errors.fetch = (error as AjaxError)?.response?.message ?? null;
    }
  }

  // TODO: developer (Demin) - add UserPlatform
  *fetchPlatform() {
    try {
      const output: AjaxResponse<IUserPlatform> = yield lastValueFrom(fetchUserDataPlatform().pipe(startWith(null)));
      this.dataPlatform = output.response ?? null;
    } catch (error: unknown) {
      this.dataPlatform = null;
    }
  }

  // Possible for the userId to come through with a 0 when adding a new
  // user the UserAddController calls this on load for edit of users
  // Just return back a blank user
  *getUserDetailFull(userId: number) {
    if (userId > 0) {
      try {
        const output: AjaxResponse<IUserPlatform> = yield lastValueFrom(getUserDetailFull(userId).pipe(startWith(null)));
        this.dataPlatform = output.response ?? null;
        return output.response;
      } catch (error: unknown) {
        this.dataPlatform = null;
      }
    }
    return null;
  }

  /**
   * Refresh the current user
   */
  *refreshUser() {
    this.status.refreshUser = OActionStatus.Pending;
    this.errors.refreshUser = null;
    try {
      const output: AjaxResponse<IUserData> = yield lastValueFrom(fetchUserData().pipe(startWith(null)));
      this.status.refreshUser = OActionStatus.Fulfilled;
      const data = { ...(output.response ?? null) };

      if (!data.currentPrescriber) {
        if (isArray(data.practices) && data.practices.length > 0) {
          data.currentPractice = data.practices?.[0];
        } else {
          yield this.logout();
          return;
        }
      }

      if (!data.currentPrescriber) {
        data.currentPrescriber = data.user;
      }

      this.data = data;

      securityModel.setCurrentPractice(data?.currentPractice?.id, data?.currentBusinessUnit?.organizationId);
      securityModel.loadRestrictions(data?.restrictions);
    } catch (error: unknown) {
      this.status.refreshUser = OActionStatus.Rejected;
      this.errors.refreshUser = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Refresh users session state
   */
  *refreshSession() {
    yield lastValueFrom(refreshUserSession().pipe(startWith(null)));
  }

  *setPracticeAndPrescriber(payload: { practice: IPractice; prescriber: IUser }) {
    const { practice, prescriber } = payload;

    this.status.setPracticeAndPrescriber = OActionStatus.Pending;
    this.errors.setPracticeAndPrescriber = null;
    try {
      // this.data!.currentPractice = practice;
      // this.data!.currentPrescriber = prescriber;

      yield lastValueFrom(setPracticeAndPrescriber(payload));
      this.status.setPracticeAndPrescriber = OActionStatus.Fulfilled;

      yield this.refreshSession();
      yield this.refreshUser();

      yield securityModel.setCurrentPractice(practice.id, this.data?.currentBusinessUnit?.organizationId);
      yield securityModel.loadRestrictions(this.data?.user?.restrictions);

      // Refresh the local UserService cache
      // yield this.fetch();
    } catch (error: unknown) {
      this.status.setPracticeAndPrescriber = OActionStatus.Rejected;
      this.errors.setPracticeAndPrescriber = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /** Log the user into a new session using the credential parameters */
  *login(payload: IUserLogin) {
    this.status.login = OActionStatus.Pending;
    this.errors.login = null;
    try {
      yield lastValueFrom(verifyLogin(payload).pipe(auditTime(300), startWith({})));
      /** Refresh cookie connect.sid with options */
      this._cookieToken = new Cookie('connect.sid');
      this.status.login = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.login = OActionStatus.Rejected;
      this.errors.login = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *logout(): Generator<Promise<AjaxResponse<Nullable<string>> | null>, void, unknown> {
    this.status.logout = OActionStatus.Pending;
    this.errors.logout = null;
    try {
      yield lastValueFrom(logout().pipe(auditTime(300), startWith(null)));
      this.status.logout = OActionStatus.Fulfilled;
      this.data = null;

      this._cookieToken.remove();
      localStorage.removeItem('timeoutUnit');
      localStorage.removeItem('timeoutAmount');
      localStorage.removeItem('userSessionExpires');
    } catch (error: unknown) {
      this.status.logout = OActionStatus.Rejected;
      this.errors.logout = (error as AjaxError)?.response?.message ?? null;
    }
  }
}

const userModel = new UserModel();
export default userModel;
