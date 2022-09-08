import React, { FC, useState } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { IRole, IRoleRestriction } from 'shared/api/restrictions';
import { XIcon } from '@heroicons/react/outline';
import { securityModel } from 'features/restrictions';
import { SettingsSecurityRolesTable, SettingsSecurityUsersTable } from './setting.security.edit.modal';
import { useIntl } from 'react-intl';

interface IEditModal {
  onClose?: (value: boolean) => void;
  open: boolean;
  checkedRole?: IRole;
  refreshRole: () => void;
}

const SettingsSecurityEditModal: FC<IEditModal> = observer(({ open, onClose, checkedRole, refreshRole }) => {
  const intl = useIntl();

  const [restrictions, setRestrictions] = useState<IRoleRestriction[]>([]);
  const saveCheckedRoles = (data) => {
    setRestrictions(data);
  };
  const saveCheckedUsers = async (data) => {
    const newUsers = data.map((item) => {
      return { userID: item.id, roleID: checkedRole?.id };
    });
    try {
      if (checkedRole?.id !== undefined) {
        await securityModel.saveSecurity(restrictions, checkedRole.id, newUsers);
        await securityModel.getRolesUsers(checkedRole?.id);
      }
    } catch {}
  };

  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="bg-primary text-2xl text-white">
        <p>
          {intl.formatMessage({
            id: 'security.role',
          })}
          {checkedRole?.name}
        </p>
        <Button shape="circle" onClick={handleClose}>
          <XIcon className="w-6 h-6 color-white" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <SettingsSecurityRolesTable restrictedRole={checkedRole} saveCheckedRoles={saveCheckedRoles} />
        <SettingsSecurityUsersTable refreshRole={refreshRole} handleClose={handleClose} saveCheckedUsers={saveCheckedUsers} checkedRole={checkedRole} />
      </Modal.Body>
    </Modal>
  );
});
SettingsSecurityEditModal.displayName = 'SettingsSecurityEditModal';
export default SettingsSecurityEditModal;
