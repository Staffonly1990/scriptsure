// #region Mobx\Model
export const OActionStatus = {
  Initial: 'initial',
  Pending: 'pending',
  Fulfilled: 'fulfilled',
  Rejected: 'rejected',
} as const;

export type ActionStatus = typeof OActionStatus[keyof typeof OActionStatus];
// #endregion
