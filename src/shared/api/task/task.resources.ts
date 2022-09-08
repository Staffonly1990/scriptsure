import { API_URL_SCRIPTSURE } from 'shared/config';
import request from '../request';
import { ITask } from './task.types';
import { IFilter } from '../message';

export const updateTask = (task: ITask) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/task`,
    method: 'PUT',
    body: task,
  });

export const getTasks = (taskFilter: IFilter) =>
  request<any>({
    url: `${API_URL_SCRIPTSURE}/v1.0/task/search`,
    method: 'POST',
    body: taskFilter,
  });
