import { ReactNode, Fragment, Children, createElement } from 'react';
import { isFragment } from 'react-is';
import { isArray, reduce } from 'lodash';

export function toValidArray(children: ReactNode[]) {
  if (isArray(children)) {
    let chunk: ReactNode[] = [];
    const dim: ReactNode[] = reduce(
      children,
      (acc, item, index) => {
        if (isFragment(item)) {
          acc.push(item);
          return acc;
        }
        if (isArray(item)) {
          acc.push(createElement(Fragment, {}, ...item));
          return acc;
        }

        chunk.push(item);
        if (isFragment(children[index + 1]) || isArray(children[index + 1]) || children.length === index + 1) {
          acc.push(createElement(Fragment, {}, ...chunk));
          chunk = [];
        }
        return acc;
      },
      [] as ReactNode[]
    );
    return Children.toArray(dim);
  }
  return children;
}

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
