import { makeAutoObservable } from 'mobx'; // flowResult
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { auditTime, startWith } from 'rxjs/operators';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import { forgotEmail, forgotPassword } from 'shared/api/user';

class LoginModalModel {
  public status: Record<'forgotEmail' | 'forgotPassword', ActionStatus> = {
    forgotEmail: OActionStatus.Initial,
    forgotPassword: OActionStatus.Initial,
  };

  public errors: Record<'forgotEmail' | 'forgotPassword', Nullable<string>> = {
    forgotEmail: null,
    forgotPassword: null,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /** Send the user over to the platform for a reset on the password */
  *forgotEmail() {
    this.status.forgotEmail = OActionStatus.Pending;
    this.errors.forgotEmail = null;
    let url: Nullable<string> = null;
    try {
      const output: AjaxResponse<Nullable<string>> = yield lastValueFrom(forgotEmail().pipe(auditTime(300), startWith(null)));
      this.status.forgotEmail = OActionStatus.Fulfilled;
      url = output.response ?? null;
    } catch (error: unknown) {
      this.status.forgotEmail = OActionStatus.Rejected;
      this.errors.forgotEmail = (error as AjaxError)?.response?.message ?? null;
    }
    return url;
  }

  /** Send the user over to the platform for a reset on the password */
  *forgotPassword() {
    this.status.forgotPassword = OActionStatus.Pending;
    this.errors.forgotPassword = null;
    let url: Nullable<string> = null;
    try {
      const output: AjaxResponse<Nullable<string>> = yield lastValueFrom(forgotPassword().pipe(auditTime(300), startWith(null)));
      this.status.forgotPassword = OActionStatus.Fulfilled;
      url = output.response ?? null;
    } catch (error: unknown) {
      this.status.forgotPassword = OActionStatus.Rejected;
      this.errors.forgotPassword = (error as AjaxError)?.response?.message ?? null;
    }
    return url;
  }
}

const loginModalModel = new LoginModalModel();
export default loginModalModel;
