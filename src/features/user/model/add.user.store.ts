import { makeAutoObservable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { IPractice } from 'shared/api/practice';
import { uniqBy, remove, uniq } from 'lodash';
import {
  addInviteUser,
  checkEmail,
  fetchPractices,
  IUserInvite,
  userSearchIncludeInvite,
  IInviteUserPrescribeFor,
  IInviteUserPractice,
  resendInvite,
} from 'shared/api/invite';
import userModel from './user.model';

class AddUser {
  practices: IPractice[] = [];

  selectPracticesList: IPractice[] = [];

  addPracticesList: IPractice[] = [];

  filterPracticesList: IPractice[] = [];

  users: IUserInvite[] = [];

  selectUsersList: IUserInvite[] = [];

  addtUsersList: IUserInvite[] = [];

  filterUsersList: IUserInvite[] = [];

  mailError = false;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Saves the user by performing an addPractice for new practices
   * and updatePractice for existing practices
   */

  *addInviteUser(invite: {
    businessUnitId: number;
    email: string;
    firstName: string;
    inviteId: number;
    isBusinessUnitAdmin: boolean;
    siteAdministrator: boolean;
    lastName: string;
    suffix: string;
    prescriber: boolean;
    organizationId: number;
    inviteUserId: number;
  }) {
    yield lastValueFrom(
      addInviteUser({
        ...invite,
        InviteUserPrescribeFor: this.InviteUserPrescribeFor(invite.prescriber),
        InviteUserPractice: this.InviteUserPractice(),
        emailVerified: false,
        // Ensures that an invite email is sent to new user
        sendInvite: !invite.inviteUserId,
        userStatus: invite.inviteUserId ? 3 : 4,
      })
    )
      .then((res) => {
        console.log(res.response);
      })
      .catch((err) => {
        console.log(err.response);
      });
    this.nullify();
    this.removeUsers();
    this.removePractices();
    this.mailError = false;
  }

  InviteUserPrescribeFor(prescriber: boolean): IInviteUserPrescribeFor[] {
    const newArr = this.addtUsersList.map((value) => {
      return {
        name: value.fullName,
        userCreated: value.userCreated,
        prescriberId: prescriber ? 0 : this.prescriberId(value.inviteUserId!, value.id),
        prescriberIdFor: prescriber ? this.prescriberId(value.inviteUserId!, value.id) : 0,
      };
    });
    return newArr;
  }

  InviteUserPractice(): IInviteUserPractice[] {
    const newArr = this.addPracticesList.map((value) => {
      return {
        name: value.name,
        practiceCreated: value.id > 0,
        practiceId: value.id > 0 ? value.id : value.invitePracticeId,
      };
    });
    return newArr;
  }

  prescriberId(inviteUserId: number, id?: number): number {
    return id && id > 0 ? id : inviteUserId;
  }

  inputSearch(text: string, type: string) {
    this.selectPracticesList = [];
    this.selectUsersList = [];
    switch (type) {
      case 'practice':
        this.filterPracticesList = this.practices.filter((value) => value.name.toLowerCase().includes(text.toLowerCase()));
        break;
      case 'users':
        this.filterUsersList = this.users.filter((value) => value.lastName!.toLowerCase().includes(text.toLowerCase()));
        break;
      default:
        break;
    }
  }

  nullify() {
    this.users = [];
    this.practices = [];
    this.selectPracticesList = [];
    this.selectUsersList = [];
    this.filterUsersList = [];
    this.filterPracticesList = [];
  }

  selectPractices(practice: IPractice) {
    let newArr = this.selectPracticesList.filter((value) => value !== practice);
    if (this.selectPracticesList.length > newArr.length) {
      this.selectPracticesList = newArr;
    } else {
      this.selectPracticesList.push(practice);
    }
    newArr = [];
  }

  addPractices(practice?: IPractice) {
    if (practice) {
      this.addPracticesList = [practice];
    } else {
      this.addPracticesList = uniqBy([...this.addPracticesList, ...this.selectPracticesList], 'id');
    }
  }

  addtUsers(user?: IUserInvite) {
    if (user) {
      this.addtUsersList = uniqBy([...this.addtUsersList, user], 'id');
    } else {
      this.addtUsersList = uniqBy([...this.addtUsersList, ...this.selectUsersList], 'id');
    }
  }

  removeUsers(user?: IUserInvite) {
    if (user) {
      this.addtUsersList = this.addtUsersList.filter((value) => value !== user);
    } else {
      this.addtUsersList = [];
    }
  }

  removePractices(practice?: IPractice) {
    if (practice) {
      this.addPracticesList = this.addPracticesList.filter((value) => value !== practice);
    } else {
      this.addPracticesList = [];
    }
  }

  selectUsers(user: IUserInvite) {
    let newArr = this.selectUsersList.filter((value) => value !== user);
    if (this.selectUsersList.length > newArr.length) {
      this.selectUsersList = newArr;
    } else {
      this.selectUsersList.push(user);
    }
    newArr = [];
  }

  *fetchPractices() {
    this.nullify();
    yield lastValueFrom(fetchPractices())
      .then((response) => {
        this.practices = response.response;
        this.filterPracticesList = [...this.practices];
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  *checkEmail(email: string) {
    yield lastValueFrom(checkEmail(email))
      .then((response) => {
        if ((response.response as { exists: boolean }).exists && (email !== userModel.dataPlatform?.email || email !== userModel.data?.user.email)) {
          this.mailError = true;
        } else {
          this.mailError = false;
        }
      })
      .catch((err) => {
        console.log(err.response);
        this.mailError = false;
      });
  }

  *userSearchIncludeInvite(prescriber: boolean, inviteId?: number, organizationId?: number, inviteOrganizationId?: number, currentUserID?: number) {
    this.nullify();
    if (inviteId && organizationId && currentUserID) {
      yield lastValueFrom(userSearchIncludeInvite(inviteId, inviteOrganizationId ?? 0, organizationId, prescriber))
        .then((response) => {
          this.users = response.response.filter((user) => user.id !== currentUserID);
          this.filterUsersList = [...this.users];
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }

  *userResendInvite(payload) {
    try {
      const output = yield lastValueFrom(resendInvite(payload));
    } catch (err: unknown) {}
  }

  /**
   * Filters the user list
   * @param filterType
   */
  filter(action: string) {
    this.selectPracticesList = [];
    this.selectUsersList = [];
    switch (action) {
      case 'All':
        this.filterUsersList = this.users;
        break;
      case 'Prescriber':
        this.filterUsersList = this.users.filter((user) => user.prescriber);
        break;
      case 'Supporting':
        this.filterUsersList = this.users.filter((user) => !user.prescriber);
        break;
      default:
        break;
    }
  }

  checkAll(type?: string) {
    if (type) {
      switch (type) {
        case 'practice':
          this.selectPracticesList = [...this.practices];
          break;
        case 'users':
          this.selectUsersList = [...this.users];
          break;
        default:
          break;
      }
    } else {
      this.selectPracticesList = [];
      this.selectUsersList = [];
    }
  }
}

const addUser = new AddUser();
export default addUser;
