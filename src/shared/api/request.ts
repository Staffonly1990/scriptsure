import type { AjaxError } from 'rxjs/ajax';
import { tap } from 'rxjs/operators';

import { requestFactory } from 'shared/lib/request';
import { API_KEY } from 'shared/config';

const request = requestFactory();
request.defaultConfig = {
  headers: { apikey: API_KEY },
  async: true,
  crossDomain: true,
  withCredentials: true,
  responseType: 'json' as XMLHttpRequestResponseType,
};
request.operations.use(tap({ error: (error: unknown) => console.error((error as AjaxError)?.message) }));

export default request;
