import React, { FC, MutableRefObject, useState } from 'react';
import Button from 'shared/ui/button/button';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { CalendarIcon } from '@heroicons/react/outline';
import { userModel } from 'features/user';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'shared/ui/date.picker';
import { useStateRef } from 'shared/hooks';
import { useGetSet } from 'react-use';
import SettingsMangeUserDeactivateModal from './settings.manage.deactivate.modal';
import { useIntl } from 'react-intl';

interface IModalInactivate {
  onClose?: (value: boolean) => void;
  open: boolean;
  selectedPractice: number | string | undefined;
  innerRef?: MutableRefObject<HTMLElement | null>;
}

const SettingsManageInactivateModal: FC<IModalInactivate> = observer(({ open, onClose, selectedPractice, innerRef }) => {
  const intl = useIntl();
  const [isOpenDeactivate, setIsOpenDeactivate] = useGetSet<boolean>(false);
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);

  const [dateForm, setDateForm] = useState<{ inactivateDate: Date }>();
  const practiceName = userModel?.data?.practices?.find((item) => item.id === selectedPractice);
  const toggleIsOpenDeactivate = (state?: boolean) => {
    const currentState = isOpenDeactivate();
    setIsOpenDeactivate(state ?? !currentState);
  };
  const handleClose = () => {
    if (onClose) {
      onClose(false);
    }
  };
  const { control, handleSubmit } = useForm<{ inactivateDate: Date }>({
    mode: 'onBlur',
    defaultValues: {
      inactivateDate: new Date(),
    },
  });
  return (
    <Modal open={open} onClose={onClose} innerRef={setInnerRef}>
      <Modal.Body>
        <div>
          <p className="font-semibold m-3">
            {intl.formatMessage({ id: 'inactivate.all.users' })} {practiceName?.name} - {practiceName?.id}
          </p>
          <form
            // ref={setInnerRef}
            onBlur={handleSubmit((data) => {
              return setDateForm(data);
            })}
          >
            <div className="flex items-end">
              <div className="flex flex-col m-2">
                <label className="form-helper-text" htmlFor="date-end">
                  {intl.formatMessage({ id: 'select.end.date' })}
                </label>
                <Controller
                  control={control}
                  name="inactivateDate"
                  render={({ field: { value, onChange } }) => (
                    <DatePicker date={value} container={formRef?.current} onDateChange={onChange}>
                      {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-end" {...inputProps} />}
                    </DatePicker>
                  )}
                />
              </div>
              <CalendarIcon className="w-6 h-6 ml-1 mb-3.5" />
            </div>
          </form>
          <div className="flex justify-end m-2">
            <Button color="gray" variant="outlined" className="m-2" shape="smooth" onClick={handleClose}>
              {intl.formatMessage({ id: 'cancel' })}
            </Button>
            <Button color="green" shape="smooth" className="m-2" onClick={() => toggleIsOpenDeactivate(true)}>
              {intl.formatMessage({ id: 'save' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
      <SettingsMangeUserDeactivateModal open={isOpenDeactivate()} onClose={toggleIsOpenDeactivate} dateForm={dateForm} practice={practiceName} />
    </Modal>
  );
});
SettingsManageInactivateModal.displayName = 'SettingsManageInactivateModal';
export default SettingsManageInactivateModal;
