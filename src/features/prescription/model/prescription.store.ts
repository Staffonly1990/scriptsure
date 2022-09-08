import { makeAutoObservable, observable } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';

import { API_URL_SCRIPTSURE } from 'shared/config';
import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { getPrescription } from 'shared/api/prescription';
import { IPrescription } from 'shared/api/prescription/prescription.types';
import { IMessage } from 'shared/api/message';

class PrescriptionQueue {
  public list: IPrescription[] = [];

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
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );
  }

  *get() {
    this.list = [];
    this.exportLink = undefined;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<{ results: IPrescription[] }> = yield lastValueFrom(getPrescription().pipe(startWith([])));
      const { results } = output.response ?? {};
      this.status.search = OActionStatus.Fulfilled;
      this.list = results ?? [];
      this.exportLink = `${API_URL_SCRIPTSURE}/v1.0/electronic/queue/`;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  deletePrescription(message: IMessage) {
    // TODO
  }

  approveMessage(message: IMessage) {
    // TODO
  }

  editPrescriptionCompound(message: IMessage) {
    // TODO
  }

  editPrescription(message: IMessage) {
    // TODO
  }
}

const prescriptionQueue = new PrescriptionQueue();
export default prescriptionQueue;
