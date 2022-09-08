import { makeAutoObservable, observable } from 'mobx';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { getVitals, archiveVitals, IVitals, sendVitals } from 'shared/api/vital';

class VitalStore {
  public list: IVitals[] = [];

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
        list: observable.shallow,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *getAllVitals(patientId: string | number, vitalType: string) {
    this.list = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<object[]> = yield lastValueFrom(getVitals(patientId, vitalType).pipe(startWith([])));
      this.list = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *setArchiveVital(payload: IVitals) {
    this.status.search = OActionStatus.Pending;
    try {
      const output: AjaxResponse<IVitals> = yield lastValueFrom(archiveVitals(payload).pipe(startWith({})));
    } catch (e: unknown) {}
  }

  *addVital(payload: IVitals) {
    this.status.search = OActionStatus.Pending;
    try {
      const output: AjaxResponse<IVitals> = yield lastValueFrom(sendVitals(payload).pipe(startWith([])));
    } catch (e: unknown) {}
  }
}

const vitalStore = new VitalStore();
export default vitalStore;
