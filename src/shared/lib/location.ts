import { createLocation } from 'history';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const resolveToLocation = (to, currentLocation) => (typeof to === 'function' ? to(currentLocation) : to);

export const normalizeToLocation = (to, currentLocation) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return typeof to === 'string' ? createLocation(to, null, undefined, currentLocation) : to;
};
