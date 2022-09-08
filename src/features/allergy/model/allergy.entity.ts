import { observable } from 'mobx'; // flowResult
import { each } from 'lodash';

import { IAllergy, IAllergyClassification } from 'shared/api/allergy';

const allergyEntity = observable.object({
  allergy: null as Nullable<Partial<IAllergy>>,
  classification: null as Nullable<IAllergyClassification>,
  confirmed: false as boolean,
  editing: false as boolean,
  adding: false as boolean,
  mods: [] as Function[],
  add(allergy: Partial<IAllergy>, classification: IAllergyClassification) {
    this.reset();
    this.allergy = {
      patientId: undefined,
      allergyType: classification?.allergyType,
      allergyId: classification?.allergyId,
      ROUTED_MED_ID: classification?.ROUTED_MED_ID,
      reactionId: undefined,
      severityCode: undefined,
      adverseEventCode: undefined,
      comment: undefined,
      onsetDate: undefined,
      endDate: undefined,
      name: classification?.Descr,
      archive: 0,
      ...allergy,
    } as IAllergy;
    this.classification = { ...classification };
    this.editing = true;
    this.adding = true;
  },
  edit(allergy: IAllergy) {
    this.reset();
    this.allergy = { ...allergy };
    this.editing = true;
  },
  confirm(allergy: IAllergy) {
    this.reset();
    this.allergy = { ...allergy };
    this.confirmed = true;
  },
  dismiss() {
    this.confirmed = false;
    this.editing = false;
    this.revoke();
  },
  toggle(allergy?: IAllergy) {
    if (allergy) {
      this.allergy = { ...allergy };
      this.revoke();
    }

    if (this.allergy?.archive === 1) {
      this.mods.push(() => {
        this.allergy.archive = 0;
      });
    } else if (this.allergy?.archive === 0) {
      this.mods.push(() => {
        this.allergy.archive = 1;
        if (!this.allergy?.endDate) this.allergy.endDate = new Date();
      });
    }

    const toggledAllergy = { ...this.allergy } as Nullable<IAllergy>;
    if (toggledAllergy?.archive === 1) {
      toggledAllergy.archive = 0;
    } else if (toggledAllergy?.archive === 0) {
      toggledAllergy.archive = 1;
      if (!toggledAllergy?.endDate) toggledAllergy.endDate = new Date();
    }
    return toggledAllergy;
  },
  invoke() {
    each(this.mods, (mod) => {
      mod.call(this);
    });
    this.revoke();
  },
  revoke() {
    this.mods = [];
  },
  reset() {
    this.allergy = null;
    this.classification = null;
    this.confirmed = false;
    this.editing = false;
    this.adding = false;
    this.mods = [];
  },
});

export default allergyEntity;
