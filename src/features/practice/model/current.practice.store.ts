import { union, find } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { IUser, IUserData } from 'shared/api/user';
import { switchPracticeUser, IPractice } from 'shared/api/practice';
import { findSetting } from 'features/settings/lib/find.setting';

class CurrentPracticeStore {
  list: IPractice[] = [];

  result: IPractice[] = [];

  states: string[] = [];

  search = '';

  state = 'ALL';

  constructor() {
    makeAutoObservable(this);
  }

  getCurrentPractice(practices: Nullable<IPractice[]>) {
    this.list = practices || [];
    this.result = practices || [];
    this.states = ['ALL', ...union(practices?.map((practic) => practic.state))];
  }

  searchChange(value: string) {
    this.search = value.toLowerCase();
    this.filter();
  }

  stateСhoice(value: string) {
    this.state = value;
    this.filter();
  }

  /**
   * Sets the practice and the current user default is one exists. This process is run
   * on load of the application as well as change to the practice
   * @param practice - Practice entity
   * @param showToastMessages - Show the toast to indicate that the practice has been changed
   */
  setPracticeUser(practice: IPractice, user: IUserData): IUser {
    const setting = findSetting(user.settings, 'DEFAULT_DOCTOR', 'User');
    let defaultDoctor: string | null;
    if (setting) {
      // If the base value is not set then take the default
      // value
      defaultDoctor = null;
    } else {
      defaultDoctor = null;
    }
    if (defaultDoctor) {
      const defaultPrescriber = find(practice.prescribers, (prescriber) => prescriber.id === Number(defaultDoctor));
      // The prescriber cannot be found.Possible cause is that maybe the
      // default was set and then the user left the practice and can no
      // longer be found as a current user.

      // There is no default doctor set, so the code grabs
      // the current user

      if (defaultPrescriber) {
        // Make sure that the physician is approved by the doctor
        // It could be that the default is this prescriber but the
        // actual doctor has not approved them yet and is not
        // allowed tro prescriber for them
        if (defaultPrescriber.PrescribeFor) {
          if (defaultPrescriber.PrescribeFor.accessStatus === 0) {
            // There is no default doctor set, so the code grabs
            // the current user
            return defaultPrescriber;
          }
        } else {
          return user.user;
        }
      }
    }

    // There is no default doctor set, so the code grabs
    // the current user
    if (user.currentPrescriber) {
      // Just ensure that the currentPrescriber is part of the users
      // allowed to prescribe under the practice
      const exists = find(practice.prescribers, (prescriber) => prescriber.id === Number(user.currentPrescriber.id));
      if (!exists) {
        return user.user;
      }
    }
    return user.user;
  }

  *switchPracticeUser(prescriberV: IUser, practiceV: IPractice) {
    yield lastValueFrom(
      switchPracticeUser({
        practice: practiceV,
        prescriber: prescriberV,
      })
    )
      .then((response) => {
        console.log(response.response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  filter() {
    if (this.state === 'ALL') {
      this.result = this.search.length >= 3 ? this.list.filter((practice) => practice.name.toLowerCase().includes(this.search)) : this.list;
    } else {
      this.result =
        this.search.length >= 3
          ? this.list.filter((practice) => practice.state === this.state && practice.name.toLowerCase().includes(this.search))
          : this.list.filter((practice) => practice.state === this.state);
    }
  }
}

const currentPracticeStore = new CurrentPracticeStore();
export default currentPracticeStore;
