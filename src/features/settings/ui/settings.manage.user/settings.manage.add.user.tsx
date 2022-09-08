import React, { FC, useState } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';
import SettingsManageInvite from './settings.manage.invite';

const SettingsManageAddUser: FC = observer(() => {
  const intl = useIntl();
  const [openInvite, updateArgsInvite] = useState(false);

  const [title, setTitle] = useState('');
  const [prescribeTitle, setPrescribeTitle] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [prescriber, setPrescriber] = useState(false);
  const subtitlePrescribe = (firstName: string, lastName: string) => {
    if (prescriber) {
      return `${intl.formatMessage({ id: 'header.userAllowedPrescribe' })} ${firstName} ${lastName}`;
    }
    return `${firstName} ${lastName} ${intl.formatMessage({ id: 'header.canPrescribe' })}`;
  };
  const attentionPrescribe = (firstName: string, lastName: string) => {
    if (prescriber) {
      return `${intl.formatMessage({ id: 'header.noUsersPrescribe' })} ${firstName} ${lastName}`;
    }
    return `${firstName} ${lastName} ${intl.formatMessage({ id: 'header.notAccessPrescribe' })}`;
  };

  const handleOpenInvite = () => {
    updateArgsInvite(true);
  };

  const handleCloseInvite = () => {
    updateArgsInvite(false);
  };
  return (
    <div className="w-full">
      <div className="bg-green-500 dark:bg-green-300 text-white text-xl lg:text-2xl p-5">{intl.formatMessage({ id: 'invite' })}</div>
      <div className="flex flex-col items-center">
        <p className="m-10">{intl.formatMessage({ id: 'invite.user.question' })}</p>
        <div className="flex justify-end">
          <Button
            variant="flat"
            size="lg"
            className="uppercase"
            onClick={() => {
              handleOpenInvite();
              setTitle(`${intl.formatMessage({ id: 'header.invitePrescriber' })}`);
              setPrescribeTitle(`${intl.formatMessage({ id: 'header.prescribeFor' })}`);
              setAddTitle(`${intl.formatMessage({ id: 'measures.addUser' })}`);
              setPrescriber(false);
            }}
          >
            {intl.formatMessage({ id: 'header.inviteNewPrescriber' })}
          </Button>
          <Button
            variant="flat"
            size="lg"
            className="uppercase"
            onClick={() => {
              handleOpenInvite();
              setTitle(`${intl.formatMessage({ id: 'header.inviteSupUser' })}`);
              setPrescribeTitle(`${intl.formatMessage({ id: 'header.prescribeUsing' })}`);
              setAddTitle(`${intl.formatMessage({ id: 'header.addPrescriber' })}`);
              setPrescriber(true);
            }}
          >
            {intl.formatMessage({ id: 'header.inviteNewSupUser' })}
          </Button>
        </div>
      </div>
      <SettingsManageInvite
        addTitle={addTitle}
        prescribeTitle={prescribeTitle}
        title={title}
        handleClose={handleCloseInvite}
        prescriber={prescriber}
        subtitlePrescribe={subtitlePrescribe}
        attentionPrescribe={attentionPrescribe}
        open={openInvite}
      />
    </div>
  );
});

SettingsManageAddUser.displayName = 'SettingsManageAddUser';
export default SettingsManageAddUser;
