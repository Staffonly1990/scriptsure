import React, { FC, ElementType, Ref, MutableRefObject, Fragment, memo } from 'react';
import { useKey, useScrollbarWidth, useIsomorphicLayoutEffect } from 'react-use';
import { Dialog, Transition } from '@headlessui/react';
import { isUndefined, isNil, assign, noop } from 'lodash';
import cx from 'classnames';

import Actions from './modal.actions';
import Header from './modal.header';
import Body from './modal.body';

interface IModalPanelProps {
  open?: boolean;
  scroll?: boolean;
}
/** Private Modal.Panel Component */
const Panel: FC<IModalPanelProps> = memo(({ open, scroll, children }) => {
  const scrollbarWidth = useScrollbarWidth();

  useIsomorphicLayoutEffect(() => {
    if (!open) return;

    if (!isUndefined(window)) {
      const observer = new IntersectionObserver((entries) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          target.style.removeProperty('overflow');
          target.style.removeProperty('padding-right');
        }
      });

      const scrollable = (document.body.clientHeight || document.documentElement.clientHeight) >= window.innerHeight;
      if (scrollable && !scroll) {
        const { overflow } = document.body.style;
        const { paddingRight } = document.body.style;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = !isNil(scrollbarWidth) ? `${scrollbarWidth}px` : '0px';

        observer.observe(document.documentElement);
        // eslint-disable-next-line consistent-return
        return () => {
          document.body.style.overflow = overflow;
          document.body.style.paddingRight = paddingRight;
          observer.disconnect();
        };
      }

      observer.observe(document.documentElement);
      // eslint-disable-next-line consistent-return
      return () => {
        observer.disconnect();
      };
    }
  }, [open, scroll]);

  return <>{children}</>;
});
Panel.displayName = 'Modal.Panel';

export interface IModalProps {
  open: boolean;
  /** Allow body scrolling while offcanvas is open. */
  scroll?: boolean;
  unmount?: boolean;
  /** Closes the offcanvas when escape key is pressed [docs] */
  keyboard?: boolean;
  hideBackdrop?: boolean;
  innerRef?: MutableRefObject<(HTMLElement & HTMLDivElement) | null> | Ref<HTMLElement & HTMLDivElement> | undefined;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  onClose?: (value: boolean) => void;
}

export type ModalClasses = 'root' | 'backdrop' | 'forefront';

const Modal: OverloadedFC<StyledComponentProps<IModalProps, ModalClasses>> = ({
  as = 'div',
  className,
  classes,
  open,
  scroll,
  unmount,
  keyboard,
  hideBackdrop,
  initialFocus,
  innerRef,
  children,
  onClose,
  ...attrs
}) => {
  useKey(
    'Escape',
    (e) => {
      if (!isUndefined(window) && !keyboard) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { event: 'keydown', target: document?.documentElement },
    [keyboard]
  );

  return (
    <Transition as={Fragment} show={open} unmount={unmount}>
      <Dialog
        as={as as ElementType}
        {...attrs}
        className={cx(classes?.root, 'fixed z-modal inset-0 overflow-y-auto')}
        initialFocus={initialFocus}
        onClose={onClose ?? noop}
        static
      >
        {({ open: visible }) => (
          <Panel open={visible} scroll={scroll}>
            <div ref={console.warn}>
              {!hideBackdrop && (
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className={cx(classes?.backdrop, 'fixed z-modalBackdrop inset-0 bg-gray-500 bg-opacity-50 transition-opacity')} />
                </Transition.Child>
              )}

              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-16 text-center sm:block sm:p-0">
                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                  &#8203;
                </span>

                <Transition.Child
                  as="div"
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-300"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  className={cx(
                    className,
                    classes?.forefront,
                    'relative z-modalForefront transform transition-all',
                    'inline-block text-left bg-primary rounded-sm shadow-xl',
                    'w-full max-w-full align-bottom',
                    'sm:max-w-xl sm:my-8 sm:align-middle'
                  )}
                >
                  <div ref={innerRef} className="overflow-hidden">
                    {children}
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Panel>
        )}
      </Dialog>
    </Transition>
  );
};
Modal.displayName = 'Modal';
Modal.defaultProps = {
  hideBackdrop: false,
  keyboard: true,
  unmount: true,
  scroll: false,
  open: false,
};

export default assign(Modal, { Actions, Header, Body, Title: Dialog.Title, Description: Dialog.Description });
