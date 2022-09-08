import React, { FC } from 'react';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import Invite from 'features/user/ui/add.user/invite';

interface ISettingsManageInvite {
  handleClose: () => void;
  open: boolean;
  title: string;
  prescribeTitle: string;
  addTitle: string;
  prescriber: boolean;
  subtitlePrescribe: (firstName: string, lastName: string) => string;
  attentionPrescribe: (firstName: string, lastName: string) => string;
}

const SettingsManageInvite: FC<ISettingsManageInvite> = observer(
  ({ addTitle, prescriber, prescribeTitle, title, subtitlePrescribe, attentionPrescribe, handleClose, open }) => {
    return (
      <Modal className="!max-w-none w-7/12" open={open}>
        <Invite
          addTitle={addTitle}
          prescribeTitle={prescribeTitle}
          title={title}
          close={handleClose}
          prescriber={prescriber}
          subtitlePrescribe={subtitlePrescribe}
          attentionPrescribe={attentionPrescribe}
        />
      </Modal>
    );
  }
);

SettingsManageInvite.displayName = 'SettingsManageInvite';
export default SettingsManageInvite;
