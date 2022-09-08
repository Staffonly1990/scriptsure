import { makeAutoObservable } from 'mobx';
import { lastValueFrom } from 'rxjs';
import { getOrdersets, IOrderset } from 'shared/api/orderset';
import { AjaxResponse } from 'rxjs/ajax';
import { IPharmacy } from 'shared/api/patient';
import { patientPharmacyModel } from 'features/patient';
import { getComments, IComment } from 'shared/api/comment';

class OrderSet {
  orderSets: IOrderset[] = [];

  selectedOrderSet: Nullable<IOrderset> = null;

  commentsOne: IComment[] = [];

  insurances: IComment[] = [];

  commentsThree: IComment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  *getOrderSets(organizationId?: number) {
    if (organizationId) {
      try {
        const output: AjaxResponse<IOrderset[]> = yield lastValueFrom(getOrdersets(organizationId));
        this.orderSets = output.response ?? [];
      } catch (error: unknown) {
        this.orderSets = [];
      }
    }
  }

  *getComments(type: number, practiceId?: number) {
    if (practiceId) {
      try {
        const output: AjaxResponse<IComment[]> = yield lastValueFrom(getComments(practiceId, type));
        console.log(output.response);
        switch (type) {
          case 1:
            this.commentsOne = output.response ?? [];
            break;
          case 2:
            this.insurances = output.response ?? [];
            break;
          case 3:
            this.commentsThree = output.response ?? [];
            break;
          default:
            break;
        }
      } catch (error: unknown) {
        switch (type) {
          case 1:
            this.commentsOne = [];
            break;
          case 2:
            this.insurances = [];
            break;
          case 3:
            this.commentsThree = [];
            break;
          default:
            break;
        }
      }
    }
  }

  changeSelectedOrderSet(selectedOrder: Nullable<IOrderset>, pharmacy: Nullable<IPharmacy>) {
    if (selectedOrder && pharmacy) {
      this.selectedOrderSet = {
        ...selectedOrder,
        OrdersetSequences: selectedOrder.OrdersetSequences.map((sequence) => {
          return {
            ...sequence,
            Orders: sequence.Orders?.map((order) => {
              if (!order.pharmacy) {
                return {
                  ...order,
                  pharmacy: pharmacy.businessName,
                  pharmacyId: pharmacy.ncpdpId,
                };
              }
              return { ...order };
            }),
          };
        }),
      };
    } else if (selectedOrder && !pharmacy) {
      this.selectedOrderSet = selectedOrder;
    } else if (!selectedOrder && pharmacy && this.selectedOrderSet) {
      this.selectedOrderSet = {
        ...this.selectedOrderSet,
        OrdersetSequences: this.selectedOrderSet.OrdersetSequences.map((sequence) => {
          return {
            ...sequence,
            Orders: sequence.Orders?.map((order) => {
              return {
                ...order,
                pharmacy: pharmacy.businessName,
                pharmacyId: pharmacy.ncpdpId,
              };
            }),
          };
        }),
      };
    } else {
      this.selectedOrderSet = null;
    }
  }
}

const orderSet = new OrderSet();
export default orderSet;
