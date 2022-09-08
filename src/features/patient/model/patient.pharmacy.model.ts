import { makeAutoObservable, observable, runInAction, toJS } from 'mobx';
import { AjaxError, AjaxResponse } from 'rxjs/ajax';
import { lastValueFrom } from 'rxjs';
import { auditTime, startWith } from 'rxjs/operators';
import { filter, find, forEach, isEqual, map, sortBy } from 'lodash';

import { ActionStatus, OActionStatus } from 'shared/lib/model';
import {
  findPharmacy,
  getCommon,
  getPreferred,
  IPharmacy,
  IPharmacyFilter,
  OSortCommonsList,
  removeCommon,
  removePreferred,
  setCommon,
  setDefault,
  setPreferred,
  SortCommonsList,
} from 'shared/api/patient';
import { SettingTypeEnum } from 'shared/api/settings';
import { userModel } from 'features/user';
import { settingsModel } from 'features/settings';
import patientModel from './patient.model';

class PatientPharmacyModel {
  public common: IPharmacy[] = [];

  public pharmacies: IPharmacy[] = [];

  public selectedPharmacy: IPharmacy | null = null;

  public searchPharmacies: IPharmacy[] = [];

  public searchCommons: IPharmacy[] = [];

  public notify = '';

  public editCommonMode = false;

  public commonSortType: OSortCommonsList = SortCommonsList.BusinessName;

  public status: Record<'search', ActionStatus> = {
    search: OActionStatus.Initial,
  };

  public errors: Record<'search', Nullable<string>> = {
    search: null,
  };

  public hideCommon = false;

  public isSearch = false;

  public pharmacyFilter: IPharmacyFilter = {
    ncpdpid: '',
    businessName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    fax: '',
    specialties: ['Retail', 'Mail Order'],
  };

  public isPrescription = false;

  constructor() {
    makeAutoObservable(
      this,
      {
        common: observable,
        isPrescription: observable,
        searchCommons: observable,
        searchPharmacies: observable,
        isSearch: observable,
        pharmacies: observable,
        editCommonMode: observable,
        commonSortType: observable,
        notify: observable,
        status: observable.shallow,
        errors: observable.shallow,
      },
      { autoBind: true }
    );

    runInAction(() => {
      this.notify = '';
      this.hideCommon = Boolean(Number(settingsModel?.get('DO_NOT_SHOW_PHARMACY_COMMON', SettingTypeEnum.PRACTICE)));
    });
    this.getPharmacies(patientModel.currentPatient?.chartId || patientModel.currentPatient?.patientId);
  }

  setPharmacyFilter(values) {
    this.pharmacyFilter = values;
  }

  specifyIsPrescription(is: boolean) {
    this.isPrescription = is;
  }

  searchCommon(value) {
    this.searchCommons = toJS(this.common).filter((commonItem) => commonItem?.businessName?.toLowerCase().includes(value.toLowerCase()));
  }

  setIsSearch(value: boolean) {
    this.isSearch = value;
  }

  setEditCommonMode() {
    this.editCommonMode = !this.editCommonMode;
  }

  setSort(sortType: OSortCommonsList) {
    this.commonSortType = sortType;
    this.common = [...sortBy(this.common, sortType)];
    this.searchCommons = [...sortBy(this.searchCommons, sortType)];
  }

  selectPharmacy(pharmacy, isPrescription?: boolean) {
    if (isPrescription) {
      this.selectedPharmacy = pharmacy;
    }
    if (patientModel.currentPatient) {
      this.addPatientPreferred(pharmacy);
    } else {
      this.pharmacies.push(pharmacy);
    }
  }

  *getCommon(practiceId: number) {
    if (this.hideCommon) return;
    this.common = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPharmacy[]> = yield lastValueFrom(getCommon(practiceId).pipe(startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.common = output.response ?? [];
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *getPharmacies(id) {
    if (!id) return;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPharmacy[]> = yield lastValueFrom(getPreferred(id).pipe(startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.pharmacies = output.response ?? [];

      if (output.response.length > 0) {
        this.selectedPharmacy = this.pharmacies.find((pharmacy) => pharmacy.PatientPharmacy?.[0].default === true) ?? {
          ...this.pharmacies[0],
        };
      }
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  searchKeyPress(ev: any) {
    if (ev.originalEvent.keyIdentifier === 'Enter') {
      this.search(true);
    }
  }

  *search(isSimple: boolean) {
    let queryFilter;
    if (isSimple) {
      if (!this.pharmacyFilter.businessName || this.pharmacyFilter.businessName.length === 0) {
        return;
      }

      const data = this.pharmacyFilter.businessName.split(' ');
      let businessName;
      let zipCode;
      let city;

      if (data.length) {
        const [data0, data1] = data;
        if (data.length > 1) {
          if (!Number.isNaN(Number(data0))) {
            zipCode = data0;
          } else {
            businessName = data0;
          }

          if (!Number.isNaN(Number(data1))) {
            zipCode = data1;
          } else if (!Number.isNaN(Number(data0))) {
            businessName = data1;
          } else {
            city = data1;
          }
        } else if (!Number.isNaN(Number(data0))) {
          zipCode = data0;
        } else {
          businessName = data0;
        }
      }

      queryFilter = {
        specialties: ['Retail', 'TwentyFourHourStore', 'MailOrder'],
      };
      if (city) {
        queryFilter.city = city;
      }
      if (businessName) {
        queryFilter.businessName = businessName;
      }
      if (zipCode) {
        queryFilter.zipCode = zipCode;
      }
    } else {
      queryFilter = this.pharmacyFilter;
    }
    this.searchPharmacies = [];
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      const output: AjaxResponse<IPharmacy[]> = yield lastValueFrom(findPharmacy(queryFilter).pipe(auditTime(100), startWith({})));
      this.status.search = OActionStatus.Fulfilled;
      this.searchPharmacies = output.response ?? [];
      this.isSearch = true;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *deletePatientPreferred(pharmacy: IPharmacy) {
    if (!patientModel.currentPatient?.patientId || !pharmacy.ncpdpId) return;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      yield lastValueFrom(removePreferred(patientModel.currentPatient.patientId, pharmacy.ncpdpId).pipe(startWith({})));

      this.getPharmacies(patientModel.currentPatient?.chartId || patientModel.currentPatient?.patientId);
      this.notify = 'Pharmacy has been removed';
      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  setIsSelect(common: IPharmacy) {
    this.common = map(this.common, (commonItem) => {
      const newCommonItem = commonItem;
      if (newCommonItem.ncpdpId === common.ncpdpId) {
        newCommonItem.isSelected = !newCommonItem.isSelected;
      }

      return newCommonItem;
    });
  }

  deleteCommon(pharmacy: IPharmacy) {
    const deleteCommons = filter(this.common, (selectCommon: IPharmacy) => {
      return selectCommon.isSelected === true;
    });
    if (deleteCommons.length !== 0) return;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      deleteCommons.push(pharmacy);
      const userData = toJS(userModel.data);

      forEach(deleteCommons, async (deleteCommonItem) => {
        if (!userData?.currentPractice?.id) return;

        await lastValueFrom(removeCommon(userData.currentPractice.id, deleteCommonItem.ncpdpId).pipe(startWith({})));

        this.common = this.common.filter((item) => deleteCommonItem.ncpdpId !== item.ncpdpId);
      });

      this.notify = 'Pharmacy has been removed from Common list';

      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *addCommon(pharmacy: IPharmacy) {
    const exist = find(this.common, (pharmacyExist) => {
      return pharmacyExist.ncpdpId === pharmacy.ncpdpId;
    });
    const userData = toJS(userModel.data);
    if (exist || !userData?.currentPractice?.id) return;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      yield lastValueFrom(setCommon(userData.currentPractice.id, [pharmacy.ncpdpId]).pipe(startWith({})));
      this.common.push(pharmacy);
      this.notify = 'Common pharmacy added to practice';
      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *setDefault(pharmacy: IPharmacy) {
    if (!patientModel.currentPatient?.patientId || !pharmacy.ncpdpId) return;
    this.status.search = OActionStatus.Pending;
    this.errors.search = null;
    try {
      yield lastValueFrom(setDefault(patientModel.currentPatient.patientId, pharmacy.ncpdpId).pipe(startWith({})));

      this.pharmacies = this.pharmacies.map((itemPharmacy) => {
        const newItemPharmacy = itemPharmacy;
        newItemPharmacy.PatientPharmacy[0].default = false;
        return newItemPharmacy;
      });

      this.pharmacies = toJS(this.pharmacies).map((itemPharmacy) => {
        const newItemPharmacy = itemPharmacy;

        if (newItemPharmacy.ncpdpId === pharmacy.ncpdpId && newItemPharmacy.npi === pharmacy.npi) {
          newItemPharmacy.PatientPharmacy[0].default = true;
        }
        return newItemPharmacy;
      });

      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *addPatientPreferred(pharmacy: IPharmacy) {
    const exist = find(this.pharmacies, (pharmacyExist) => {
      return pharmacyExist.ncpdpId === pharmacy.ncpdpId;
    });

    if (exist) return;
    if (!patientModel.currentPatient?.patientId) return;

    this.status.search = OActionStatus.Pending;
    this.errors.search = null;

    const addPharmacies = filter(this.common, (selectCommon: IPharmacy) => {
      return selectCommon.isSelected === true;
    });

    const ncpdpIds: string[] = [];

    forEach(addPharmacies, (addPharmacy: IPharmacy) => {
      ncpdpIds.push(addPharmacy.ncpdpId);
    });

    if (ncpdpIds.length === 0) {
      addPharmacies.push(pharmacy);
      ncpdpIds.push(pharmacy.ncpdpId);
    }

    try {
      yield lastValueFrom(setPreferred(patientModel.currentPatient.patientId, ncpdpIds).pipe(startWith({})));

      forEach(addPharmacies, (pharmacySelected) => {
        const existInner = find(this.pharmacies, (pharmacyExist) => {
          return pharmacyExist.ncpdpId === pharmacySelected.ncpdpId;
        });

        if (!existInner) {
          this.common = map(this.common, (commonItem) => {
            const newCommonItem = commonItem;
            if (isEqual(newCommonItem, pharmacySelected)) {
              newCommonItem.PatientPharmacy = [
                {
                  active: true,
                  default: false,
                  ncpdpId: pharmacySelected.ncpdpId,
                  patientId: patientModel?.currentPatient?.patientId ?? 0,
                },
              ];
            }

            return newCommonItem;
          });

          this.pharmacies.push({
            ...pharmacySelected,
            PatientPharmacy: [
              {
                active: true,
                default: false,
                ncpdpId: pharmacySelected.ncpdpId,
                patientId: patientModel?.currentPatient?.patientId ?? 0,
              },
            ],
          });
        }
      });

      this.notify = 'Patient preferred pharmacy added';
      this.status.search = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.search = OActionStatus.Rejected;
      this.errors.search = (error as AjaxError)?.response?.message ?? null;
    }
  }
}

const patientPharmacyModel = new PatientPharmacyModel();
export default patientPharmacyModel;
