import React, { FC } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { XIcon } from '@heroicons/react/outline';
import { IRole } from 'shared/api/restrictions';
import securityModel from 'features/restrictions/model/security.model';
import { userModel } from 'features/user';
import { useIntl } from 'react-intl';

interface IModalArchive {
  onClose?: (value: boolean) => void;
  open: boolean;
  checkedRole?: IRole;
}

const SettingsSecurityDeleteRoleModal: FC<IModalArchive> = observer(({ open, onClose, checkedRole }) => {
  const intl = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const deleteRole = async () => {
    if (checkedRole) {
      try {
        await securityModel.deleteRole(checkedRole);
        const id = userModel.data?.currentOrganization?.id;
        if (id) await securityModel.getRolesUsers(id);
      } catch {}
    }
    handleClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="flex justify-between items-center bg-primary text-2xl text-white">
        <p>Delete role</p>
        <Button shape="circle" onClick={handleClose}>
          <XIcon className="w-6 h-6 color-white" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <p>
          {intl.formatMessage({
            id: 'security.delete.role.clarification',
          })}
        </p>
        <div className="flex justify-end mt-3">
          <Button shape="smooth" color="gray" variant="outlined" className="m-3" onClick={handleClose}>
            {intl.formatMessage({
              id: 'cancel',
            })}
          </Button>
          <Button className="m-3 mr-0" shape="smooth" onClick={deleteRole}>
            {intl.formatMessage({
              id: 'security.delete.role',
            })}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});
SettingsSecurityDeleteRoleModal.displayName = 'SettingsSecurityDeleteRoleModal';
export default SettingsSecurityDeleteRoleModal;
