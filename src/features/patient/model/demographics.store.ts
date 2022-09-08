import { computed, makeAutoObservable, observable, toJS, reaction } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { computedFn } from 'mobx-utils';
import { find, forEach, isNumber } from 'lodash';

import { getPreferredCommunications, getEthnicity, getMaritalStatuses, getStatus } from 'shared/api/patient.demographics';
import { getUserDetailFull } from 'shared/api/user';
import { getDemographicsRelation, IPatientAllergy } from 'shared/api/patient';
import { getPracticeUsers } from 'shared/api/practice';
import { patientModel } from './index';

class DemographicStore {
  public _currentPatient: IPatientAllergy = patientModel.currentPatient as IPatientAllergy;

  public patientDoctor;

  public patientPractice;

  public preferredCommunicationOptions;

  public patientStatusOptions;

  public patientPreferredCommunication;

  public patientEthnicity;

  public patientStatus;

  public ethnicityOptions;

  public patientMaritalStatus;

  public maritalStatusOptions;

  public nextOfKinRelationOptions;

  public patientKinRelation;

  constructor() {
    makeAutoObservable(this, {
      _currentPatient: observable,
      patientDoctor: observable,
      preferredCommunicationOptions: observable,
      patientMaritalStatus: observable,
      patientPreferredCommunication: observable,
      ethnicityOptions: observable,
      patientEthnicity: observable,
      patientStatus: observable,
      maritalStatusOptions: observable,
      nextOfKinRelationOptions: observable,
      patientStatusOptions: observable,
      patientKinRelation: observable,
      sexualOrientations: computed,
      genderIdentities: computed,
    });

    reaction(
      () => patientModel.currentPatient?.patientId,
      () => {
        this.updateCurrentPatient();
        this.load();
      }
    );
  }

  updateCurrentPatient() {
    this._currentPatient = patientModel.currentPatient as IPatientAllergy;
  }

  load() {
    this.fetchPreferredCommunicationOptions();
    this.fetchEthnicity();
    this.fetchMaritalStatuses();
    this.fetchDoctor();
    this.fetchStatus();
    this.fetchNextOfKinRelations();
    this.fetchPractice();
  }

  *fetchNextOfKinRelations() {
    yield lastValueFrom(getDemographicsRelation()).then(({ response }) => {
      this.nextOfKinRelationOptions = response;
      forEach(this.nextOfKinRelationOptions, (options) => {
        if (this._currentPatient?.nextOfKinPatientId === options.nextOfKinRelationId) {
          this.patientKinRelation = options.descr;
        }
      });
    });
  }

  *fetchPreferredCommunicationOptions() {
    yield lastValueFrom(getPreferredCommunications()).then(({ response }) => {
      this.preferredCommunicationOptions = response;
      forEach(this.preferredCommunicationOptions, (options) => {
        if (this._currentPatient?.preferredCommunicationId === options.preferredCommunicationId) {
          this.patientPreferredCommunication = options.descr;
        }
      });
    });
  }

  *fetchPractice() {
    if (this._currentPatient?.practiceId) {
      yield lastValueFrom(getPracticeUsers(this._currentPatient.practiceId)).then(({ response }) => {
        this.patientPractice = response;
      });
    }
  }

  *fetchMaritalStatuses() {
    yield lastValueFrom(getMaritalStatuses()).then(({ response }) => {
      this.maritalStatusOptions = response;
      forEach(this.maritalStatusOptions, (options) => {
        if (this._currentPatient?.maritalStatusId === options.maritalStatusId) {
          this.patientMaritalStatus = options.descr;
        }
      });
    });
  }

  *fetchEthnicity() {
    yield lastValueFrom(getEthnicity()).then(({ response }) => {
      this.ethnicityOptions = response;
      forEach(this.ethnicityOptions, (options) => {
        if (this._currentPatient?.ethnicityId === options.ethnicityId) {
          this.patientEthnicity = options.descr;
        }
      });
    });
  }

  *fetchDoctor() {
    if (isNumber(this._currentPatient?.doctorId) && this._currentPatient?.doctorId >= 1) {
      yield lastValueFrom(getUserDetailFull(this._currentPatient?.doctorId)).then(({ response }) => {
        if (response.prescriber) {
          this.patientDoctor = response;
        }
      });
    }
  }

  *fetchStatus() {
    yield lastValueFrom(getStatus()).then(({ response }) => {
      this.patientStatusOptions = response;
      forEach(this.patientStatusOptions, (options) => {
        if (this._currentPatient?.patientStatusId === options.patientStatusId) {
          this.patientStatus = options.descr;
        }
      });
    });
  }

  getRelation = computedFn((relId) => {
    console.log('==========>relId', relId);
    console.log('==========>this.nextOfKinRelationOptions', toJS(this.nextOfKinRelationOptions));
    if (relId && relId !== 0) {
      let description;
      forEach(this.nextOfKinRelationOptions, (relationship) => {
        if (relationship.relationId === relId) {
          description = relationship.descr;
        }
      });
      return description;
    }
    return '';
  });

  getGenderIdentity = computedFn((code) => {
    if (code) {
      const description = find(this.genderIdentities, (gender) => {
        return gender.code === code;
      });
      if (!description) {
        return 'user.gender.identity.unknown';
      }

      return description.name;
    }
    return '';
  });

  getSexualOrientation = computedFn((code) => {
    if (code) {
      const description = find(this.sexualOrientations, (sex) => {
        return sex.code === code;
      });
      if (!description) {
        return 'user.gender.identity.unknown';
      }
      return description.name;
    }

    return '';
  });

  getEthnicity = computedFn((ethId) => {
    if (ethId && ethId !== 0) {
      let description;
      forEach(this.ethnicityOptions, (ethnicity) => {
        if (ethnicity.ethnicityId === ethId) {
          description = ethnicity.descr;
        }
      });
      return description;
    }
    return '';
  });

  get sexualOrientations() {
    return [
      {
        code: '38628009',
        name: 'user.gender.identity.lesbianGay',
      },
      {
        code: '20430005',
        name: 'user.gender.identity.straight',
      },
      {
        code: '42035005',
        name: 'user.gender.identity.bisexual',
      },
      {
        code: 'OTH',
        name: 'user.gender.identity.oth',
      },
      {
        code: 'UNK',
        name: 'user.gender.identity.unknown',
      },
      {
        code: 'ASKU',
        name: 'user.gender.identity.asku',
      },
    ];
  }

  get genderIdentities() {
    return [
      {
        code: '446151000124109',
        name: 'user.gender.identity.male',
      },
      {
        code: '446141000124107',
        name: 'user.gender.identity.female',
      },
      {
        code: '407377005',
        name: 'user.gender.identity.ftm',
      },
      {
        code: '407376001',
        name: 'user.gender.identity.mtf',
      },
      {
        code: '446131000124102',
        name: 'user.gender.identity.genderqueer',
      },
      {
        code: 'OTH',
        name: 'user.gender.identity.oth',
      },
      {
        code: 'ASKU',
        name: 'user.gender.identity.asku',
      },
    ];
  }
}

const demographicStore = new DemographicStore();
export default demographicStore;
