import React, { MutableRefObject, SyntheticEvent, ReactNode, ButtonHTMLAttributes, forwardRef, useRef } from 'react';
import { isFunction } from 'lodash';
import { useIntl } from 'react-intl';
import cx from 'classnames';

import { useForkRef } from 'shared/hooks';
import Button from 'shared/ui/button';
import styles from './modal.actions.module.css';

export type ModalActionsClasses = 'root' | 'btn-cancel' | 'btn-ok';

export interface IModalActionsProps {
  cancelButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  okButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  onCancel?: (e: SyntheticEvent) => void;
  onOk?: (e: SyntheticEvent) => void;
  cancelText?: string | ReactNode;
  okText?: string | ReactNode;
  cancelType?: string;
  okType?: string;
  cancelAttrs?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'>;
  okAttrs?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'>;
}

const Actions = forwardRef<HTMLDivElement, StyledComponentProps<IModalActionsProps, ModalActionsClasses>>(
  ({ className, classes, style, cancelButtonRef, okButtonRef, onCancel, onOk, cancelText, okText, cancelType, okType, cancelAttrs, okAttrs }, ref) => {
    const intl = useIntl();
    const rootRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(ref, rootRef);

    const handleCancel: (e: SyntheticEvent) => void = (e) => {
      if (isFunction(onCancel)) onCancel(e);
    };

    const handleOk: (e: SyntheticEvent) => void = (e) => {
      if (isFunction(onOk)) onOk(e);
    };

    return (
      <div ref={handleRef} className={cx(className, classes?.root, styles.root)} style={style}>
        <Button
          ref={okButtonRef}
          variant="filled"
          shape="smooth"
          color="blue"
          {...okAttrs}
          className={cx(classes?.[`btn-ok`], styles[`btn-ok`])}
          type={okType ?? 'button'}
          onClick={handleOk}
        >
          {okText ?? <>{intl.formatMessage({ id: 'measures.ok' })}</>}
        </Button>
        <Button
          ref={cancelButtonRef}
          variant="outlined"
          shape="smooth"
          color="gray"
          {...cancelAttrs}
          className={cx(classes?.[`btn-cancel`], styles[`btn-cancel`])}
          type={cancelType ?? 'button'}
          onClick={handleCancel}
        >
          {cancelText ?? <>{intl.formatMessage({ id: 'measures.cancel' })}</>}
        </Button>
      </div>
    );
  }
);
Actions.displayName = 'Modal.Actions';

export default Actions;
