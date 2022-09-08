import { makeAutoObservable } from 'mobx';
import {
  getAllergies,
  getDrugList,
  getFavorites,
  getInteractions,
  ICurrentMedication,
  IDrugABC,
  IFavoritesDrug,
  ISearchDrug,
  refreshPatientCurrentMedications,
  search,
} from 'shared/api/drug';
import { lastValueFrom } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { IAllergyDrugcheck, IInteractionAllergy, IInteractionDrugcheck } from 'shared/api/allergy';
import { find, forEach } from 'lodash';
import { getCompounds, ICompoundObject, ICompound } from 'shared/api/compound';
import { getOrdersets, IOrderset } from 'shared/api/orderset';

export interface IAllergies {
  hicRoot?: number[];
  hicSeqn?: number[];
  damAlrgnGrp?: number[];
  damAlrgnXsense?: number[];
}

class DrugSearch {
  searchDrags: {
    drugs?: ISearchDrug[];
    indications?: {
      DXID: number;
      MED_ROUTED_MED_ID_DESC: string;
    }[];
  } = {};

  drugABCList: IDrugABC[] = [];

  favoritesDrugs: IFavoritesDrug[] = [];

  currentMedications: ICurrentMedication[] = [];

  interactionAllergy: IInteractionAllergy = { allergies: [], interactions: [] };

  compounds: ICompoundObject[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setAllergyInteractions(category: string) {
    let drugs: any[] = [];

    if (category === 'F') {
      drugs = this.favoritesDrugs;
    }

    if (
      category === 'B' ||
      category === 'A' ||
      category === 'C' ||
      category === 'D' ||
      category === 'E' ||
      category === 'G' ||
      category === 'K+' ||
      category === 'O' ||
      category === 'P' ||
      category === 'SD' ||
      category === 'PSY' ||
      category === 'Z'
    ) {
      drugs = this.drugABCList;
    }

    if (category === '') {
      drugs = this.searchDrags.drugs ?? [];
    }

    forEach(this.interactionAllergy.interactions, (interaction) => {
      const interactedDrug = find(drugs, (drug) => {
        return drug?.ROUTED_MED_ID === interaction?.ROUTED_MED_ID;
      });
      if (interactedDrug) {
        interactedDrug.interaction = interaction;
      }
    });

    forEach(this.interactionAllergy.allergies, (allergy) => {
      const allergyDrug = find(drugs, (drug) => {
        return drug?.ROUTED_MED_ID === allergy?.detail?.ROUTED_MED_ID;
      });
      if (allergyDrug) {
        if (allergyDrug.allergy) {
          // There is a chance for duplicates. This will ensure that
          // the same comment is not printed twice
          if (allergyDrug.allergy.title.indexOf(allergy.title) < 0) {
            allergyDrug.allergy.title += '</br>';
            allergyDrug.allergy.title += allergy.title;
          }
        } else {
          allergyDrug.allergy = allergy;
        }
      }
    });

    if (category === 'F') {
      this.favoritesDrugs = drugs;
    }

    if (
      category === 'B' ||
      category === 'A' ||
      category === 'C' ||
      category === 'D' ||
      category === 'E' ||
      category === 'G' ||
      category === 'K+' ||
      category === 'O' ||
      category === 'P' ||
      category === 'SD' ||
      category === 'PSY' ||
      category === 'Z'
    ) {
      this.drugABCList = drugs;
    }

    if (category === '') {
      this.searchDrags.drugs = drugs;
    }

    drugs = [];
  }

  *search(payload: {
    searchTerm?: string;
    searchMedication?: boolean;
    searchIndication?: boolean;
    searchOtc?: boolean;
    searchSupply?: boolean;
    searchStatus?: number;
    searchBrand?: boolean;
    searchGeneric?: boolean;
  }) {
    try {
      const output: AjaxResponse<{
        drugs?: ISearchDrug[];
        indications?: { DXID: number; MED_ROUTED_MED_ID_DESC: string }[];
      }> = yield lastValueFrom(
        search(
          payload.searchTerm,
          payload.searchMedication,
          payload.searchIndication,
          payload.searchOtc,
          payload.searchSupply,
          payload.searchStatus,
          payload.searchBrand,
          payload.searchGeneric
        )
      );
      this.searchDrags = { ...output.response };
    } catch (error: unknown) {
      this.searchDrags = {};
    }
  }

  *getCompounds(requiredDrug: boolean, organizationId?: number) {
    if (organizationId) {
      try {
        const output: AjaxResponse<ICompoundObject[]> = yield lastValueFrom(getCompounds(organizationId, requiredDrug));
        this.compounds = output.response ?? [];
      } catch (error: unknown) {
        this.compounds = [];
      }
    }
  }

  *getInteractionsAllergies(listDrugs: IFavoritesDrug[] | IDrugABC[] | ISearchDrug[], allergies?: IAllergies, currentDrugs?: ICurrentMedication[]) {
    const drugs = listDrugs.map((drug) => {
      return { routedMedId: drug.ROUTED_MED_ID };
    });

    if (currentDrugs && currentDrugs.length > 0 && drugs && drugs.length > 0) {
      try {
        const output: AjaxResponse<IInteractionDrugcheck[]> = yield lastValueFrom(
          getInteractions({
            listRoutedMedIds: drugs,
            currentRoutedMedIds: currentDrugs.map((drug) => {
              return { routedMedId: drug.ROUTED_MED_ID };
            }),
          })
        );
        this.interactionAllergy.interactions = output.response ?? [];
      } catch (error: unknown) {
        this.interactionAllergy.interactions = [];
      }
    }

    if (allergies && drugs && drugs.length > 0) {
      try {
        const output: AjaxResponse<IAllergyDrugcheck[]> = yield lastValueFrom(
          getAllergies({
            listRoutedMedIds: drugs,
            hicRoot: allergies.hicRoot,
            hicSeqn: allergies.hicSeqn,
            damAlrgnGrp: allergies.damAlrgnGrp,
            damAlrgnXsense: allergies.damAlrgnXsense,
          })
        );
        this.interactionAllergy.allergies = output.response ?? [];
      } catch (error: unknown) {
        this.interactionAllergy.allergies = [];
      }
    }
  }

  *getFavorites() {
    try {
      const output: AjaxResponse<IFavoritesDrug[]> = yield lastValueFrom(getFavorites());
      this.favoritesDrugs = output.response ?? [];
    } catch (error: unknown) {
      this.favoritesDrugs = [];
    }
  }

  *getDrugList(category: string) {
    try {
      const output: AjaxResponse<IDrugABC[]> = yield lastValueFrom(getDrugList(category));
      this.drugABCList = output.response ?? [];
    } catch (error: unknown) {
      this.drugABCList = [];
    }
  }

  *getCurrentMedications(ignoreDays: number, patientId?: number | null) {
    if (patientId) {
      try {
        const output: AjaxResponse<ICurrentMedication[]> = yield lastValueFrom(refreshPatientCurrentMedications(patientId, ignoreDays));
        this.currentMedications = output.response ?? [];
      } catch (error: unknown) {
        this.currentMedications = [];
      }
    }
  }
}

const drugSearch = new DrugSearch();
export default drugSearch;
