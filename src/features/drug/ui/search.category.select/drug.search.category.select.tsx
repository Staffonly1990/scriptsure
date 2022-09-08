import React, { FC, Key, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { ClipboardListIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import { Item } from '@react-stately/collections';
import { useSelectState } from '@react-stately/select';
import { useButton } from '@react-aria/button';
import { FocusScope } from '@react-aria/focus';
import { useListBox, useOption } from '@react-aria/listbox';
import { HiddenSelect, useSelect } from '@react-aria/select';
import { map, assign } from 'lodash';

import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import Popper from 'shared/ui/popper';

export interface IDrugSelectProps {
  items?: any[];
  selected?: Key;
  onSelect?: (value: Key) => void;
}

function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) assign(ref, { current: value });
}

/** @private */
function Option({ item, state }) {
  const ref = useRef(null);
  const { optionProps, isSelected, isFocused, isDisabled } = useOption({ key: item.key }, state, ref);

  let color = 'gray';
  if (isSelected) {
    color = 'blue';
  } else if (isFocused) {
    color = 'gray';
  } else if (isDisabled) {
    color = 'gray';
  }

  return (
    <Button
      as="li"
      {...optionProps}
      ref={ref}
      className="!flex"
      variant="flat"
      shape={null}
      // @ts-ignore
      color={color}
      disabled={isDisabled}
    >
      {item.rendered}
    </Button>
  );
}

/** @private */
function ListBox(props) {
  const ref = useRef(null);
  const { listBoxRef = ref, state } = props;
  const { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul {...listBoxProps} ref={listBoxRef} className="max-h-60 m-0 p-0 overflow-auto list-none">
      {map([...state.collection], (item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

/** @private */
function List({ label, selected, children, onSelect }) {
  const breakpoints = useBreakpoints();
  const triggerRef = useRef(null);

  const state = useSelectState({ label, selectedKey: selected, children, onSelectionChange: onSelect });
  const { selectionManager } = state;

  const { triggerProps, menuProps } = useSelect({ label, selectedKey: selected, children }, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);

  useEffect(() => {
    if (!selectionManager.isSelected(selected) && selectionManager.canSelectItem(selected)) {
      selectionManager.setSelectedKeys([selected]);
    }
  }, [selected]);

  return (
    <>
      <HiddenSelect state={state} triggerRef={triggerRef} label={label} />
      <Popper
        placement="bottom-start"
        trigger={null}
        open={state.isOpen}
        onOpen={() => state.open(null)}
        onClose={state.close}
        content={
          <FocusScope contain autoFocus>
            <ListBox {...menuProps} state={state} label={label} />
          </FocusScope>
        }
      >
        {({ ref }) => (
          <Tooltip content={label}>
            <Button
              {...buttonProps}
              ref={(el) => {
                setRef(triggerRef, el);
                setRef(ref, el);
              }}
              variant="flat"
              shape="circle"
              color="black"
            >
              {breakpoints.md ? (
                <ClipboardListIcon className="w-6 h-6 pointer-events-none" focusable={false} aria-hidden />
              ) : (
                <DotsVerticalIcon className="w-6 h-6 pointer-events-none" focusable={false} aria-hidden />
              )}
            </Button>
          </Tooltip>
        )}
      </Popper>
    </>
  );
}
List.displayName = 'DrugSearchCategorySelect.List';

const DrugSearchCategorySelect: FC<IDrugSelectProps> = ({ selected, items, onSelect }) => {
  return (
    <List label={<FormattedMessage id="drug.medication.type" />} selected={selected} onSelect={onSelect}>
      {map(items, (item) => (
        <Item key={item.value} textValue={item.value}>
          {item.name}
        </Item>
      ))}
    </List>
  );
};

DrugSearchCategorySelect.displayName = 'DrugSearchCategorySelect';
export default DrugSearchCategorySelect;
