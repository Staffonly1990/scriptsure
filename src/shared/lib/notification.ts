import { of, delay as delayTime, Subject } from 'rxjs';
import { mergeMap, groupBy } from 'rxjs/operators';
import { pick } from 'lodash';

export const ONotification = {
  Info: 'info',
  Error: 'error',
  Warning: 'warn',
  Success: 'success',
} as const;

export type Notification = typeof ONotification[keyof typeof ONotification];

export interface INotificationPayload {
  title?: string;
  description?: string;
  closable?: boolean;
}

const source$ = new Subject();
const notifications$ = source$.pipe(
  groupBy((msg: any) => msg.type),
  mergeMap((group$) => group$.pipe(mergeMap((msg: any) => of(pick(msg, ['type', 'payload'])).pipe(delayTime(msg?.delay ?? 0)))))
);

function subscribe(...args: Parameters<typeof notifications$.subscribe>) {
  return notifications$.subscribe.call(notifications$, ...args);
}

function open(type: Notification, payload: INotificationPayload, delay = 0) {
  return source$.next({ type, payload, delay });
}

function info(payload: INotificationPayload, delay?: number | undefined) {
  return open(ONotification.Info, payload, delay);
}

function error(payload: INotificationPayload, delay?: number | undefined) {
  return open(ONotification.Error, payload, delay);
}

function warning(payload: INotificationPayload, delay?: number | undefined) {
  return open(ONotification.Warning, payload, delay);
}

function success(payload: INotificationPayload, delay?: number | undefined) {
  return open(ONotification.Success, payload, delay);
}

export { subscribe, open, info, error, warning, success };
