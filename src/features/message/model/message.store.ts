import { action, autorun, computed, makeAutoObservable, observable, toJS } from 'mobx';
import { concat, find, forEach, has, isArray, map, remove, sortBy, uniqBy } from 'lodash';
import { AjaxError, AjaxResponse } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';
import moment from 'moment';
import localStorage from 'mobx-localstorage';
import { computedFn } from 'mobx-utils';

import { ActionStatus, OActionStatus } from 'shared/lib/model';
import {
  fetchMessage,
  fetchCount,
  ICount,
  IFilter,
  IMessage,
  OSortedBy,
  OSortedByType,
  OTabList,
  OTabListType,
  TotalsEnum,
  ISettings,
  fetchUpdateMessageStatus,
  getMessageResponse,
  cancelPrescription,
  IMessageApprove,
  setReviewed,
  fetchRespondChangeRequest,
  getMessageById,
  ICancelPrescriptionPayload,
} from 'shared/api/message';
import { IPractice } from 'shared/api/practice';
import { deleteUserToken, IPrescribe, IUser } from 'shared/api/user';
import { userModel } from 'features/user';
import { SettingTypeEnum } from 'shared/api/settings';
import { getTasks, updateTask } from 'shared/api/task/task.resources';
import { getEncounterCurrent } from 'shared/api/encounter';
import { deletePrescription, getPrescriptionByMessageId, updateStatus } from 'shared/api/drug/drug.history.resources';
import { IPrescription, IPrescriptionStatus, updatePrescriptionInhouseStatus } from 'shared/api/prescription';
import { settingsModel } from 'features/settings';
import currentPracticeStore from '../../practice/model/current.practice.store';
import { prescriptionDetailModel, prescriptionQueue } from 'features/prescription';
import { denialReasonTranslates } from '../../prescription/config';
import { patientModel } from 'features/patient';
import settingsUserModel from 'features/settings/model/settings.user.model';

class MessageStore {
  public selectedTab = OTabList.Pending;

  public tabList: OTabListType[] = [
    OTabList.Pending,
    OTabList.RefillRequest,
    OTabList.ChangeRequest,
    OTabList.NewPrescription,
    OTabList.Error,
    OTabList.History,
    OTabList.Approved,
    OTabList.Declined,
    OTabList.Cancel,
    OTabList.ErrorReviewed,
  ];

  public total = '0';

  public prescribers: IPrescribe[] = userModel.data?.currentPrescriber ? [userModel.data.currentPrescriber] : [];

  public practices: IPractice[] = userModel.data?.currentPractice ? [userModel.data.currentPractice] : [];

  private initialFilter: IFilter = {
    messageStatus: ['WaitingApproval', 'Pending', 'Error'],
    messageStatusForCount: ['WaitingApproval', 'Pending', 'Error'],
    fromDate: moment().subtract(14, 'days').startOf('days').toDate(),
    toDate: moment().endOf('day').toDate(),
    messageType: '%',
    firstName: '',
    lastName: '',
    taskStatus: ['A'],
    taskType: ['CMM'],
    sortedBy: OSortedBy.MessageDate,
    totals: TotalsEnum.PENDING,
  };

  private initialMessagesCount = {
    refillRx: 0,
    changeRx: 0,
    newRx: 0,
    error: 0,
    inhouseNewRx: 0,
    approved: 0,
    declined: 0,
    cancelRxResponse: 0,
    errorReviewed: 0,
    cancelRx: 0,
    priorAuthorization: 0,
  };

  public messagesCount = { ...this.initialMessagesCount };

  public messages: IMessage[] = [];

  public messageFilter: IFilter = { ...this.initialFilter };

  public searchItemsFilterModal: IPractice[] | IPrescribe[] = [];

  public valueSearchItems = '';

  public messageHistoryFilter: IFilter = {
    ...this.initialFilter,
    messageStatus: ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'],
    messageStatusForCount: ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'],
    totals: TotalsEnum.HISTORY,
  };

  public messageSearchFilter: IFilter = {
    ...this.initialFilter,
    totals: TotalsEnum.FILTER,
  };

  public settings: ISettings = {
    offset: 0,
    limit: 25,
    isPagingHidden: true,
    offsetTask: 0,
    isPagingHiddenTask: true,
  };

  public status: Record<'fetch', ActionStatus> = {
    fetch: OActionStatus.Initial,
  };

  public errors: Record<'fetch', Nullable<string>> = {
    fetch: null,
  };

  public showNotify: null | string = null;

  public showModal: null | {
    type: string;
    handle?: (data?: IMessage | IPrescription) => void;
    value?: string | number;
  } = null;

  constructor() {
    makeAutoObservable(this, {
      valueSearchItems: observable,
      searchItemsFilterModal: observable,
      messageFilter: observable,
      messageHistoryFilter: observable,
      settings: observable,
      messages: observable,
      showNotify: observable,
      messagesCount: observable,
      inHouse: computed,
      prescribers: observable,
      practices: observable,
      tabList: observable,
      total: observable,
      pending: computed,
      PracticeFilter: computed,
      UserFilter: computed,
      isBusinessUnitAdmin: computed,
      handleCancelPrescription: action,
      handleDeclineInHouse: action,
      handleReprescribe: action,
    });

    this.initLocalStorage();
    this.setTabList();
  }

  get inHouse() {
    return Boolean(Number(settingsModel?.get('INHOUSE_PHARMACIST', SettingTypeEnum.USER)));
  }

  initLocalStorage() {
    const practices = this.PracticeFilter;
    const prescribers = this.UserFilter;
    if (practices || prescribers) {
      const disposer = autorun(() => {
        if (userModel.data) {
          const query = {
            ...this.messageHistoryFilter,
          };

          if (practices) {
            this.practices = practices;
            query.practiceId = practices.map((practice) => practice.id);
          } else {
            this.selectAllPractices();
          }
          if (prescribers) {
            this.prescribers = prescribers;
            query.doctorId = prescribers.map((prescriber) => prescriber.id);
          } else {
            this.selectAllPrescribers();
          }
          this.viewAllPending(false);
          this.getMessagesCount(query, false);
          disposer();
        }
      });
    } else {
      const disposer = autorun(() => {
        if (userModel.data) {
          this.selectAllPractices();
          this.selectAllPrescribers();
          this.viewAllPending();
          this.getMessagesCount(this.messageHistoryFilter, false);
          disposer();
        }
      });
    }
  }

  setPracticeFilter() {
    localStorage.setItem('PracticeFilter', toJS(this.practices));
  }

  setUserFilter() {
    localStorage.setItem('UserFilter', toJS(this.prescribers));
  }

  get pending() {
    return (
      this.messagesCount.newRx +
      this.messagesCount.cancelRx +
      this.messagesCount.changeRx +
      this.messagesCount.refillRx +
      this.messagesCount.error +
      this.messagesCount.priorAuthorization +
      this.messagesCount.inhouseNewRx
    );
  }

  get PracticeFilter() {
    return toJS(localStorage.getItem('PracticeFilter'));
  }

  get UserFilter() {
    return toJS(localStorage.getItem('UserFilter'));
  }

  get isBusinessUnitAdmin() {
    if (!userModel.data || !userModel.data?.businessunits) {
      return false;
    }

    const practiceSecurity: any[] = [];
    forEach(userModel.data?.practices, (practice: IPractice) => {
      const isAdministrator = find(userModel.data?.businessunits, (businessunit) => {
        return businessunit.id === practice.businessUnitId;
      });

      if (isAdministrator) {
        if (isAdministrator.businessunitadmins) {
          practiceSecurity.push(practice);
        }
      }
    });
    return practiceSecurity.length === userModel.data?.practices?.length;
  }

  getMessagePendingCount(doctorId: number, practiceId: number) {
    const filterCount = {
      doctorId: [doctorId],
      practiceId,
      fromDate: moment().subtract(30, 'days').startOf('days').toDate(),
      toDate: moment().endOf('days').toDate(),
      messageStatus: ['WaitingApproval', 'Pending', 'Error'],
      messageStatusForCount: ['WaitingApproval', 'Pending', 'Error'],
      messageType: '%',
      firstName: '',
      lastName: '',
      taskStatus: ['A'],
      taskType: ['CMM'],
      sortedBy: OSortedBy.MessageDate,
    };

    if (this.inHouse) {
      filterCount.messageStatus = ['InhouseNewRx', 'SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
      filterCount.messageStatusForCount = ['InhouseNewRx', 'SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
    }

    this.getMessagesCount(filterCount);
  }

  *getMessagesCount(filter?: IFilter, isTriggerTotalRequest?: boolean) {
    this.status.fetch = OActionStatus.Pending;
    this.errors.fetch = null;

    try {
      const query = {
        ...this.settings,
        doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
        practiceId: map(this.practices, (practice) => practice.id) || [],
        ...(filter || this.messageFilter),
      };

      const output: AjaxResponse<ICount[]> = yield lastValueFrom(fetchCount(query).pipe(startWith(null)));
      this.status.fetch = OActionStatus.Fulfilled;

      const totals = {
        refillRx: 0,
        changeRx: 0,
        newRx: 0,
        error: 0,
        inhouseNewRx: 0,
        approved: 0,
        declined: 0,
        cancelRxResponse: 0,
        errorReviewed: 0,
        cancelRx: 0,
        priorAuthorization: 0,
      };
      if (output.response.length > 0) {
        output.response.forEach((status) => {
          switch (status.messageStatus) {
            case 'WaitingApproval':
              switch (status.messageType) {
                case 'RxRenewalRequest':
                  totals.refillRx += Number(status.total);
                  break;
                case 'RxChangeRequest':
                  totals.changeRx += status.total;
                  break;
                case 'CancelRx':
                case 'CancelRxRequest':
                  totals.cancelRx += status.total;
                  break;
                case 'NewRx':
                  totals.newRx += status.total;
                  break;
                default:
                  break;
              }
              break;
            case 'InhouseNewRx':
              totals.inhouseNewRx += status.total;
              break;
            case 'Pending':
            case 'ActivePa':
              switch (status.messageType) {
                case 'RxRenewalRequest':
                  totals.refillRx += status.total;
                  break;
                case 'RxChangeRequest':
                  totals.changeRx += status.total;
                  break;
                case 'CancelRx':
                case 'CancelRxRequest':
                  totals.cancelRx += status.total;
                  break;
                case 'NewRx':
                  totals.approved += status.total;
                  break;
                case 'CMM':
                  totals.priorAuthorization += status.total;
                  break;
                default:
                  break;
              }
              break;
            case 'Error':
              totals.error += status.total;
              break;
            case 'Error Reviewed':
              totals.errorReviewed += status.total;
              break;
            case 'Success':
            case 'PendingNewRx':
              switch (status.messageType) {
                case 'CancelRxResponse':
                  totals.cancelRxResponse += status.total;
                  break;
                default:
                  totals.approved += status.total;
                  break;
              }
              break;
            case 'SuccessInhouseNewRx':
              totals.approved += status.total;
              break;
            case 'Declined':
              totals.declined += status.total;
              break;
            case 'Declined Success':
            case 'QueuedDeclined':
              totals.declined += status.total;
              break;
            case 'DeclinedInhouseNewRx':
              totals.declined += status.total;
              break;
            default:
              break;
          }
        });
        if (query.totals === TotalsEnum.BOTH || query.totals === TotalsEnum.PENDING) {
          this.messagesCount.newRx = totals.newRx;
          this.messagesCount.inhouseNewRx = totals.inhouseNewRx;
          this.messagesCount.cancelRx = totals.cancelRx;
          this.messagesCount.changeRx = totals.changeRx;
          this.messagesCount.refillRx = totals.refillRx;
          this.messagesCount.priorAuthorization = totals.priorAuthorization;
          this.messagesCount.error = totals.error;
        }
        if (query.totals === TotalsEnum.BOTH || query.totals === TotalsEnum.HISTORY) {
          this.messagesCount.approved = totals.approved;
          this.messagesCount.declined = totals.declined;
          this.messagesCount.cancelRxResponse = totals.cancelRxResponse;
          this.messagesCount.errorReviewed = totals.errorReviewed;
        }
      } else {
        if (query.totals === TotalsEnum.BOTH || query.totals === TotalsEnum.PENDING) {
          this.messagesCount.newRx = 0;
          this.messagesCount.inhouseNewRx = 0;
          this.messagesCount.cancelRx = 0;
          this.messagesCount.changeRx = 0;
          this.messagesCount.refillRx = 0;
          this.messagesCount.error = 0;
          this.messagesCount.priorAuthorization = 0;
        }
        if (query.totals === TotalsEnum.BOTH || query.totals === TotalsEnum.HISTORY) {
          this.messagesCount.approved = 0;
          this.messagesCount.declined = 0;
          this.messagesCount.cancelRxResponse = 0;
          this.messagesCount.errorReviewed = 0;
        }
      }

      if (isTriggerTotalRequest) this.getTotal();
    } catch (error: unknown) {
      this.status.fetch = OActionStatus.Rejected;
      this.errors.fetch = (error as AjaxError)?.response?.message ?? null;
    }
  }

  async respondRxRenewalRequest(
    relatesToMessageId: string,
    messageType: string,
    responseCode: string,
    refill: number | undefined,
    note: string | undefined,
    patientId: number | undefined,
    dob: Date | undefined,
    encounterId: number | undefined,
    prescriptionStatusTypeId: number,
    drugCode: any,
    messageRequestedSelected: any,
    pharmacyVersion: string,
    followUpPrescriber = 0,
    isControlled = false
  ) {
    const fakeFn = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        resolve(true);
        reject(new Error('error'));
      });
    };
    const res = await fakeFn();
    return res; // TODO добавить когда будет реализован VitalService.addPrescriptionVital | message.service 603
  }

  async respondChangeRequest(
    relatesToMessageId: string,
    messageType: string,
    responseCode: string,
    note: string,
    patientId: number | undefined,
    encounterId: number | undefined,
    ncpdpId: string | undefined,
    medicationRequested: any,
    prescriptionStatusTypeId: number,
    drugCode: any,
    duration: number | undefined,
    priorAuthorization: string | undefined,
    cancelPrescriptionBool: boolean,
    requestId: number,
    messageRequestData: string | undefined,
    messageRequestSubCode: string
  ) {
    const changeResponse: any = {
      body: 'RxChangeResponse',
      duration,
      drugCode: { MED_REF_DEA_CD: drugCode },
      prescriptionStatusTypeId,
      name: 'New Prescription',
      messageType,
      response: {
        responseCode,
        responseQualifier: responseCode,
      },
      pharmacy: {
        ncpdpId,
      },
      patient: {
        patientId,
        encounterId,
        human: 'HumanPatient',
      },
      header: {
        sentTime: moment(),
        relatesToMessageId,
      },
    };

    if (priorAuthorization) {
      changeResponse.priorAuthorization = priorAuthorization;
    }

    if (messageRequestData) {
      changeResponse.messageRequestData = messageRequestData;
      changeResponse.messageRequestSubCode = messageRequestSubCode;
    }
    if (medicationRequested) {
      changeResponse.medicationRequested = medicationRequested;
    }

    if (responseCode !== 'A' && responseCode !== 'C') {
      changeResponse.response.responseCode = responseCode === 'ZZ' ? 'N' : 'D';
      changeResponse.response.responseQualifier = responseCode;
      if (note) {
        changeResponse.response.denialReason = note;
      }
    } else if (note) {
      changeResponse.response.note = note;
    }

    await lastValueFrom(fetchRespondChangeRequest(changeResponse))
      .then(async ({ response: messages }) => {
        if (cancelPrescriptionBool) {
          await lastValueFrom(getMessageById(relatesToMessageId)).then(async ({ response: message }) => {
            if (message && patientId) {
              const cancelrx: ICancelPrescriptionPayload = {
                body: 'CancelRx',
                header: {
                  sentTime: moment(),
                  relatesToMessageId: message.Message.Header.RelatesToMessageID || '',
                },
                patient: {
                  patientId,
                },
                response: {
                  responseCode: 'X',
                },
              };
              return lastValueFrom(cancelPrescription(cancelrx)).then(async () => {
                await lastValueFrom(getEncounterCurrent(patientId, false)).then(async ({ response }) => {
                  const currentPrescriber = userModel.data?.currentPrescriber;
                  const status: IPrescriptionStatus = {
                    messageId: message.Message.Header.RelatesToMessageID,
                    prescriptionStatusTypeId: 3,
                    name: 'Cancel Prescription',
                    encounterId: response?.savedEncounterObj?.encounterId,
                    userId: userModel.data?.user.id,
                    userName: `${currentPrescriber?.firstName} ${currentPrescriber?.lastName}`,
                  };

                  await lastValueFrom(updateStatus(status));
                });
              });
            }
            return messages;
          });
        }
      })
      .catch((error) => {
        return new Error(error);
      });
  }

  *getMessagesByFilter(filter?: IFilter, isTriggerTotalRequest?: boolean, showAll?: boolean, excludingTasks?: boolean) {
    if (!this.settings.offset) this.messages = [];
    this.status.fetch = OActionStatus.Pending;
    this.errors.fetch = null;
    if (showAll) {
      this.settings.offset = 0;
      this.messages = [];
    }
    try {
      const query = {
        ...this.settings,
        doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
        practiceId: map(this.practices, (practice) => practice.id) || [],
        ...(filter || this.messageFilter),
      };

      if (!query.doctorId.length || !query.practiceId || (isArray(query.practiceId) && !query.practiceId.length)) {
        this.status.fetch = OActionStatus.Rejected;
        return;
      }

      const output: AjaxResponse<IMessage[]> = yield lastValueFrom(fetchMessage(query).pipe(startWith(null)));
      this.status.fetch = OActionStatus.Fulfilled;
      if (!output.response || output.response.length === 0) {
        this.settings.isPagingHidden = true;
      } else {
        this.settings.isPagingHidden = output.response.length < 25 || showAll === true;
      }

      if (excludingTasks === false) {
        this.getTasksFilter(query, !!showAll);
      } else {
        this.settings.isPagingHiddenTask = true;
      }

      if (isTriggerTotalRequest) {
        this.getMessagesCount(filter);
      }
      if (!this.settings.offset) {
        this.messages = [...output.response] || [];
      } else {
        this.messages = this.messages.concat([...output.response] || []);
      }
      this.getTotal();
    } catch (error: unknown) {
      this.status.fetch = OActionStatus.Rejected;
      this.errors.fetch = (error as AjaxError)?.response?.message ?? null;
    }
  }

  getPracticeName = computedFn((messageRequest) => {
    if (userModel.data && userModel.data.practices) {
      const practice = find(userModel.data.practices, (p) => p.id === messageRequest.practiceId);
      if (practice) {
        return practice.prescribingName;
      }
    }
    return '';
  });

  *getTasksFilter(filter: IFilter, showAll: boolean) {
    const query = {
      ...this.settings,
      doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
      practiceId: map(this.practices, (practice) => practice.id) || [],
      ...filter,
      offsetTask: 0,
    };

    let taskMessages: any[] = [];
    yield lastValueFrom(getTasks(query)).then(({ response: results }: any) => {
      if (!results || results.length === 0) {
        this.settings.isPagingHiddenTask = true;
      } else {
        forEach(results, (result: any) => {
          taskMessages = taskMessages.concat(result);
        });

        if (!Number.isNaN(this.settings.offsetTask)) {
          this.settings.offsetTask += results.length;
        }

        this.settings.isPagingHiddenTask = results.length < 25 || showAll;

        this.messages = concat(this.messages, taskMessages);
      }

      this.getTotal();
    });
  }

  getTotal() {
    let total = 0;
    switch (this.selectedTab) {
      case OTabList.Pending:
        total =
          this.messagesCount.newRx +
          this.messagesCount.inhouseNewRx +
          this.messagesCount.changeRx +
          this.messagesCount.refillRx +
          this.messagesCount.error +
          this.messagesCount.priorAuthorization;
        break;
      case OTabList.ChangeRequest:
        total = this.messagesCount.changeRx;
        break;
      case OTabList.RefillRequest:
        total = this.messagesCount.refillRx;
        break;
      case OTabList.NewPrescription:
        total = this.messagesCount.newRx;
        break;
      case OTabList.Error:
        total = this.messagesCount.error;
        break;
      case OTabList.InHousePharmacy:
        total = this.messagesCount.inhouseNewRx;
        break;
      case OTabList.Cancel:
        total = this.messagesCount.cancelRx;
        break;
      case OTabList.Approved:
        total = this.messagesCount.approved;
        break;
      case OTabList.Declined:
        total = this.messagesCount.declined;
        break;
      case OTabList.ErrorReviewed:
        total = this.messagesCount.errorReviewed;
        break;
      case OTabList.History:
        total = this.messagesCount.approved + this.messagesCount.declined + this.messagesCount.cancelRxResponse + this.messagesCount.errorReviewed;
        break;
      default:
        return 0;
    }

    if (total > 25 && total !== this.messages.length) {
      this.total = `${this.messages.length} of ${total}`;
    } else {
      this.total = String(this.messages.length);
    }

    if (total > 25 && total === this.messages.length) {
      this.settings.isPagingHidden = true;
    }

    return total;
  }

  setSortedBy(sortType: OSortedByType) {
    this.messageFilter.sortedBy = sortType;
    this.messageHistoryFilter.sortedBy = sortType;
    this.messages = [...sortBy(this.messages, sortType)];
  }

  userFilterSelected(value: string) {
    if (!this.getPrescribers().length) return;
    forEach(this.getPrescribers(), (prescriber) => {
      if (value === `${prescriber?.lastName}, ${prescriber?.firstName}`) {
        const exist = this.prescribers.filter((existPrescriber) => `${existPrescriber?.lastName}, ${existPrescriber?.firstName}` === value).length;
        if (!exist) {
          this.prescribers.push(prescriber);
        }
      }
    });
  }

  clearSearchItemsFilterModal() {
    this.searchItemsFilterModal = [];
  }

  practiceFilterSelected(value: string) {
    if (!userModel.data?.practices?.length) return;
    forEach(userModel.data?.practices, (practice) => {
      if (value === practice.prescribingName) {
        const exist = this.practices?.filter((existPractice) => existPractice.prescribingName === value).length;
        if (!exist) {
          this.practices.push(practice);
        }
      }
    });
  }

  setValueSearchItems(value: string) {
    this.valueSearchItems = value;
  }

  findPractices(value: string) {
    this.searchItemsFilterModal = (userModel.data?.practices ?? []).filter((practice) => {
      return practice.prescribingName.toLowerCase().includes(value.toLowerCase()) || practice.name.toLowerCase().includes(value.toLowerCase());
    });
  }

  findUsers(value: string) {
    this.searchItemsFilterModal = this.getPrescribers().filter((doctor) => {
      return doctor.fullName.toLowerCase().includes(value.toLowerCase());
    });
  }

  selectAllPractices() {
    this.practices = userModel.data?.practices ?? [];
  }

  clearAllPractices() {
    this.practices = userModel.data?.currentPractice ? [userModel.data?.currentPractice] : [];
  }

  deleteOnePractice(removeId: number) {
    this.practices = this.practices.filter((practice) => practice.id !== removeId);
  }

  getPrescribers = computedFn(() => {
    let doctors: IPrescribe[] | [] = [];
    forEach(userModel.data?.practices, (practice) => {
      doctors = concat(doctors, practice.prescribers);
    });
    doctors = uniqBy(doctors, 'id');

    return doctors;
  });

  selectAllPrescribers() {
    this.prescribers = this.getPrescribers();
  }

  clearAllPrescribers() {
    this.prescribers = userModel.data?.currentPrescriber ? [userModel.data?.currentPrescriber] : [];
  }

  deleteOnePrescriber(removeId: number) {
    this.prescribers = this.prescribers.filter((practice) => practice.id !== removeId);
  }

  *getTasks(filter: IFilter, showAll = false) {
    const query = {
      ...this.settings,
      doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
      practiceId: map(this.practices, (practice) => practice.id) || [],
      ...filter,
    };
    yield lastValueFrom(getTasks(query)).then(({ response: results }: any) => {
      if (!results || results.length === 0) {
        this.settings.isPagingHiddenTask = true;
      }

      forEach(results, (result: any) => {
        this.messages = this.messages.concat(result);
      });

      if (!Number.isNaN(this.settings.offsetTask)) {
        this.settings.offsetTask += results.length;
      }

      this.settings.isPagingHiddenTask = results.length < 25 || showAll;
      this.getTotal();
    });
  }

  getMessagesByCategory(filter, messageType, messageStatus) {
    const fixedFilter = { ...filter };
    fixedFilter.messageType = messageType;
    this.resetSearch();
    switch (messageType) {
      case 'CMM':
        fixedFilter.taskType = [messageType];
        fixedFilter.taskStatus = [messageStatus];
        this.getTasks(fixedFilter, false);
        break;
      default:
        switch (messageStatus) {
          case 'Declined':
            fixedFilter.messageStatus = ['Declined', 'Declined Success', 'QueuedDeclined'];
            break;
          case 'Success':
            fixedFilter.messageStatus = ['Success', 'PendingNewRx'];
            break;
          default:
            fixedFilter.messageStatus = [messageStatus];
            break;
        }
        if (filter.totals === TotalsEnum.PENDING) {
          this.messageFilter = fixedFilter;
        } else if (filter.totals === TotalsEnum.HISTORY) {
          this.messageHistoryFilter = fixedFilter;
        }
        this.getMessagesByFilter(fixedFilter, false, false, true);
    }
  }

  setTab(tab: OTabListType, filter: IFilter, messageType: string, messageStatus: string) {
    this.selectedTab = tab;
    this.getMessagesByCategory(filter, messageType, messageStatus);
  }

  resetSearch() {
    this.settings.isPagingHidden = true;
    this.settings.isPagingHiddenTask = true;
    this.settings.offset = 0;
    this.settings.offsetTask = 0;
    this.settings.limit = 25;
    this.messages = [];
  }

  clearSearch() {
    this.messageHistoryFilter = {
      ...this.initialFilter,
      fromDate: moment().startOf('day').toDate(),
      toDate: moment().endOf('day').toDate(),
      messageStatus: ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'],
      messageStatusForCount: ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'],
      totals: TotalsEnum.HISTORY,
    };
    this.messageSearchFilter = {
      ...this.initialFilter,
      fromDate: moment().subtract(90, 'days').startOf('days').toDate(),
      toDate: moment().endOf('day').toDate(),
      messageStatus: ['WaitingApproval', 'Pending', 'Error', 'Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'],
      messageStatusForCount: [
        'WaitingApproval',
        'Pending',
        'Error',
        'Error Reviewed',
        'Success',
        'PendingNewRx',
        'Declined',
        'Declined Success',
        'QueuedDeclined',
      ],
      totals: TotalsEnum.FILTER,
    };

    this.messageFilter = {
      ...this.initialFilter,
    };
    this.prescribers = userModel.data?.currentPrescriber ? [userModel.data.currentPrescriber] : [];
    this.practices = userModel.data?.currentPractice ? [userModel.data.currentPractice] : [];

    if (this.inHouse) {
      this.messageFilter.messageStatus = ['InhouseNewRx'];
      this.messageFilter.messageStatusForCount = ['InhouseNewRx'];
      this.messageHistoryFilter.messageStatus = ['SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
      this.messageHistoryFilter.messageStatusForCount = ['SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
      this.messageSearchFilter.messageStatus = ['InhouseNewRx', 'SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
      this.messageSearchFilter.messageStatusForCount = ['InhouseNewRx', 'SuccessInhouseNewRx', 'DeclinedInhouseNewRx'];
    }
    this.selectedTab = OTabList.Pending;
  }

  searchForPatient(value) {
    const [lastName, firstName] = value.split(' ');
    switch (this.selectedTab) {
      case OTabList.Pending:
      case OTabList.ChangeRequest:
      case OTabList.RefillRequest:
      case OTabList.NewPrescription:
      case OTabList.Error:
      case OTabList.InHousePharmacy:
        this.messageFilter.lastName = lastName ?? '';
        this.messageFilter.firstName = firstName ?? '';
        this.getMessagesByFilter(this.messageFilter);
        break;
      default:
        this.messageHistoryFilter.lastName = lastName ?? '';
        this.messageHistoryFilter.firstName = firstName ?? '';
        this.getMessagesByFilter(this.messageHistoryFilter);
    }
  }

  loadMore() {
    this.settings.offset += 25;
    switch (this.selectedTab) {
      case OTabList.Pending:
      case OTabList.ChangeRequest:
      case OTabList.RefillRequest:
      case OTabList.NewPrescription:
      case OTabList.Error:
      case OTabList.InHousePharmacy:
        this.getMessagesByFilter(this.messageFilter, false, false, false);
        break;
      default:
        this.getMessagesByFilter(this.messageHistoryFilter, false, false, true);
    }
  }

  showAll() {
    this.settings.limit = this.getTotal();
    this.settings.offset = this.messages.length;
    switch (this.selectedTab) {
      case OTabList.Pending:
      case OTabList.ChangeRequest:
      case OTabList.RefillRequest:
      case OTabList.NewPrescription:
      case OTabList.Error:
      case OTabList.InHousePharmacy:
        this.getMessagesByFilter(this.messageFilter, false, true, false);
        break;
      default:
        this.getMessagesByFilter(this.messageHistoryFilter, false, true, true);
    }
  }

  *reviewedAllErrors() {
    const filter = {
      ...this.settings,
      ...this.messageFilter,
      doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
      practiceId: map(this.practices, (practice) => practice.id) || [],
      messageType: '%',
      messageStatus: ['Error'],
      fromDate: moment(new Date(this.messageFilter.fromDate)).startOf('day').toDate(),
      toDate: moment(new Date(this.messageFilter.toDate)).endOf('day').toDate(),
      offset: 0,
      limit: 500,
      isPagingHidden: false,
      offsetTask: 50000,
      isPagingHiddenTask: true,
    };

    yield lastValueFrom(fetchMessage(filter)).then(({ response: result }) => {
      forEach(result, (messageError: any) => {
        this.updateMessageStatus(messageError.requestId, 'Error Reviewed');
      });
      this.resetSearch();
      this.getMessagesByFilter(this.messageFilter, false);
      this.getMessagesCount(this.messageFilter, true);
      this.showNotify = 'CLEAR_ALL_ERRORS_STATEMENT';
    });
  }

  *clearAllRefills() {
    const filter = {
      ...this.settings,
      ...this.messageFilter,
      doctorId: map(this.prescribers, (prescriber: IPrescribe) => prescriber.id) || [],
      practiceId: map(this.practices, (practice) => practice.id) || [],
      messageType: 'RxRenewalRequest',
      messageStatus: ['Pending'],
      fromDate: moment(new Date(this.messageFilter.fromDate)).startOf('day').toDate(),
      toDate: moment(new Date(this.messageFilter.toDate)).endOf('day').toDate(),
      offset: 0,
      limit: 500,
      isPagingHidden: false,
      offsetTask: 50000,
      isPagingHiddenTask: true,
    };

    yield lastValueFrom(fetchMessage(filter)).then(({ response: result }) => {
      forEach(result, (messageError: any) => {
        this.updateMessageStatus(messageError.requestId, 'Declined');
      });
      this.resetSearch();
      this.getMessagesByFilter(this.messageFilter, false);
      this.getMessagesCount(this.messageFilter, true);
      this.showNotify = 'CLEAR_ALL_REFILLS_STATEMENT';
    });
  }

  setTimeFrame(tab: OTabListType, days: number) {
    this.selectedTab = tab;
    this.resetSearch();
    switch (this.selectedTab) {
      case OTabList.Pending:
      case OTabList.ChangeRequest:
      case OTabList.RefillRequest:
      case OTabList.NewPrescription:
      case OTabList.Error:
      case OTabList.InHousePharmacy:
        this.messageFilter.toDate = moment().endOf('day').toDate();
        this.messageFilter.fromDate = moment().subtract(days, 'days').toDate();
        this.getMessagesByFilter(this.messageFilter, true);
        break;
      default:
        this.messageHistoryFilter.toDate = moment().endOf('day').toDate();
        this.messageHistoryFilter.fromDate = moment().subtract(days, 'days').toDate();
        this.getMessagesByFilter(this.messageHistoryFilter, true);
    }
  }

  reloadHistory(name, value) {
    if (name === 'toDate') {
      this.messageHistoryFilter.toDate = value;
    } else {
      this.messageHistoryFilter.fromDate = value;
    }
    this.getMessagesCount(this.messageHistoryFilter);
  }

  reloadPending(name, value) {
    if (name === 'toDate') {
      this.messageFilter.toDate = new Date(value);
    } else {
      this.messageFilter.fromDate = new Date(value);
    }
    this.getMessagesCount(this.messageFilter);
  }

  viewAllHistory(clearSearchFilter?: boolean) {
    this.selectedTab = OTabList.History;
    if (clearSearchFilter) {
      this.clearSearch();
    } else {
      this.messageFilter.messageStatus = ['WaitingApproval', 'Pending', 'Error'];
      this.messageFilter.messageStatusForCount = ['WaitingApproval', 'Pending', 'Error'];
      this.messageFilter.messageType = '%';
      this.messageFilter.firstName = '';
      this.messageFilter.lastName = '';
      this.messageFilter.totals = TotalsEnum.PENDING;
      this.messageHistoryFilter.messageStatus = ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'];
      this.messageHistoryFilter.messageStatusForCount = ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'];
      this.messageHistoryFilter.messageType = '%';
      this.messageHistoryFilter.firstName = '';
      this.messageHistoryFilter.lastName = '';
      this.messageHistoryFilter.totals = TotalsEnum.HISTORY;
      this.messageSearchFilter.messageStatus = [
        'WaitingApproval',
        'Pending',
        'Error',
        'Error Reviewed',
        'Success',
        'PendingNewRx',
        'Declined',
        'Declined Success',
        'QueuedDeclined',
      ];
      this.messageSearchFilter.messageStatusForCount = [
        'WaitingApproval',
        'Pending',
        'Error',
        'Error Reviewed',
        'Success',
        'PendingNewRx',
        'Declined',
        'Declined Success',
        'QueuedDeclined',
      ];
      this.messageSearchFilter.messageType = '%';
      this.messageSearchFilter.firstName = '';
      this.messageSearchFilter.lastName = '';
      this.messageSearchFilter.totals = TotalsEnum.FILTER;
    }

    this.resetSearch();
    this.getMessagesByFilter(this.messageHistoryFilter, true);
  }

  viewAllPending(clearSearchFilter?: boolean) {
    this.selectedTab = OTabList.Pending;
    if (clearSearchFilter) {
      this.clearSearch();
    } else {
      this.messageFilter.messageStatus = ['WaitingApproval', 'Pending', 'Error'];
      this.messageFilter.messageStatusForCount = ['WaitingApproval', 'Pending', 'Error'];
      this.messageFilter.messageType = '%';
      this.messageFilter.firstName = '';
      this.messageFilter.lastName = '';
      this.messageFilter.totals = TotalsEnum.PENDING;
      this.messageHistoryFilter.messageStatus = ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'];
      this.messageHistoryFilter.messageStatusForCount = ['Error Reviewed', 'Success', 'PendingNewRx', 'Declined', 'Declined Success', 'QueuedDeclined'];
      this.messageHistoryFilter.messageType = '%';
      this.messageHistoryFilter.firstName = '';
      this.messageHistoryFilter.lastName = '';
      this.messageHistoryFilter.totals = TotalsEnum.HISTORY;
      this.messageSearchFilter.messageStatus = [
        'WaitingApproval',
        'Pending',
        'Error',
        'Error Reviewed',
        'Success',
        'PendingNewRx',
        'Declined',
        'Declined Success',
        'QueuedDeclined',
      ];
      this.messageSearchFilter.messageStatusForCount = [
        'WaitingApproval',
        'Pending',
        'Error',
        'Error Reviewed',
        'Success',
        'PendingNewRx',
        'Declined',
        'Declined Success',
        'QueuedDeclined',
      ];
      this.messageSearchFilter.messageType = '%';
      this.messageSearchFilter.firstName = '';
      this.messageSearchFilter.lastName = '';
      this.messageSearchFilter.totals = TotalsEnum.FILTER;
    }

    this.resetSearch();
    this.getMessagesByFilter(this.messageFilter, false, false, false);
    this.getMessagesCount(this.messageFilter, true);
    this.getMessagesCount(this.messageHistoryFilter, true);
  }

  changePatient(patientId: number, firstName: string, lastName: string) {
    this.messages = map(this.messages, (message) => {
      const newMessage = { ...message };
      if (message.patientId === patientId) {
        newMessage.patientId = patientId;
        newMessage.firstName = firstName;
        newMessage.lastName = lastName;
      }
      return newMessage;
    });
  }

  removeTaskFromList(taskId: number | undefined) {
    if (taskId) {
      this.messages = remove(this.messages, (message) => message.taskId === taskId);
    }
  }

  setTabList() {
    if (this.inHouse) {
      this.tabList = [OTabList.Pending, OTabList.InHousePharmacy, OTabList.History, OTabList.Approved, OTabList.Declined];
    } else {
      this.tabList = [
        OTabList.Pending,
        OTabList.RefillRequest,
        OTabList.ChangeRequest,
        OTabList.NewPrescription,
        OTabList.Error,
        OTabList.History,
        OTabList.Approved,
        OTabList.Declined,
        OTabList.Cancel,
        OTabList.ErrorReviewed,
      ];
    }
  }

  private changeFieldOfMessage(messageId: string, field: string, value: any, field2?: string) {
    this.messages = map(this.messages, (innerMessage) => {
      const newMessage = { ...innerMessage };
      if (innerMessage.messageId === messageId) {
        if (field2) {
          newMessage[field][field2] = value;
        } else {
          newMessage[field] = value;
        }
      }
      return newMessage;
    });
  }

  private checkPatientAttached(message: any) {
    if (!message.patientId || message.patientId === 0) {
      this.showModal = {
        type: 'PATIENT',
      };
      return false;
    }
    return true;
  }

  async setPracticeUser(practiceId: number, userId: number) {
    if (userModel.data?.currentPrescriber?.id === userId && userModel.data?.currentPractice?.id === practiceId) {
      return true;
    }
    const practice = find(userModel.data?.practices, (p: IPractice) => p.id === practiceId);
    let user;
    if (practice) {
      user = find(practice.prescribers, (u: IUser) => u.id === userId);
      if (!user) {
        this.showNotify = 'NO_ACCESS';
        return new Error();
      }
    } else {
      this.showNotify = 'NO_ACCESS';
      return new Error();
    }
    try {
      if (userModel.data) {
        userModel.data.currentPractice = practice;
        userModel.data.currentPrescriber = user;
        await userModel.setPracticeAndPrescriber({
          practice: userModel.data.currentPractice,
          prescriber: userModel.data.currentPrescriber,
        });
        await settingsUserModel.setUserSettings(userModel.data.currentPrescriber.id);
        await currentPracticeStore.switchPracticeUser(userModel.data.currentPrescriber, userModel.data.currentPractice);
        await userModel.refreshUser();
        this.showNotify = 'CURRENT_PRACTICE';
        // TODO this.$rootScope.$broadcast('selectedPractice', userModel.data.currentPractice)
        //  - Not implemented - medication history не реализовано
        return true;
      }

      return new Error();
    } catch (e) {
      return new Error();
    }
  }

  *approveInHouse(message: IMessage) {
    yield lastValueFrom(updatePrescriptionInhouseStatus(message.messageId, true)).then(() => {
      this.viewAllPending(false);
      // TODO this.$rootScope.$broadcast('refreshMedications'); - Not implemented - medication history не реализовано
      this.showNotify = 'INHOUSE_APPROVED';
    });
  }

  *handleDeclineInHouse(message) {
    yield lastValueFrom(updatePrescriptionInhouseStatus(message.messageId, true))
      .then(() => {
        this.viewAllPending(false);
        // TODO this.$rootScope.$broadcast('refreshMedications'); - Not implemented -
        //  medication history не реализовано
        this.showNotify = 'INHOUSE_APPROVED';
      })
      .finally(() => {
        this.showModal = null;
      });
  }

  declineInHouse(message: IMessage) {
    this.showModal = {
      type: 'CANCEL_PRESCRIPTION',
      handle: () => this.handleDeclineInHouse(message),
    };
  }

  *updateMessageStatus(requestId, messageStatus) {
    yield lastValueFrom(fetchUpdateMessageStatus(requestId, messageStatus)).then(() => {
      remove(this.messages, (message) => message.requestId === requestId);
      this.getMessagesCount(this.messageFilter, true);
      this.getMessagesCount(this.messageHistoryFilter, false);
      prescriptionQueue.get();
    });
  }

  async prescribeMedication(messageId: string) {
    // TODO - FAKE Function - prescribeMedication - Not implemented - не влияет на логику мессаджей
    const fakeFn = (): Promise<IPrescription> => {
      return new Promise((resolve, reject) => {
        resolve(userModel.data?.currentPrescriber);
        reject(userModel.data?.currentPrescriber);
      });
    };
    const res = await fakeFn();
    return res;
  }

  *handleReprescribe(prescription: IPrescription) {
    if (prescription.prescriptionId) {
      yield lastValueFrom(deletePrescription(prescription.prescriptionId, 'Medication removed and re-prescribed from the message page'))
        .then(() => {
          this.resetSearch();
          this.getMessagesByFilter(this.messageFilter, false);
          this.getMessagesCount(this.messageFilter, true);
        })
        .finally(() => {
          this.showModal = null;
        });
    }
  }

  represcribe(practiceId: number, userId: number, messageId: string) {
    this.setPracticeUser(practiceId, userId).then(() => {
      this.prescribeMedication(messageId).then((prescription: IPrescription) => {
        this.showModal = {
          type: 'REMOVE_ORIGINAL',
          handle: () => this.handleReprescribe(prescription),
        };
      });
    });
  }

  *handleCancelPrescription(message) {
    yield lastValueFrom(getMessageResponse(message.requestId)).then(async ({ response: responseMessage }: any) => {
      const cancelrx = {
        body: 'CancelRx',
        header: {
          sentTime: moment(),
          relatesToMessageId: responseMessage.messageId,
        },
        patient: {
          patientId: message.patientId,
        },
        response: {
          responseCode: 'X',
        },
      };
      await lastValueFrom(cancelPrescription(cancelrx))
        .then(async () => {
          await lastValueFrom(getEncounterCurrent(message.patientId, false)).then(async ({ response: encounter }: any) => {
            await lastValueFrom(getPrescriptionByMessageId(message.messageId))
              .then(async ({ response: prescription }: any) => {
                if (prescription && has(prescription, 'prescriptionId')) {
                  if (userModel.data?.user.id) {
                    let userName: string = userModel.data?.currentPrescriber?.firstName;
                    userName += ' ';
                    userName += userModel.data?.currentPrescriber?.lastName;
                    const status: IPrescriptionStatus = {
                      messageId: message.messageId,
                      prescriptionStatusTypeId: 3,
                      name: 'Cancel Prescription',
                      encounterId: encounter.encounterId,
                      userId: userModel.data?.user.id,
                      userName,
                    };
                    await lastValueFrom(updateStatus(status)).then(() => {
                      this.changeFieldOfMessage(message.messageId, 'messageResponse', 'X');
                    });
                  }
                } else {
                  this.changeFieldOfMessage(message.messageId, 'messageResponse', 'X');
                }
              })
              .catch(() => {
                this.changeFieldOfMessage(message.messageId, 'messageResponse', 'X');
              });
          });
        })
        .finally(() => {
          this.showModal = null;
        });
    });
  }

  cancelPrescription(message: IMessage) {
    this.setPracticeUser(message.practiceId, message.doctorId).then(() => {
      if (userModel.data?.currentPrescriber?.prescriber === false) {
        this.showModal = {
          type: 'CANCEL_PRESCRIPTION',
        };
        return;
      }
      this.showModal = {
        type: `CANCEL_CONFIRM`,
        handle: () => this.handleCancelPrescription(message),
        value: message.drugName,
      };
    });
  }

  *openTask(message: IMessage) {
    if (has(message.hasOwnProperty, 'TaskAttachment') && message?.TaskAttachment?.length > 0) {
      if (userModel.signupCmm && userModel?.data?.user?.id) {
        yield lastValueFrom(deleteUserToken(userModel.data.user.id)).then(() => {
          if (message.TaskAttachment && message.TaskAttachment.length > 0 && message.TaskAttachment[0].fileLocation) {
            window.open(message.TaskAttachment[0].fileLocation);
          }
        });
      } else {
        window.open(message.TaskAttachment[0].fileLocation);
      }
    }
  }

  *completePa(message: IMessage) {
    yield lastValueFrom(updateTask({ taskId: message?.taskId, taskStatus: 'C' })).then(() => {
      this.removeTaskFromList(message?.taskId);
      this.getMessagesCount(this.messageFilter, true);
    });
  }

  showDetail(message: IMessage) {
    const details: IMessageApprove[] = [];
    details.push({
      practiceId: message.practiceId,
      doctorId: message.doctorId,
      requestId: message.requestId,
      messageId: message.messageId,
      messageStatus: message.messageStatus,
      messageType: message.messageType.indexOf('CancelRx') >= 0 ? 'NewRx' : message.messageType,
      messageDate: message.messageDate,
      patientId: message.patientId,
    });
    const selectedMessages: any[] = [];
    forEach(details, (messageRequested) => {
      selectedMessages.push({
        practiceId: messageRequested.practiceId,
        doctorId: messageRequested.doctorId,
        requestId: messageRequested.requestId,
        messageId: messageRequested.messageId,
        messageStatus: messageRequested.messageStatus,
        messageType: messageRequested.messageType,
        messageDate: messageRequested.messageDate,
        patientId: messageRequested.patientId,
      });
    });
    prescriptionDetailModel.response = '';
    prescriptionDetailModel.responseTitle = '';
    prescriptionDetailModel.setMessages(selectedMessages);
    prescriptionDetailModel.showPrescriptionDetail = true;
  }

  approve(message: IMessage) {
    let approves: IMessageApprove[] = [];
    if (!this.checkPatientAttached({ patientId: message.patientId })) {
      return;
    }
    approves.push({
      practiceId: message.practiceId,
      doctorId: message.doctorId,
      patientId: message.patientId,
      dob: message.dob,
      requestId: message.requestId,
      messageId: message.messageId,
      messageStatus: message.messageStatus,
      messageType: message.messageType,
      messageDate: message.messageDate,
    });
    const selectedMessages: IMessageApprove[] = [];
    forEach(approves, (messageRequested) => {
      selectedMessages.push({
        practiceId: messageRequested.practiceId,
        doctorId: messageRequested.doctorId,
        patientId: messageRequested.patientId,
        dob: messageRequested.dob,
        requestId: messageRequested.requestId,
        messageId: messageRequested.messageId,
        messageStatus: messageRequested.messageStatus,
        messageType: messageRequested.messageType,
        messageDate: messageRequested.messageDate,
      });
    });
    prescriptionDetailModel.response = 'A';
    prescriptionDetailModel.responseTitle = 'Approve';
    prescriptionDetailModel.setMessages(selectedMessages);
    prescriptionDetailModel.showPrescriptionDetail = true;
    prescriptionDetailModel.onConfirm = (result) => {
      if (result) {
        approves = remove(approves, (approve) => {
          this.messages = remove(this.messages, (innerMessage) => innerMessage.requestId === approve.requestId);
        });
        this.getMessagesCount(this.messageFilter, true);
        this.getMessagesCount(this.messageHistoryFilter, false);
        prescriptionQueue.get();
      }
    };
  }

  *reviewedMessage(message: IMessage) {
    try {
      const reviewed = {
        reviewedUserId: userModel.data?.user.id,
        reviewedUserName: `${userModel.data?.user.firstName} ${userModel.data?.user.lastName}`,
        reviewedDate: new Date(),
      };
      yield lastValueFrom(setReviewed(message.requestId, reviewed)).then(() => {
        this.changeFieldOfMessage(message.messageId, 'reviewedUserId', reviewed.reviewedUserId);
        this.changeFieldOfMessage(message.messageId, 'reviewedUserName', reviewed.reviewedUserName);
        this.changeFieldOfMessage(message.messageId, 'reviewedDate', reviewed.reviewedDate);
        this.showNotify = 'REVIEWED_MESSAGE_STATEMENT';
      });
    } catch (e) {}
  }

  editPrescription(message: IMessage) {
    this.setPracticeUser(message.practiceId, message.doctorId).then(async () => {
      if (!patientModel?.currentPatient || patientModel?.currentPatient?.patientId !== message.patientId) {
        await patientModel.getPatient(Number(message.patientId), true, true);
        if (patientModel.currentPatient) {
          await lastValueFrom(getPrescriptionByMessageId(message.messageId)).then(({ response: prescription }) => {
            this.changeFieldOfMessage(message.messageId, 'Prescription', {});
            this.changeFieldOfMessage(message.messageId, 'Prescription', prescription.prescriptionId, 'prescriptionId');
            this.changeFieldOfMessage(
              message.messageId,
              'Prescription',
              [
                {
                  ROUTED_MED_ID: prescription?.PrescriptionDrugs?.[0].ROUTED_MED_ID,
                  GCN_SEQNO: prescription?.PrescriptionDrugs?.[0].GCN_SEQNO,
                },
              ],
              'PrescriptionDrugs'
            );
            if (prescription.combinationMed) {
              prescriptionQueue.editPrescriptionCompound(message);
            } else {
              prescriptionQueue.editPrescription(message);
            }
          });
        }
      } else {
        lastValueFrom(getPrescriptionByMessageId(message.messageId)).then(({ response: prescription }) => {
          this.changeFieldOfMessage(message.messageId, 'Prescription', {});
          this.changeFieldOfMessage(message.messageId, 'Prescription', prescription.prescriptionId, 'prescriptionId');
          this.changeFieldOfMessage(
            message.messageId,
            'Prescription',
            [
              {
                ROUTED_MED_ID: prescription?.PrescriptionDrugs?.[0].ROUTED_MED_ID,
                GCN_SEQNO: prescription?.PrescriptionDrugs?.[0].GCN_SEQNO,
              },
            ],
            'PrescriptionDrugs'
          );
          if (prescription.combinationMed) {
            prescriptionQueue.editPrescriptionCompound(message);
          } else {
            prescriptionQueue.editPrescription(message);
          }
        });
      }
    });
  }

  decline(message: IMessage, code: string) {
    let declines: IMessageApprove[] = [];
    declines.push({
      practiceId: message.practiceId,
      doctorId: message.doctorId,
      patientId: message.patientId,
      requestId: message.requestId,
      messageId: message.messageId,
      messageStatus: message.messageStatus,
      messageType: message.messageType,
      messageDate: message.messageDate,
    });
    const selectedMessages: IMessageApprove[] = [];
    forEach(declines, (messageRequested) => {
      selectedMessages.push({
        practiceId: messageRequested.practiceId,
        doctorId: messageRequested.doctorId,
        patientId: messageRequested.patientId,
        requestId: messageRequested.requestId,
        messageId: messageRequested.messageId,
        messageStatus: messageRequested.messageStatus,
        messageType: messageRequested.messageType,
        messageDate: messageRequested.messageDate,
      });
    });
    prescriptionDetailModel.response = code;
    prescriptionDetailModel.responseTitle = denialReasonTranslates[code];
    prescriptionDetailModel.setMessages(selectedMessages);
    prescriptionDetailModel.showPrescriptionDetail = true;
    prescriptionDetailModel.onConfirm = (result) => {
      if (result) {
        declines = remove(declines, (decline) => {
          this.messages = remove(this.messages, (innerMessage) => innerMessage.requestId === decline.requestId);
        });
        this.getMessagesCount(this.messageFilter, true);
        this.getMessagesCount(this.messageHistoryFilter, false);
        prescriptionQueue.get();
      }
    };
  }
}

const messageStore = new MessageStore();
export default messageStore;
