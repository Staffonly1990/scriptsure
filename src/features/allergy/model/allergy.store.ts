import { makeAutoObservable, observable } from 'mobx'; // flowResult
import { computedFn } from 'mobx-utils';
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { auditTime, startWith } from 'rxjs/operators';
import { reduce, find } from 'lodash';
import moment from 'moment';
import type { Moment } from 'moment';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  IAllergy,
  IAllergyCreatePayload,
  IAllergyUpdatePayload,
  IAllergySearchPayload,
  IAllergyClassification,
  getAdverseEvents,
  getReactions,
  getSeverities,
  getPatientAllergies,
  allergySearch,
  updateAllergy,
  addAllergy,
} from 'shared/api/allergy';
import { patientModel } from 'features/patient';
import { isMoreRecentUpdate } from '../lib/history';

class AllergyStore {
  public allergyHistory: Record<'list' | 'activeList' | 'inactiveList' | 'archivedList', IAllergy[]> = {
    list: [],
    activeList: [],
    inactiveList: [],
    archivedList: [],
  };

  public adverseEvents: object[] = [];

  public reactionsList: object[] = [];

  public severitiesList: object[] = [];

  public latestHistoryUpdate: Moment = moment(0);

  public historyValue = 'active';

  public searchText = '';

  public searchResults: IAllergyClassification[] = [];

  public status: Record<
    'getAllergyHistory' | 'getAdverseEvents' | 'getReactions' | 'getSeverities' | 'searchForAllergyByName' | 'updateAllergy' | 'addAllergy',
    ActionStatus
  > = {
    getAllergyHistory: OActionStatus.Initial,
    getAdverseEvents: OActionStatus.Initial,
    getSeverities: OActionStatus.Initial,
    getReactions: OActionStatus.Initial,
    searchForAllergyByName: OActionStatus.Initial,
    updateAllergy: OActionStatus.Initial,
    addAllergy: OActionStatus.Initial,
  };

  public errors: Record<
    'getAllergyHistory' | 'getAdverseEvents' | 'getReactions' | 'getSeverities' | 'searchForAllergyByName' | 'updateAllergy' | 'addAllergy',
    Nullable<string>
  > = {
    getAllergyHistory: null,
    getAdverseEvents: null,
    getSeverities: null,
    getReactions: null,
    searchForAllergyByName: null,
    updateAllergy: null,
    addAllergy: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        allergyHistory: observable.shallow,
        adverseEvents: observable.shallow,
        reactionsList: observable.shallow,
        severitiesList: observable.shallow,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  /**
   * Get display text for adverseEventCode field
   */
  getAllergyAdverseEvent = computedFn((adverseEventCode: string) => {
    const detail = find(
      this.adverseEvents,
      // @ts-ignore
      (adverseEvent: object) => adverseEvent?.adverseEventCode === adverseEventCode
    );
    return detail;
  });

  /**
   * Get display text for severityId field
   */
  getSeverity = computedFn((severityId: number) => {
    const detail = find(
      this.severitiesList,
      // @ts-ignore
      (severity: object) => severity?.severityId === severityId
    );
    return detail;
  });

  /**
   * Get display text for the reactionId field
   */
  getReaction = computedFn((reactionId: number) => {
    const detail = find(
      this.reactionsList,
      // @ts-ignore
      (reaction: object) => reaction?.reactionId === reactionId
    );
    return detail;
  });

  /**
   * Get allergy history for the patient
   */
  *getAllergyHistory() {
    // const canceller$ = timer(300); // Sample canceling
    this.status.getAllergyHistory = OActionStatus.Pending;
    this.errors.getAllergyHistory = null;
    try {
      const pid = Number(patientModel?.currentPatient?.chartId) || Number(patientModel?.currentPatient?.patientId);
      // const output: AjaxResponse<IAllergy[]> = yield lastValueFrom(
      //   getPatientAllergies(pid, canceller$).pipe(startWith([]))
      // );
      const output: AjaxResponse<IAllergy[]> = yield lastValueFrom(getPatientAllergies(pid).pipe(startWith([])));
      this.status.getAllergyHistory = OActionStatus.Fulfilled;

      this.allergyHistory = reduce(
        output.response ?? [],
        (allergyHistory, allergy) => {
          const now = new Date();
          const end = new Date(allergy.endDate ?? 0);
          allergyHistory.list.push(allergy);
          if (allergy.archive === 1) {
            allergyHistory.archivedList.push(allergy);
          } else if (allergy.endDate && end <= now && (!allergy.archive || allergy.archive === 0)) {
            allergyHistory.inactiveList.push(allergy);
          } else if ((!allergy.endDate || end > now) && (!allergy.archive || allergy.archive === 0)) {
            allergyHistory.activeList.push(allergy);
          }
          this.latestHistoryUpdate = isMoreRecentUpdate(this.latestHistoryUpdate, allergy.updatedAt)
            ? moment(allergy.updatedAt)
            : moment(this.latestHistoryUpdate);
          return allergyHistory;
        },
        { list: [], activeList: [], inactiveList: [], archivedList: [] } as typeof this.allergyHistory
      );
    } catch (error: unknown) {
      this.allergyHistory.list = [];
      this.allergyHistory.activeList = [];
      this.allergyHistory.inactiveList = [];
      this.allergyHistory.archivedList = [];
      this.status.getAllergyHistory = OActionStatus.Rejected;
      this.errors.getAllergyHistory = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Get adverse events from the base table
   */
  *getAdverseEvents() {
    this.adverseEvents = [];
    this.status.getAdverseEvents = OActionStatus.Pending;
    this.errors.getAdverseEvents = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getAdverseEvents().pipe(startWith([])));
      this.status.getAdverseEvents = OActionStatus.Fulfilled;
      this.adverseEvents = output.response ?? [];
    } catch (error: unknown) {
      this.status.getAdverseEvents = OActionStatus.Rejected;
      this.errors.getAdverseEvents = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Get the allergic reaction base table list
   */
  *getReactions() {
    this.reactionsList = [];
    this.status.getReactions = OActionStatus.Pending;
    this.errors.getReactions = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getReactions().pipe(startWith([])));
      this.status.getReactions = OActionStatus.Fulfilled;
      this.reactionsList = output.response ?? [];
    } catch (error: unknown) {
      this.status.getReactions = OActionStatus.Rejected;
      this.errors.getReactions = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Get the allergy severity base table list
   */
  *getSeverities() {
    this.severitiesList = [];
    this.status.getSeverities = OActionStatus.Pending;
    this.errors.getSeverities = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getSeverities().pipe(startWith([])));
      this.status.getSeverities = OActionStatus.Fulfilled;
      this.severitiesList = output.response ?? [];
    } catch (error: unknown) {
      this.status.getSeverities = OActionStatus.Rejected;
      this.errors.getSeverities = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Create an allergy
   */
  *addAllergy(payload: IAllergyCreatePayload) {
    this.status.addAllergy = OActionStatus.Pending;
    this.errors.addAllergy = null;
    try {
      yield lastValueFrom(addAllergy(payload).pipe(startWith({})));
      this.status.addAllergy = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.addAllergy = OActionStatus.Rejected;
      this.errors.addAllergy = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Update an allergy
   */
  *updateAllergy(payload: IAllergyUpdatePayload) {
    this.status.updateAllergy = OActionStatus.Pending;
    this.errors.updateAllergy = null;
    try {
      yield lastValueFrom(updateAllergy(payload).pipe(startWith({})));
      this.status.updateAllergy = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.updateAllergy = OActionStatus.Rejected;
      this.errors.updateAllergy = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Search for allergies based on their name
   */
  *searchForAllergyByName(name: Nullable<string>, createXHR?: any) {
    this.status.searchForAllergyByName = OActionStatus.Pending;
    this.errors.searchForAllergyByName = null;
    try {
      const output: AjaxResponse<IAllergyClassification[]> = yield lastValueFrom(
        allergySearch({ query: { name } } as IAllergySearchPayload, createXHR).pipe(auditTime(100), startWith([]))
      );
      this.status.searchForAllergyByName = OActionStatus.Fulfilled;

      this.searchResults = output?.response ?? [];
    } catch (error: unknown) {
      this.status.searchForAllergyByName = OActionStatus.Rejected;
      this.errors.searchForAllergyByName = (error as AjaxError)?.response?.message ?? null;
    }
  }

  resetSearchResults() {
    this.searchResults = [];
  }

  resetSearch() {
    this.searchText = '';
    this.resetSearchResults();
  }
}

const allergyStore = new AllergyStore();
export default allergyStore;
