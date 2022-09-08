import { makeAutoObservable, observable, computed } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';
import { addNewPractice, getAdminPractice, getCurrentAdminPractice, getPracticeUsers, IPractice, updateCurrentAdminPractice } from 'shared/api/practice';
import { IUser } from 'shared/api/user';
import { ActionStatus, OActionStatus } from 'shared/lib/model';

class PracticeModel {
  public practiceUsers: IUser[] = [];

  public adminPractice: IUser[] = [];

  public currentAdminPractice: Nullable<IPractice> = null;

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public errors: Record<'search', Nullable<string>> = {
    search: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        practiceUsers: observable.shallow,
        adminPractice: observable.shallow,
        currentAdminPractice: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *getPracticeUsers(patientId: string | number) {
    this.practiceUsers = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IUser[]> = yield lastValueFrom(getPracticeUsers(patientId).pipe(startWith([])));
      this.practiceUsers = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getAdminPractice(patientId: string | number) {
    this.adminPractice = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IUser[]> = yield lastValueFrom(getAdminPractice(patientId).pipe(startWith([])));
      this.adminPractice = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getCurrentAdminPractice(patientId: string | number) {
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPractice> = yield lastValueFrom(getCurrentAdminPractice(patientId).pipe(startWith([])));
      this.currentAdminPractice = output.response;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *updateCurrentAdminPractice(practiceId: string | number, payload: IPractice) {
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPractice> = yield lastValueFrom(updateCurrentAdminPractice(practiceId, payload).pipe(startWith([])));
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *addNewPractice(payload: IPractice) {
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPractice> = yield lastValueFrom(addNewPractice(payload).pipe(startWith([])));
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }
}

const practiceModel = new PracticeModel();
export default practiceModel;
