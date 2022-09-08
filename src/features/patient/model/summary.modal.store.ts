import { makeAutoObservable, observable, runInAction } from 'mobx';

import { SettingTypeEnum } from 'shared/api/settings';
import { settingsModel } from 'features/settings';

class SummaryModalStore {
  public noPrescriptionPrint = false;

  public noAllergyPrint = false;

  public noEducationPrint = false;

  public noDiagnosisPrint = false;

  public noSoapPrint = false;

  public warningNoDiagnosisEntered = false;

  public warningNoAllergyEntered = false;

  constructor() {
    makeAutoObservable(this, {
      noPrescriptionPrint: observable,
      noAllergyPrint: observable,
      noEducationPrint: observable,
      noDiagnosisPrint: observable,
      noSoapPrint: observable,
      warningNoAllergyEntered: observable,
      warningNoDiagnosisEntered: observable,
    });

    runInAction(() => {
      this.noPrescriptionPrint = Boolean(Number(settingsModel?.get('DO_NOT_PRINT_MEDICATIONS', SettingTypeEnum.USER)));
      this.noAllergyPrint = Boolean(Number(settingsModel?.get('DO_NOT_PRINT_ALLERGY', SettingTypeEnum.USER)));
      this.noEducationPrint = Boolean(Number(settingsModel?.get('DO_NOT_PRINT_EDUCATION', SettingTypeEnum.USER)));
      this.noDiagnosisPrint = Boolean(Number(settingsModel?.get('DO_NOT_PRINT_DIAGNOSIS', SettingTypeEnum.USER)));
      this.warningNoDiagnosisEntered = Boolean(Number(settingsModel?.get('WARN_NO_DIAGNOSIS_ENTERED', SettingTypeEnum.PRACTICE)));
      this.warningNoAllergyEntered = Boolean(Number(settingsModel?.get('WARN_NO_ALLERGY_ENTERED', SettingTypeEnum.PRACTICE)));
    });
  }
}

const summaryModalStore = new SummaryModalStore();
export default summaryModalStore;
