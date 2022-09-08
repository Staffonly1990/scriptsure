import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  getDemographicsEthnicity,
  getDemographicsMaritalStatus,
  getDemographicsPreferredCommunicationId,
  getDemographicsStatus,
  getDemographicsLanguage,
  getDemographicsRace,
  getDemographicsRelation,
  getDataByZip,
  IPatientEthnicity,
  IPatientLanguage,
  IPatientMaritalStatus,
  IPatientPreferredCommunicationId,
  IPatientRace,
  IPatientRelation,
  IPatientStatus,
  IPatientZIP,
} from 'shared/api/patient';

class PatientDemographicsModel {
  public patientLanguage: IPatientLanguage[] = [];

  public patientRelation: IPatientRelation[] = [];

  public patientPreferredCommunicationId: IPatientPreferredCommunicationId[] = [];

  public patientMaritalStatus: IPatientMaritalStatus[] = [];

  public patientEthnicity: IPatientEthnicity[] = [];

  public patientStatuses: IPatientStatus[] = [];

  public patientRace: IPatientRace[] = [];

  public patientAlternativeRace: IPatientRace[] = [];

  public cityStateByZip: Nullable<IPatientZIP> = null;

  public status: Record<'getStatus' | 'getUserRace' | 'getUserLanguage', ActionStatus> = {
    getStatus: OActionStatus.Initial,
    getUserRace: OActionStatus.Initial,
    getUserLanguage: OActionStatus.Initial,
  };

  public errors: Record<'getStatus' | 'getUserRace' | 'getUserLanguage', Nullable<string>> = {
    getStatus: null,
    getUserRace: null,
    getUserLanguage: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        patientStatuses: observable,
        patientLanguage: observable,
        patientRelation: observable,
        patientPreferredCommunicationId: observable,
        patientMaritalStatus: observable,
        patientEthnicity: observable,
        patientRace: observable,
        patientAlternativeRace: observable,
      },
      { autoBind: true }
    );
  }

  *getStatus() {
    this.status.getStatus = OActionStatus.Pending;
    this.errors.getStatus = null;
    try {
      const output: AjaxResponse<IPatientStatus[]> = yield lastValueFrom(getDemographicsStatus().pipe(startWith([])));
      this.status.getStatus = OActionStatus.Fulfilled;

      this.patientStatuses = output.response;
    } catch (error: unknown) {
      this.status.getStatus = OActionStatus.Rejected;
      this.errors.getStatus = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getUserRace(race: string, id: 'race' | 'alternateRace', createXHR?: any) {
    this.status.getUserRace = OActionStatus.Pending;
    this.errors.getUserRace = null;
    try {
      const output: AjaxResponse<IPatientRace[]> = yield lastValueFrom(getDemographicsRace(race, createXHR).pipe(auditTime(100), startWith([])));
      this.status.getUserRace = OActionStatus.Fulfilled;

      if (id === 'race') this.patientRace = output.response;
      else this.patientAlternativeRace = output.response;
    } catch (error: unknown) {
      this.status.getUserRace = OActionStatus.Rejected;
      this.errors.getUserRace = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getEthnicity() {
    try {
      const output: AjaxResponse<IPatientEthnicity[]> = yield lastValueFrom(getDemographicsEthnicity().pipe(startWith([])));
      this.patientEthnicity = output.response;
    } catch {}
  }

  *getMaritalStatus() {
    try {
      const output: AjaxResponse<IPatientMaritalStatus[]> = yield lastValueFrom(getDemographicsMaritalStatus().pipe(startWith([])));
      this.patientMaritalStatus = output.response;
    } catch {}
  }

  *getPreferredCommunicationId() {
    try {
      const output: AjaxResponse<IPatientPreferredCommunicationId[]> = yield lastValueFrom(getDemographicsPreferredCommunicationId().pipe(startWith([])));
      this.patientPreferredCommunicationId = output.response;
    } catch {}
  }

  *getPatientRelation() {
    try {
      const output: AjaxResponse<IPatientRelation[]> = yield lastValueFrom(getDemographicsRelation().pipe(startWith([])));
      this.patientRelation = output.response;
    } catch {}
  }

  *getUserLanguage(language, createXHR?: any) {
    this.status.getUserLanguage = OActionStatus.Pending;
    this.errors.getUserLanguage = null;
    try {
      const output: AjaxResponse<IPatientLanguage[]> = yield lastValueFrom(getDemographicsLanguage(language, createXHR).pipe(auditTime(100), startWith([])));
      this.status.getUserLanguage = OActionStatus.Fulfilled;

      this.patientLanguage = output.response;
    } catch (error: unknown) {
      this.status.getUserLanguage = OActionStatus.Rejected;
      this.errors.getUserLanguage = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getCityStateByZIP(zip: number) {
    try {
      const output: AjaxResponse<IPatientZIP> = yield lastValueFrom(getDataByZip(zip).pipe(startWith(null)));
      this.cityStateByZip = output.response;
    } catch {}
  }
}

const patientDemographicsModel = new PatientDemographicsModel();
export default patientDemographicsModel;
