export interface ITask {
  taskId?: number;
  practiceId?: number;
  patientId?: number;
  lastName?: string;
  firstName?: string;
  taskStatus?: string;
  taskType?: string;
  associatedId?: string;
  externalId?: string;
  phone?: string;
  title?: string;
  note?: string;
  userId?: number;
  userName?: string;
  TaskAttachment?: ITaskAttachment[];
}

export interface ITaskAttachment {
  id?: number;
  taskId?: number;
  fileName?: string;
  fileLocation?: string;
}
