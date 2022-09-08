import React, { ChangeEvent, FC, useState } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { securityModel } from 'features/restrictions';
import { userModel } from 'features/user';
import { useIntl } from 'react-intl';

interface IAddRoleModal {
  onClose?: (value: boolean) => void;
  open: boolean;
}

const SettingsSecurityAddRolesModal: FC<IAddRoleModal> = observer(({ open, onClose }) => {
  const intl = useIntl();

  const [inputRole, setInputRole] = useState('');
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const toggleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputRole(event.target.value);
  };
  const saveRole = async () => {
    const id = userModel.data?.currentOrganization?.id;
    try {
      if (inputRole.length !== 0) await securityModel.addRole({ name: inputRole, organizationId: id });
      if (id) await securityModel.getRolesUsers(id);
    } catch {}
    setInputRole('');
    handleClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header as="h5" className="bg-primary text-2xl text-white">
        {intl.formatMessage({
          id: 'security.add.role',
        })}
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col">
          <input type="text" className="form-input" onChange={toggleInput} />
          <div className="flex justify-end mt-3">
            <Button shape="smooth" color="gray" variant="outlined" className="m-3" onClick={handleClose}>
              {intl.formatMessage({
                id: 'cancel',
              })}
            </Button>
            <Button className="m-3 mr-0" shape="smooth" onClick={saveRole}>
              {intl.formatMessage({
                id: 'vital.measures.save',
              })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});
SettingsSecurityAddRolesModal.displayName = 'SettingsSecurityAddRolesModal';
export default SettingsSecurityAddRolesModal;
