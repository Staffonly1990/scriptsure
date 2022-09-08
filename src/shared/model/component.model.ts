import { makeAutoObservable, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { lastValueFrom } from 'rxjs';
import { AjaxError, AjaxResponse } from 'rxjs/ajax';
import { startWith } from 'rxjs/operators';
import { find } from 'lodash';

import { ActionStatus, OActionStatus } from 'shared/lib/model';
import { getHiddenComponents, IHiddenComponents } from 'shared/api/settings';

class ComponentModel {
  public status: Record<'fetch', ActionStatus> = {
    fetch: OActionStatus.Initial,
  };

  public errors: Record<'fetch', Nullable<string>> = {
    fetch: null,
  };

  public hiddenComponents: any = [];

  constructor() {
    makeAutoObservable(this, {
      hiddenComponents: observable,
    });
  }

  *getHiddenComponents(appID?: any) {
    if (appID) {
      this.hiddenComponents = [];
      this.status.fetch = OActionStatus.Pending;
      this.errors.fetch = null;
      try {
        const output: AjaxResponse<{ data: IHiddenComponents[] }> = yield lastValueFrom(getHiddenComponents(appID).pipe(startWith([])));
        const { data } = output.response ?? {};
        this.hiddenComponents = data;
        this.status.fetch = OActionStatus.Fulfilled;
      } catch (error: unknown) {
        this.status.fetch = OActionStatus.Rejected;
        this.errors.fetch = (error as AjaxError)?.response?.message ?? null;
      }
    }
  }

  isHidden = computedFn((name: string): boolean => {
    if (!this.hiddenComponents || this.hiddenComponents.length === 0) {
      return false;
    }
    const exists = find(this.hiddenComponents, (hiddenComponent: IHiddenComponents) => {
      return hiddenComponent.name === name;
    });

    return !!exists;
  });
}

const componentModel = new ComponentModel();
export default componentModel;
