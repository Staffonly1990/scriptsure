import { makeAutoObservable, observable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { IEncounter, IEncounterCurrent, IEncounterCacheItem, getEncounterCurrent, getAllEncounters } from 'shared/api/encounter';
import { IPatientEncounter } from 'shared/api/diagnosis';
import { IPatient } from 'shared/api/patient';

class EncounterModel {
  public encounters: IEncounterCacheItem[] = [];

  // this stack we use for all actions in encounter with modal
  public modalStack: {}[] = [];

  // this stack we use only for diagnosis
  public diagnosisStack: IPatientEncounter[] = [];

  public allEncountersList: IEncounter[] = [];

  public currentPatient: IPatient = {};

  public currentEncounter: Nullable<IEncounter> = null;

  public status: Record<'getCurrentEncounter' | 'getAllEncounters' | 'modalStack', ActionStatus> = {
    getCurrentEncounter: OActionStatus.Initial,
    getAllEncounters: OActionStatus.Initial,
    modalStack: OActionStatus.Initial,
  };

  public errors: Record<'getCurrentEncounter' | 'getAllEncounters', Nullable<string>> = {
    getCurrentEncounter: null,
    getAllEncounters: null,
  };

  constructor() {
    makeAutoObservable<EncounterModel, never>(
      this,
      {
        encounters: observable.shallow,
        currentEncounter: observable.shallow,
      },
      { autoBind: true }
    );
  }

  /**
   * Get Current Encounter for given patient
   * @param {number} patientId   The patientId for the patient in question.
   * @param {boolean} createIfNoneExists   Create the encounter if it doesn't exist.  This defaults to False
   * @param {boolean} ignoreCache     Ignore the cache to force a new request
   */
  *getCurrentEncounter(patientId?: number, createIfNoneExists = false, ignoreCache = false) {
    if (!patientId || patientId === 0) {
      this.status.getCurrentEncounter = OActionStatus.Fulfilled;
      this.currentEncounter = null;
      return;
    }

    const index = this._encounterCacheIndex(patientId);
    if (index < 0 || ignoreCache) {
      this.status.getCurrentEncounter = OActionStatus.Pending;
      try {
        const output: AjaxResponse<IEncounterCurrent> = yield lastValueFrom(getEncounterCurrent(patientId, createIfNoneExists).pipe(startWith(null)));
        this.status.getCurrentEncounter = OActionStatus.Fulfilled;

        const encounter = output.response?.savedEncounterObj ?? null;
        this.currentEncounter = encounter;
        // TODO
        // this.encounterCacheItem(encounter);
      } catch (e: unknown) {
        this.status.getCurrentEncounter = OActionStatus.Rejected;
      }
    } else {
      this.status.getCurrentEncounter = OActionStatus.Fulfilled;
      this.currentEncounter = this.encounters?.[index]?.encounter ?? null;
    }
  }

  *getAllEncounters(patientId: number | string) {
    try {
      const output: AjaxResponse<IEncounter[]> = yield lastValueFrom(getAllEncounters(patientId).pipe(startWith({})));

      this.allEncountersList = output.response;
    } catch {}
  }

  setInitialStack(modalStack: {}[], diagnosisStack: IPatientEncounter[]) {
    this.modalStack = modalStack;
    this.diagnosisStack = diagnosisStack;
  }

  decrementModalStack() {
    this.modalStack.shift();
    if (this.modalStack.length > 0) {
      this.status.modalStack = OActionStatus.Pending;
    } else {
      this.status.modalStack = OActionStatus.Fulfilled;
    }
  }

  setInitialModalStackStatus() {
    this.status.modalStack = OActionStatus.Initial;
  }

  /**
   * See if encounter is cached by patientId.  Returns -1 if it doesn't exist.
   * @param patientId Patient ID to search for
   * @returns {number} -1 if no cache exists.
   */
  private _encounterCacheIndex(patientId: number): number {
    for (let i = 0, len = this.encounters.length; i < len; i += 1) {
      const found = this.encounters?.[i]?.encounter?.patientId === patientId;
      if (found) return i;
    }
    return -1;
  }
}

const encounterModel = new EncounterModel();
export default encounterModel;
