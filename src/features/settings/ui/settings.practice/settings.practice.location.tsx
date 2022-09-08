import React, { FC, useState, useEffect } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import { addUser } from 'features/user';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { toJS } from 'mobx';
import MaskFormat from 'shared/ui/mask.format';
import { SettingsPracticeEditView, SettingsPracticeInactivateModal } from './setting.practice.locations';
import { useGetSet } from 'react-use';
import { practiceModel } from 'features/practice';
import { useIntl } from 'react-intl';

const SettingsPracticeLocation: FC = observer(() => {
  const intl = useIntl();

  const [isOpenEditView, setIsOpenEditView] = useGetSet<boolean>(false);
  const [isOpenInactivateView, setIsOpenInactivateView] = useGetSet<boolean>(false);
  const [allPractice, setAllPractice] = useState(false);
  const [editable, setEditable] = useState<boolean>();

  const toggleIsOpenEditView = (state?: boolean) => {
    const currentState = isOpenEditView();
    setIsOpenEditView(state ?? !currentState);
  };
  const toggleIsOpenInactivateView = (state?: boolean) => {
    const currentState = isOpenInactivateView();
    setIsOpenInactivateView(state ?? !currentState);
  };
  const fetchPractices = async () => {
    try {
      await addUser.fetchPractices();
    } catch {}
  };
  useEffect(() => {
    if (addUser.practices?.length === 0) {
      fetchPractices();
    }
  }, []);
  const getAdminPractice = async (id, modalName) => {
    try {
      await practiceModel.getCurrentAdminPractice(id);
      setEditable(true);
    } catch {}
    if (modalName === 'edit') {
      return toggleIsOpenEditView(true);
    }
    return toggleIsOpenInactivateView(true);
  };
  const allPractices = toJS(addUser.practices);
  const activePractices = allPractices.filter((item) => item.practiceStatus === 0);
  const checkedPractices = allPractice ? activePractices : allPractices;
  return (
    <div className="w-full lg:w-2/3">
      <div className="flex justify-between mt-3">
        <Button shape="round" className="uppercase m-2" size="lg" onClick={() => setAllPractice(!allPractice)}>
          {allPractice ? intl.formatMessage({ id: 'show.active' }) : intl.formatMessage({ id: 'show.all' })}
        </Button>
        <Button
          shape="round"
          size="lg"
          className="uppercase m-2"
          color="green"
          onClick={() => {
            toggleIsOpenEditView(true);
            setEditable(false);
          }}
        >
          {intl.formatMessage({ id: 'add.practice' })}
        </Button>
      </div>
      {checkedPractices.map((practice) => {
        return (
          <div className="flex justify-between items-center m-2 text-xs lg:text-sm">
            <div className="flex items-center">
              <CheckCircleIcon className="w-16 h-16 m-5 text-green-400" />
              <div className="flex flex-col">
                <p className="text-xl lg:text-2xl">{practice.name}</p>
                <p>{practice.addressLine1}</p>
                <p>
                  {practice.city}, {practice.state} {practice.zip}
                </p>
                <p>
                  <MaskFormat textContent={practice.phone} options={{ mask: 'Phone: (999) 999-9999' }} />
                </p>
                <p>
                  Fax:
                  <MaskFormat textContent={practice.fax} options={{ mask: ' (999) 999-9999' }} />
                </p>
              </div>
            </div>
            <div>
              {/* <Button className="uppercase m-2" shape="smooth" size="lg">
                {intl.formatMessage({ id: 'settings' })}
              </Button> */}
              <Button
                className="uppercase m-2"
                shape="smooth"
                size="lg"
                onClick={() => {
                  getAdminPractice(practice.id, 'edit');
                }}
              >
                {intl.formatMessage({ id: 'measures.edit' })}
              </Button>
              <Button
                className="uppercase m-2"
                shape="smooth"
                size="lg"
                onClick={() => {
                  getAdminPractice(practice.id, 'inactivate');
                }}
              >
                {intl.formatMessage({ id: 'inactivate' })}
              </Button>
            </div>
          </div>
        );
      })}
      {checkedPractices.length === 0 && <p className="text-2xl">No practice</p>}
      <SettingsPracticeEditView open={isOpenEditView()} onClose={toggleIsOpenEditView} editable={editable} />
      <SettingsPracticeInactivateModal open={isOpenInactivateView()} onClose={toggleIsOpenInactivateView} />
    </div>
  );
});

SettingsPracticeLocation.displayName = 'SettingsPracticeLocation';

export default SettingsPracticeLocation;
