import React, { FC, useState, useEffect } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { IRole } from 'shared/api/restrictions';
import { XIcon } from '@heroicons/react/outline';
import { useIntl } from 'react-intl';
import { useGetSet } from 'react-use';
import { SettingsSecurityRestrictionTable, SettingsSecurityResultTable } from './setting.security.view.modal';
import SettingsSecurityEditModal from './settings.security.edit.modal';
import { securityModel } from 'features/restrictions';
import { toJS } from 'mobx';
import { userModel } from 'features/user';

interface IViewModal {
  onClose?: (value: boolean) => void;
  open: boolean;
  checkedRole?: IRole;
}

const SettingsSecurityViewModal: FC<IViewModal> = observer(({ open, onClose, checkedRole }) => {
  const intl = useIntl();
  const [role, setRole] = useState(checkedRole);
  const [isOpenView, setIsOpenView] = useGetSet<boolean>(false);
  const toggleIsOpenView = (state?: boolean) => {
    const currentState = isOpenView();
    setIsOpenView(state ?? !currentState);
  };
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  useEffect(() => {
    setRole(checkedRole);
  }, [checkedRole, role]);
  const refreshRole = async () => {
    try {
      const organizationId = userModel.data?.currentOrganization?.id;
      if (organizationId !== undefined) await securityModel.getRolesUsers(organizationId);
      if (checkedRole?.id !== undefined) await securityModel.getRestrictions(checkedRole?.id);
      if (securityModel?.userRoles !== null) setRole(toJS(securityModel?.userRoles).find((item) => item.id === checkedRole?.id));
    } catch {}
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="bg-primary text-xl text-white">
        <p>
          {intl.formatMessage({
            id: 'role',
          })}
          <span className="font-semibold text-2xl"> {checkedRole?.name}</span>
        </p>
        <Button shape="circle" onClick={handleClose}>
          <XIcon className="w-6 h-6 color-white" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="flex justify-end">
          <Button color="green" shape="smooth" onClick={() => toggleIsOpenView(true)}>
            {intl.formatMessage({ id: 'measures.edit' })}
          </Button>
        </div>
        <SettingsSecurityResultTable restrictedUsers={role} />
        <SettingsSecurityRestrictionTable roleId={checkedRole?.id} />
      </Modal.Body>
      <SettingsSecurityEditModal open={isOpenView()} refreshRole={refreshRole} onClose={toggleIsOpenView} checkedRole={role} />
    </Modal>
  );
});
SettingsSecurityViewModal.displayName = 'SettingsSecurityViewModal';
export default SettingsSecurityViewModal;
