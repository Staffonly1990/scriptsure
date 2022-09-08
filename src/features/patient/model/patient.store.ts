import { makeAutoObservable, observable } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';

import { uniq } from 'lodash';
import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  searchPatient,
  advancedSearchPatient,
  IPatient,
  IPatientAdvancedQueryPayload,
  IPatientDuplicate,
  checkDuplicatePatient,
  mergePatient,
} from 'shared/api/patient';
import { API_URL_SCRIPTSURE } from 'shared/config';

class PatientStore {
  public listMerge: IPatient[] = [];

  public patientChild: IPatient[] = [];

  public patientMerge: IPatient = {};

  public list: IPatient[] = [];

  public duplicateList: IPatientDuplicate[] = [];

  public duplicateRequest: Array<string | undefined> = [];

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public exportLink: string | undefined = undefined;

  public errors: Record<'search', Nullable<string>> = {
    search: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        list: observable,
        duplicateList: observable,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  removePatientChild(patient: IPatient) {
    this.patientChild = this.patientChild.filter((value) => value !== patient);
  }

  setAsPrimary(patient?: IPatient) {
    if (patient) {
      this.patientMerge = patient;
    } else {
      this.patientMerge = {};
    }
  }

  addPatientIdChild(child?: IPatient) {
    if (child) {
      this.patientChild = uniq([...this.patientChild, child]);
    } else {
      this.patientChild = [];
    }
  }

  cleanUpListMerge() {
    this.listMerge = [];
  }

  *search(query: string) {
    this.list = [];
    this.exportLink = undefined;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<{ results: IPatient[]; guid: string }> = yield lastValueFrom(searchPatient({ query }).pipe(startWith([])));
      const { results, guid } = output.response ?? {};
      this.status.search = OActionStatus.Fulfilled;
      this.list = results ?? [];
      this.exportLink = guid ? `${API_URL_SCRIPTSURE}/v1.0/patient/search/export/${guid}` : `${API_URL_SCRIPTSURE}/v1.0/patient/search/export/`;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *searchMerge(query: string) {
    this.listMerge = [];
    try {
      const output: AjaxResponse<{ results: IPatient[]; guid: string }> = yield lastValueFrom(searchPatient({ query }).pipe(startWith([])));
      const { results } = output.response ?? {};
      this.listMerge = results ?? [];
    } catch (error: unknown) {
      console.log(error);
    }
  }

  *mergePatient() {
    const payload = {
      patientId: this.patientMerge.patientId!,
      patientIdChild: this.patientChild.map((value) => value.patientId as number),
    };
    yield lastValueFrom(mergePatient(payload))
      .then((response) => {
        this.setAsPrimary();
        this.addPatientIdChild();
        this.cleanUpListMerge();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  *advancedSearchMerge(advQuery: IPatientAdvancedQueryPayload) {
    this.listMerge = [];
    try {
      const output: AjaxResponse<{ results: IPatient[]; guid: string }> = yield lastValueFrom(advancedSearchPatient({ advQuery }).pipe(startWith([])));
      const { results } = output.response ?? {};
      this.listMerge = results ?? [];
    } catch (error: unknown) {
      console.log(error);
    }
  }

  *advancedSearch(advQuery: IPatientAdvancedQueryPayload) {
    this.list = [];
    this.exportLink = undefined;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<{ results: IPatient[]; guid: string }> = yield lastValueFrom(advancedSearchPatient({ advQuery }).pipe(startWith([])));
      const { results, guid } = output.response ?? {};
      this.status.search = OActionStatus.Fulfilled;
      this.list = results ?? [];
      this.exportLink = guid ? `${API_URL_SCRIPTSURE}/v1.0/patient/search/export/${guid}` : `${API_URL_SCRIPTSURE}/v1.0/patient/search/export/`;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *searchDuplicate(payload: IPatientDuplicate, request: Array<string | undefined>) {
    this.duplicateRequest = request;
    try {
      const output: AjaxResponse<{ results: IPatientDuplicate[] }> = yield lastValueFrom(checkDuplicatePatient(payload).pipe(startWith({})));

      this.duplicateList = output.response.results;
    } catch {}
  }

  cleanUpDuplicateList() {
    this.duplicateList = [];
    this.duplicateRequest = [];
  }

  cleanUpList() {
    this.list = [];
  }
}

const patientStore = new PatientStore();
export default patientStore;
