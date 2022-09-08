/** This file represents the default view of the component */
import React, { FC, ReactNode, SyntheticEvent } from 'react';
import { useId } from '@react-aria/utils';
import { ExclamationIcon, XCircleIcon, CheckCircleIcon, InformationCircleIcon, XIcon } from '@heroicons/react/solid';
import { isFunction, assign } from 'lodash';
import cx from 'classnames';

import Button from 'shared/ui/button';
import styles from './alert.module.css';

type AlertShape = 'smooth' | 'round' | null;
type AlertType = 'info' | 'success' | 'warn' | 'error' | null;
type AlertColor = Exclude<TailwindColor, 'transparent' | 'current'>;

export const DefaultShape: AlertShape = null;
export const DefaultType: AlertType = null;
export const DefaultColor: AlertColor = 'white';
export const DefaultRole = 'alert';

interface IAlertIconProps {
  icon?: React.SVGProps<ReactNode>;
}
/** Private Alert.Icon Component */
const Icon: FC<IAlertIconProps> = ({ icon }) => {
  return (
    <div className="h-5 w-5 flex-shrink-0" tabIndex={-1} aria-hidden="true">
      {icon}
    </div>
  );
};
Icon.displayName = 'Alert.Icon';

interface IAlertHeaderProps {
  id?: string;
  title?: ReactNode;
}
/** Private Alert.Header Component */
const Header: FC<IAlertHeaderProps> = ({ id, title }) => {
  return (
    <div>
      <h3 id={id}>{title}</h3>
    </div>
  );
};
Header.displayName = 'Alert.Header';

interface IAlertCloseButtonProps {
  onClick?: (e: SyntheticEvent) => void;
  color?: AlertColor;
}
/** Private Alert.CloseButton Component */
const CloseButton: FC<IAlertCloseButtonProps> = ({ onClick, color }) => {
  return (
    <Button
      className="absolute top-0 right-0 transform-gpu -translate-x-3 translate-y-3"
      size="xs"
      variant="flat"
      shape="circle"
      color={color}
      type="button"
      tabIndex={0}
      onClick={onClick}
    >
      <span className="sr-only">Dismiss</span>
      <XIcon className="h-5 w-5" focusable="false" aria-hidden="true" />
    </Button>
  );
};
CloseButton.displayName = 'Alert.CloseButton';
/** Object with icons according to the Alert type */
const defaultIconMapping: Record<Exclude<AlertType, null>, ReactNode> = {
  info: <InformationCircleIcon />,
  warn: <ExclamationIcon />,
  error: <XCircleIcon />,
  success: <CheckCircleIcon />,
};
/** get shape style from alert.module.css according to the received prop 'shape'(smooth, round or null)
 Default shape is 'null' */
const getShapeClasses = (shape: AlertShape) => {
  return styles?.[`${shape}`] ?? null;
};

/** get color style from alert.module.css according to the received prop 'color' Default color is 'white' */
const getColorClasses = (color: AlertColor) => {
  return styles?.[`${color}`] ?? null;
};

export interface IAlertProps {
  role?: string;
  shape?: AlertShape;
  type?: AlertType;
  color?: AlertColor;
  iconMapping?: typeof defaultIconMapping;
  icon?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  border?: boolean;
  closable?: boolean;
  onClose?: () => void | boolean | Promise<void> | Promise<boolean>;
}

/** We may transfer different props and get different views of the Alert component (some of them are default): 
 className - additional styles like margin, shadow, size, etc. 
 role - aria-role 
 shape - how much the corners are rounded 
 type - image of the icon in the header due to object on line 68 defaultIconMapping 
 color - main color of the alert 
 iconMapping -  if we need for the definite type another icon. iconMapping={{ warn: newIcon }} 
 icon - if we want to use another icon, that there is not from the defaultIconMapping. 
 the priority of icons is icon -> iconMapping -> defaultIconMapping
 actions - buttons that should be inside the alert
 title - if we need a header (send any text you want to see in the header)  
 border - if it's true, the left border appears on the alert
 closable - if true, the closing button (x-form) appears on the right-top of the alert 
 children - if it is necessary to add internal context inside the alert  */
const Alert: FC<StyledComponentProps<IAlertProps>> = ({
  className,
  role,
  shape,
  type,
  color,
  iconMapping,
  icon,
  actions,
  title,
  border,
  closable,
  children,
  onClose,
  ...attrs
}) => {
  const labelId = useId();
  const descId = useId();

  const cls = cx(getShapeClasses(shape ?? DefaultShape), getColorClasses(color ?? DefaultColor));
  const defaultIcon = iconMapping?.[`${type}`] ?? defaultIconMapping?.[`${type}`];
  const handleClose = () => {
    if (isFunction(onClose)) onClose();
  };

  return (
    <div
      {...attrs}
      className={cx(className, styles.root, cls, border && styles.border)}
      role={role ?? DefaultRole}
      aria-labelledby={labelId}
      aria-describedby={descId}
    >
      {closable && <CloseButton color={color} onClick={handleClose} />}
      <Icon icon={icon ?? defaultIcon} />
      <div className="flex-grow ml-3 mr-6">
        <Header id={labelId} title={title} />
        <article id={descId}>{children}</article>
        {actions && (
          <div className="mt-4">
            <div className="flex -mx-2 -my-1.5">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};
Alert.displayName = 'Alert';
Alert.defaultProps = {
  shape: DefaultShape,
  type: DefaultType,
  color: DefaultColor,
  role: DefaultRole,
  closable: false,
  border: false,
};

export interface ISnackbarProps extends Omit<IAlertProps, 'actions'> {
  dismiss?: () => void;
  actions?: ((close: () => Promise<void>) => ReactNode) | ReactNode;
}

/** Notification Component for the alert controlling without using the alert itself (closing, calling etc) */
const Notification: FC<StyledComponentProps<ISnackbarProps>> = ({ className, dismiss, actions, children, onClose, ...props }) => {
  const handleClose = async () => {
    let closing = true;
    if (isFunction(onClose)) closing = (await onClose()) ?? true;
    if (isFunction(dismiss) && closing) dismiss();
  };

  const effects = (fx: typeof handleClose) => {
    if (isFunction(actions)) return actions(fx);
    return actions;
  };

  return (
    <Alert
      {...props}
      className={cx(className, 'w-[320px] md:w-[480px] shadow')}
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      actions={effects(handleClose)}
      onClose={handleClose}
    >
      {children}
    </Alert>
  );
};
Notification.displayName = 'Alert.Notification';

export default assign(Alert, { Notification });
