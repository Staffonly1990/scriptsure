import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { archiveEducation, deleteEducation, getEducation, IEducation } from 'shared/api/education';

class EducationStore {
  public list: IEducation[] = [];

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public errors: Record<'search' | 'id' | 'message', Nullable<string>> = {
    search: null,
    id: null,
    message: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        list: observable.shallow,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *getAllEducation(patientId: string | number, vitalType: string) {
    this.list = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getEducation(patientId, vitalType).pipe(startWith([])));
      this.status.search = OActionStatus.Fulfilled;
      this.list = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *setArchiveEducation(payload: IEducation) {
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<{ results: IEducation[] }> = yield lastValueFrom(archiveEducation(payload).pipe(startWith({})));
      const { results } = output.response ?? {};
      this.status.search = OActionStatus.Fulfilled;
      this.list = results ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
      this.errors.id = (error as AjaxError)?.response?.id ?? null;
      this.errors.message = (error as AjaxError)?.response?.err?.message;
    }
  }

  *deleteEducation(educationId: number) {
    try {
      yield lastValueFrom(deleteEducation(educationId).pipe(startWith({})));
    } catch {}
  }

  clearEducationStatus() {
    this.errors.id = null;
    this.errors.message = null;
  }
}

const educationStore = new EducationStore();
export default educationStore;
