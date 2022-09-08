import React, { FC, Ref, MutableRefObject, KeyboardEvent, ElementType, forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useScrollbarWidth } from 'react-use';
import { Transition, CSSTransition, TransitionStatus } from 'react-transition-group';
import { isElement, isFunction, isUndefined, isNull, isNil, assign, reduce } from 'lodash';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import Body from './offcanvas.body';
import Header from './offcanvas.header';
import styles from './offcanvas.module.css';

interface IOffcanvasBackdropProps {
  visible?: boolean;
  unmount?: boolean;
  onClick?: () => void;
}

/** Private Offcanvas.Backdrop Component */
const Backdrop: FC<StyledComponentProps<IOffcanvasBackdropProps>> = ({ className, visible, onClick }) => {
  const nodeRef = useRef(null);

  const backdrop = () => {
    return <div ref={nodeRef} className={className} aria-hidden="true" onClick={onClick} />;
  };

  const displayBackdrop = () => {
    return (
      <CSSTransition nodeRef={nodeRef} classNames="fx-fade" in={visible} timeout={300} unmountOnExit mountOnEnter>
        {backdrop()}
      </CSSTransition>
    );
  };

  return displayBackdrop();
};
Backdrop.displayName = 'Offcanvas.Backdrop';
Backdrop.defaultProps = { visible: false };

export type OffcanvasClasses = 'root' | 'top' | 'bottom' | 'right' | 'left' | 'open' | 'backdrop';
export type OffcanvasPlacement = 'top' | 'bottom' | 'right' | 'left';

export interface IOffcanvasProps {
  /** If true, the backdrop is not rendered. */
  hideBackdrop?: boolean;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  /** Closes the offcanvas when escape key is pressed [docs] */
  keyboard?: boolean;
  /** Callback fired when the component requests to be hidden. */
  onClose?: () => void;
  /** Callback fired when the component requests to be shown. */
  onOpen?: () => void;
  /** Components placement. */
  placement?: OffcanvasPlacement;
  /** Binding element for the portal. */
  container?: Element | null | undefined;
  /** Allow body scrolling while offcanvas is open. */
  scroll?: boolean;
  /** Toggle the visibility of offcanvas component. */
  open?: boolean;
  unmount?: boolean;
}

const DefaultPlacement: OffcanvasPlacement = 'right';
const DefaultContainer: HTMLElement | null | undefined = !isUndefined(window) ? document.body : undefined;

const Offcanvas: OverloadedFC<StyledComponentProps<IOffcanvasProps, OffcanvasClasses>> = forwardRef<
  ElementType,
  PropsWithOverload<StyledComponentProps<IOffcanvasProps, OffcanvasClasses>, ElementType>
>(
  (
    {
      as: Component = 'div',
      className,
      classes,
      style,
      placement,
      hideBackdrop,
      initialFocus,
      keyboard,
      scroll,
      open,
      unmount,
      container,
      children,
      onClose,
      onOpen,
      ...attrs
    },
    ref
  ) => {
    const [visible, setVisible] = useState(open ?? false);
    const scrollbarWidth = useScrollbarWidth();

    const rootRef = useRef<ElementType>(null);
    const nodeRef = useRef(null);
    const plugRef = useForkRef(nodeRef, ref);
    const handleRef = useForkRef(rootRef, plugRef);

    useEffect(() => {
      if (!isNil(open)) setVisible(open);
    }, [open]);

    useEffect(() => {
      if (!visible) return;

      if (!isUndefined(window) && !scroll) {
        const { overflow } = document.body.style;
        const { paddingRight } = document.body.style;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = !isNil(scrollbarWidth) ? `${scrollbarWidth}px` : '0px';

        // eslint-disable-next-line consistent-return
        return () => {
          document.body.style.overflow = overflow;
          document.body.style.paddingRight = paddingRight;
        };
      }
    }, [visible, scroll]);

    const handleDismiss = () => {
      setVisible(false);
    };

    const handleKeydown = useCallback(
      // eslint-disable-next-line consistent-return
      (event: KeyboardEvent) => {
        if (keyboard && event.key === 'Escape') {
          // event.preventDefault();
          // event.stopPropagation();
          return handleDismiss();
        }
      },
      [ref, keyboard, handleDismiss]
    );

    const offcanvas = (elementRef: Ref<ElementType>, state: TransitionStatus) => {
      const cls = cx(
        className,
        classes?.root,
        styles.root,
        reduce(
          {
            [classes?.[`${placement}`]]: placement,
            [classes?.[`${state}`]]: state,
            [`${classes?.open}`]: visible,
            [styles?.[`${placement}`]]: placement,
            [styles?.[`${state}`]]: state,
            [styles.open]: visible,
          },
          (acc, v, k) => {
            if (v && !isNil(k)) assign(acc, { [k]: v });
            return acc;
          },
          {}
        )
      );
      return (
        <Component ref={elementRef} className={cls} style={style} role="dialog" tabIndex={-1} aria-modal="true" onKeyDown={handleKeydown} {...attrs}>
          {children}
        </Component>
      );
    };

    const displayOffcanvas = () => {
      return (
        <Transition
          nodeRef={nodeRef}
          in={visible}
          onEnter={onOpen}
          onEntered={() => {
            let element;
            if (!isUndefined(initialFocus?.current)) element = initialFocus?.current;
            else element = rootRef.current as unknown as HTMLOrSVGElement;
            if (isElement(element) && isFunction(element?.focus)) element?.focus();
          }}
          onExit={onClose}
          timeout={{ enter: 150, exit: 300 }}
          unmountOnExit={unmount}
          mountOnEnter
        >
          {(state) => offcanvas(handleRef, state)}
        </Transition>
      );
    };

    const render = () => {
      if (isNull(container))
        return (
          <>
            {displayOffcanvas()}
            {!hideBackdrop && <Backdrop className={cx(classes?.backdrop, styles.backdrop)} visible={visible} onClick={handleDismiss} />}
          </>
        );
      if (!isUndefined(container))
        return (
          <>
            {createPortal(displayOffcanvas(), container)}
            {!hideBackdrop &&
              createPortal(<Backdrop className={cx(classes?.backdrop, styles.backdrop)} visible={visible} onClick={handleDismiss} />, container)}
          </>
        );
      if (!isNil(DefaultContainer))
        return (
          <>
            {createPortal(displayOffcanvas(), DefaultContainer)}
            {!hideBackdrop &&
              createPortal(<Backdrop className={cx(classes?.backdrop, styles.backdrop)} visible={visible} onClick={handleDismiss} />, DefaultContainer)}
          </>
        );
      return (
        <>
          {displayOffcanvas()}
          {!hideBackdrop && <Backdrop className={cx(classes?.backdrop, styles.backdrop)} visible={visible} onClick={handleDismiss} />}
        </>
      );
    };

    return render();
  }
);
Offcanvas.displayName = 'Offcanvas';
Offcanvas.defaultProps = {
  placement: DefaultPlacement,
  hideBackdrop: false,
  keyboard: true,
  unmount: true,
  scroll: false,
};

export default assign(Offcanvas, { Header, Body });
