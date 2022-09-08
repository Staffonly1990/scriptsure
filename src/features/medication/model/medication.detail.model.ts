import { reaction, makeAutoObservable, observable, toJS } from 'mobx';
import { find, forEach, has, map, orderBy } from 'lodash';
import { computedFn } from 'mobx-utils';
import { lastValueFrom } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';
import { AjaxResponse } from 'rxjs/ajax';

import { getUserDetail } from 'shared/api/user';
import { getPrintedPrescription } from 'shared/api/drug/drug.history.resources';
import { getMessageDetail, getMessageJson, getQuantityQualifiers, IMessageApprove } from 'shared/api/message';
import { prescriptionDetailModel } from '../../prescription';
import { userModel } from '../../user';

class MedicationDetailModel {
  public show = false;

  public detailOnly = false;

  public prescription: any = null;

  public showPatient = false;

  public showPhysician = false;

  public showPharmacy = false;

  public quantityQualifiers: any[] = [];

  public message: IMessageApprove = { messageId: '', messageType: '', requestId: 0 };

  constructor() {
    makeAutoObservable(
      this,
      {
        showPhysician: observable,
        showPatient: observable,
        showPharmacy: observable,
        quantityQualifiers: observable,
        show: observable,
        message: observable,
      },
      { autoBind: true }
    );

    reaction(
      () => !!userModel.data,
      () => {
        if (userModel.data) {
          this.setQuantityQualifier();
        }
      }
    );
  }

  *setQuantityQualifier() {
    try {
      const output: AjaxResponse<[]> = yield lastValueFrom(getQuantityQualifiers().pipe(auditTime(300), startWith([])));
      this.quantityQualifiers = output.response ?? [];
    } catch (error: unknown) {}
  }

  showModal(value) {
    this.show = value;
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

  getQuantityQualifier = computedFn((potencyUnit: string) => {
    const qualifier = find(this.quantityQualifiers, function (o) {
      return o.potencyUnit === potencyUnit;
    });
    if (qualifier) {
      return qualifier.name;
    }

    return '';
  });

  showToast(message) {
    prescriptionDetailModel.notify = message;
  }

  getMessageHistory() {
    forEach(this.message.messageHistory, (result, i) => {
      const messageHistory = this.message.messageHistory?.length && this.message.messageHistory[i];
      if (!messageHistory) return;
      if (has(messageHistory?.messageXml?.Message?.Body?.ChangeRxResponse?.Response?.Denied, 'ReasonCode')) {
        messageHistory.messageXml.Message.Body.ChangeRxResponse.Response.DenialTitle = prescriptionDetailModel.getDenialReason(
          messageHistory.messageXml.Message.Body.ChangeRxResponse.Response.Denied.ReasonCode
        );
      }
      if (has(messageHistory?.messageXml?.Message?.Body?.RxRenewalResponse?.Response?.Denied, 'ReasonCode')) {
        messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.DenialTitle = prescriptionDetailModel.getDenialReason(
          messageHistory.messageXml.Message.Body.RxRenewalResponse.Response.Denied.ReasonCode
        );
      }
      if (messageHistory?.messageXml?.Message?.Body?.CancelRxResponse?.Response) {
        let reason = '';

        if (has(messageHistory?.messageXml?.Message?.Body?.CancelRxResponse?.Response?.Denied, 'ReasonCode')) {
          forEach(messageHistory.messageXml.Message.Body.CancelRxResponse.Response.Denied.ReasonCode, (reasonCode) => {
            reason += prescriptionDetailModel.getDenialReason(reasonCode);
            reason += ', ';
          });
        }
        messageHistory.messageXml.Message.Body.CancelRxResponse.Response.DenialTitle = reason;
      }
    });
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

  *getPrescription(user: any) {
    yield lastValueFrom(getPrintedPrescription(this.prescription.Prescription.prescriptionId, user)).then(({ response: printedMessage }: any) => {
      const newPrintedMessage = { ...printedMessage };
      if (!user) {
        newPrintedMessage.doNotShowPrescriber = true;
      }
      if (this.message && Object.keys(this.message).length > 0) {
        this.message.messageXml = newPrintedMessage.messageXml;
      } else {
        this.message = newPrintedMessage;
      }
    });
  }

  *load(messageId: string | null) {
    yield lastValueFrom(getMessageDetail(messageId)).then(async ({ response: message }: any) => {
      if (message) {
        this.message = message;
        if (has(this.message.header, 'SenderSoftware')) {
          this.getMessageHistory();
        } else if (this.prescription.Prescription.doctorId && this.prescription.Prescription.doctorId > 0) {
          await lastValueFrom(getUserDetail(this.prescription.Prescription.doctorId))
            .then(({ response: user }) => {
              this.getPrescription(user);
            })
            .catch(() => {
              this.getPrescription(null);
            });
        } else {
          this.getPrescription(null);
        }
      } else if (this.prescription.Prescription.doctorId && this.prescription.Prescription.doctorId > 0) {
        await lastValueFrom(getUserDetail(this.prescription.Prescription.doctorId))
          .then((user) => {
            this.getPrescription(user);
          })
          .catch(() => {
            this.getPrescription(null);
          });
      } else {
        this.getPrescription(null);
      }

      let row = 1;
      this.message.messageHistory = map(orderBy(this.message.messageHistory, ['messageDate', 'desc']), (m) => {
        const newM = { ...m };
        if (
          newM.messageType === 'RxChangeResponse' ||
          newM.messageType === 'RxRenewalResponse' ||
          newM.messageType === 'CancelRx' ||
          newM.messageType === 'NewRx' ||
          newM.messageType === 'RxFillIndicatorChange'
        ) {
          this.getStatus(newM.messageType, newM);
        }
        if (newM.messageType !== 'Status' && newM.messageType !== 'Verify') {
          newM.order = row;
          row += 1;
        }
        return newM;
      });
    });
  }

  *loadDetail(messageId: string) {
    yield lastValueFrom(getMessageJson(messageId)).then(({ response: message }: any) => {
      this.message = message;
    });
  }
}

const medicationDetailModel = new MedicationDetailModel();
export default medicationDetailModel;
