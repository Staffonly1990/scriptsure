import React, { FC, ChangeEventHandler, ReactNode, Fragment, memo, useRef, useMemo, useState, useEffect, forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { createPortal } from 'react-dom';
import { useUpdateEffect } from 'react-use';
import { FocusScope } from '@react-aria/focus';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { usePopperTooltip } from 'react-popper-tooltip';
import { CSSTransition } from 'react-transition-group';
import { isUndefined, isNull, isNil, find } from 'lodash';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import styles from './select.module.css';

type OptionsPlacement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

type SelectColor = Exclude<TailwindColor, 'transparent' | 'current'>;
type SelectShape = 'smooth' | 'round' | null;
type SelectIconPosition = 'left' | 'right' | null;
type SelectWidth = 'w-full' | 'w-auto' | 'w-min' | 'w-max' | 'w-60' | 'w-80' | 'w-96' | string | null;

export interface ISelectProps<V = any> {
  disabled?: boolean;
  unmount?: boolean;
  color?: SelectColor;
  options: { value: V; label?: string }[];
  placement?: OptionsPlacement;
  label?: ReactNode;
  checkedIcon?: React.SVGProps<ReactNode>;
  selectIcon?: React.SVGProps<ReactNode>;
  container?: Nullable<Element> | undefined;
  shape?: SelectShape;
  iconPosition?: SelectIconPosition;
  /** @deprecated */
  width?: SelectWidth;
  onChange?: ChangeEventHandler;
  name?: string;
  value?: V;
  placeholder?: string;
}

export const DefaultPlacement: OptionsPlacement = 'bottom-end';
export const DefaultContainer: HTMLElement | undefined = !isUndefined(window) ? document.body : undefined;
export const DefaultColor: SelectColor = 'blue';
export const DefaultShape: SelectShape = null;
export const DefaultWidth: SelectWidth = null;
export const DefaultIconPosition: SelectIconPosition = 'right';
export const DefaultPlaceholder = 'noSelected';
export const DefaultValue = '';

const getColorClasses = (color: SelectColor) => {
  return styles?.[`${color}`] ?? null;
};

const getShapeClasses = (shape: SelectShape) => {
  return styles?.[`${shape}`] ?? null;
};

const getIconPositionClasses = (iconPosition: SelectIconPosition) => {
  return styles?.[`${iconPosition}`] ?? null;
};

interface ISelectIconProps {
  icon?: React.SVGProps<ReactNode>;
}
const Icon: FC<ISelectIconProps> = ({ icon }) => {
  return (
    <div className="h-5 w-5" aria-hidden="true">
      {icon}
    </div>
  );
};
Icon.displayName = 'Select.Icon';

const Group: FC<any> = memo(({ open: visible, onVisibleChange, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useEffect(() => onVisibleChange(visible), [visible]);

  return <>{children}</>;
});
Group.displayName = 'Select.Group';

const Select: FC<StyledComponentProps<ISelectProps<string | number>, 'root' | 'placeholder' | 'options'>> = forwardRef(
  (
    {
      className,
      classes,
      color,
      label,
      options,
      placement,
      checkedIcon,
      selectIcon,
      container,
      shape,
      width,
      unmount,
      iconPosition,
      onChange,
      name,
      value,
      placeholder,
      ...attrs
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState(value ?? DefaultValue);
    const intl = useIntl();
    const selectedOption = useMemo(
      () => find(options, (option) => (option.value ? String(option.value) : option.value) === selectedValue),
      [options, selectedValue]
    );
    const selectedPlaceholder = selectedOption?.label ?? selectedValue;

    useUpdateEffect(() => {
      if (value !== selectedValue) setSelectedValue(value ?? DefaultValue);
    }, [value]);

    const cls = cx(getShapeClasses(shape ?? DefaultShape), getColorClasses(color ?? DefaultColor), width ?? DefaultWidth);

    const [controlledVisible, setControlledVisible] = useState(false);
    const { getTooltipProps, setTooltipRef, setTriggerRef, triggerRef } = usePopperTooltip(
      {
        defaultVisible: false,
        interactive: false,
        trigger: null,
        delayHide: 0,
        delayShow: 0,
        placement,
        visible: controlledVisible,
        closeOnOutsideClick: true,
        closeOnTriggerHidden: false,
        // mutationObserverOptions: null,
        mutationObserverOptions: { attributes: false, childList: true, subtree: false }, // fix bug: infinite re-render
      }
      // { placement }
    );

    const nodeRef = useRef(null);
    const handleRef = useForkRef<HTMLUListElement>(setTooltipRef, nodeRef);
    const list = () => {
      return (
        <CSSTransition nodeRef={nodeRef} classNames="fx-fade" in={controlledVisible} timeout={300} unmountOnExit={unmount} mountOnEnter>
          <Listbox.Options
            as="ul"
            ref={handleRef}
            {...getTooltipProps({
              className: cx(styles.list_options, classes?.options, cls),
              style: { width: triggerRef?.clientWidth },
            })}
            static
          >
            <FocusScope>
              <Listbox.Option
                as="li"
                className={({ active }) => cx(active && styles.active, styles.listbox_option, iconPosition === 'left' ? 'pl-9' : 'pl-3')}
                value={DefaultValue}
                data-label={intl.formatMessage({ id: `measures.${DefaultPlaceholder}` })}
                data-value={DefaultValue}
                tabIndex={-1}
                aria-hidden
                hidden
                disabled
              >
                {({ active, selected }) => (
                  <>
                    <span className={cx('block line-clamp-1', { [styles.selected__text]: selected })}>
                      {intl.formatMessage({ id: `measures.${DefaultPlaceholder}` })}
                    </span>
                    <input
                      // @ts-ignore
                      ref={ref}
                      type="radio"
                      onChange={onChange}
                      value={DefaultValue}
                      name={name}
                      checked={selected}
                      className="w-full h-full absolute inset-0 opacity-0"
                      focusable="false"
                      tabIndex={-1}
                      aria-hidden
                    />

                    {selected ? (
                      <span
                        className={cx(
                          active ? styles.active : styles.selected,
                          styles.listbox_icon,
                          getIconPositionClasses(iconPosition ?? DefaultIconPosition)
                        )}
                      >
                        {checkedIcon && <Icon icon={checkedIcon} />}
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
              {options.map((option) => (
                <Listbox.Option
                  as="li"
                  key={option.value}
                  className={({ active }) => cx(active && styles.active, styles.listbox_option, iconPosition === 'left' ? 'pl-9' : 'pl-3')}
                  value={option.value}
                  data-label={option?.label ?? option.value}
                  data-value={option.value}
                >
                  {({ active, selected }) => (
                    <>
                      <span className={cx('block line-clamp-1', { [styles.selected__text]: selected })}>{option?.label ?? option.value}</span>
                      <input
                        // @ts-ignore
                        ref={ref}
                        type="radio"
                        onChange={onChange}
                        value={option.value}
                        name={name}
                        checked={selected}
                        className="w-full h-full absolute inset-0 opacity-0"
                        focusable="false"
                        tabIndex={-1}
                        aria-hidden
                      />

                      {selected ? (
                        <span
                          className={cx(
                            active ? styles.active : styles.selected,
                            styles.listbox_icon,
                            getIconPositionClasses(iconPosition ?? DefaultIconPosition)
                          )}
                        >
                          {checkedIcon && <Icon icon={checkedIcon} />}
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </FocusScope>
          </Listbox.Options>
        </CSSTransition>
      );
    };

    const displayList = () => {
      if (isNull(container)) return list();
      if (!isUndefined(container)) return createPortal(list(), container);
      if (!isNil(DefaultContainer)) return createPortal(list(), DefaultContainer);
      return list();
    };

    return (
      <Listbox as="div" {...attrs} className={cx(className, styles.root, classes?.root, cls)} value={selectedValue} onChange={setSelectedValue}>
        {({ open }) => (
          <Group open={open} onVisibleChange={setControlledVisible}>
            <>
              {label && <Listbox.Label as={Fragment}>{label}</Listbox.Label>}

              <Listbox.Button ref={setTriggerRef} className={cx(cls, styles.listbox_button, classes?.placeholder)}>
                {selectedValue === DefaultValue && (
                  <span className="block line-clamp-1">{placeholder || intl.formatMessage({ id: `measures.${DefaultPlaceholder}` })}</span>
                )}
                {selectedValue !== DefaultValue && <span className="block line-clamp-1">{selectedPlaceholder}</span>}
                <span className={cx(styles.listbox_icon, styles.listbox_icon__selector, styles.right)}>
                  <Icon icon={selectIcon} />
                </span>
              </Listbox.Button>

              {displayList()}
            </>
          </Group>
        )}
      </Listbox>
    );
  }
);
Select.displayName = 'Select';
Select.defaultProps = {
  color: DefaultColor,
  placement: DefaultPlacement,
  shape: DefaultShape,
  width: DefaultWidth,
  iconPosition: DefaultIconPosition,
  selectIcon: <SelectorIcon />,
  checkedIcon: <CheckIcon />,
  unmount: true,
};

export default Select;
