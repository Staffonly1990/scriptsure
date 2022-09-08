import React, { FC, Key, useEffect } from 'react';
import { useListState } from '@react-stately/list';
import { Item } from '@react-stately/collections';
import { map, isFunction } from 'lodash';

import Button from 'shared/ui/button';

export interface IDrugSelectProps {
  items?: any[];
  selected?: Key;
  onSelect?: (value: Key) => void;
}

/** @private */
function Badges({ selected, children, onSelect }) {
  // @ts-ignore
  const state = useListState({
    selectionMode: 'single',
    selectionBehavior: 'replace',
    selectedKeys: [selected],
    children,
  });
  const { collection, selectionManager } = state;

  useEffect(() => {
    if (!selectionManager.isSelected(selected) && selectionManager.canSelectItem(selected)) {
      selectionManager.setSelectedKeys([selected]);
    }
  }, [selected]);

  return (
    <>
      {map([...collection], (item: any) => (
        <Button
          key={item.key}
          className="uppercase"
          color={selectionManager.isSelected(item.key) ? 'blue' : 'gray'}
          shape="smooth"
          onClick={() => {
            if (selectionManager.canSelectItem(item.key)) {
              selectionManager.setSelectedKeys([item.key]);
              if (isFunction(onSelect)) onSelect(item.key);
            }
          }}
        >
          {item.rendered}
        </Button>
      ))}
    </>
  );
}
Badges.displayName = 'DrugSearchCategory.Badges';

const DrugSearchCategory: FC<IDrugSelectProps> = ({ selected, items, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badges selected={selected} onSelect={onSelect}>
        {map(items, (item) => (
          <Item key={item.value} textValue={item.value}>
            {item.name}
          </Item>
        ))}
      </Badges>
    </div>
  );
};

DrugSearchCategory.displayName = 'DrugSearchCategory';
export default DrugSearchCategory;
