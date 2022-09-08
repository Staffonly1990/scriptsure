import { autorun, computed, makeAutoObservable, observable, toJS } from 'mobx'; // flowResult
import { filter, find, forEach, isArray, map, has, remove, split, indexOf, isUndefined, some } from 'lodash';
import { AjaxError, AjaxResponse } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';
import moment from 'moment';
import { computedFn } from 'mobx-utils';
import localStorage from 'mobx-localstorage';

import encounterModel from 'features/encounter/model/encounter.model';
import { messageStore } from 'features/message';
import { settingsModel } from 'features/settings';
import { userModel } from 'features/user';
import { ActionStatus, OActionStatus } from 'shared/lib/model';
import {
  deletePrescription,
  fetchUpdateMessageStatus,
  getMessageById,
  getMessageHistoryByRequestId,
  getMessageHistoryByRequestIdString,
  getMessageResponse,
  getQuantityQualifiers,
  IMessageApprove,
  updateMessagePendingStatus,
} from 'shared/api/message';
import { getComments as fetchGetComments } from 'shared/api/comment';
import { SettingTypeEnum } from 'shared/api/settings';
import { getNdc, search } from 'shared/api/drug';
import { getPatientDetail, getPharmacy } from 'shared/api/patient';
import { denialReasonTranslates, StatusColors, ValidateMethodEnum } from '../config';
import { medicationDetailModel } from '../../medication';

export enum ServiceLevelEnum {
  NEWPRESCRIPTION = 2,
  REFILLPRESCRIPTION = 4,
  CANCELPRESCRIPTION = 8,
  CHANGEPRESCRIPTION = 16,
  CONTROLLEDSUBSTANCES = 32,
  DOCTORTODOCTOREMAIL = 64,
}

class PrescriptionDetailModel {
  public showModal: string | null = '';

  public onConfirm: (result) => void = () => {};

  public cancelPrescription = false;

  public messages: IMessageApprove[] = [];

  public showPrescriptionDetail = false;

  public wait: any = null;

  public stopSend = false;

  public showMoreDetail = false;

  public comments: any[] = [];

  public pharmacy: any = {};

  public maxRefill = 98;

  public message: IMessageApprove = { messageId: '', messageType: '', requestId: 0 };

  public response = '';

  public quantityQualifiers: any[] = [];

  public currentMessage = 0;

  public multipleFob = false;

  public currentToken: ValidateMethodEnum = ValidateMethodEnum.IDME;

  public currentMessageTitle = '';

  public expires = '';

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public errors: Record<'search', Nullable<string>> = {
    search: null,
  };

  public showPatient = false;

  public showPhysician = false;

  public showPharmacy = false;

  public showRefill = false;

  public showXmlDetailModal: {
    messages: IMessageApprove[];
    show: boolean;
  } = {
    messages: [],
    show: false,
  };

  public responseTitle = '';

  public drugFilterSelected: any = null;

  public drugFilter = '';

  public dialog: any = {};

  public drugSearchResult = [];

  public FormFilter: any = null;

  public notify = '';

  public isProcessing = false;

  constructor() {
    makeAutoObservable(
      this,
      {
        notify: observable,
        showModal: observable,
        showXmlDetailModal: observable,
        messages: observable,
        showPrescriptionDetail: observable,
        isProcessing: observable,
        drugFilterSelected: observable,
        drugFilter: observable,
        FormFilter: observable,
        drugSearchResult: observable,
        responseTitle: observable,
        showPhysician: observable,
        showPatient: observable,
        showPharmacy: observable,
        showRefill: observable,
        showMoreDetail: observable,
        response: observable,
        message: observable,
        currentMessageTitle: observable,
        currentMessage: observable,
        dosesOnly: computed,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );

    autorun(() => {
      if (userModel.data) {
        this.setQuantityQualifier();
        this.setMultipleFob();
      }
    });

    if (localStorage.getItem('showMoreDetail')) {
      if (typeof localStorage.getItem('showMoreDetail') === 'boolean') {
        this.showMoreDetail = localStorage.getItem('showMoreDetail');
      }
    }
  }

  get dosesOnly() {
    return Boolean(Number(settingsModel.get('REMOVE_DELIVERED_FORMATS', SettingTypeEnum.PRACTICE)));
  }

  totalDispensed = computedFn((prescribed: number, dispensed: number) => {
    return Math.round((dispensed / prescribed) * 100);
  });

  getQuantityQualifier = computedFn((potencyUnit: string) => {
    const qualifier = find(this.quantityQualifiers, function (o) {
      return o.potencyUnit === potencyUnit;
    });
    if (qualifier) {
      return qualifier.name;
    }

    return '';
  });

  getDenialReason = computedFn((code) => {
    return denialReasonTranslates[code] || null;
  });

  getMessageRequestColor = computedFn((messageRequestCode: string): string => {
    return `bg-${StatusColors[messageRequestCode]}`;
  });

  getMessageHistoryFilter = computedFn((messageHistory: any) => {
    return filter(messageHistory, (history: any) => history.messageType !== 'Status' && history.messageType !== 'Verify');
  });

  getControlledDescription = computedFn((dea) => {
    switch (dea) {
      case '2':
        return denialReasonTranslates.EPCS_II;
      case '3':
        return denialReasonTranslates.EPCS_III;
      case '4':
        return denialReasonTranslates.EPCS_IV;
      case '5':
        return denialReasonTranslates.EPCS_V;
      case '6':
        return denialReasonTranslates.EPCS_MULTIPLE;
      default:
        return '';
    }
  });

  diagnosisDecimal = computedFn((code: string) => {
    if (code) {
      if (code.length === 3) {
        return code;
      }
      return [code.slice(0, 3), '.', code.slice(3)].join('');
    }
    return '';
  });

  messageRequestDescription = computedFn((messageRequestSubCode: string) => {
    switch (messageRequestSubCode) {
      case 'A':
        return 'Prescriber must confirm their State license status';
      case 'B':
        return 'Prescriber must confirm their DEA license status in prescribing state';
      case 'C':
        return 'Prescriber must confirm their DEA registration by DEA class';
      case 'D':
        return 'Prescriber must confirm their State Controlled Substance Registration license status';
      case 'E':
        return 'Prescriber must confirm their registration by State Controlled Substance Registration class';
      case 'F':
        return 'Prescriber must confirm their NADEAN license status';
      case 'G':
        return 'Prescriber must obtain/validate Type1 NPI';
      case 'H':
        return 'Prescriber must enroll/re-enroll with prescription benefit plan';
      case 'I':
        return 'Prescriber must confirm prescriptive authority criteria for prescribed medication is met';
      case 'J':
        return 'Prescriber must enroll/re-enroll in REMS';
      case 'K':
        return 'Prescriber must confirm their assignment as patients’ lock-in prescriber';
      case 'L':
        return 'Prescriber must obtain/validate their supervising prescriber';
      case 'M':
        return 'Prescriber must confirm their Certificate to Prescribe Number status';
      default:
        return '';
    }
  });

  async validate(isControlled: boolean, messageType: string, messageResponse: string) {
    if (!messageType) {
      return true;
    }
    let requireApproval = false;

    if (userModel.data?.user.id !== userModel.data?.currentPrescriber.id) {
      switch (messageType) {
        case 'RxRenewalRequest':
          if (messageResponse === 'Approved') {
            requireApproval = Boolean(settingsModel?.get('APPROVED_REFILL_SCRIPTS_REQUIRE_APPROVAL', 'Doctor'));
          } else {
            requireApproval = Boolean(settingsModel?.get('DECLINED_REFILL_SCRIPTS_REQUIRE_APPROVAL', 'Doctor'));
          }
          break;
        default:
          break;
      }

      if (isControlled && messageResponse === 'Approved') {
        requireApproval = true;
      }
    }

    if (isControlled && !requireApproval) {
      const fakeFn = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          resolve(true);
          reject(new Error('error'));
        });
      };
      const res = await fakeFn();
      return res;
      // TODO добавить когда будет реализован OtpService | message.response.controller 1808
    }
    return true;
  }

  *cancelPrescriptionConfirm(cancelPrescription) {
    let complete;
    if (this.message.patientId) {
      yield lastValueFrom(getPatientDetail(this.message.patientId)).then(async ({ response: patientDetail }: any) => {
        await encounterModel.getCurrentEncounter(patientDetail.patientId, true, false);
        if (encounterModel.currentEncounter) {
          messageStore
            .respondChangeRequest(
              this.message.messageId,
              this.message.messageType,
              this.response,
              this.message.comment || '',
              patientDetail.patientId,
              encounterModel.currentEncounter.encounterId,
              this.message.ncpdpId,
              this.message.messageRequestedSelected,
              1,
              this.messages[this.currentMessage].drugcode,
              this.messages[this.currentMessage].duration ? this.messages[this.currentMessage].duration : 0,
              '',
              cancelPrescription,
              this.message.requestId,
              '',
              ''
            )
            .then(() => {
              this.messages = map(this.messages, (innerMessage, index) => {
                const newMessage = { ...innerMessage };
                if (index === this.currentMessage) {
                  newMessage.messageStatus = 'Success';
                }

                return newMessage;
              });
              this.removeSelectedMessage(this.message.messageId);

              complete = true;
              forEach(this.messages, (innerMessage: any) => {
                if (innerMessage.messageStatus === 'WaitingApproval' || innerMessage.messageStatus === 'Pending') {
                  this.nextMessage();
                  complete = false;
                }
              });

              this.isProcessing = false;
              if (complete) {
                this.onConfirm(this.messages);
                this.showPrescriptionDetail = false;
              }
            })
            .catch(() => {
              this.isProcessing = false;
            });
        } else {
          this.isProcessing = false;
        }
      });
    }
  }

  *decline() {
    let complete = false;
    let serviceLevel;
    let message;
    switch (this.message.messageType) {
      case 'NewRx':
        yield lastValueFrom(fetchUpdateMessageStatus(this.message.requestId, 'Declined')).then(async () => {
          await lastValueFrom(deletePrescription(this.message.messageId)).then(() => {
            this.messages = map(this.messages, (innerMessage, index) => {
              const newMessage = { ...innerMessage };
              if (index === this.currentMessage) {
                newMessage.messageStatus = 'Success';
              }

              return newMessage;
            });
            this.removeSelectedMessage(this.message.messageId);
            complete = true;
            forEach(this.messages, (innerMessage: any) => {
              if (innerMessage.messageStatus === 'WaitingApproval' || innerMessage.messageStatus === 'Pending') {
                this.nextMessage();
                complete = false;
              }
            });

            if (complete) {
              this.onConfirm(this.messages);
              this.showPrescriptionDetail = false;
            }
          });
        });
        break;
      case 'CancelRx':
        this.isProcessing = true;
        yield lastValueFrom(getMessageResponse(this.message.requestId)).then(async ({ response: messagePending }: any) => {
          if (messagePending) {
            await lastValueFrom(fetchUpdateMessageStatus(messagePending.messageId, 'Declined')).then(() => {
              this.messages = map(this.messages, (innerMessage, index) => {
                const newMessage = { ...innerMessage };
                if (index === this.currentMessage) {
                  newMessage.messageStatus = 'Success';
                }

                return newMessage;
              });
              this.removeSelectedMessage(this.message.messageId);

              complete = true;
              forEach(this.messages, (innerMessage: any) => {
                if (innerMessage.messageStatus === 'WaitingApproval' || innerMessage.messageStatus === 'Pending') {
                  this.nextMessage();
                  complete = false;
                }
              });

              this.isProcessing = false;
              if (complete) {
                this.onConfirm(this.messages);
                this.showPrescriptionDetail = false;
              }
            });
          }
        });
        break;
      case 'RxRenewalRequest':
        message = { ...this.message };
        serviceLevel = this.confirmServiceLevel(
          this.message.messageXml && this.message.messageXml.Pharmacy ? this.message.messageXml.Pharmacy.Identification.NCPDPID : null,
          this.response === 'ZZ' ? 'NewRx' : '',
          this.message
        );
        if (serviceLevel === 0) {
          this.validate(false, this.response === 'ZZ' ? 'NewRx' : '', 'Declined').then(async (result) => {
            if (result) {
              this.isProcessing = true;
              await encounterModel.getCurrentEncounter(message.patientId, true, false);
              if (encounterModel.currentEncounter) {
                messageStore
                  .respondRxRenewalRequest(
                    message.messageId,
                    message.messageType,
                    this.response,
                    0,
                    message.comment,
                    message.patientId,
                    message.dob,
                    encounterModel.currentEncounter.encounterId,
                    1,
                    this.messages[this.currentMessage].drugcode,
                    this.message.messageRequestedSelected,
                    this.pharmacy.version
                  )
                  .then(() => {
                    this.messages[this.currentMessage].messageStatus = 'Declined';

                    this.removeSelectedMessage(message.messageId);

                    complete = true;
                    forEach(this.messages, (innerMessage: any) => {
                      if (innerMessage.messageStatus === 'WaitingApproval' || innerMessage.messageStatus === 'Pending') {
                        this.nextMessage();
                        complete = false;
                      }
                    });

                    this.isProcessing = false;
                    if (complete) {
                      this.onConfirm(this.messages);
                      this.showPrescriptionDetail = false;
                    }
                  })
                  .catch(() => {
                    this.isProcessing = false;
                  });
              } else {
                this.isProcessing = false;
              }
            }
          });
        }

        break;
      case 'RxChangeRequest':
        this.isProcessing = true;
        this.showModal = 'CANCEL_PRESCRIPTION';
        break;
      default:
        break;
    }
  }

  *approve() {
    const serviceLevel = this.confirmServiceLevel(
      this.message.messageXml && this.message.messageXml.Pharmacy ? this.message.messageXml.Pharmacy.Identification.NCPDPID : null,
      this.message.messageType,
      this.message
    );
    if (serviceLevel === 0) {
      let isControlled = false;
      let isAttached = false;
      let followUpPrescriber = 0;
      let response = 'A';
      const newMessage = this.message;
      switch (this.message.messageType) {
        case 'NewRx':
        case 'CancelRx':
          this.isProcessing = true;
          yield lastValueFrom(updateMessagePendingStatus(this.message.messageId, 'Pending'))
            .then(() => {
              this.messages[this.currentMessage].messageStatus = 'Success';
              this.removeSelectedMessage(this.message.messageId);
              let complete = true;
              forEach(this.messages, (message: any) => {
                if (message.messageStatus === 'WaitingApproval' || message.messageStatus === 'Pending') {
                  this.nextMessage();
                  complete = false;
                }
              });

              this.isProcessing = false;

              if (complete) {
                this.onConfirm(this.messages);
                this.showPrescriptionDetail = false;
              }
            })
            .catch(() => {
              this.isProcessing = false;
            });
          break;
        case 'RxRenewalRequest':
          if (has(this.message?.messageXml?.MedicationDispensed, 'PharmacyRequestedRefills')) {
            if (this.message?.refill?.toString() !== this.message.messageXml?.MedicationDispensed?.PharmacyRequestedRefills?.toString()) {
              response = 'C';
            } else {
              response = 'A';
            }
          }

          isControlled = this.checkDea();
          if (userModel.data?.currentPrescriber?.id !== newMessage.doctorId && !isUndefined(newMessage.doctorId)) {
            followUpPrescriber = newMessage.doctorId;
          }
          isAttached = this.checkPatientAttached(this.message);

          if (isAttached) {
            this.validate(isControlled, 'RxRenewalRequest', 'Approved').then(async (result) => {
              if (result) {
                this.isProcessing = true;
                await encounterModel.getCurrentEncounter(newMessage.patientId, true, false);
                if (encounterModel.currentEncounter) {
                  messageStore
                    .respondRxRenewalRequest(
                      newMessage.messageId,
                      newMessage.messageType,
                      response,
                      newMessage.refill,
                      newMessage.comment,
                      newMessage.patientId,
                      newMessage.dob,
                      encounterModel.currentEncounter.encounterId,
                      1,
                      this.messages[this.currentMessage].drugcode,
                      null,
                      this.pharmacy.version,
                      followUpPrescriber,
                      isControlled
                    )
                    .then((resultRespondRxRenewalRequest) => {
                      if (!resultRespondRxRenewalRequest) {
                        this.isProcessing = false;
                        return;
                      }
                      this.messages[this.currentMessage].messageStatus = 'Success';
                      this.removeSelectedMessage(newMessage.messageId);
                      let complete = true;
                      forEach(this.messages, (message: any) => {
                        if (message.messageStatus === 'WaitingApproval' || message.messageStatus === 'Pending') {
                          this.nextMessage();
                          complete = false;
                        }
                      });

                      this.isProcessing = false;

                      if (complete) {
                        this.onConfirm(this.messages);
                        this.showPrescriptionDetail = false;
                      }
                    })
                    .catch(() => {
                      this.isProcessing = false;
                    });
                } else {
                  this.isProcessing = false;
                }
              }
            });
          }

          break;
        case 'RxChangeRequest':
          isControlled = this.checkDea();
          if (
            isControlled &&
            (userModel.data?.user.id !== userModel.data?.currentPrescriber.id ||
              userModel.data?.user.id !== newMessage.doctorId ||
              userModel.data?.currentPrescriber.id !== newMessage.doctorId)
          ) {
            this.showModal = 'VALIDATION';
            return;
          }
          isAttached = this.checkPatientAttached(this.message);

          if (isAttached) {
            this.validate(isControlled, 'RxChangeRequest', 'Approved').then(async (result) => {
              if (result) {
                this.isProcessing = true;
                await encounterModel.getCurrentEncounter(this.message.patientId, true, false);
                if (encounterModel.currentEncounter) {
                  messageStore
                    .respondChangeRequest(
                      this.message.messageId,
                      this.message.messageType,
                      this.message.approved ? this.message.approved : this.response,
                      this.message?.messageRequestedSelected?.Note || '',
                      this.message.patientId,
                      encounterModel.currentEncounter.encounterId,
                      this.message.ncpdpId,
                      this.message.messageRequestedSelected,
                      1,
                      this.messages[this.currentMessage].drugcode,
                      this.message.duration,
                      this.message.priorAuthorization,
                      false,
                      0,
                      this.message.messageRequestData,
                      this.message.messageXml?.MessageRequestSubCode
                    )
                    .then(() => {
                      this.messages[this.currentMessage].messageStatus = 'Success';
                      this.removeSelectedMessage(this.message.messageId);
                      if (this.message.relatesToMessageId) lastValueFrom(deletePrescription(this.message.relatesToMessageId));
                      let complete = true;
                      forEach(this.messages, (message: any) => {
                        if (message.messageStatus === 'WaitingApproval' || message.messageStatus === 'Pending') {
                          this.nextMessage();
                          complete = false;
                        }
                      });

                      this.isProcessing = false;
                      if (complete) {
                        this.onConfirm(this.messages);
                        this.showPrescriptionDetail = false;
                      }
                    })
                    .catch(() => {
                      this.isProcessing = false;
                    });
                } else {
                  this.isProcessing = false;
                }
              }
            });
          }

          break;
        default:
          break;
      }
    } else if (serviceLevel === 1) {
      this.showModal = 'PHARMACY_SERVICE_LEVEL';
    } else if (serviceLevel === 2) {
      this.showModal = 'PHARMACY_CONTROLLED';
    }
  }

  *drugSearch(drugFilter) {
    this.drugFilter = drugFilter;
    this.drugSearchResult = [];
    if (drugFilter) {
      yield lastValueFrom(search(drugFilter, true, false)).then(({ response }: any) => {
        this.drugSearchResult = response?.drugs;
      });
    }
  }

  *getComments() {
    if (this.messages?.[this.currentMessage]?.practiceId) {
      yield lastValueFrom(fetchGetComments(<number>this.messages?.[this.currentMessage]?.practiceId, 1)).then(({ response: commentList }) => {
        this.comments = commentList;
      });
    }
  }

  *parse() {
    this.showRefill = true;
    this.message = this.messages[this.currentMessage];
    this.message.duration = 0;
    this.setExpiration();

    this.message.messageStatus = this.messages[this.currentMessage].messageStatus;

    if (!has(this.message, 'comment')) {
      this.message.comment = '';
    }
    if (!has(this.message, 'refill')) {
      this.message.refill = 0;
    }
    if (this.messages[this.currentMessage]?.messageType?.includes('CancelRx')) {
      this.messages[this.currentMessage].messageType = 'NewRx';
    }
    this.getComments();
    if (this.messages.length) {
      this.message = this.messages[this.currentMessage];
    }

    yield this.getMessageHistory(true);
  }

  *setQuantityQualifier() {
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<[]> = yield lastValueFrom(getQuantityQualifiers().pipe(auditTime(300), startWith([])));
      this.quantityQualifiers = output.response ?? [];
      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *selectMedicationRequested(ev: any, medicationRequested) {
    if (!medicationRequested) {
      return;
    }
    this.message.messageRequestedSelected = medicationRequested;
    if (this.message.messageRequestedSelected?.Quantity && has(this.message.messageRequestedSelected.Quantity, 'Value')) {
      this.message.messageRequestedSelected.Quantity.Value = Number(this.message.messageRequestedSelected.Quantity.Value);
    }
    if (this.message.messageRequestedSelected && has(this.message.messageRequestedSelected, 'NumberOfRefills')) {
      this.message.messageRequestedSelected.NumberOfRefills = Number(this.message.messageRequestedSelected.NumberOfRefills);
    }
    this.message.approved = 'A';
    if (this.message.messageXml?.MessageRequestCode === 'D' || this.message.messageXml?.MessageRequestCode === 'S') {
      this.approve();
    } else if (this.message.messageRequestedSelected?.DrugCoded?.ProductCode?.Code) {
      this.wait = 'A';
      yield lastValueFrom(getNdc(this.message.messageRequestedSelected.DrugCoded.ProductCode.Code))
        .then(({ response: result }) => {
          if (result) {
            // TODO добавить когда будет реализован FormatDosageService | message.response.controller 2490
          }
        })
        .catch(() => {
          this.wait = null;
        });
    }
  }

  *getMessageHistory(getMore) {
    if (has(this.messages[this.currentMessage], 'messageHistory')) {
      return;
    }
    yield lastValueFrom(getMessageHistoryByRequestId(this.messages[this.currentMessage]?.requestId, this.messages[this.currentMessage].messageId))
      .then((output) => {
        this.message.messageHistory = output.response ?? [];
        forEach(this.message.messageHistory, (result, i) => {
          const messageHistory = this.message.messageHistory?.length && this.message.messageHistory[i];
          if (!messageHistory) return;
          if (has(messageHistory?.messageXml?.Message?.Body?.ChangeRxResponse?.Response?.Denied, 'ReasonCode')) {
            messageHistory.messageXml.Message.Body.ChangeRxResponse.Response.DenialTitle = this.getDenialReason(
              messageHistory.messageXml.Message.Body.ChangeRxResponse.Response.Denied.ReasonCode
            );
          }
          if (has(messageHistory?.messageXml?.Message?.Body?.RxRenewalResponse?.Response?.Denied, 'ReasonCode')) {
            messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.DenialTitle = this.getDenialReason(
              messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.Denied.ReasonCode
            );
          }
          if (messageHistory?.messageXml?.Message?.Body?.CancelRxResponse?.Response) {
            let reason = '';

            if (has(messageHistory?.messageXml?.Message?.Body?.CancelRxResponse?.Response?.Denied, 'ReasonCode')) {
              forEach(messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode, (reasonCode) => {
                reason += this.getDenialReason(reasonCode);
                reason += ', ';
              });
            }
            messageHistory.messageXml.Message.Body.CancelRxResponse.Response.DenialTitle = reason;
          }
        });
      })
      .then(() => {
        if (!getMore) return;
        if (!has(this.message, 'messageXml')) {
          lastValueFrom(getMessageById(this.messages[this.currentMessage].messageId)).then(({ response: messageXml }: any) => {
            if (!messageXml) return;
            const newMessageXml = { ...messageXml };

            if (typeof messageXml === 'string') {
              return;
            }
            this.message.isOldScript = messageXml.isOldScript;
            const [human] = Object.keys(messageXml.Message.Body[this.messages[this.currentMessage].messageType].Patient);
            this.message.human = human;
            const [veterinarian] = Object.keys(messageXml.Message.Body[this.messages[this.currentMessage].messageType].Prescriber);
            this.message.veterinarian = veterinarian;
            this.message.relatesToMessageId = messageXml.Message.Header.RelatesToMessageID;
            this.message.messageXml = messageXml.Message.Body[this.messages[this.currentMessage].messageType];
            this.message.ncpdpId = messageXml.Message.Body[this.messages[this.currentMessage].messageType].Pharmacy.Identification.NCPDPID;

            if (this.messages[this.currentMessage].messageType === 'RxChangeRequest') {
              if (messageXml?.Message?.Body?.[this.messages?.[this.currentMessage]?.messageType]?.Request?.ChangeRequestType === 'T') {
                if (this.message.patientId && this.message.patientId > 0 && this.message.patientId) {
                  lastValueFrom(getPatientDetail(this.message.patientId)).then((patientDetail: any) => {
                    if (patientDetail?.data && patientDetail.data.patientId > 0) {
                      // TODO добавить когда будет реализован EligibilityService | message.response.controller 2019
                    }
                  });
                }
              }
            }
            let dea = '0';
            switch (this.messages[this.currentMessage].messageType) {
              case 'RxRenewalRequest':
                if (has(this.messages[this.currentMessage].messageXml, 'MedicationDispensed')) {
                  if (this.messages[this.currentMessage].messageXml.MedicationDispensed.PharmacyRequestedRefills) {
                    this.message.refill = Number(this.messages[this.currentMessage].messageXml.MedicationDispensed.PharmacyRequestedRefills);
                  }
                  if (this.messages[this.currentMessage].messageXml?.MedicationDispensed?.DrugCoded?.DEASchedule) {
                    const deaSchedule = this.messages[this.currentMessage].messageXml.MedicationDispensed.DrugCoded.DEASchedule?.Code;
                    switch (deaSchedule) {
                      case 'C48672':
                        dea = '1';
                        break;
                      case 'C48675':
                        dea = '2';
                        break;
                      case 'C48676':
                        dea = '3';
                        break;
                      case 'C48677':
                        dea = '4';
                        break;
                      case 'C48679':
                        dea = '5';
                        break;
                      default:
                        break;
                    }
                  }
                  if (isArray(this.messages[this.currentMessage].messageXml?.MedicationDispensed?.CompoundInformation?.CompoundIngredientsLotNotUsed)) {
                    forEach(this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed, (c) => {
                      if (has(c.CompoundIngredient, 'DEASchedule')) {
                        switch (c.CompoundIngredient.DEASchedule.Code) {
                          case 'C48672':
                            dea = '1';
                            break;
                          case 'C48675':
                            dea = '2';
                            break;
                          case 'C48676':
                            dea = '3';
                            break;
                          case 'C48677':
                            dea = '4';
                            break;
                          case 'C48679':
                            dea = '5';
                            break;
                          default:
                            break;
                        }
                      }
                    });
                  }
                  if (
                    this.messages[this.currentMessage].messageXml?.MedicationDispensed?.CompoundInformation?.CompoundIngredientsLotNotUsed?.CompoundIngredient
                      ?.DEASchedule
                  ) {
                    switch (
                      this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient
                        .DEASchedule.Code
                    ) {
                      case 'C48672':
                        dea = '1';
                        break;
                      case 'C48675':
                        dea = '2';
                        break;
                      case 'C48676':
                        dea = '3';
                        break;
                      case 'C48677':
                        dea = '4';
                        break;
                      case 'C48679':
                        dea = '5';
                        break;
                      default:
                        break;
                    }
                  }
                }
                if (!this.message.refill || this.message.refill === 0) {
                  this.message.refill = 1;
                }
                break;
              case 'RxChangeRequest':
                if (this.messages[this.currentMessage].messageXml?.MedicationPrescribed?.DrugCoded?.DEASchedule) {
                  const deaSchedule: string = this.messages[this.currentMessage].messageXml.MedicationPrescribed.DrugCoded.DEASchedule.Code;
                  switch (deaSchedule) {
                    case 'C48672':
                      dea = '1';
                      break;
                    case 'C48675':
                      dea = '2';
                      break;
                    case 'C48676':
                      dea = '3';
                      break;
                    case 'C48677':
                      dea = '4';
                      break;
                    case 'C48679':
                      dea = '5';
                      break;
                    default:
                      break;
                  }
                }
                break;
              default:
                break;
            }

            this.messages[this.currentMessage].drugcode = dea;
            let ndc = '';
            if (has(this.messages[this.currentMessage]?.messageXml?.MedicationDispensed?.DrugCoded, 'ProductCode')) {
              ndc = this.messages[this.currentMessage].messageXml.MedicationDispensed.DrugCoded.ProductCode?.Code;
            }

            if (!(!ndc || dea !== '0')) {
              lastValueFrom(getNdc(ndc)).then((results: any) => {
                let result: any = null;
                if (results && results.data && results.data.length > 0) {
                  const [resultFromData] = results.data;
                  result = resultFromData;
                }
                if (result) {
                  dea = result.MED_REF_DEA_CD;
                  this.messages[this.currentMessage].drugcode = dea;
                }
                switch (dea) {
                  case '1':
                  case '2':
                    if (has(messageXml.Message.Body?.[this.messages?.[this.currentMessage]?.messageType]?.MedicationPrescribed, 'NumberOfRefills')) {
                      newMessageXml.Message.Body[this.messages[this.currentMessage].messageType].MedicationPrescribed.NumberOfRefills = 1;
                    }
                    if (has(messageXml.Message.Body?.[this.messages?.[this.currentMessage]?.messageType]?.MedicationResponse, 'NumberOfRefills')) {
                      newMessageXml.Message.Body[this.messages[this.currentMessage].messageType].MedicationResponse.NumberOfRefills = 1;
                    }

                    this.showRefill = false;
                    break;
                  case '3':
                  case '4':
                  case '5':
                    if (has(messageXml.Message.Body?.[this.messages?.[this.currentMessage]?.messageType]?.MedicationPrescribed, 'NumberOfRefills')) {
                      newMessageXml.Message.Body[this.messages[this.currentMessage].messageType].MedicationPrescribed.NumberOfRefills = 1;
                    }
                    if (has(messageXml.Message.Body?.[this.messages?.[this.currentMessage]?.messageType]?.MedicationResponse, 'NumberOfRefills')) {
                      newMessageXml.Message.Body[this.messages[this.currentMessage].messageType].MedicationResponse.NumberOfRefills = 1;
                    }

                    this.maxRefill = 4;
                    this.showRefill = true;
                    break;
                  case '0':
                    if (this.response === 'ZZ' && this.messages[this.currentMessage].messageType !== 'RxChangeRequest') {
                      this.showModal = 'REPLACE_PRESCRIPTION';
                    }
                    this.showRefill = true;
                    break;
                  default:
                    this.showRefill = true;
                    break;
                }
              });
            }
            let messageHistory;
            switch (this.messages[this.currentMessage].messageType) {
              case 'RxRenewalRequest':
                messageHistory = this.messages?.[this.currentMessage]?.messageHistory || null;
                if (this.currentMessage && messageHistory && messageHistory?.length) {
                  const index = messageHistory?.length - 1;
                  const response = messageHistory[index];

                  if (has(response.messageXml.Message.Body, 'RxRenewalResponse')) {
                    this.messages[this.currentMessage].refill =
                      Number(response.messageXml.Message.Body.RxRenewalResponse.MedicationResponse.NumberOfRefills) - 1;

                    if (has(response.messageXml.Message?.Body?.RxRenewalResponse?.Response?.Denied, 'DenialReason')) {
                      this.messages[this.currentMessage].comment = response.messageXml.Message.Body.RxRenewalResponse.Response.Denied.DenialReason;
                    }
                    if (has(response.messageXml.Message.Body?.RxRenewalResponse?.Response?.Approved, 'Note')) {
                      this.messages[this.currentMessage].comment = response.messageXml.Message.Body.RxRenewalResponse.Response.Approved.Note;
                    }
                    if (has(response.messageXml.Message.Body?.RxRenewalResponse?.Response?.ApprovedWithChanges, 'Note')) {
                      this.messages[this.currentMessage].comment = response.messageXml.Message.Body.RxRenewalResponse.Response.ApprovedWithChanges.Note;
                    }
                  }
                }
                break;
              default:
                break;
            }

            let row = 1;
            this.message.messageHistory = map(this.message.messageHistory, (message) => {
              let newMessage = { ...message };
              if (
                newMessage.messageType === 'RxChangeResponse' ||
                newMessage.messageType === 'RxRenewalResponse' ||
                newMessage.messageType === 'CancelRx' ||
                newMessage.messageType === 'NewRx'
              ) {
                newMessage = this.getStatus(newMessage.messageType, newMessage);
              }
              if (newMessage.messageType !== 'Status' && newMessage.messageType !== 'Verify') {
                newMessage.order = row;
                row += 1;
              }
              return newMessage;
            });
            if (this.message.ncpdpId) {
              lastValueFrom(getPharmacy(this.message.ncpdpId)).then((pharmacy: any) => {
                if (this.response === 'ZZ' && dea !== '0') {
                  if (pharmacy.version.indexOf('v6') < 0) {
                    this.showModal = 'REPLACE';
                    this.stopSend = true;
                  }
                }
                this.pharmacy = pharmacy;
              });
            }
            this.message.messageXml = newMessageXml.Message.Body[this.messages[this.currentMessage].messageType];
          });
        }
      });
  }

  private checkDea() {
    if (has(this.messages[this.currentMessage]?.messageXml?.MedicationDispensed, 'DrugCoded')) {
      if (has(this.messages[this.currentMessage].messageXml.MedicationDispensed.DrugCoded, 'DEASchedule')) {
        const deaSchedule = this.messages[this.currentMessage].messageXml.MedicationDispensed.DrugCoded.DEASchedule.Code;
        switch (deaSchedule) {
          case 'C48672':
          case 'C48675':
          case 'C48676':
          case 'C48677':
          case 'C48679':
            return true;
          default:
            return false;
        }
      }
    } else if (has(this.messages[this.currentMessage].messageXml?.MedicationDispensed, 'CompoundInformation')) {
      if (isArray(this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed)) {
        some(this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed, (c) => {
          if (has(c.CompoundIngredient, 'DEASchedule')) {
            switch (c.CompoundIngredient.DEASchedule.Code) {
              case 'C48672':
              case 'C48675':
              case 'C48676':
              case 'C48677':
              case 'C48679':
                return true;
              default:
                return false;
            }
          }

          return false;
        });
      } else if (
        has(
          this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient,
          'DEASchedule'
        )
      ) {
        switch (
          this.messages[this.currentMessage].messageXml.MedicationDispensed.CompoundInformation.CompoundIngredientsLotNotUsed.CompoundIngredient.DEASchedule
            .Code
        ) {
          case 'C48672':
          case 'C48675':
          case 'C48676':
          case 'C48677':
          case 'C48679':
            return true;
          default:
            return false;
        }
      }
    }

    return false;
  }

  private checkPatientAttached(message: IMessageApprove) {
    if (!message.patientId || message.patientId === 0) {
      this.showModal = 'PATIENT';
      return false;
    }
    return true;
  }

  setMessages(messages: IMessageApprove[]) {
    this.messages = messages;

    if (this.messages.length > 0) {
      this.parse();
    }

    if (this.messages.length > 1) {
      this.currentMessageTitle = `${this.currentMessage + 1} of ${this.messages.length}`;
    }
  }

  drugFilterChange(FormFilter: any) {
    this.FormFilter = FormFilter;
    if (this.drugFilterSelected) {
      // TODO добавить когда будет реализован FormatDosageService | message.response.controller 533
    }
  }

  expandPatient() {
    this.showPatient = !this.showPatient;
  }

  expandPhysician() {
    this.showPhysician = !this.showPhysician;
  }

  expandPharmacy() {
    this.showPharmacy = !this.showPharmacy;
  }

  setMultipleFob() {
    const idme = settingsModel.get('IDME_IDENTIFICATION', SettingTypeEnum.USER);
    const identrust = settingsModel.get('IDENTRUST_USER_NAME', SettingTypeEnum.USER);
    const defaultFob = settingsModel.get('DEFAULT_EPCS_AUTHENTICATION_METHOD', SettingTypeEnum.USER);
    if (idme && Boolean(Number(idme)) && identrust && identrust.toString().length > 0) {
      this.multipleFob = true;
      if (defaultFob && defaultFob !== '0') {
        this.currentToken = Number(defaultFob);
      } else {
        this.currentToken = Number(ValidateMethodEnum.IDME);
      }
    } else if (idme && Boolean(Number(idme))) {
      this.multipleFob = false;
      this.currentToken = ValidateMethodEnum.IDME;
    } else if (identrust && identrust.toString().length > 0) {
      this.multipleFob = false;
      this.currentToken = ValidateMethodEnum.IDENTRUST;
    } else {
      this.multipleFob = false;
      this.currentToken = ValidateMethodEnum.IDME;
    }
  }

  showDetail(detailOnly, prescription) {
    medicationDetailModel.prescription = prescription;
    medicationDetailModel.detailOnly = detailOnly;
    if (detailOnly) {
      medicationDetailModel.loadDetail(prescription.messageId);
    } else {
      switch (prescription.sendMethod) {
        case 1:
        case 3:
        case 4:
        case 5:
          medicationDetailModel.load(null);
          break;
        default:
          medicationDetailModel.load(prescription.messageId);
          break;
      }
    }
    medicationDetailModel.showModal(true);
    this.showPrescriptionDetail = !this.showPrescriptionDetail;
  }

  setExpiration() {
    if (!this.message) return;
    let days = Number(this.message.duration);

    if (this.message.duration) {
      if (this.message?.messageRequestedSelected?.NumberOfRefills) {
        if (Number(this.message.messageRequestedSelected.NumberOfRefills) > 0) {
          days = this.message.duration * Number(this.message.messageRequestedSelected.NumberOfRefills);
        } else {
          days = this.message.duration;
        }
      }
    }
    this.expires = moment().add(days, 'd').format('MM-DD-YYYY');
  }

  getStatus(messageType: string, message: any) {
    const newMessage = { ...message };
    let filterMessages: any[] = [];
    switch (messageType) {
      case 'RxChangeResponse':
      case 'RxRenewalResponse':
      case 'NewRx':
      case 'CancelRx':
        if (this.message.messageHistory) {
          filterMessages = toJS(this.message.messageHistory).filter((history) => {
            return history.messageXml.Message.Header.RelatesToMessageID === message.messageXml.Message.Header.MessageID;
          });
          if (filterMessages && filterMessages.length > 0) {
            forEach(filterMessages, (innerMessage, i) => {
              newMessage.messageStatus = filterMessages[i].messageType;
            });
          } else {
            newMessage.messageStatus = null;
          }
          newMessage.statusMessages = filterMessages;
        }
        break;
      default:
        break;
    }

    return newMessage;
  }

  confirmServiceLevel(ncpdpId: string, messageType: string, message: any) {
    if (!messageType || !ncpdpId) {
      return 0;
    }

    this.pharmacy.serviceLevel = split(this.pharmacy.serviceLevel, this.pharmacy.serviceLevel.indexOf('~') >= 0 ? '~' : ',');
    let serviceLevel = -1;
    let isControlled = false;
    switch (messageType) {
      case 'NewRx':
        serviceLevel = indexOf(this.pharmacy.serviceLevel, 'New');
        if (has(message.messageXml?.MedicationPrescribed?.DrugCoded, 'DEASchedule')) {
          isControlled = true;
        }

        if (isControlled) {
          if (this.pharmacy.version.indexOf('v6') < 0) {
            this.showModal = 'REPLACE';
            this.stopSend = true;
          }
        }

        break;
      case 'CancelRx':
        serviceLevel = indexOf(this.pharmacy.serviceLevel, 'Cancel');
        break;
      case 'RxRenewalRequest':
        serviceLevel = indexOf(this.pharmacy.serviceLevel, 'Refill');
        if (has(message.messageXml?.MedicationPrescribed?.DrugCoded, 'DEASchedule')) {
          isControlled = true;
        }

        break;
      case 'RxChangeRequest':
        serviceLevel = indexOf(this.pharmacy.serviceLevel, 'Change');
        if (has(message.messageXml?.MedicationPrescribed?.DrugCoded, 'DEASchedule')) {
          isControlled = true;
        }

        break;
      default:
        break;
    }

    if (Number(serviceLevel) < 0) {
      return 1;
    }
    if (isControlled) {
      serviceLevel = indexOf(this.pharmacy.serviceLevel, 'Controlled Substance');
      if (serviceLevel >= 0) {
        return 2;
      }
      return 0;
    }
    return 0;
  }

  showMore() {
    this.showMoreDetail = !this.showMoreDetail;
    localStorage.setItem('showMoreDetail', this.showMoreDetail);
  }

  nextMessage() {
    if (this.messages.length === this.currentMessage + 1) {
      this.currentMessage = 0;
    } else {
      this.currentMessage += 1;
    }

    this.parse();

    this.currentMessageTitle = `${this.currentMessage + 1} of ${this.messages.length}`;
  }

  previousMessage() {
    if (this.currentMessage === 0) {
      this.currentMessage = this.messages.length - 1;
    } else {
      this.currentMessage -= 1;
    }

    this.parse();

    this.currentMessageTitle = `${this.currentMessage + 1} of ${this.messages.length}`;
  }

  private checkRefillLength = (errors: any) => {
    if (errors.ssRefill?.type === 'maxlength') {
      this.showModal = 'REFILL_MAX_LENGTH';
      return true;
    }
    return false;
  };

  private checkDecimals(errors: any) {
    if (errors.ssRefill?.type === 'pattern') {
      this.showModal = 'REFILL_DECIMAL';
      return true;
    }
    return false;
  }

  private checkNotes(errors: any) {
    if (errors.ssPharmacyNote?.type === 'maxlength') {
      this.showModal = 'PHARMACY_NOTE';
      return true;
    }
    return false;
  }

  private checkRefills(dea: string, refill: number | undefined) {
    if (refill && refill > 1) {
      if (dea === '2') {
        this.showModal = 'REFILL_CLASS_II';
        return true;
      }
      if (refill > 5) {
        this.showModal = 'REFILL_CLASS';
        return true;
      }

      return false;
    }
    return false;
  }

  private checkControlled(dea: string | undefined, refill: number | undefined) {
    switch (dea) {
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (this.checkRefills(dea, refill)) {
          return true;
        }

        return false;
        break;
      default:
        return false;
    }
  }

  private checkServiceLevelPrescriber(dea: string | undefined) {
    if (!(userModel.data?.currentPractice?.serviceLevel === ServiceLevelEnum.NEWPRESCRIPTION)) {
      this.showModal = 'SERVICE_LEVEL';
      return true;
    }

    switch (dea) {
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (!(userModel.data?.currentPractice?.serviceLevel === ServiceLevelEnum.CONTROLLEDSUBSTANCES)) {
          this.showModal = 'SERVICE_LEVEL';
          return true;
        }
        break;
      default:
        return false;
    }

    return false;
  }

  validatePrescriptionDecline(errors) {
    if (errors) {
      if (this.checkNotes(errors)) {
        return false;
      }
    }

    return true;
  }

  validatePrescription(errors: any, dea: string | undefined) {
    if (errors) {
      if (
        this.checkNotes(errors) ||
        this.checkDecimals(errors) ||
        this.checkRefillLength(errors) ||
        this.checkControlled(dea, this.message.refill) ||
        this.checkServiceLevelPrescriber(dea)
      ) {
        return false;
      }
    }

    return true;
  }

  send(errors) {
    if (this.response === 'A') {
      if (this.validatePrescription(errors, this.messages?.[this.currentMessage]?.drugcode)) {
        this.approve();
      }
    } else if (this.validatePrescriptionDecline(errors)) {
      this.decline();
    }
  }

  alternative(alternative: any, ev: any) {
    // TODO добавить когда будет реализован EligibilityService | message.response.controller 550
  }

  removeSelectedMessage(messageId: string) {
    remove(this.messages, (processed: any) => {
      return processed.messageId === messageId;
    });
  }

  *updateMessageStatus(requestId, messageStatus) {
    yield lastValueFrom(fetchUpdateMessageStatus(requestId, messageStatus)).then(() => {
      let complete = true;
      forEach(this.messages, (message: any) => {
        if (message.messageStatus === 'WaitingApproval' || message.messageStatus === 'Pending') {
          this.nextMessage();
          complete = false;
        }
      });

      if (complete) {
        this.onConfirm(this.messages);
        this.showPrescriptionDetail = false;
      }
      messageStore.viewAllPending(false);
    });
  }

  selectComment(comment) {
    if (!this.message.comment) {
      this.message.comment = '';
    }
    let newComment = this.message.comment;
    newComment += ' ';
    newComment += comment;
    this.message.comment = newComment.trim();
  }

  *showXmlDetail(requestId) {
    yield lastValueFrom(getMessageHistoryByRequestIdString(requestId)).then(({ response }) => {
      this.showXmlDetailModal = {
        messages: response,
        show: true,
      };
    });
  }
}

const prescriptionDetailModel = new PrescriptionDetailModel();
export default prescriptionDetailModel;
