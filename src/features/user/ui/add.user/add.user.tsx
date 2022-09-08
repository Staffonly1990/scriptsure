import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import Dropdown from 'shared/ui/dropdown';
import Button from 'shared/ui/button';
import { UserAddIcon } from '@heroicons/react/solid';
import { PlusIcon } from '@heroicons/react/outline';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Modal from 'shared/ui/modal';
import Invite from './invite';

const AddUser: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const [open, updateArgs] = useState(false);

  const [title, setTitle] = useState('');
  const [prescribeTitle, setPrescribeTitle] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [prescriber, setPrescriber] = useState(false);
  const intl = useIntl();

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

  const handleOpen = () => {
    updateArgs(true);
  };

  const handleClose = () => {
    updateArgs(false);
  };

  return (
    <>
      <Dropdown
        list={[
          <Dropdown.Item
            onClick={() => {
              handleOpen();
              setTitle(`${intl.formatMessage({ id: 'header.invitePrescriber' })}`);
              setPrescribeTitle(`${intl.formatMessage({ id: 'header.prescribeFor' })}`);
              setAddTitle(`${intl.formatMessage({ id: 'measures.addUser' })}`);
              setPrescriber(false);
            }}
          >
            <UserAddIcon className="w-4 h-4 mr-2" />
            {intl.formatMessage({ id: 'header.inviteNewPrescriber' })}
          </Dropdown.Item>,
          <Dropdown.Item
            onClick={() => {
              handleOpen();
              setTitle(`${intl.formatMessage({ id: 'header.inviteSupUser' })}`);
              setPrescribeTitle(`${intl.formatMessage({ id: 'header.prescribeUsing' })}`);
              setAddTitle(`${intl.formatMessage({ id: 'header.addPrescriber' })}`);
              setPrescriber(true);
            }}
          >
            <UserAddIcon className="w-4 h-4 mr-2" />
            {intl.formatMessage({ id: 'header.inviteNewSupUser' })}
          </Dropdown.Item>,
        ]}
      >
        <Button variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'}>
          <PlusIcon className="w-4 h-4 !rounded !text-white !bg-green-600 lg:mr-2" />
          <span className="hidden lg:inline">{intl.formatMessage({ id: 'measures.addUser' })}</span>
        </Button>
      </Dropdown>

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
    </>
  );
});

AddUser.displayName = 'AddUser';
export default AddUser;
