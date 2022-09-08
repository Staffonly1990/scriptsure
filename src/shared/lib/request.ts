import type { Observable, OperatorFunction } from 'rxjs';
import type { AjaxConfig, AjaxResponse, AjaxError } from 'rxjs/ajax';
import { ajax } from 'rxjs/ajax';
import { assign, reduce, filter, negate, isNil } from 'lodash';

export class OperatorManager {
  private _operations: Array<OperatorFunction<any, any> | undefined> = [];

  /**
   * Add a new operation to the stack
   */
  use(operation) {
    this._operations.push(operation);
    return this._operations.length - 1;
  }

  /**
   * Remove an operation from the stack
   */
  eject(id) {
    if (this._operations[id]) this._operations[id] = undefined;
  }

  /** Run each an operation */
  exec<T = any>(target: Observable<T>) {
    return reduce(
      filter(this._operations, negate(isNil)) as OperatorFunction<any, any>[],
      (acc, operation: OperatorFunction<any, any>) => acc.pipe(operation),
      target
    );
  }
}

export interface IReactiveRequest {
  <T>(config: AjaxConfig): Observable<AjaxResponse<T>>;
  defaultConfig: Partial<AjaxConfig>;
  operations: OperatorManager;
}

export const requestFactory = () => {
  const that = <T>(config) => {
    const { defaultConfig, operations } = that as IReactiveRequest;
    const ajax$ = operations.exec(ajax<T>(assign({}, defaultConfig, config)));
    return ajax$;
  };

  Object.defineProperty(that, 'defaultConfig', {
    value: {},
    writable: true,
  });

  Object.defineProperty(that, 'operations', {
    value: new OperatorManager(),
    writable: false,
  });

  return that as IReactiveRequest;
};
