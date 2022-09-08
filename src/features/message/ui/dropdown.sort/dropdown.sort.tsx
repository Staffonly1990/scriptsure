import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';
import { useIntl } from 'react-intl';

import Dropdown from 'shared/ui/dropdown';
import { InformationCircleIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import { OSortedBy, OSortedByType } from 'shared/api/message';

interface IDropdownSortProps {
  handleChange: (value: OSortedByType) => void;
  sortedBy: OSortedByType;
}

const Item = ({ text, onClick, isSelected }) => (
  <Dropdown.Item onClick={onClick}>
    <InformationCircleIcon className={cx(isSelected ? '!text-blue-500' : '!text-gray-500', 'w-6 h-6 mr-4')} />
    {text}
  </Dropdown.Item>
);

const DropdownToSort: FC<IDropdownSortProps> = observer(({ handleChange, sortedBy }: IDropdownSortProps) => {
  const { formatMessage } = useIntl();

  const list = [
    {
      text: formatMessage({ id: 'reports.measures.drugName' }),
      onClick: () => handleChange(OSortedBy.DrugName),
      isSelected: sortedBy === OSortedBy.DrugName,
    },
    {
      text: formatMessage({ id: 'invite.firstName' }),
      onClick: () => handleChange(OSortedBy.FirstName),
      isSelected: sortedBy === OSortedBy.FirstName,
    },
    {
      text: formatMessage({ id: 'invite.lastName' }),
      onClick: () => handleChange(OSortedBy.LastName),
      isSelected: sortedBy === OSortedBy.LastName,
    },
    {
      text: formatMessage({ id: 'messages.messageDate' }),
      onClick: () => handleChange(OSortedBy.MessageDate),
      isSelected: sortedBy === OSortedBy.MessageDate,
    },
  ].map(({ onClick, text, isSelected }) => <Item onClick={onClick} text={text} isSelected={isSelected} />);

  return (
    <Dropdown list={list}>
      <MenuAlt2Icon className="w-6 h-6 mr-2" />
    </Dropdown>
  );
});

DropdownToSort.displayName = 'DropdownToSort';
export default DropdownToSort;
