import React, {
  Children,
  Dispatch,
  SetStateAction,
  ReactElement,
  AriaRole,
  ReactNode,
  cloneElement,
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { isElement } from 'react-is';
import { useKey, useClickAway, useIsomorphicLayoutEffect, useToggle } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { usePopperTooltip } from 'react-popper-tooltip';
import { isElement as isHtmlElement, isFunction, isUndefined, isNull, isNil, assign, uniqueId } from 'lodash';
import cx from 'classnames';

import { convertRemToPixels } from 'shared/lib/element';
import { useForkRef } from 'shared/hooks';
import PopperContext from './popper.context';
import Title from './popper.title';
import Content from './popper.content';
import { Listbox, ListboxItem } from './popper.listbox';
import styles from './popper.module.css';

export type PopperClasses = 'root';
export type PopperPlacement =
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

export interface IPopperProps {
  id?: string;
  role?: AriaRole;
  closeOnBlur?: boolean;
  closeOnOutsideClick?: boolean;
  /** Closes the offcanvas when escape key is pressed [docs] */
  keyboard?: boolean;
  /** Callback fired when the component requests to be hidden. */
  onClose?: () => void;
  /** Callback fired when the component requests to be shown. */
  onOpen?: () => void;
  /**
   * Event or events that trigger
   * @default click
   */
  trigger?: Nullable<'click' | 'focus'>;
  placement?: PopperPlacement;
  offset?: [number, number];
  content?: ReactNode;
  title?: ReactNode;
  container?: Nullable<Element>;
  open?: boolean;
  hidden?: boolean;
  unmount?: boolean;
}

export const DefaultPlacement: PopperPlacement = 'bottom-end';
export const DefaultOffset: [number, number] = [0, convertRemToPixels(0.5)];
export const DefaultContainer: HTMLElement | undefined = !isUndefined(window) ? document.body : undefined;

const Popper = forwardRef<
  HTMLDivElement,
  | PropsWithOnlyChild<StyledComponentProps<IPopperProps, PopperClasses>>
  | PropsWithFunctionChild<StyledComponentProps<IPopperProps, PopperClasses>, { ref: Dispatch<SetStateAction<Nullable<HTMLElement>>>; visible: boolean }>
>(
  (
    {
      id: htmlId,
      role = 'dialog',
      className,
      classes,
      open,
      hidden,
      unmount,
      content,
      title,
      trigger = 'click',
      placement,
      keyboard,
      offset,
      closeOnBlur,
      closeOnOutsideClick,
      container,
      children,
      onClose,
      onOpen,
    },
    ref
  ) => {
    const [componentId] = useState(uniqueId('react-ui-popper-'));
    const [visible, toggleVisible] = useToggle(open ?? false);

    useEffect(() => {
      if (!isNil(open)) toggleVisible(open);
    }, [open]);

    const { getTooltipProps, setTooltipRef, setTriggerRef, tooltipRef, triggerRef } = usePopperTooltip({
      defaultVisible: false,
      interactive: true,
      trigger,
      delayHide: 0,
      delayShow: 0,
      offset,
      visible,
      placement,
      mutationObserverOptions: { attributes: false, childList: true, subtree: false },
    });

    // eslint-disable-next-line consistent-return
    useIsomorphicLayoutEffect(() => {
      if (isHtmlElement(triggerRef)) {
        let handle;
        let handleIn;
        let handleOut;
        switch (trigger) {
          case 'focus':
            handleIn = () => toggleVisible(true);
            handleOut = () => toggleVisible(false);
            triggerRef?.addEventListener('focus', handleIn);
            if (closeOnBlur) triggerRef?.addEventListener('blur', handleOut);
            return () => {
              triggerRef?.removeEventListener('focus', handleIn);
              if (closeOnBlur) triggerRef?.removeEventListener('blur', handleOut);
            };
          case 'click':
            handle = () => toggleVisible();
            triggerRef?.addEventListener('click', handle, { capture: true });
            return () => {
              triggerRef?.removeEventListener('click', handle, { capture: true });
            };
          default:
        }
      }
    }, [triggerRef, trigger, closeOnBlur]);

    const handleDismiss = useCallback(() => {
      toggleVisible(false);
    }, []);

    useClickAway({ current: tooltipRef }, (event) => {
      if (!closeOnOutsideClick) return;
      if (isHtmlElement(triggerRef) && event.target === triggerRef) return;
      handleDismiss();
    });

    useKey(
      'Escape',
      (e) => {
        if (!isUndefined(window) && !keyboard) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        handleDismiss();
      },
      { event: 'keydown', target: document.body },
      [keyboard, handleDismiss]
    );

    const nodeRef = useRef(null);
    const plugRef = useForkRef(nodeRef, ref);
    const handleRef = useForkRef<HTMLDivElement>(setTooltipRef, plugRef);
    const isOnlyChild = !Array.isArray(children) && isElement(children);
    const isFunctionChild = isFunction(children);

    const popper = () => {
      return (
        <div
          ref={handleRef}
          role={role}
          aria-live="polite"
          aria-modal="true"
          id={htmlId || componentId}
          {...getTooltipProps({ className: cx(className, classes?.root, styles?.root) })}
        >
          {title}
          {content}
        </div>
      );
    };

    const displayPopper = () => {
      return (
        <CSSTransition
          nodeRef={nodeRef}
          classNames="fx-fade"
          in={visible && !hidden}
          onEnter={onOpen}
          onExit={onClose}
          timeout={300}
          unmountOnExit={unmount}
          mountOnEnter
        >
          {popper()}
        </CSSTransition>
      );
    };

    const render = () => {
      if (isNull(container)) return displayPopper();
      if (!isUndefined(container)) return createPortal(displayPopper(), container);
      if (!isNil(DefaultContainer)) return createPortal(displayPopper(), DefaultContainer);
      return displayPopper();
    };

    if (isOnlyChild)
      return (
        <>
          {Children.only(cloneElement(children as ReactElement, { ref: setTriggerRef }))}
          <PopperContext.Provider value={{ dismiss: handleDismiss }}>{render()}</PopperContext.Provider>
        </>
      );
    if (isFunctionChild)
      return (
        <>
          {children({ ref: setTriggerRef, visible })}
          <PopperContext.Provider value={{ dismiss: handleDismiss }}>{render()}</PopperContext.Provider>
        </>
      );
    return null;
  }
);
Popper.displayName = 'Popper';
Popper.defaultProps = {
  placement: DefaultPlacement,
  offset: DefaultOffset,
  trigger: 'click',
  closeOnBlur: false,
  closeOnOutsideClick: true,
  keyboard: true,
  unmount: true,
  hidden: false,
};

export default assign(Popper, { Title, Content, Listbox, ListboxItem });
