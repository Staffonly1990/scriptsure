import { flowResult, makeAutoObservable } from 'mobx';
import {
  ITaxonomy,
  fetchTaxonomy,
  requestAccess,
  grantAccess,
  getUsers,
  IApplication,
  IPrescriber,
  IPrescribeFor,
  IUserPlatform,
  IEpcs,
  getUserEpcs,
  saveEpcs,
  getEpcsRequest,
  deactivateSpi,
  deleteSpi,
  electronicStatus,
  IUserSpi,
  updateUser,
  IApplicationUser,
  IPrescribeUsing,
  IPracticeUser,
} from 'shared/api/user';
import { AjaxResponse } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { getOrganization, IOrganization } from 'shared/api/organization';
import { getPracticeList, IPractice, registerUser, saveSpi } from 'shared/api/practice';
import { uniqBy, uniq, find, concat, forEach, isNil } from 'lodash';
import { getBusinessUnitDetail, updateSubscription } from 'shared/api/settings';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import userModel from './user.model';

export interface IPracticeProfile extends IPractice {
  spi?: string;
  serviceLevel?: Nullable<number>;
}

class EditProfile {
  public taxonomys: ITaxonomy[] = [];

  public organization: Nullable<IOrganization> = null;

  public practices: IPracticeProfile[] = [];

  public practicesList: IPracticeProfile[] = [];

  public practicesSelect: IPracticeProfile[] = [];

  public practicesFilter: IPracticeProfile[] = [];

  public prescribers: IPrescriber[] = [];

  public prescribersList: IPrescriber[] = [];

  public prescribersFilter: IPrescriber[] = [];

  public prescribersSelect: IPrescriber[] = [];

  public prescribeFors: IPrescribeFor[] = [];

  public prescribeForsList: IPrescribeFor[] = [];

  public prescribeForsFilter: IPrescribeFor[] = [];

  public prescribeForsSelect: IPrescribeFor[] = [];

  public applications: IApplication[] = [];

  public epcsRequest: IEpcs[] = [];

  public electronStatuses: { spi: string; serviceLevel: number }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  nullify() {
    this.practicesSelect = [];
    this.practicesList = [];
    this.practicesFilter = [];

    this.prescribersList = [];
    this.prescribersFilter = [];
    this.prescribersSelect = [];

    this.prescribeForsList = [];
    this.prescribeForsFilter = [];
    this.prescribeForsSelect = [];
  }

  async profileValues(dataPlatform: IUserPlatform | null) {
    if (dataPlatform) {
      await this.fetchTaxonomy();
      await this.getOrganization();
      await this.defaultPrescribers(dataPlatform.Prescribers ?? []);
      await this.defaultPrescribeFors(dataPlatform.PrescribeFors ?? []);
      await this.defaultApplications(dataPlatform.Applications ?? []);
      await this.defaultPractices(dataPlatform); // 1
      await this.getUserEpcs(dataPlatform.id); // 2
      await this.electronicStatuses(); // 3
    }
  }

  electronicStatuses() {
    this.electronStatuses = [];
    this.practices.forEach((practice) => {
      if (practice.spi) {
        this.electronicStatus(practice.spi);
      }
    });
  }

  defaultPrescribeFors(prescribeFors: IPrescribeFor[]) {
    this.prescribeFors = prescribeFors;
  }

  removePrescribeFor(prescriber: IPrescribeFor) {
    this.prescribeFors = this.prescribeFors.filter((value) => value.id !== prescriber.id);
  }

  addPrescribeFor(prescriber?: IPrescribeFor) {
    if (prescriber) {
      this.prescribeFors = uniqBy([...this.prescribeFors, prescriber], 'id');
    } else {
      this.prescribeFors = uniqBy([...this.prescribeFors, ...this.prescribeForsSelect], 'id');
    }
  }

  removeAllPrescribeFors() {
    this.prescribeFors = [];
  }

  selectPrescriberFors(prescriber: IPrescribeFor) {
    const arr = this.prescribeForsSelect.filter((value) => value.id !== prescriber.id);
    if (arr.length < this.prescribeForsSelect.length) {
      this.prescribeForsSelect = arr;
    } else {
      this.prescribeForsSelect = [...this.prescribeForsSelect, prescriber];
    }
  }

  defaultPrescribers(prescribers: IPrescriber[]) {
    this.prescribers = prescribers;
  }

  removePrescriber(prescriber: IPrescriber) {
    this.prescribers = this.prescribers.filter((value) => value.id !== prescriber.id);
  }

  addPrescriber(prescriber?: IPrescriber) {
    if (prescriber) {
      this.prescribers = uniqBy([...this.prescribers, prescriber], 'id');
    } else {
      this.prescribers = uniqBy([...this.prescribers, ...this.prescribersSelect], 'id');
    }
  }

  removeAllPrescribers() {
    this.prescribers = [];
  }

  selectPrescriber(prescriber: IPrescriber) {
    const arr = this.prescribersSelect.filter((value) => value.id !== prescriber.id);
    if (arr.length < this.prescribersSelect.length) {
      this.prescribersSelect = arr;
    } else {
      this.prescribersSelect = [...this.prescribersSelect, prescriber];
    }
  }

  removeAllPractices() {
    this.practices = [];
  }

  removePractice(practice: IPractice) {
    this.practices = this.practices.filter((value) => value.id !== practice.id);
  }

  defaultApplications(applications: IApplication[]) {
    this.applications = applications;
  }

  removeApplications(application: IApplication) {
    this.applications = this.applications.filter((value) => value.id !== application.id);
  }

  addApplications(application: IApplication) {
    this.applications = uniqBy([...this.applications, application], 'id');
  }

  defaultPractices(dataPlatform: IUserPlatform) {
    if (dataPlatform.Practices?.length) {
      this.practices = dataPlatform.Practices.map((value) => {
        return { ...value, ...this.addUserSpi(value.id, dataPlatform.UserSpi) };
      });
    }
  }

  addPractices(usersSpi?: IUserSpi[]) {
    const selects = this.practicesSelect.map((practice) => {
      return { ...practice, ...this.epcsStatus(practice.id), ...this.addUserSpi(practice.id, usersSpi) };
    });
    this.practices = uniqBy([...this.practices, ...selects], 'id');
  }

  addUserSpi(practiceId: number, usersSpi?: IUserSpi[]) {
    if (practiceId && usersSpi && usersSpi?.length) {
      const userSpi = usersSpi.find((value) => value.practiceId === practiceId)?.spi;
      return { spi: userSpi };
    }
    return {};
  }

  selectPractice(practice: IPractice) {
    const arr = this.practicesSelect.filter((value) => value.id !== practice.id);
    if (arr.length < this.practicesSelect.length) {
      this.practicesSelect = arr;
    } else {
      this.practicesSelect = [...this.practicesSelect, practice];
    }
  }

  inputSearch(text: string, type: string) {
    this.practicesSelect = [];
    this.prescribersSelect = [];
    this.prescribeForsSelect = [];
    switch (type) {
      case 'practice':
        this.practicesFilter = this.practicesList.filter((value) => value.name.toLowerCase().includes(text.toLowerCase()));
        break;
      case 'prescribers':
        this.prescribersFilter = this.prescribersList.filter((value) => value.lastName!.toLowerCase().includes(text.toLowerCase()));
        break;
      case 'prescribeFors':
        this.prescribeForsFilter = this.prescribeForsList.filter((value) => value.lastName!.toLowerCase().includes(text.toLowerCase()));
        break;
      default:
        break;
    }
  }

  checkAll(type?: string) {
    if (type) {
      switch (type) {
        case 'practice':
          this.practicesSelect = [...this.practicesFilter];
          break;
        case 'prescribers':
          this.prescribersSelect = [...this.prescribersFilter];
          break;
        case 'prescribeFors':
          this.prescribeForsSelect = [...this.prescribeForsFilter];
          break;
        default:
          break;
      }
    } else {
      this.practicesSelect = [];
      this.prescribersSelect = [];
      this.prescribeForsSelect = [];
    }
  }

  *getUserEpcs(userId?: number) {
    this.epcsRequest = [];
    if (userId) {
      try {
        const output: AjaxResponse<IEpcs[]> = yield lastValueFrom(getUserEpcs(userId).pipe(startWith(null)));
        this.epcsRequest = output.response ?? [];
        this.practices = this.practices.map((practice) => {
          return { ...practice, ...this.epcsStatus(practice.id) };
        });
      } catch (error: unknown) {
        this.epcsRequest = [];
      }
    }
  }

  requestEpcsALL(data: IUserPlatform | null) {
    if (data) {
      this.practices.forEach((valuie) => {
        this.saveEpcs({
          practiceId: valuie.id,
          userId: data.id!,
          userName: `${data.firstName} ${data.lastName}`,
          status: 1,
          validateMethod: 1,
        });
      });
    }
  }

  *registerUser(userId: number, serviceLevels?: { value: number; checked: boolean }[]) {
    try {
      const output: AjaxResponse<{ response: { Error: { Description: string } } }> = yield lastValueFrom(
        registerUser({ serviceLevel: this.serviceLevelTotal(serviceLevels ?? []) }, userId).pipe(startWith(null))
      );
      if (output.response.response.Error.Description) {
        return output.response.response.Error.Description;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  *saveSpi(payload: { practiceId: number; userId: number; spi: string }) {
    try {
      yield lastValueFrom(saveSpi(payload));
    } catch (error) {
      console.log(error);
    }
  }

  *deleteSpi(spi: string) {
    try {
      yield lastValueFrom(deleteSpi(spi));
      this.practices = this.practices.map((value) => (value.spi === spi ? { ...value, spi: undefined } : { ...value }));
    } catch (error) {
      console.log(error);
    }
  }

  *deactivateSpi(spiV: string) {
    try {
      yield lastValueFrom(deactivateSpi({ spi: spiV }));
    } catch (error) {
      console.log(error);
    }
  }

  *electronicStatus(spi: string) {
    try {
      const output: AjaxResponse<any> = yield lastValueFrom(electronicStatus(spi).pipe(startWith(null)));
      if (output.response.response.ServiceLevel) {
        this.electronStatuses.push({
          serviceLevel: output.response.response.ServiceLevel,
          spi,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  *getBusinessUnitDetail(businessUnitId: number) {
    try {
      const output: AjaxResponse<{
        BillingAccount: {
          accountCode: string;
          subscriptionMonthly: any;
          subscriptionYearly: any;
        };
        billingAccountId: number;
      }> = yield lastValueFrom(getBusinessUnitDetail(businessUnitId).pipe(startWith(null)));
      return output.response;
    } catch (error: unknown) {
      console.log(error);
    }
    return null;
  }

  *updateSubscription(payload: {
    accountCode: string | null;
    billingAccountId: number | null;
    subscriptionMonthly: any | null;
    subscriptionYearly: any | null;
  }) {
    try {
      yield lastValueFrom(updateSubscription(payload));
    } catch (error: unknown) {
      console.log(error);
    }
  }

  *saveEpcs(epcs: { practiceId: number; userId: number; userName: string; status: number; validateMethod: number }) {
    try {
      const output: AjaxResponse<IEpcs> = yield lastValueFrom(saveEpcs(epcs).pipe(startWith(null)));
      console.log(output.response);
    } catch (error: unknown) {
      console.log(error);
    }
  }

  /**
   * Saves the user by performing an addPractice for new practices
   * and updatePractice for existing practices
   */
  *saveUser(user: IUserPlatform, form: UseFormReturn<FieldValues, object>, serviceLevels: { value: number; checked: boolean }[]) {
    const setValues = {
      businessUnitId: isNil(form.getValues('businessUnit')) ? user.businessUnitId.toString() : form.getValues('businessUnit'),

      isBusinessUnitAdmin: isNil(form.getValues('basicAdministrator')) ? userModel.isBusinessUnitAdmin() : form.getValues('basicAdministrator'),

      siteAdministrator: isNil(form.getValues('fullAdministrator ')) ? userModel.isAdministrator() : form.getValues('fullAdministrator '),

      cellPhone: isNil(form.getValues('cellPhone')) ? user.cellPhone : form.getValues('cellPhone'),

      answer1: isNil(form.getValues('answer1')) ? user.challengeAnswerOne : form.getValues('answer1'),

      answer2: isNil(form.getValues('answer2')) ? user.challengeAnswerTwo : form.getValues('answer2'),

      challengeQuestionOne: isNil(form.getValues('challengeQuestion1')) ? user.challengeQuestionOne : form.getValues('challengeQuestion1'),

      challengeQuestionTwo: isNil(form.getValues('challengeQuestion2')) ? user.challengeQuestionTwo : form.getValues('challengeQuestion2'),

      dea: isNil(form.getValues('dea')) ? user.dea : form.getValues('dea'),

      degrees: isNil(form.getValues('degree')) ? user.degrees : form.getValues('degree'),

      detox: isNil(form.getValues('detox')) ? user.detox : form.getValues('detox'),

      loginEmail: isNil(form.getValues('loginEmail')) ? user.email : form.getValues('loginEmail'),

      endDt: isNil(form.getValues('endDate')) ? user.endDt : form.getValues('endDate'),

      eulaSigned: user.eulaSigned,

      firstName: isNil(form.getValues('firstName')) ? user.firstName : form.getValues('firstName'),

      lastName: isNil(form.getValues('lastName')) ? user.lastName : form.getValues('lastName'),

      middleName: isNil(form.getValues('middleName')) ? user.middleName : form.getValues('middleName'),

      npi: isNil(form.getValues('npi')) ? user.npi : form.getValues('npi'),

      prescriber: isNil(form.getValues('prescriber')) ? user.prescriber : form.getValues('prescriber'),

      recoveryEmail: isNil(form.getValues('recoveryEmail')) ? user.recoveryEmail : form.getValues('recoveryEmail'),

      recoveryPhone: isNil(form.getValues('recoveryPhone')) ? user.recoveryPhone : form.getValues('recoveryPhone'),

      salutation: isNil(form.getValues('salutation')) ? user.salutation : form.getValues('salutation'),

      serviceLevel: serviceLevels,

      specialtyCode: isNil(form.getValues('speciality')) ? user.specialtyCode : form.getValues('speciality'),

      startDt: isNil(form.getValues('startDate')) ? user.startDt : form.getValues('startDate'),

      stateControlled: isNil(form.getValues('stateControlled')) ? user.stateControlled : form.getValues('stateControlled'),

      stateLicense: isNil(form.getValues('stateLicense')) ? user.stateLicense : form.getValues('stateLicense'),

      suffix: isNil(form.getValues('suffix')) ? user.suffix : form.getValues('suffix'),

      supervisor: isNil(form.getValues('supervisor')) ? user.supervisor : form.getValues('supervisor'),

      timeType: isNil(form.getValues('timeType')) ? user.timeType : form.getValues('timeType'),

      timeZone: isNil(form.getValues('timeZone')) ? user.timeZone : form.getValues('timeZone'),

      userExternalId: isNil(form.getValues('externalIdentification')) ? user.userExternalId : form.getValues('externalIdentification'),

      userStatus: isNil(form.getValues('userStatus')) ? user.userStatus : form.getValues('userStatus'),

      userType: isNil(form.getValues('userType')) ? user.userType : form.getValues('userType'),
    };
    try {
      let inactivate: boolean;
      if (setValues.userStatus === '1') {
        inactivate = true;
      } else {
        inactivate = false;
      }
      const output: AjaxResponse<{ businessUnitId: number }> = yield lastValueFrom(
        updateUser({
          Applications: this.applications,
          ApplicationsUsers: this.applicationsUsers(user.id),
          BusinessUnitAdmins: this.isBusinessUnitAdmin(setValues.isBusinessUnitAdmin, {
            userId: user.id,
            businessUnitId: setValues.businessUnitId,
            siteAdministrator: Number(setValues.siteAdministrator),
          }),
          OrganizationAdmins: user.OrganizationAdmins,
          PracticeUsers: this.practiceUsers(user.id),
          Practices: this.practices,
          PrescribeUsing: this.prescribeUsing(user.id),
          Prescribers: this.prescribers,
          UserSpi: user.UserSpi,
          archived: user.archived,
          businessUnitId: setValues.businessUnitId,
          cellPhone: setValues.cellPhone,
          challengeAnswerOne: setValues.answer1,
          challengeAnswerTwo: setValues.answer2,
          challengeQuestionOne: setValues.challengeQuestionOne,
          challengeQuestionTwo: setValues.challengeQuestionTwo,
          dea: setValues.dea,
          deaInstitute: user.deaInstitute,
          degrees: setValues.degrees,
          detox: setValues.detox,
          directAddress: user.directAddress,
          dob: user.dob,
          email: setValues.loginEmail,
          emailConfirm: user.emailConfirm,
          emailVerificationTimestamp: user.emailVerificationTimestamp,
          emailVerified: user.emailVerified,
          endDt: setValues.endDt,
          eulaSigned: setValues.eulaSigned,
          experianResult: user.experianResult,
          experianTransactionId: user.experianTransactionId,
          firstName: setValues.firstName,
          fullName: user.fullName,
          id: user.id,
          inactivateUser: inactivate,
          isBusinessUnitAdmin: Number(setValues.isBusinessUnitAdmin),
          isLocked: user.isLocked,
          lastName: setValues.lastName,
          loginImage: user.loginImage,
          middleName: setValues.middleName,
          note: user.note,
          npi: setValues.npi,
          npiInstitute: user.npiInstitute,
          prescriber: setValues.prescriber,
          recoveryEmail: setValues.recoveryEmail,
          recoveryPhone: setValues.recoveryPhone,
          retries: user.retries,
          salutation: setValues.salutation,
          secondaryVerified: user.secondaryVerified,
          serviceLevel: this.serviceLevelTotal(setValues.serviceLevel),
          siteAdministrator: Number(setValues.siteAdministrator),
          specialtyCode: setValues.specialtyCode,
          ssn: user.ssn,
          startDt: setValues.startDt,
          stateControlled: setValues.stateControlled,
          stateLicense: setValues.stateLicense,
          statusText: user.statusText,
          suffix: setValues.suffix,
          supervisor: setValues.supervisor,
          timeType: setValues.timeType,
          timeZone: setValues.timeZone,
          useSecondaryAuth: user.useSecondaryAuth,
          userExternalId: setValues.userExternalId,
          userStatus: setValues.userStatus,
          userType: setValues.userType,
          vendorsOrganizations: user.vendorsOrganizations,
          workPhone: user.workPhone,
        }).pipe(startWith(null))
      );
      return output.response;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  // Get the total Bit for the ServiceLevel
  serviceLevelTotal(serviceLevels: { value: number; checked: boolean }[]) {
    let serviceLevelTotal = 0;
    forEach(serviceLevels, (serviceLevel) => {
      if (serviceLevel.checked) {
        serviceLevelTotal += serviceLevel.value;
      }
    });
    return serviceLevelTotal;
  }

  // Collect all the PrescribeUsing and PrescribeFor mappings
  // into a single list that can be posted
  prescribeUsing(id?: number) {
    const arr: IPrescribeUsing[] = [];
    const userId = id ?? 0;
    forEach(this.prescribers, (prescriber: IPrescriber) => {
      const prescriberId = prescriber.id ? prescriber.id : 0;
      const exists = find(userModel.dataPlatform?.Prescribers, (p: IPrescriber) => {
        return p.PrescribeFor.prescriberID === prescriberId && p.PrescribeFor.userID === userId;
      });
      if (!exists) {
        arr.push({
          userID: userId,
          prescriberID: prescriberId,
          accessStatus: prescriber.accessStatus || prescriber.PrescribeFor.accessStatus,
        });
      }
    });
    forEach(this.prescribeFors, (prescriber: IPrescribeFor) => {
      const prescriberId = prescriber.id ? prescriber.id : 0;
      const exists = find(arr, (p: any) => {
        return p.prescriberID === userId && p.userID === prescriberId;
      });
      if (!exists) {
        arr.push({
          prescriberID: userId,
          userID: prescriberId,
          accessStatus: prescriber.accessStatus || prescriber.PrescribeFor.accessStatus,
        });
      }
    });
    return arr;
  }

  // Collect the PracticeUsers
  practiceUsers(id?: number) {
    const arr: IPracticeUser[] = [];
    if (id) {
      forEach(this.practices, (practice) => {
        arr.push({
          practiceID: practice.id,
          userID: id,
        });
      });
    }
    return arr;
  }

  // Collect the ApplicationUsers
  applicationsUsers(id?: number) {
    const arr: IApplicationUser[] = [];
    if (id) {
      forEach(this.applications, (application: IApplication) => {
        arr.push({
          applicationID: application.id,
          userID: id,
        });
      });
    }
    return arr;
  }

  // If the user is set as a business unit administrator then
  // the entity is created to set in the administration table
  isBusinessUnitAdmin(
    isBusinessUnitAdmin: boolean,
    businessUnitAdmin: {
      userId?: number;
      businessUnitId?: number | string;
      siteAdministrator?: number;
    }
  ) {
    if (businessUnitAdmin.businessUnitId && businessUnitAdmin.userId && businessUnitAdmin.siteAdministrator) {
      if (Boolean(Number(isBusinessUnitAdmin)) === true) {
        return businessUnitAdmin;
      }
    }
    return null;
  }

  // Check to see if a request has already been submitted
  *getEpcsRequest(userId?: number, epcsStatus?: number) {
    let epcs;
    if (userId && epcsStatus) {
      try {
        const output: AjaxResponse<IEpcs> = yield lastValueFrom(getEpcsRequest(userId, epcsStatus).pipe(startWith(null)));
        epcs = output.response;
      } catch (error: unknown) {
        console.log(error);
      }
    }
    return epcs;
  }

  *fetchTaxonomy() {
    this.taxonomys = [];
    try {
      const output: AjaxResponse<ITaxonomy[]> = yield lastValueFrom(fetchTaxonomy());
      this.taxonomys = output.response ?? [];
    } catch (error: unknown) {
      this.taxonomys = [];
    }
  }

  *getOrganization() {
    this.organization = null;
    try {
      const output: AjaxResponse<IOrganization> = yield lastValueFrom(getOrganization().pipe(startWith(null)));
      this.organization = { ...(output.response ?? null) };
    } catch (error: unknown) {
      this.organization = null;
    }
  }

  *getPracticeList(organizationId?: number) {
    this.nullify();
    if (organizationId) {
      try {
        const output: AjaxResponse<IPractice[]> = yield lastValueFrom(getPracticeList(organizationId).pipe(startWith(null)));
        this.practicesList = output.response ?? [];
        this.practicesFilter = output.response ?? [];
      } catch (error: unknown) {
        this.practicesList = [];
      }
    }
  }

  epcsStatus(practiceId: number) {
    const epcs = this.epcsRequest.find((value) => value.practiceId === practiceId)?.status;
    let textId = '';
    if (Number.isInteger(epcs)) {
      switch (epcs) {
        case 0:
          textId = 'practice.request.initialized';
          break;
        case 1:
          textId = 'practice.request.pending';
          break;
        case 2:
          textId = 'practice.request.approved';
          break;
        case 3:
          textId = 'practice.request.declined';
          break;
        default:
          break;
      }
      return { epcsStatus: epcs, epcsStatement: textId };
    }
    return {};
  }

  *getUserDoctors(type: string, userId?: number, organizationId?: number) {
    this.nullify();
    if (organizationId && userId) {
      try {
        const output: AjaxResponse<IPrescriber[]> = yield lastValueFrom(requestAccess(organizationId).pipe(startWith(null)));
        this.prescribersList = output.response.map((value) => {
          return { ...value, accessStatus: this.accessStatus(type, userId, value) };
        });
        this.prescribersFilter = [...this.prescribersList];
      } catch (error: unknown) {
        this.prescribersList = [];
        this.prescribersFilter = [];
      }
    }
  }

  // переделать
  accessStatus(type: string, userId: number, user: IPrescriber | IPrescribeFor) {
    let exists;
    if (userId === user.id) {
      return 1;
    }
    switch (type) {
      case 'prescribers':
        exists = this.prescribers.find((value) => value.id === user.id);
        break;
      case 'prescribeFors':
        exists = this.prescribeFors.find((value) => value.id === user.id);
        break;
      default:
        break;
    }
    return exists ? 0 : 1;
  }

  *getUsers(type: string, userId?: number, organizationId?: number) {
    this.nullify();
    if (organizationId && userId) {
      try {
        const output: AjaxResponse<IPrescribeFor[]> = yield lastValueFrom(getUsers(organizationId).pipe(startWith(null)));
        this.prescribeForsList = output.response.map((value) => {
          return { ...value, accessStatus: this.accessStatus(type, userId, value) };
        });
        this.prescribeForsFilter = [...this.prescribeForsList];
      } catch (error: unknown) {
        this.prescribeForsList = [];
        this.prescribeForsFilter = [];
      }
    }
  }
}

const editProfile = new EditProfile();
export default editProfile;
