import React, { Children, ReactElement, ReactNode, cloneElement, forwardRef, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { isElement } from 'react-is';
import { useKey, useToggle } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { usePopperTooltip } from 'react-popper-tooltip';
import { isUndefined, isNull, isNil, uniqueId, assign } from 'lodash';
import cx from 'classnames';

import { convertRemToPixels } from 'shared/lib/element';
import { useForkRef } from 'shared/hooks';
import styles from './tooltip.module.css';

type TooltipClasses = 'root' | 'arrow';
type TooltipPlacement =
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

export interface ITooltipProps {
  id?: string;
  arrow?: boolean;
  interactive?: boolean;
  followCursor?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnTriggerHidden?: boolean;
  offset?: [number, number];
  content?: ReactNode;
  placement?: TooltipPlacement;
  container?: Element;
  /** Closes the tooltip when escape key is pressed on the children */
  keyboard?: boolean;
  unmount?: boolean;
  onVisibleChange?: (state: boolean) => void;
}

function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) assign(ref, { current: value });
}

const DefaultPlacement: TooltipPlacement = 'top';
const DefaultOffset: [number, number] = [0, convertRemToPixels(0.25)];
const DefaultContainer: HTMLElement | undefined = !isUndefined(window) ? document.body : undefined;

const Tooltip = forwardRef<HTMLDivElement, StyledComponentProps<PropsWithOnlyChild<ITooltipProps>, TooltipClasses>>(
  (
    {
      id: htmlId,
      className,
      classes,
      arrow,
      content,
      placement,
      offset,
      interactive,
      followCursor,
      closeOnOutsideClick,
      closeOnTriggerHidden,
      container,
      keyboard,
      unmount,
      children,
      onVisibleChange,
      ...attrs
    },
    ref
  ) => {
    const [componentId] = useState(uniqueId('react-ui-tooltip-'));
    const [visible, toggleVisible] = useToggle(false);

    const handleVisibleChange = (state) => {
      if (onVisibleChange) onVisibleChange(state);
      toggleVisible(state);
    };

    const handleDismiss = useCallback(() => {
      toggleVisible(false);
    }, []);

    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip({
      defaultVisible: false,
      trigger: ['hover', 'focus'],
      delayHide: 300,
      delayShow: 300,
      offset,
      visible,
      placement,
      interactive,
      followCursor,
      closeOnOutsideClick,
      closeOnTriggerHidden,
      onVisibleChange: handleVisibleChange,
    });

    const nodeRef = useRef(null);
    const plugRef = useForkRef(nodeRef, ref);
    const handleRef = useForkRef<HTMLDivElement>(setTooltipRef, plugRef);
    const isOnlyChild = !Array.isArray(children) && isElement(children);

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
      { event: 'keydown', target: window },
      [keyboard, handleDismiss]
    );

    const tooltip = () => {
      if (content === undefined) return <></>;
      return (
        <div
          ref={handleRef}
          role="tooltip"
          aria-live="polite"
          id={htmlId || componentId}
          {...getTooltipProps({ className: cx(className, classes?.root, styles?.root) })}
        >
          {arrow && <div {...getArrowProps({ className: cx(classes?.arrow, styles?.arrow) })} />}
          {content}
        </div>
      );
    };

    const displayTooltip = () => {
      return (
        <CSSTransition nodeRef={nodeRef} classNames="fx-fade" in={visible} timeout={300} unmountOnExit={unmount} mountOnEnter>
          {tooltip()}
        </CSSTransition>
      );
    };

    const render = () => {
      if (isNull(container)) return displayTooltip();
      if (!isUndefined(container)) return createPortal(displayTooltip(), container);
      if (!isNil(DefaultContainer)) return createPortal(displayTooltip(), DefaultContainer);
      return displayTooltip();
    };

    return isOnlyChild ? (
      <>
        {Children.only(
          cloneElement(children as ReactElement, {
            'ref': (el) => {
              // @ts-ignore
              setRef(children?.ref, el);
              setTriggerRef(el);
            },
            'aria-describedby': htmlId || componentId,
            ...attrs,
          })
        )}
        {render()}
      </>
    ) : null;
  }
);
Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = {
  placement: DefaultPlacement,
  offset: DefaultOffset,
  arrow: true,
  interactive: false,
  followCursor: false,
  closeOnOutsideClick: true,
  closeOnTriggerHidden: false,
  unmount: true,
  keyboard: true,
};

export default Tooltip;
