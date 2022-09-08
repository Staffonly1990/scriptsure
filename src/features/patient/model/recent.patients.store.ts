import { uniqBy } from 'lodash';
import { makeAutoObservable, computed } from 'mobx';
import localStorage from 'mobx-localstorage';

import { routes } from 'shared/config';

class RecentPatientsStore {
  constructor() {
    makeAutoObservable(this, { list: computed });
  }

  // Get the list of recent patients from localStorage
  get list() {
    if (!localStorage.getItem('recents')) return [];
    return localStorage.getItem('recents') as { patient: string; href: string }[];
  }

  // Add patient to the list of recent patients in localStorage
  public add(data: { firstName?: string; nextOfKinName?: string; lastName?: string; id: string | number }) {
    if (data.id) {
      const patient = `${data.firstName} ${data.nextOfKinName ? data.nextOfKinName : ''} 
    ${data.lastName} - ${data.id}`;
      const href = routes.chart.path(data.id);

      let recents = [...this.list];
      if (recents.length > 9) {
        recents.pop();
      }
      recents.unshift({ patient, href });
      recents = uniqBy(recents, 'patient');

      localStorage.setItem('recents', recents);
    }
  }
}

const recentPatientsStore = new RecentPatientsStore();
export default recentPatientsStore;
