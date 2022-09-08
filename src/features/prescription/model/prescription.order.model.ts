import { makeAutoObservable } from 'mobx';

import { IPatient, IPharmacy } from 'shared/api/patient';
import { IFormat } from 'shared/api/drug/drug.types';

export enum SaveMethodEnum {
  SAVE = 0,
  SHOW_CONFIRMATION = 1,
  ADD_TO_QUEUE = 2,
  SAVE_ONLY = 3,
}

class PrescriptionOrderModel {
  public prescriptionId = 0;

  public formatId = 0;

  public delivered = 0;

  public prescribedRoutedMedId = 0;

  public prescribedGcnSeqno = 0;

  public drugName = '';

  public ordersetId = 0;

  constructor() {
    makeAutoObservable(this);
  }

  performDrugCheck(
    currentPatient: IPatient,
    isEditMode: boolean,
    saveMethod: SaveMethodEnum,
    form: any,
    formqualifiers: any[],
    currentStatus: any,
    newrx: any,
    isMessageResponse = false,
    ncpdpId: string | null = null,
    pharmacy: IPharmacy[] | null = null,
    medication: IFormat | null = null,
    insurance: any = null,
    checkNotes = true
  ) {
    return null;
  }
}

const prescriptionOrderModel = new PrescriptionOrderModel();
export default prescriptionOrderModel;
