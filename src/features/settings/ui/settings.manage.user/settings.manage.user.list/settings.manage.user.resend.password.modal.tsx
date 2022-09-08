import React, { FC } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { XIcon } from '@heroicons/react/outline';
import { IUserPlatform } from 'shared/api/user';
import { addUser } from 'features/user';
import { useIntl } from 'react-intl';

interface IModalReinvite {
  onClose?: (value: boolean) => void;
  open: boolean;
  users?: IUserPlatform[] | undefined;
}

const SettingsMangeUserResendPasswordModal: FC<IModalReinvite> = observer(({ open, onClose, users }) => {
  const intl = useIntl();
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const resendInvite = async () => {
    const payload = users?.map((item) => {
      return { email: item?.email, inviteId: item?.inviteId, inviteUserId: item?.inviteUserId };
    });
    try {
      await addUser.userResendInvite(payload);
      handleClose();
    } catch {}
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Body className="flex justify-between">
        <div className=" w-5/6">
          {users?.length !== 0 ? (
            <div className="flex flex-col items-center">
              <p className="font-semibold m-3">{intl.formatMessage({ id: 'users.no.password' })}</p>
              <p className="m-3">{intl.formatMessage({ id: 'resend.invite.instead' })}</p>

              <Button shape="smooth" onClick={resendInvite}>
                {intl.formatMessage({ id: 'resend.invite' })}
              </Button>
            </div>
          ) : (
            <div>
              <p className="font-semibold m-3">{intl.formatMessage({ id: 'users.no.checked' })}</p>
            </div>
          )}
        </div>
        <div>
          <Button shape="circle" color="gray" onClick={handleClose}>
            <XIcon className="w-6 h-6" />
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});
SettingsMangeUserResendPasswordModal.displayName = 'SettingsMangeUserResendPasswordModal';
export default SettingsMangeUserResendPasswordModal;
