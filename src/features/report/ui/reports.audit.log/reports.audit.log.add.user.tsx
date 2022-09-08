import React, { FC, useState, useRef, useEffect, MutableRefObject, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { observer } from 'mobx-react-lite';
import { CheckIcon, MenuAlt1Icon } from '@heroicons/react/solid';
import Tooltip from 'shared/ui/tooltip';
import { useStateRef } from 'shared/hooks';
import { reportsStore } from 'features/report';
import { userModel } from 'features/user';
import { map } from 'lodash';
import { toJS } from 'mobx';
import { IAuditLogUsers } from 'shared/api/report';
import { ViewGridAddIcon } from '@heroicons/react/outline';

interface IMeasureAudit {
  innerRef?: MutableRefObject<HTMLElement | null>;
  onClose?: (value: boolean) => void;
  open: boolean;
  checkedAuditUsers: IAuditLogUsers[];
  addCheckedAuditUsers: (value: IAuditLogUsers[]) => void;
}

const ReportsAuditLogAddUser: FC<IMeasureAudit> = observer(({ open, onClose, innerRef, checkedAuditUsers, addCheckedAuditUsers }) => {
  const intl = useIntl();
  const auditLogUsers = toJS(reportsStore.auditLogUsers);
  const [auditUser, setAuditUser] = useState(auditLogUsers);
  const [checkedUsers, setCheckedUsers] = useState<IAuditLogUsers[]>(checkedAuditUsers);
  useEffect(() => {
    setAuditUser(auditLogUsers);
    const organizationID = userModel.data?.currentOrganization?.id;
    async function fetchAPI() {
      try {
        await reportsStore.getAllAuditUsers(organizationID);
      } catch {}
    }
    if (userModel?.data === null) return;
    fetchAPI();
  }, [setAuditUser]);
  // const ReportsAuditLogAddUser: FC<IMeasureAudit> = observer(({ open, onClose, innerRef }) => {
  //   useEffect(() => {
  //     const organizationID = userModel.data?.currentOrganization?.id;
  //     async function fetchAPI() {
  //       try {
  //         await reportsStore.getAllAuditUsers(organizationID);
  //       } catch {}
  //     }
  //     fetchAPI();
  //   }, []);
  //   const [auditUser, setAuditUser] = useState(toJS(reportsStore.auditLogUsers));
  //   const changeInput = useCallback(
  //     (event: React.ChangeEvent<HTMLInputElement>) => {
  //       const newList = auditUser.filter(
  //         (item) =>
  //           item?.firstName?.toLowerCase().includes(event.target.value) ||
  //           item?.lastName?.toLowerCase().includes(event.target.value)
  //       );
  //       setAuditUser(newList);
  //     },
  //     [setAuditUser]
  //   );
  //   const clearSearch = () => {
  //     setAuditUser(toJS(reportsStore.auditLogUsers));
  //   };
  //   return (
  //     <Modal ref={innerRef} open={open} onClose={onClose} className="md:max-w-4xl">
  //       <Modal.Header as="h5" className="text-xl text-white bg-green-500">
  //         <p>User ({auditUser.length})</p>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <div className="bg-primary m-2">
  //           <div className="flex justify-between">
  //             <input
  //               type="text"
  //               placeholder="Search for last name..."
  //               className="w-5/6 shadow-lg form-input"
  //               onChange={(event) => changeInput(event)}
  //             />
  //             <Button className="uppercase shadow-lg" variant="flat" color="black" onClick={clearSearch}>
  //               <MenuAlt1Icon className="w-6 h-6 mr-2" />
  //               Clear
  //             </Button>
  //           </div>
  //           {map(auditUser, (user, index) => (
  //             <Button color="gray" variant="flat" className="flex justify-between w-full" key={index.toString(36)}>
  //               <div className="flex justify-start items-center">
  //                 <input className="form-checkbox m-0 mr-4" type="checkbox" />
  //                 <ul>
  //                   <li className="text-lg">
  //                     {user.lastName}, {user.firstName}
  //                   </li>
  //                   <li>{user.userType}</li>
  //                   <li>{user.npi}</li>
  //                 </ul>
  //               </div>
  //               <Tooltip content="ADD USER">
  //                 <Button className="uppercase" variant="flat" size="md" color="black">
  //                   add
  //                 </Button>
  //               </Tooltip>
  //             </Button>
  //           ))}

  const changeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newList = auditUser.filter(
        (item) => item?.firstName?.toLowerCase().includes(event.target.value) || item?.lastName?.toLowerCase().includes(event.target.value)
      );
      setAuditUser(newList);
    },
    [setAuditUser]
  );

  const addUser = (user) => {
    const sameUser = !!checkedUsers.find((item) => item.id === user.id);
    const reduceUser = checkedUsers.filter((item) => item.id !== user.id);

    const newUser = sameUser ? reduceUser : [...checkedUsers, user];
    setCheckedUsers(newUser);
  };
  const clearSearch = () => {
    setAuditUser(auditLogUsers);
  };
  const findChecked = (itemChecked) => {
    const checked = checkedUsers.find((item) => item.id === itemChecked.id);
    return !!checked;
  };
  const checkAll = () => {
    setCheckedUsers(auditUser);
  };
  const uncheckAll = () => {
    setCheckedUsers([]);
  };
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const addSingleUser = (user) => {
    addUser(user);
    addCheckedAuditUsers(checkedUsers);
  };
  const addCheckedUsers = () => {
    handleClose();
    addCheckedAuditUsers(checkedUsers);
  };
  return (
    <Modal ref={innerRef} open={open} onClose={onClose} className="md:max-w-4xl">
      <Modal.Header as="h5" className="text-xl text-white bg-green-500">
        <p>
          {intl.formatMessage({ id: 'measures.user' })} ({auditUser.length})
        </p>
      </Modal.Header>
      <Modal.Body>
        <div className="bg-primary m-2">
          <div className="flex justify-between">
            <input
              type="text"
              placeholder={intl.formatMessage({ id: 'reports.measures.searchLastName' })}
              className="w-5/6 shadow-lg form-input"
              onChange={(event) => changeInput(event)}
            />
            <Button className="uppercase shadow-lg" variant="flat" color="black" onClick={clearSearch}>
              <MenuAlt1Icon className="w-6 h-6 mr-2" />
              {intl.formatMessage({ id: 'reports.measures.clear' })}
            </Button>
          </div>
          {auditLogUsers.length !== 0 &&
            map(auditUser, (user, index) => (
              <Button color="gray" variant="flat" className="flex justify-between w-full" key={index.toString(36)} onClick={() => addUser(user)}>
                <div className="flex justify-start items-center">
                  <input className="form-checkbox m-0 mr-4" type="checkbox" checked={findChecked(user)} readOnly />
                  <ul className="mx-5">
                    <li className="text-lg">
                      {user.lastName}, {user.firstName}
                    </li>
                    <li>{user.userType}</li>
                    <li>{user.npi}</li>
                  </ul>
                </div>
                <Tooltip content={intl.formatMessage({ id: 'measures.addUser' })}>
                  <Button className="uppercase" variant="flat" size="md" color="black" onClick={() => addSingleUser(user)}>
                    {intl.formatMessage({ id: 'measures.add' })}
                  </Button>
                </Tooltip>
              </Button>
            ))}

          <div className="flex justify-between">
            <div className="flex justify-start">
              <Button className="uppercase shadow-lg mx-2" color="black" onClick={checkAll}>
                <CheckIcon className="w-6 h-6 mr-2" />
                {intl.formatMessage({ id: 'measures.checkAll' })}
              </Button>
              <Button className="uppercase shadow-lg" color="black" onClick={uncheckAll}>
                <div className="w-4 h-4 border-white border-2 mr-2" />
                {intl.formatMessage({ id: 'measures.uncheckAll' })}
              </Button>
            </div>
            <div className="flex justify-end">
              {checkedUsers.length !== 0 && (
                <Button onClick={addCheckedUsers}>
                  <ViewGridAddIcon className="w-5 h-5 mr-3" />
                  <span className="uppercase">
                    {intl.formatMessage({ id: 'measures.addChecked' })} ({checkedUsers.length})
                  </span>
                </Button>
              )}
              <Button className="uppercase shadow-lg mx-2" color="black" onClick={handleClose}>
                {intl.formatMessage({ id: 'measures.close' })}
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

ReportsAuditLogAddUser.displayName = 'ReportsAuditLogAddUser';
export default ReportsAuditLogAddUser;
