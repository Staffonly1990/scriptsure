import { makeAutoObservable, computed } from 'mobx';

class MergePatients {
  constructor() {
    makeAutoObservable(this);
  }
}

const mergePatients = new MergePatients();
export default mergePatients;
