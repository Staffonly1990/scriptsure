import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';

import {
  getDiagnosisEncounter,
  getDiagnosisHistory,
  getDiagnosisCommon,
  createDiagnosis,
  archiveDiagnosis,
  deleteDiagnosis,
  searchSnomedDiagnosis,
  searchIcd10Diagnosis,
  searchIcd9Diagnosis,
  IPatientEncounter,
  IDiagnosis,
  ICreateDiagnosis,
  ISearchDiagnosis,
  updateDiagnosis,
} from 'shared/api/diagnosis';
import { getEncounterCurrent, IEncounterCurrent } from 'shared/api/encounter';
import { getMedlineInformation, IMedline, IMedlineRequest } from 'shared/api/medline';
import { ActionStatus, OActionStatus } from 'shared/lib/model';

import { patientModel } from 'features/patient';
import { EncounterStatus, OEncounterStatus } from '../lib/model';

class DiagnosisStore {
  public diagnosisList: Record<'list' | 'currentList' | 'archivedList' | 'encounterList', IPatientEncounter[]> = {
    list: [],
    currentList: [],
    archivedList: [],
    encounterList: [],
  };

  public searchedDiagnosisList: ISearchDiagnosis[] | IDiagnosis[] = [];

  public medlineInformation: Nullable<IMedline> = null;

  public encounterId?: number = undefined;

  public commonDiagnosisList: IDiagnosis[] | ISearchDiagnosis[] = [];

  public encountertStatus: Record<'currentPatient', EncounterStatus> = {
    currentPatient: OEncounterStatus.NoEncounter,
  };

  public currentEditable: Nullable<IPatientEncounter> = null;

  public editDiagnosisDefaultData: ICreateDiagnosis = {
    archive: false,
    codingSystem: 0,
    conceptId: '',
    isCondition: false,
    name: '',
  };

  public status: Record<'getSearchDiagnosis', ActionStatus> = {
    getSearchDiagnosis: OActionStatus.Initial,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        medlineInformation: observable.shallow,
        diagnosisList: observable.shallow,
        encountertStatus: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *getAllDiagnosis() {
    try {
      let encounterMessage: EncounterStatus = OEncounterStatus.NoEncounter;
      const pid = Number(patientModel?.currentPatient?.chartId) || Number(patientModel?.currentPatient?.patientId);
      const currentEncounter: AjaxResponse<IEncounterCurrent> = yield lastValueFrom(getEncounterCurrent(pid, false).pipe(startWith({})));
      const encounterId = currentEncounter.response.savedEncounterObj?.encounterId;
      this.encounterId = encounterId;

      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const encounterIdKey in OEncounterStatus) {
        if (currentEncounter.response.successMsg === OEncounterStatus[encounterIdKey]) {
          encounterMessage = OEncounterStatus[encounterIdKey];
        }
      }

      this.encountertStatus.currentPatient = encounterMessage;

      if (encounterId) {
        const encounterList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisEncounter(pid, encounterId).pipe(startWith([])));
        const diagnosisList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisHistory(pid, encounterId).pipe(startWith([])));

        const archived = diagnosisList.response.filter(({ archive }) => archive);
        const current = diagnosisList.response.filter(({ archive }) => !archive);

        this.diagnosisList.archivedList = archived;
        this.diagnosisList.currentList = current;
        this.diagnosisList.encounterList = encounterList.response;
        this.diagnosisList.list = diagnosisList.response;
      } else {
        const diagnosisList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisHistory(pid).pipe(startWith([])));

        const archived = diagnosisList.response.filter(({ archive }) => archive);
        const current = diagnosisList.response.filter(({ archive }) => !archive);

        this.diagnosisList.archivedList = archived;
        this.diagnosisList.currentList = current;
        this.diagnosisList.list = diagnosisList.response;
      }
    } catch {}
  }

  *getMedlineInformation(payload: IMedlineRequest) {
    try {
      const output: AjaxResponse<IMedline> = yield lastValueFrom(getMedlineInformation(payload).pipe(startWith({})));

      this.medlineInformation = output.response;
    } catch {}
  }

  *getCommonDiagnosis() {
    try {
      const output: AjaxResponse<IDiagnosis[]> = yield lastValueFrom(getDiagnosisCommon().pipe(startWith({})));

      this.commonDiagnosisList = output.response;
    } catch {}
  }

  *addDiagnosis(payload: ICreateDiagnosis, isEncounter: boolean, isEditable: boolean) {
    try {
      let encounterMessage: EncounterStatus = this.encountertStatus.currentPatient;
      const pid = Number(patientModel?.currentPatient?.chartId) || Number(patientModel?.currentPatient?.patientId);
      if (isEncounter) {
        const currentEncounter: AjaxResponse<IEncounterCurrent> = yield lastValueFrom(getEncounterCurrent(pid, true).pipe(startWith({})));
        const encounterId = currentEncounter.response.savedEncounterObj?.encounterId;
        this.encounterId = encounterId;

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const encounterIdKey in OEncounterStatus) {
          if (currentEncounter.response.successMsg === OEncounterStatus[encounterIdKey]) {
            encounterMessage = OEncounterStatus[encounterIdKey];
          }
        }

        this.encountertStatus.currentPatient = encounterMessage;
      }
      const request: ICreateDiagnosis = {
        ...payload,
        encounterId: this.encounterId,
        patientId: pid,
      };
      if (isEditable) {
        yield lastValueFrom(updateDiagnosis(request).pipe(startWith([])));
      } else {
        yield lastValueFrom(createDiagnosis(request).pipe(startWith({})));
      }
    } catch {}
  }

  *setArchiveDiagnosis(diagnosisId: number) {
    try {
      const result: AjaxResponse<{ affectedCount: number }> = yield lastValueFrom(archiveDiagnosis(diagnosisId).pipe(startWith({})));

      if (result.response.affectedCount) {
        const pid = Number(patientModel?.currentPatient?.chartId) || Number(patientModel?.currentPatient?.patientId);

        const encounterList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisEncounter(pid, this.encounterId!).pipe(startWith([])));
        const diagnosisList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisHistory(pid, this.encounterId).pipe(startWith([])));

        const archived = diagnosisList.response.filter(({ archive }) => archive);
        const current = diagnosisList.response.filter(({ archive }) => !archive);

        this.diagnosisList.archivedList = archived;
        this.diagnosisList.currentList = current;
        this.diagnosisList.encounterList = encounterList.response;
        this.diagnosisList.list = diagnosisList.response;
      }
    } catch {}
  }

  *deleteDiagnosis(patientId: number, encounterId: number, conceptId: string, codingSystem: number) {
    try {
      const result: AjaxResponse<{ affectedCount: number }> = yield lastValueFrom(
        deleteDiagnosis(patientId, encounterId, conceptId, codingSystem).pipe(startWith({}))
      );

      if (result.response.affectedCount) {
        const encounterList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisEncounter(patientId, this.encounterId!).pipe(startWith([])));
        const diagnosisList: AjaxResponse<IPatientEncounter[]> = yield lastValueFrom(getDiagnosisHistory(patientId, this.encounterId).pipe(startWith([])));

        const archived = diagnosisList.response.filter(({ archive }) => archive);
        const current = diagnosisList.response.filter(({ archive }) => !archive);

        this.diagnosisList.archivedList = archived;
        this.diagnosisList.currentList = current;
        this.diagnosisList.encounterList = encounterList.response;
        this.diagnosisList.list = diagnosisList.response;
      }
    } catch {}
  }

  *searchDiagnosis(search: string, isGroups: boolean, isCodes: boolean, limit: number, code: string) {
    try {
      this.status.getSearchDiagnosis = OActionStatus.Pending;
      if (code === 'icd10') {
        const output: AjaxResponse<ISearchDiagnosis[]> = yield lastValueFrom(
          searchIcd10Diagnosis(search, isGroups, isCodes, limit).pipe(auditTime(100), startWith([]))
        );
        this.searchedDiagnosisList = output.response;
      }

      if (code === 'icd9') {
        const output: AjaxResponse<ISearchDiagnosis[]> = yield lastValueFrom(searchIcd9Diagnosis(search, 100).pipe(auditTime(100), startWith([])));
        this.searchedDiagnosisList = output.response;
      }

      if (code === 'snomed') {
        const output: AjaxResponse<ISearchDiagnosis[]> = yield lastValueFrom(searchSnomedDiagnosis(search, 100, 0).pipe(auditTime(100), startWith([])));
        this.searchedDiagnosisList = output.response;
      }

      if (code === 'common') {
        const output: AjaxResponse<IDiagnosis[]> = yield lastValueFrom(getDiagnosisCommon().pipe(auditTime(100), startWith({})));

        this.searchedDiagnosisList = output.response;
      }

      this.status.getSearchDiagnosis = OActionStatus.Fulfilled;
    } catch (e) {
      this.status.getSearchDiagnosis = OActionStatus.Rejected;
    }
  }

  clearSearchDiagnosis() {
    this.searchedDiagnosisList = [];
  }

  setCurrentEditable(payload: IPatientEncounter) {
    this.currentEditable = payload;
  }

  updateCurrentEditDiagnosis(payload: ICreateDiagnosis) {
    this.editDiagnosisDefaultData = payload;
  }

  clearCurrentEditable() {
    this.currentEditable = null;
  }

  clearCurrentEditDiagnosis() {
    this.editDiagnosisDefaultData = {
      archive: false,
      codingSystem: 0,
      conceptId: '',
      isCondition: false,
      name: '',
    };
  }

  clearLists() {
    this.diagnosisList.list = [];
    this.diagnosisList.currentList = [];
    this.diagnosisList.archivedList = [];
    this.diagnosisList.encounterList = [];
  }
}

const diagnosisStore = new DiagnosisStore();
export default diagnosisStore;
