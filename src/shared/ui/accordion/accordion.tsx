import React, { FC } from 'react';
import { useGetSet } from 'react-use';
import { useId } from '@react-aria/utils';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { assign } from 'lodash';
import cx from 'classnames';

import Button from '../button';
import Label from './label';

interface ILabelContainer {
  time?: string;
  userName?: string;
  label?: Nullable<JSX.Element>;
  actionBtn?: Nullable<JSX.Element>;
}

const Accordion: FC<StyledComponentProps<ILabelContainer>> = ({ time, userName, label, children, actionBtn }) => {
  const headerId = useId();
  const contentId = useId();
  const [isExpanded, setIsExpanded] = useGetSet<boolean>(false);

  return (
    <div className={`flex flex-col w-full relative ${userName || time ? 'border' : ''}`}>
      {(userName || time) && (
        <div id={headerId} className="w-full flex justify-between items-center p-4" aria-expanded={isExpanded()} aria-controls={contentId}>
          <div className="flex flex-col">
            <span className="text-2xl font-normal">{time}</span>
            <span className="text-sm">{userName}</span>
          </div>

          <Button className="mr-16" tabIndex={0} variant="filled" shape="circle" color="white" aria-hidden onClick={() => setIsExpanded(!isExpanded())}>
            <ChevronDownIcon className={`w-5 h-5 ${isExpanded() && 'transform rotate-180'}`} focusable="false" aria-hidden />
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div
          className="w-full cursor-pointer p-3"
          role="presentation"
          onKeyDown={() => setIsExpanded(!isExpanded())}
          onClick={() => setIsExpanded(!isExpanded())}
        >
          {label}
        </div>

        {actionBtn}
      </div>

      <div className={cx('min-h-0', isExpanded() ? 'h-auto visible' : 'h-0 invisible')}>
        <div id={contentId} role="region" aria-labelledby={headerId}>
          <div className="p-4 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

Accordion.displayName = 'Accordion';

export default assign(Accordion, { Label });
