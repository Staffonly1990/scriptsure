import React, { FC, useRef, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNotifier } from 'react-headless-notifier';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react-lite';
import { isNil, isFunction, debounce } from 'lodash';
import cx from 'classnames';

import { OActionStatus } from 'shared/lib/model';
import Modal, { IModalProps } from 'shared/ui/modal';
import Alert from 'shared/ui/alert';
import Button from 'shared/ui/button';
import Spinner from 'shared/ui/spinner';
import { userModel } from 'features/user';
import { loginModalModel } from '../model';

interface ILoginModalProps extends Pick<IModalProps, 'open' | 'unmount' | 'hideBackdrop' | 'onClose'> {
  onLogin?: () => void;
}

interface ILoginFormInputs {
  email: string;
  password: string;
}

const LoginModal: FC<ILoginModalProps> = observer(({ open, unmount, hideBackdrop, onClose, onLogin }) => {
  const intl = useIntl();
  const { notify } = useNotifier();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<ILoginFormInputs>({ mode: 'onChange' });

  const focusElementRef = useRef<HTMLButtonElement | null>(null);
  const isSubmitPending = userModel.status.login === 'pending';
  const isSubmitDisabled = (isSubmitted && !isValid) || isSubmitPending;

  useEffect(() => {
    if (!isNil(userModel.errors.login)) {
      notify(
        <Alert.Notification shape="smooth" type="error" color="red" border closable>
          {userModel.errors.login}
        </Alert.Notification>
      );
    }
  }, [userModel.errors.login]);

  const onSubmit: SubmitHandler<ILoginFormInputs> = async (data) => {
    const { email, password } = data;
    try {
      await userModel.login({ email, password });
    } catch {}
    if (isNil(userModel.errors.login)) {
      try {
        await userModel.fetch();
        if (userModel.isLoggedIn) {
          if (isFunction(onLogin)) onLogin();
          reset();
        }
      } catch {}
    }
  };

  const handleForgotEmail = useMemo(
    () =>
      debounce(async () => {
        if (loginModalModel.status.forgotEmail === OActionStatus.Pending) return;
        const forgotEmailUrl = await flowResult(loginModalModel.forgotEmail());
        if (forgotEmailUrl) window.location.assign(forgotEmailUrl);
      }, 300),
    []
  );

  const handleForgotPassword = useMemo(
    () =>
      debounce(async () => {
        if (loginModalModel.status.forgotPassword === OActionStatus.Pending) return;
        const forgotPasswordUrl = await flowResult(loginModalModel.forgotPassword());
        if (forgotPasswordUrl) window.location.assign(forgotPasswordUrl);
      }, 300),
    []
  );

  return (
    <Modal
      as="form"
      className="sm:!max-w-md"
      classes={{ backdrop: '!bg-primary' }}
      open={open}
      keyboard={false}
      unmount={unmount}
      autoComplete="off"
      hideBackdrop={hideBackdrop}
      initialFocus={focusElementRef}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
    >
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          ScriptSure {intl.formatMessage({ id: 'login.measures.login' })}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="form-control w-full mb-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="email" className="form-label">
            {intl.formatMessage({ id: 'login.measures.email' })}
          </label>
          <input
            className={cx('form-input w-full px-4 py-2', {
              __error: errors.email || !isNil(userModel.errors.login),
            })}
            id="email"
            type="email"
            autoComplete="off"
            readOnly={isSubmitPending}
            {...register('email', { required: true })}
          />
          <div className="flex items-center justify-between">
            {errors.email?.type === 'required' && <span className="form-helper-text __error">{intl.formatMessage({ id: 'fields.error.required' })}</span>}
            <button className="form-helper-text __end text-blue-500 hover:underline" type="button" onClick={handleForgotEmail}>
              {intl.formatMessage({ id: 'login.measures.forgotEmail' })}
            </button>
          </div>
        </div>

        <div className="form-control w-full">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="password" className="form-label">
            {intl.formatMessage({ id: 'login.measures.password' })}
          </label>
          <input
            className={cx('form-input w-full px-4 py-2 rounded', {
              __error: errors.password || !isNil(userModel.errors.login),
            })}
            id="password"
            type="password"
            autoComplete="new-password"
            readOnly={isSubmitPending}
            {...register('password', { required: true })}
          />
          <div className="flex items-center justify-between">
            {errors.password?.type === 'required' && <span className="form-helper-text __error">{intl.formatMessage({ id: 'fields.error.required' })}</span>}
            <button className="form-helper-text __end text-blue-500  hover:underline" type="button" onClick={handleForgotPassword}>
              {intl.formatMessage({ id: 'login.measures.forgotPassword' })}
            </button>
          </div>
        </div>
      </Modal.Body>

      <div className="flex justify-end px-3 py-3 sm:px-4 sm:py-2.5">
        <Button ref={focusElementRef} variant="filled" shape="smooth" color="blue" type="submit" disabled={isSubmitDisabled}>
          {isSubmitPending && <Spinner className="mr-2" size="sm" />}
          {intl.formatMessage({ id: 'login.measures.login' })}
        </Button>
      </div>
    </Modal>
  );
});
LoginModal.displayName = 'LoginModal';

export default LoginModal;
