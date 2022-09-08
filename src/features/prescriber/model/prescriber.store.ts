import { makeAutoObservable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { grantAccess, requestAccess, IUser, userSearch, IFilter, IPrescriber } from 'shared/api/user';
import { SettingTypeEnum } from 'shared/api/settings';
import { getAccessRequest, saveAccessRequest, deleteAccessRequest } from 'shared/api/prescriber';
import { switchPracticeUser, IPractice } from 'shared/api/practice';
import { userModel } from 'features/user';
import { settingsModel } from 'features/settings';

class Prescriber {
  users: Partial<IUser>[] = [];

  showUsers: Partial<IUser>[] = [];

  selectUsers: Partial<IUser>[] = [];

  prescribers: IPrescriber[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  nullify() {
    this.selectUsers = [];
    this.users = [];
    this.showUsers = [];
  }

  selectUser(user: Partial<IUser>) {
    let newArr = this.selectUsers.filter((value) => value !== user);
    if (this.selectUsers.length > newArr.length) {
      this.selectUsers = newArr;
    } else {
      this.selectUsers.push(user);
    }
    newArr = [];
  }

  checkAll(action?: string) {
    if (action) {
      this.selectUsers = this.showUsers;
    } else {
      this.selectUsers = [];
    }
  }

  /**
   * Filters the user list
   * @param filterType
   */
  filter(action: number) {
    this.selectUsers = [];
    switch (action) {
      case 0:
        this.showUsers = this.users;
        break;
      case 1:
        this.showUsers = this.users.filter((user) => user.npi && user.npi.length > 0);
        break;
      case 2:
        this.showUsers = this.users.filter((user) => !user.npi || user.npi.length === 0);
        break;
      default:
        break;
    }
  }

  addChecked(type: string, userIDV?: number) {
    switch (type) {
      case 'grantUsers':
        this.selectUsers.forEach((user) => {
          this.saveAccessRequest({
            accessStatus: 0,
            userID: userIDV,
            prescriberID: user.id,
          });
        });
        break;
      case 'requestUsers':
        this.selectUsers.forEach((user) => {
          this.addAccessRequest(userIDV, user.id);
        });
        break;
      default:
        break;
    }
  }

  *userSearch(filter: IFilter) {
    this.nullify();
    yield lastValueFrom(userSearch({ ...filter }))
      .then((response) => {
        this.users = response.response;
        this.showUsers = response.response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Grant access to users to prescribe under the current
   * user who is a doctor
   */
  *grantAccess() {
    this.nullify();
    yield lastValueFrom(grantAccess())
      .then((response) => {
        this.users = response.response;
        this.showUsers = response.response;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  *requestAccess(organizationId?: number) {
    this.nullify();
    if (organizationId) {
      yield lastValueFrom(requestAccess(organizationId))
        .then((response) => {
          this.users = response.response;
          this.showUsers = response.response;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Save or update the access request
   * @returns {boolean} - Returns True if the access request is insert: Returns False when
   * the access request record is updated
   */
  *saveAccessRequest(accessRequest: { userID?: number | null; prescriberID?: number | null; accessStatus: number }) {
    if (accessRequest.prescriberID && accessRequest.userID) {
      yield lastValueFrom(
        saveAccessRequest({
          userID: accessRequest.userID,
          prescriberID: accessRequest.prescriberID,
          accessStatus: accessRequest.accessStatus,
        })
      )
        .then((response) => {
          console.log(response.response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Gets a specific AccessRequest request
   * @param userId - AccessRequest identification number
   * @param prescriberId - prescriber identification number
   * @returns {Promise} - AccessRequest request entity {@link scriptsure.services.IAccessRequest}
   */
  *addAccessRequest(userId?: number, prescriberId?: number) {
    if (userId && prescriberId) {
      // Check to see if a request has already been submitted
      yield lastValueFrom(getAccessRequest(userId, prescriberId))
        .then((response) => {
          if (!response.response) {
            this.saveAccessRequest({
              userID: userId,
              prescriberID: prescriberId,
              accessStatus: 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Deletes a access request
   * @param userId - user identification number
   * @returns {boolean} - Returns True if the access request is deleted: Returns False when
   * the access request record is not deleted
   */

  *deleteRequest(userId?: number, prescriberId?: number) {
    if (userId && prescriberId) {
      yield lastValueFrom(deleteAccessRequest(userId, prescriberId))
        .then((response) => {
          console.log(response.response);

          this.prescribers = this.prescribers.filter((prescriber) => prescriberId !== prescriber.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *switchPracticeUser(practiceV: IPractice, prescriberV?: IUser) {
    if (prescriberV) {
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
  }

  /**
   * Set which physician has been set as the default prescriber for the practice.
   * The default physician will automatically be selected when the user selects
   * the practice in the future.
   */
  setDefault(prescribers?: IPrescriber[]) {
    // Get the default user to present on the dialog
    this.prescribers = [];
    const defaultDoctor = settingsModel.get('DEFAULT_DOCTOR', SettingTypeEnum.USER);
    if (prescribers) {
      if (defaultDoctor) {
        prescribers.forEach((prescriber) => {
          if (prescriber.id === Number(defaultDoctor)) {
            this.prescribers.push({ ...prescriber, defaultDoctor: true });
          } else {
            this.prescribers.push({ ...prescriber, defaultDoctor: false });
          }
        });
      } else {
        userModel.data?.currentPractice?.prescribers.forEach((prescriber) => {
          this.prescribers.push({ ...prescriber, defaultDoctor: false });
        });
      }
    }
  }
}

const currentPrescriber = new Prescriber();
export default currentPrescriber;
