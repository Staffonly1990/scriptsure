import { makeAutoObservable, observable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { AjaxResponse, AjaxError } from 'rxjs/ajax';
import { auditTime, startWith } from 'rxjs/operators';
import { assign, isString } from 'lodash';

import { OActionStatus, ActionStatus } from 'shared/lib/model';
import {
  fetchPatient,
  getPatientAllergy,
  createPatient,
  getPatientImage,
  sendPatientImage,
  removePatientImage,
  IPatient,
  IPatientAllergy,
  ISavedPatient,
  updatePatient,
} from 'shared/api/patient';
import { IEncounter } from 'shared/api/encounter';
import { IEligibility, createEligibility } from 'shared/api/eligibility';
import { getDoctorsPractice, IDoctorData } from 'shared/api/practice';
import { userModel } from 'features/user';
import { encounterModel } from 'features/encounter';

class PatientModel {
  public allergyPatientData: IPatientAllergy = {
    selectedLanguage: null,
    selectedRace: null,
    sexualOrientationDescription: '',
    addressLine1: '',
    city: '',
    gender: '',
    hippaComplianceDate: '',
    home: '',
    patientStatusId: 0,
    state: '',
    zip: '',
    dob: '',
    firstName: '',
    lastName: '',
    selectedAlternateRace: { descr: '', raceId: '' },
    patientId: 0,
    alternateRaceId: '',
    raceId: '',
    languageId: '',
  };

  public doctorsPractice: IDoctorData[] = [];

  public currentPatient: Nullable<IPatient> = null;

  public currentPatientImage: Nullable<string> = null;

  public currentEncounter: Nullable<IEncounter> = null;

  public eligibilityData: {} = {};

  public status: Record<'image' | 'getPatient' | 'addPatient' | 'getEligibility' | 'refreshPatientAllergies', ActionStatus> = {
    image: OActionStatus.Initial,
    getPatient: OActionStatus.Initial,
    addPatient: OActionStatus.Initial,
    getEligibility: OActionStatus.Initial,
    refreshPatientAllergies: OActionStatus.Initial,
  };

  public errors: Record<'image' | 'getPatient' | 'addPatient' | 'refreshPatientAllergies', Nullable<string>> = {
    image: null,
    getPatient: null,
    addPatient: null,
    refreshPatientAllergies: null,
  };

  constructor() {
    makeAutoObservable(
      this,
      {
        doctorsPractice: observable,
        currentPatient: observable.shallow,
        currentEncounter: observable.shallow,
      },
      { autoBind: true }
    );
  }

  resetPatientImage() {
    this.currentPatientImage = null;
  }

  *getPracticalDoctors(data: number) {
    try {
      const output: AjaxResponse<IDoctorData[]> = yield lastValueFrom(getDoctorsPractice(data).pipe(startWith({})));

      this.doctorsPractice = output.response;
    } catch {}
  }

  *createPatient(payload: IPatient) {
    this.status.addPatient = OActionStatus.Pending;
    try {
      const output: AjaxResponse<ISavedPatient> = yield lastValueFrom(createPatient(payload).pipe(auditTime(300), startWith({})));
      this.status.addPatient = OActionStatus.Fulfilled;
      this.currentPatient = output.response?.savedPatientObj ?? null;
    } catch (e: unknown) {
      this.status.addPatient = OActionStatus.Rejected;
    }
  }

  *updatePatient(payload: IPatientAllergy) {
    this.status.addPatient = OActionStatus.Pending;
    try {
      const output: AjaxResponse<{ patient: IPatientAllergy }> = yield lastValueFrom(updatePatient(payload).pipe(auditTime(300), startWith({})));

      this.currentPatient = {
        ...this.currentPatient,
        ...{ ...payload, ...(output.response?.patient ?? {}) },
      };
      console.log({ ...this.currentPatient });
      this.status.addPatient = OActionStatus.Fulfilled;
    } catch (e: unknown) {
      this.status.addPatient = OActionStatus.Rejected;
      this.errors.addPatient = (e as AjaxError).response.message;
    }
  }

  *createPatientAllergy(payload: IPatientAllergy) {
    try {
      const output: AjaxResponse<IPatientAllergy> = yield lastValueFrom(getPatientAllergy(payload).pipe(startWith({})));
      this.allergyPatientData = output.response;
    } catch {}
  }

  *createPatientEligibility(payload: IEligibility) {
    this.status.getEligibility = OActionStatus.Pending;
    try {
      const output: AjaxResponse<{}> = yield lastValueFrom(createEligibility(payload).pipe(auditTime(300), startWith([])));

      this.status.getEligibility = OActionStatus.Fulfilled;
      this.eligibilityData = output.response;
    } catch (e: unknown) {
      this.status.getEligibility = OActionStatus.Rejected;
    }
  }

  *getPatientImage(patientId: number) {
    this.status.image = OActionStatus.Pending;
    this.errors.image = null;
    let response: Nullable<string> = null;
    try {
      const output: AjaxResponse<Nullable<string>> = yield lastValueFrom(getPatientImage(patientId).pipe(auditTime(300), startWith(null)));
      this.status.image = OActionStatus.Fulfilled;
      if (isString(output.response) && output.response?.length > 2) {
        response = `data:image/png;base64,${output.response}`;
      }
    } catch (error: unknown) {
      this.status.image = OActionStatus.Rejected;
      this.errors.image = (error as AjaxError)?.response?.message ?? null;
    }
    this.currentPatientImage = response;
    return response;
  }

  *sendPatientImage(payload: FormData) {
    this.status.image = OActionStatus.Pending;
    this.errors.image = null;
    try {
      yield lastValueFrom(sendPatientImage(payload).pipe(auditTime(300), startWith({})));
      this.status.image = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.image = OActionStatus.Rejected;
      this.errors.image = (error as AjaxError)?.response?.message ?? null;
    }
  }

  *removePatientImage(patientId: number) {
    this.status.image = OActionStatus.Pending;
    this.errors.image = null;
    try {
      yield lastValueFrom(removePatientImage(patientId).pipe(auditTime(300), startWith(null)));
      this.status.image = OActionStatus.Fulfilled;
      this.resetPatientImage();
    } catch (error: unknown) {
      this.status.image = OActionStatus.Rejected;
      this.errors.image = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Get specific patient based on ScriptSure internal patient identification number
   * @param {number} patientId - Patient identification number
   * @param {boolean} skipDH - Flag to skip running Eligibility and Drug History Download on patient load
   *  (Used mostly in embedded situations).
   * @param {boolean} skipMessages - Flag to skip retreiving message count for the doctor
   *  (Used mostly in embedded situations).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  *getPatient(patientId: number, skipDH = false, skipMessages = false, showConfirmationOverride = false) {
    if (!patientId) return;

    this.status.getPatient = OActionStatus.Pending;
    this.errors.getPatient = null;
    try {
      const output: AjaxResponse<IPatient> = yield lastValueFrom(fetchPatient(patientId).pipe(startWith({})));
      this.status.getPatient = OActionStatus.Fulfilled;
      this.currentPatient = { ...(output.response ?? null) };

      if (this.currentPatient) {
        // TODO
        // this.refreshPatientCurrentMedications();
        this.refreshPatientAllergies();

        // Grabs the encounter if one exists. It DOES NOT create one
        // automatically on load of patient. Encounters are only created
        // when they are needed. For example, when a prescription is saved
        // at that moment a new encounterId is created. Otherwise empty encounters
        // are created and it can have an impact further down stream with MU
        // calculations or just viewing the encounter page in ScriptSure. The page
        // shows a blank encounter.
        if (this.currentPatient.patientId) this.getCurrentEncounter(this.currentPatient.patientId, false, false);
        //
        // if (skipDH === false && userModel.data?.currentPrescriber?.npi?.length > 0) {
        //   this.requestEligibilityDrugHistory(patientId, this.currentPatient, showConfirmationOverride);
        // }
        //
        // if (skipMessages === false) {
        //   // Get the message count
        //   this._messageStore.getMessagePendingCount(
        //     userModel.data?.currentPrescriber?.id,
        //     userModel.data?.currentPractice?.id
        //   );
        // }
        //
        // // Following checks to ensure that the user wants to automatically
        // // change the practice if the patient is attached to a different
        // // one than the current one in the UserService.user.currentPractice.
        // // If so, then a call is made to switch the current practice in cache.
        // // const autoSelect: boolean = Boolean(
        // //   Number(
        // //     this._settingsModel.get(
        // //       'AUTO_SELECT_PRACTICE_ON_PATIENT_SELECT',
        // //       this._settingsModel.SettingTypeEnum.USER
        // //     )
        // //   )
        // // );
        // // const autoSelect = true;
        // if (autoSelect === true) {
        //   if (this.currentPatient?.practiceId !== userModel.data?.currentPractice?.id) {
        //     // Sets the practice and the current default user
        //     this.setPracticeUser(this.currentPatient.practiceId);
        //   }
        // }
      }
    } catch (error: unknown) {
      this.currentPatient = null;
      this.status.getPatient = OActionStatus.Rejected;
      this.errors.getPatient = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Gets the patient allergies to refresh the cache to allow for future Drug-Allergy checks
   */
  *refreshPatientAllergies() {
    if (!this.currentPatient) return;

    this.status.refreshPatientAllergies = OActionStatus.Pending;
    this.errors.refreshPatientAllergies = null;
    try {
      const output: AjaxResponse<IPatientAllergy> = yield lastValueFrom(getPatientAllergy(this.currentPatient).pipe(startWith({})));
      const patient = { ...(output.response ?? null) };

      if (patient) {
        const { allergy, hicRoot, hicSeqn, damAlrgnGrp, damAlrgnXsense } = patient;
        this.currentPatient = assign(this.currentPatient, { allergy, hicRoot, hicSeqn, damAlrgnGrp, damAlrgnXsense });
      }

      this.status.refreshPatientAllergies = OActionStatus.Fulfilled;
    } catch (error: unknown) {
      this.status.refreshPatientAllergies = OActionStatus.Rejected;
      this.errors.refreshPatientAllergies = (error as AjaxError)?.response?.message ?? null;
    }
  }

  /**
   * Get Current Encounter for given patient. Same function call appears in the
   * EncounterService. The reason for this is that the PatientService calls the
   * EncounterService to get an existing encounter for the patient or it creates
   * a new one. Once the response comes back it is cached in the PatientService
   * on the currentEncounter and the encounterId within the currentPatient
   * @param {number}  patientId   The patientId for the patient in question.
   * @param {boolean} createIfNoneExists   Create the encounter if it doesn't exist.  This defaults to False
   * @param {boolean} ignoreCache     Ignore the cache to force a new request
   * @param {boolean} doNotUpdateCache  Prevents the currentPatient from being updated. Note: It is possib el to have
   * a patient selected and then go to the messaging page and approve a script. This prevents the current patient from
   * having the encounter updated in patient.service. If this were not done new transactions for the current patient
   * would be saved to the wrong encounter
   */
  *getCurrentEncounter(patientId?: number, createIfNoneExists = false, ignoreCache = false, doNotUpdateCache = false) {
    yield encounterModel?.getCurrentEncounter(patientId, createIfNoneExists, ignoreCache);
    const encounter = encounterModel?.currentEncounter ?? null;
    // It is possible for the currentPatient to be NULL because
    // the user may not have a patient in memory. Also this process
    // is called from the message page to respond to refill/change so
    // that process is only concerned with getting a new encounter
    // for the requested patient NOT changing any singleton cache
    if (this.currentPatient && !doNotUpdateCache) {
      if (encounter && Object.keys(encounter).length > 0) {
        this.currentEncounter = encounter;
        this.currentPatient.encounterId = encounter.encounterId;
      } else {
        this.currentEncounter = null;
        this.currentPatient.encounterId = undefined;
      }
    }
  }
}

const patientModel = new PatientModel();
export default patientModel;
