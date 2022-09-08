import { makeAutoObservable, observable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import {
  IAddendum,
  getAllNotes,
  getNote,
  INote,
  pickList,
  getCurrentMedications,
  IEncounterResult,
  getCurrentEncounter,
  getEncounterById,
  getPatientAllergies,
  IPickItem,
  newPickList,
  getNoteСheckout,
  deleteNoteCheckout,
  createAddendum,
  getAddendum,
  archiveNote,
  editNote,
  deleteNote,
} from 'shared/api/soap';
import { groupBy, each } from 'lodash';

enum Actions {
  'Current Notes' = 0,
  'Archived Notes' = 1,
  'Deleted' = 2,
}

class ChartNotes {
  notes: INote[] = [];

  parentNotes: INote[][] = [];

  addendums: IAddendum[] = [];

  selectedNote: Nullable<INote> = null;

  encounterResult: Nullable<IEncounterResult> = null;

  selectedAddendum: Nullable<IAddendum> = null;

  currentMedications: string[] = [];

  orders: string[] = [];

  allergies: string[] = [];

  pickLists: IPickItem[] = [];

  showSearch = false;

  searchValue = '';

  constructor() {
    makeAutoObservable(this, {
      searchValue: observable,
      showSearch: observable,
    });
  }

  setShowSearch(value) {
    this.showSearch = value;
  }

  setSearchValue(value) {
    this.searchValue = value;
  }

  *archiveNote(soapId?: number) {
    if (soapId) {
      yield lastValueFrom(archiveNote(soapId))
        .then((response) => {
          console.log(response.response);
          this.selectedNote = null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *deleteNote(soapId?: number) {
    if (soapId) {
      yield lastValueFrom(deleteNote(soapId))
        .then((response) => {
          console.log(response.response);
          this.selectedNote = null;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *getNotes(action: string, patientId?: number | null) {
    /*
    Current = 0;
    Archived = 1;
    Deleted = 2;
    All = undefined
    */
    this.notes = [];
    this.parentNotes = [];
    this.addendums = [];
    if (patientId) {
      yield lastValueFrom(getAllNotes(patientId))
        .then((response) => {
          if (Actions[action] || Actions[action] === 0) {
            this.group(response.response.notes.filter((value) => value.archive === Actions[action]));
          } else {
            this.group(response.response.notes);
          }
          this.addendums = response.response.addendums;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public group(notesRes?: INote[]) {
    if (notesRes) {
      const groups = groupBy(notesRes, 'parentSoapId');
      each(groups, (value, key) => {
        if (key === 'null') {
          this.notes = value.filter((obj) => !Object.keys(groups).includes(obj.soapId!.toString()));
        } else {
          const parent = notesRes.filter((obj) => obj.soapId?.toString() === key);
          this.parentNotes.push([...parent, ...value]);
        }
      });
    }
  }

  *createAddendum(payload: IAddendum) {
    if (payload.comment) {
      yield lastValueFrom(createAddendum(payload))
        .then((response) => {
          console.log(response.response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *getNoteСheckout(soapId: number) {
    yield lastValueFrom(getNoteСheckout(soapId))
      .then((response) => {
        console.log(response.response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  *deleteNoteCheckout(soapId: number, overwrite: boolean) {
    yield lastValueFrom(deleteNoteCheckout(soapId, overwrite))
      .then((response) => {
        console.log(response.response);
        this.selectedNote = null;
        this.selectedAddendum = null;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  *getNote(soapId?: number) {
    this.selectedAddendum = null;
    if (soapId) {
      yield lastValueFrom(getNote(soapId))
        .then((response) => {
          this.selectedNote = response.response;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *getAddendum(addendumId?: number) {
    this.selectedNote = null;
    if (addendumId) {
      yield lastValueFrom(getAddendum(addendumId))
        .then((response) => {
          this.selectedAddendum = response.response;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *pickList() {
    yield lastValueFrom(pickList())
      .then((response) => {
        this.pickLists = [...response.response];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  *newPickList(textV?: string, titleV?: string, typeV?: string, userIdV?: number) {
    if (textV && titleV && typeV && userIdV) {
      yield lastValueFrom(
        newPickList({
          text: textV,
          title: titleV,
          type: typeV,
          userId: userIdV,
        })
      )
        .then((response) => {
          this.pickLists = [...response.response];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *editNote(note: INote, method: string) {
    if (note.encounterId) {
      yield lastValueFrom(editNote(note, method))
        .then((response) => {
          console.log(response.response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *getCurrentEncounter(patientId?: number | null) {
    if (patientId) {
      yield lastValueFrom(getCurrentEncounter(patientId, true))
        .then((response) => {
          this.encounterResult = response.response;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *addCurrentMeds(show: boolean, patientId?: number | null) {
    this.currentMedications = [];
    if (patientId && show) {
      yield lastValueFrom(getCurrentMedications(patientId))
        .then((response) => {
          response.response.forEach((value) => (value.drugName ? this.currentMedications.push(value.drugName) : null));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *addOrders(show: boolean, encounterId?: number) {
    this.orders = [];
    if (encounterId && show) {
      yield lastValueFrom(getEncounterById(encounterId))
        .then((response) => {
          if (response.response.Prescriptions && response.response.Prescriptions.length > 0) {
            response.response.Prescriptions?.forEach((prescription) => {
              prescription.PrescriptionDrugs?.forEach((drug) => this.orders.push(drug.drugName!));
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  *addAllergies(show: boolean, patientId?: number | null) {
    this.allergies = [];
    if (patientId && show) {
      yield lastValueFrom(getPatientAllergies(patientId))
        .then((response) => {
          if (response.response && response.response.length > 0) {
            response.response.forEach((allergy) => {
              this.allergies.push(allergy.name!);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

const chartNotes = new ChartNotes();
export default chartNotes;
