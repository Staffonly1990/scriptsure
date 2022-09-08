import React, {
  Key,
  Dispatch,
  SetStateAction,
  MutableRefObject,
  ReactElement,
  createContext,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import type { CollectionChildren, SingleSelection, Node, DOMProps, Orientation } from '@react-types/shared';
import type { AriaTabListBase } from '@react-types/tabs';
import type { TabListState } from '@react-stately/tabs';
import type { SingleSelectListState } from '@react-stately/list';
import { useTabListState } from '@react-stately/tabs';
import { ListCollection } from '@react-stately/list';
import { useCollection, Item } from '@react-stately/collections';
import { useTab, useTabList, useTabPanel } from '@react-aria/tabs';
import { filterDOMProps } from '@react-aria/utils';
import { map, assign } from 'lodash';
import cx from 'classnames';

import { TabsColor, DefaultColor } from './tabs.types';
import stylesRoot from './tabs.module.css';
import stylesTab from './tabs.tab.module.css';

const getActiveTabColor = (color: TabsColor) => {
  return stylesTab?.[`active-${color}`] ?? null;
};

interface ITabsProps<T> extends AriaTabListBase, SingleSelection, DOMProps {
  /** The item objects for each tab, for dynamic collections. */
  items?: Iterable<T> | undefined;
  /** The keys of the tabs that are disabled. These tabs cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: Iterable<Key> | undefined;
  orientation?: Orientation | undefined;
  color?: TabsColor | undefined;
}

interface ITabProps<T> {
  item: Node<T>;
  state: SingleSelectListState<T>;
  isDisabled?: boolean;
  orientation?: Orientation;
  color?: TabsColor;
}

interface ITabListProps<T> extends DOMProps {
  /**
   * The tab items to display.
   * Item keys should match the key of the corresponding `<Tab.Item>` within the `<Tab.TabPanels>` element.
   */
  children: CollectionChildren<T>;
}

interface ITabPanelsProps<T> extends DOMProps {
  keep?: boolean;
  /**
   * The contents of each tab.
   * Item keys should match the key of the corresponding `<Tab.Item>` within the `<Tab.TabList>` element.
   */
  children: CollectionChildren<T>;
}

export interface ITabsContextProps<T> {
  tabsProps: PropsWithChildren<ITabsProps<T>>;
  tabsState: {
    selectedTab: HTMLElement | undefined;
    tabListState: Nullable<TabListState<T>>;
    setTabListState: Dispatch<SetStateAction<Nullable<TabListState<T>>>>;
  };
  refs: {
    wrapperRef: MutableRefObject<Nullable<HTMLDivElement>>;
    tablistRef: MutableRefObject<Nullable<HTMLDivElement>>;
  };
}

// @ts-ignore
export const TabsContext = createContext<ITabsContextProps<any>>(null);

function Tabs<T extends object>(
  {
    className,
    classes,
    style,
    color,
    orientation = 'horizontal' as Orientation,
    children,
    ...tabsProps
  }: PropsWithChildren<StyledComponentProps<ITabsProps<T>>>,
  ref
) {
  const tablistRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState<HTMLElement>();
  const [tabListState, setTabListState] = useState<Nullable<TabListState<T>>>(null);

  useIsomorphicLayoutEffect(() => {
    if (tablistRef.current) {
      const _selectedTab: Nullable<HTMLElement> = tablistRef.current?.querySelector(`[data-key="${tabListState?.selectedKey}"]`);

      if (_selectedTab !== null) {
        setSelectedTab(_selectedTab);
      }
    }
  }, [children, tabListState?.selectedKey, tablistRef]);

  return (
    <TabsContext.Provider
      value={{
        tabsProps: { ...tabsProps, orientation, color },
        tabsState: { selectedTab, tabListState, setTabListState },
        refs: { tablistRef, wrapperRef },
      }}
    >
      <div {...filterDOMProps(tabsProps)} ref={ref} className={cx(className, stylesRoot.root, stylesRoot?.[orientation])} style={style}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
Tabs.displayName = 'Tabs';
Tabs.defaultProps = {
  color: DefaultColor,
};

/** @private */
function Tab<T>({ item, state, isDisabled: disabled, color, orientation = 'horizontal' as Orientation }: ITabProps<T>) {
  const { key, rendered } = item;

  const isSelected = state.selectedKey === key;
  const isDisabled = disabled ?? state.disabledKeys.has(key);

  const ref = useRef(null);
  const { tabProps } = useTab({ key, isDisabled }, state, ref);

  return (
    <button
      {...tabProps}
      ref={ref}
      className={cx(stylesTab.root, stylesTab?.[orientation], {
        [stylesTab.disabled]: isDisabled,
        [stylesTab.inactive]: !isSelected,
        [getActiveTabColor(color || DefaultColor)]: isSelected,
      })}
      type="button"
    >
      {rendered}
    </button>
  );
}
Tab.displayName = 'Tabs.Tab';

function TabList<T extends object>({ className, classes, style, children, ...tablistProps }: StyledComponentProps<ITabListProps<T>>) {
  const tabsContext = useContext(TabsContext);
  const { tabsProps, tabsState, refs } = tabsContext;

  const { color, orientation, isDisabled } = tabsProps;
  const { setTabListState } = tabsState;
  const { tablistRef, wrapperRef } = refs;

  // Pass original Tab props but override children to create the collection.
  const state = useTabListState({ ...tabsProps, children });
  const { tabListProps } = useTabList({ ...tabsProps, ...tablistProps, children }, state, tablistRef);

  useEffect(() => {
    // Passing back to root as useTabPanel needs the TabListState
    setTabListState(state);
  }, [state.disabledKeys, state.selectedItem, state.selectedKey, children]);

  return (
    <div ref={wrapperRef} className="border-b border-gray-200">
      <nav
        {...tabListProps}
        ref={tablistRef}
        className={cx(className, orientation === 'horizontal' ? 'flex -mb-px space-x-4' : 'flex flex-col -mr-px space-y-4')}
        style={style}
      >
        {map([...state.collection], (item) => (
          <Tab key={item.key} item={item} state={state} color={color} orientation={orientation} isDisabled={isDisabled} />
        ))}
      </nav>
    </div>
  );
}
TabList.displayName = 'Tabs.TabList';

/** @private */
function TabPanel<T>({ children, ...props }: ITabPanelsProps<T>) {
  const tabsContext = useContext(TabsContext);
  const { tabsProps, tabsState } = tabsContext;

  const { orientation } = tabsProps;
  const { tabListState } = tabsState;

  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel({ ...props }, tabListState as any, ref);

  return (
    <div {...tabPanelProps} ref={ref} className={cx(orientation === 'horizontal' ? 'px-1 py-2' : 'px-2 py-1')}>
      {children}
    </div>
  );
}
TabPanel.displayName = 'Tabs.TabPanel';

function TabPanels<T>({ keep = false, ...props }: ITabPanelsProps<T>) {
  const tabsContext = useContext(TabsContext);
  const { tabsProps, tabsState } = tabsContext;

  const factory = (nodes) => new ListCollection(nodes);
  const collection = useCollection({ items: tabsProps?.items, ...props }, factory, { suppressTextValueWarning: true });

  const { tabListState } = tabsState;
  const selectedItem = tabListState ? collection.getItem(tabListState.selectedKey) : null;

  if (keep) {
    return (
      <>
        {map([...collection.getKeys()], (key) => {
          if (selectedItem?.key === key) {
            return (
              <TabPanel {...props} key={key}>
                {selectedItem && selectedItem.props.children}
              </TabPanel>
            );
          }

          return (
            <div key={key} aria-hidden hidden>
              {collection.getItem(key)?.props?.children}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <TabPanel {...props} key={tabListState?.selectedKey}>
      {selectedItem && selectedItem.props.children}
    </TabPanel>
  );
}
TabPanels.displayName = 'Tabs.TabPanels';

function TabSummary({ className, classes, style, children }: PropsWithChildren<StyledComponentProps>) {
  const { tabsProps } = useContext(TabsContext);
  const { orientation } = tabsProps;

  return (
    <div className={cx(className, orientation === 'horizontal' ? 'px-1 py-2' : 'px-2 py-1')} style={style}>
      {children}
    </div>
  );
}
TabSummary.displayName = 'Tabs.TabSummary';

// forwardRef doesn't support generic parameters, so cast the result to the correct type
const _Tabs = forwardRef(Tabs as any) as <T>(
  props: PropsWithChildren<StyledComponentProps<ITabsProps<T>>> & { ref?: MutableRefObject<HTMLElement> }
) => ReactElement;

export default assign(_Tabs, { TabSummary, TabPanels, TabList, Item });
