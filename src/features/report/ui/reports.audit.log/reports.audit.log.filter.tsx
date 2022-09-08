import React, { FC, useState, useRef, useEffect, MutableRefObject, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import Button from 'shared/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { observer, Observer } from 'mobx-react-lite';
import Select from 'shared/ui/select';
import { userModel } from 'features/user';
import { map } from 'lodash';
import { DownloadIcon, TrashIcon, UsersIcon } from '@heroicons/react/outline';
import DatePicker from 'shared/ui/date.picker';
import moment from 'moment';
import ReportsAuditLogAddUser from './reports.audit.log.add.user';
import { useGetSet } from 'react-use';
import { useStateRef } from 'shared/hooks';
import type { IAuditLogFilter } from 'shared/api/auditlog';
import { toJS } from 'mobx';
import { auditLogModel } from 'features/auditlog';
import { reportsStore } from 'features/report';
import { IAuditLogUsers } from 'shared/api/report';

interface IReportsAuditLogFilterProps {
  innerRef?: MutableRefObject<HTMLElement | null>;
}

const ReportsAuditLogFilter: FC<IReportsAuditLogFilterProps> = observer(({ innerRef }) => {
  const intl = useIntl();
  const mainUser = toJS(userModel?.data?.user);
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);
  const [checkedAuditUsers, setCheckedAuditUsers] = useState<IAuditLogUsers[] | any[]>([mainUser] ?? []);
  const [isOpenAddUser, setIsOpenAddUser] = useGetSet<boolean>(false);
  const { control, handleSubmit, reset } = useForm<IAuditLogFilter<string | number>>({
    mode: 'onChange',
    defaultValues: {
      users: [],
      practiceId: '',
      startDate: new Date(),
      endDate: new Date(),
      auditLogTypeId: '',
      lastAuditLogId: -1,
      offset: 0,
    },
  });
  useEffect(() => {
    async function fetchAPI() {
      try {
        await auditLogModel.getAuditLogTypes();
      } catch {}
    }
    fetchAPI();
  }, []);
  const addCheckedAuditUsers = (users) => {
    setCheckedAuditUsers(users);
  };
  const deleteAuditUser = (user) => {
    const deletedUsers = checkedAuditUsers.filter((item) => user.id !== item.id);
    setCheckedAuditUsers(deletedUsers);
  };
  const sendForm = async (data) => {
    const newForm = { ...data, users: checkedAuditUsers };
    try {
      await auditLogModel.searchAuditLog(newForm);
    } catch {}
  };
  const toggleIsOpenAddUser = (state?: boolean) => {
    const currentState = isOpenAddUser();
    setIsOpenAddUser(state ?? !currentState);
  };
  const resetForm = useCallback((e) => {
    e.preventDefault();
    reset({
      users: [],
      practiceId: '',
      startDate: new Date(),
      endDate: new Date(),
      auditLogTypeId: '',
      lastAuditLogId: '-1',
      offset: '0',
    });
  }, []);
  return (
    <div>
      <form
        ref={setInnerRef}
        className="flex flex-col items-start m-2 text-primary bg-primary"
        onSubmit={handleSubmit((data) => {
          sendForm(data);
        })}
      >
        {/* @ts-ignore */}
        <Controller
          control={control}
          name="practiceId"
          render={({ field: { value, onChange } }) => (
            <Observer>
              {() => (
                <Select
                  container={formRef?.current}
                  className="form-control md:flex-auto md:w-4/6 my-3"
                  classes={{ placeholder: 'w-full', options: '!w-auto' }}
                  shape="round"
                  label={<label className="form-label">{intl.formatMessage({ id: 'reports.measures.practice' })}</label>}
                  options={map(userModel.data?.practices, (practice) => ({
                    value: Number(practice?.id),
                    label: practice?.name,
                  }))}
                  name="practiceId"
                  value={value}
                  onChange={onChange}
                />
              )}
            </Observer>
          )}
        />
        {checkedAuditUsers.length !== 0 &&
          map(checkedAuditUsers, (user, index) => (
            <div className="flex justify-between items-center" key={index.toString(36)}>
              <span>
                {user.firstName} {user.lastName}
              </span>
              <Button color="gray" shape="circle" variant="flat" onClick={() => deleteAuditUser(user)}>
                <TrashIcon className="w-6 h-6" />
              </Button>
            </div>
          ))}

        <Button shape="round" className="uppercase my-3" onClick={() => toggleIsOpenAddUser(true)}>
          <UsersIcon className="w-6 h-6 mr-2" />
          {intl.formatMessage({ id: 'measures.addUser' })}
        </Button>
        <Controller
          control={control}
          name="auditLogTypeId"
          render={({ field: { value, onChange } }) => (
            <Observer>
              {() => (
                <Select
                  container={formRef?.current}
                  className="form-control md:flex-auto md:w-4/6 my-3"
                  classes={{ placeholder: 'w-full', options: '!w-auto' }}
                  shape="round"
                  label={<label className="form-label">{intl.formatMessage({ id: 'reports.measures.auditLogType' })}</label>}
                  options={map(toJS(auditLogModel.auditLogTypes), (type) => ({
                    value: String(type?.auditLogTypeId),
                    label: type?.description,
                  }))}
                  name="auditLogTypeId"
                  value={value}
                  onChange={onChange}
                />
              )}
            </Observer>
          )}
        />
        <div className="flex -ml-2">
          <div className="flex flex-col m-2">
            <label className="form-helper-text" htmlFor="date-start">
              {intl.formatMessage({ id: 'reports.measures.startDate' })}
            </label>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker date={value} container={innerRef?.current} onDateChange={onChange}>
                  {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
                </DatePicker>
              )}
            />
          </div>
          <div className="flex flex-col m-2">
            <label className="form-helper-text" htmlFor="date-end">
              {intl.formatMessage({ id: 'measures.endDate' })}
            </label>
            <Controller
              control={control}
              name="endDate"
              render={({ field: { value, onChange } }) => (
                <DatePicker date={value} container={innerRef?.current} onDateChange={onChange}>
                  {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-end" {...inputProps} />}
                </DatePicker>
              )}
            />
          </div>
        </div>
        <div className="flex">
          <Button className="uppercase m-2 ml-0" color="green" shape="round" type="submit">
            {intl.formatMessage({ id: 'measures.search' })}
          </Button>
          <Button className="uppercase m-2" shape="round" onClick={(e) => resetForm(e)}>
            {intl.formatMessage({ id: 'reports.measures.clearSearch' })}
          </Button>
          <Button variant="flat" color="gray" shape="circle">
            <DownloadIcon className="w-6 h-6 m-2" />
          </Button>
        </div>
        <ReportsAuditLogAddUser
          innerRef={formRef}
          open={isOpenAddUser()}
          onClose={toggleIsOpenAddUser}
          addCheckedAuditUsers={addCheckedAuditUsers}
          checkedAuditUsers={checkedAuditUsers}
        />
      </form>
    </div>
  );
});

ReportsAuditLogFilter.displayName = 'ReportsAuditLogFilter';
export default ReportsAuditLogFilter;
