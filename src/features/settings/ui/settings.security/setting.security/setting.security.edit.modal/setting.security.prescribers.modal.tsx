import React, { FC, useState } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { toJS } from 'mobx';
import { IUser } from 'shared/api/user';
import PopupList from 'features/prescriber/ui/popup.list';
import { currentPrescriber } from 'features/prescriber';
import Tooltip from 'shared/ui/tooltip';
import { useIntl } from 'react-intl';
import { unionWith, isEqual } from 'lodash';

interface IModalPrescribers {
  isCheckedPrescribers: (value?: Partial<IUser>[]) => void;
  checkedPrescribers?: IUser[];
}

const SettingsSecurityPrescribersModal: FC<IModalPrescribers> = observer(({ isCheckedPrescribers, checkedPrescribers }) => {
  const intl = useIntl();

  const [checkedUsers, setCheckedUsers] = useState<Partial<IUser>[]>(checkedPrescribers || []);
  const addCheckedUsers = (type) => {
    const users = toJS(currentPrescriber.selectUsers);
    const newList = unionWith(users, checkedUsers, isEqual);
    setCheckedUsers(newList);
  };
  const addPrescriber = (userData) => {
    const user = toJS(userData);
    const repeatedUser = !!checkedUsers.find((item) => item.id === user.id);
    const addedPrescriber = repeatedUser ? checkedUsers : [...checkedUsers, user];
    setCheckedUsers(addedPrescriber);
  };
  const onClosePopup = () => {
    currentPrescriber.nullify();
    isCheckedPrescribers(checkedUsers);
    setCheckedUsers([]);
  };

  const grantAccess = async () => {
    try {
      await currentPrescriber.grantAccess();
    } catch {}
  };
  const having = (user: Partial<IUser>) => {
    let check = false;
    currentPrescriber.selectUsers.forEach((value) => {
      if (value === user) {
        check = true;
      }
    });
    return check;
  };
  const grantList = () => {
    if (currentPrescriber.showUsers.length) {
      return (
        <ul className="divide-y divide-gray-200 max-h-96">
          {currentPrescriber.showUsers.map((user) => (
            <li className="hover:bg-gray-200">
              <label
                onChange={() => {
                  currentPrescriber.selectUser(user);
                }}
                className="flex items-center h-full w-full cursor-pointer px-1 py-2"
              >
                <input checked={having(user)} className="form-checkbox" type="checkbox" />
                <div className="form-control-label_label w-full flex items-center justify-between">
                  <div>
                    <div>{`${user.lastName} ${user.firstName}`}</div>
                    <div>{user.userType}</div>
                    <div>{user.email}</div>
                    <div>
                      {intl.formatMessage({
                        id: 'npi',
                      })}
                      {user.npi}
                    </div>
                  </div>
                  <Tooltip
                    content={intl.formatMessage({
                      id: 'measures.Add user',
                    })}
                  >
                    <Button
                      onClick={() => {
                        addPrescriber(user);
                      }}
                      className="h-full"
                      variant="flat"
                      shape="smooth"
                      color="gray"
                    >
                      <PlusCircleIcon stroke="red" className="w-5 h-5 mr-3" />
                      <span className="text-md leading-5 xl:block text-red-500 uppercase">
                        {intl.formatMessage({
                          id: 'measures.add',
                        })}
                      </span>
                    </Button>
                  </Tooltip>
                </div>
              </label>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <PopupList
      title={`User(${currentPrescriber.showUsers.length})`}
      searchBtns
      renderList={grantList}
      getList={grantAccess}
      type="grantUsers"
      addChecked={addCheckedUsers}
      onClose={onClosePopup}
    >
      <Button shape="smooth" className="m-2">
        Add User
      </Button>
    </PopupList>
  );
});
SettingsSecurityPrescribersModal.displayName = 'SettingsSecurityPrescribersModal';
export default SettingsSecurityPrescribersModal;
