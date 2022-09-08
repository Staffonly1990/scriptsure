import React, { FC, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LocationDescriptor } from 'history';
import { forEach } from 'lodash';
import { observer } from 'mobx-react-lite';

import SummaryModal from '../summary.modal';
import { patientModel } from 'features/patient';
import { IPatientAllergy } from 'shared/api/patient';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown/dropdown';
import { DocumentDownloadIcon, DotsVerticalIcon, TicketIcon, UserCircleIcon } from '@heroicons/react/solid';
import { routes } from 'shared/config';
import Alert from 'shared/ui/alert';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { ComponentModel } from 'shared/model';

interface IBannerActionsProps {
  notify: (children: any, overrideConfig?: {} | undefined) => void;
  replace: { (path: string, state?: unknown): void; (location: LocationDescriptor<unknown>): void };
  push: { (path: string, state?: unknown): void; (location: LocationDescriptor<unknown>): void };
  url: string;
  toggleIsOpenEncounters: (value: boolean) => void;
}

const BannerActions: FC<IBannerActionsProps> = ({ notify, replace, url, push, toggleIsOpenEncounters }) => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const intl = useIntl();
  const refToCopy = useRef(null);
  const breakpoints = useBreakpoints();
  const goToDiagnosis = () => replace(url + routes.chart.routes.diagnosis.path());
  const goToVitals = () => replace(url + routes.chart.routes.vitals.path());
  const goToAllergies = () => replace(url + routes.chart.routes.allergies.path());
  const goToSetting = () => push('/setting');

  const handleCopy = () => {
    const getText = () => {
      let text = '';
      forEach((refToCopy as React.RefObject<HTMLDivElement>).current?.childNodes, (child) => {
        forEach(child?.childNodes, (innerChild) => {
          if (text !== '') text += '\n';
          text += innerChild.textContent as string;
        });
      });
      return text;
    };
    navigator.clipboard
      .writeText(getText())
      .then(() => {
        notify(
          <Alert.Notification shape="smooth" type="success" color="green" border closable>
            {intl.formatMessage({ id: 'banner.textCopiedClipboard' })}
          </Alert.Notification>
        );
      })
      .catch(() => {
        notify(
          <Alert.Notification shape="smooth" type="error" color="red" border closable>
            {intl.formatMessage({ id: 'banner.unableCopy' })}
          </Alert.Notification>
        );
      });
  };
  const Buttons = [
    {
      isHidden: !breakpoints.lg || !ComponentModel.isHidden('chartnav-vitals'),
      onClick: goToVitals,
      icon: <TicketIcon className="w-6 h-6 mr-1" />,
      title: intl.formatMessage({ id: 'measures.vitals' }),
    },
    {
      isHidden: !breakpoints.lg || !ComponentModel.isHidden('chartnav-encounters'),
      icon: <UserCircleIcon className="w-6 h-6 mr-1" />,
      title: intl.formatMessage({ id: 'measures.encounters' }),
      onClick: () => toggleIsOpenEncounters(true),
    },
    {
      isHidden: !breakpoints.lg ? !ComponentModel.isHidden('chartnav-summary') : !ComponentModel.isHidden('chartnav-summary') && patientModel.currentEncounter,
      onClick: async () => {
        await patientModel.getCurrentEncounter(patientModel.currentPatient?.patientId as number, true);
        setShowSummaryModal(true);
      },
      icon: <DocumentDownloadIcon className="w-6 h-6 mr-1" />,
      title: intl.formatMessage({ id: 'measures.summary' }),
    },
  ];

  return (
    <>
      <SummaryModal
        goToAllergies={goToAllergies}
        goToSetting={goToSetting}
        goToDiagnosis={goToDiagnosis}
        currentPatient={patientModel.currentPatient as IPatientAllergy}
        open={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        handleCopy={handleCopy}
        refToCopy={refToCopy}
      />
      <div className="hidden lg:block">
        {Buttons.map(
          (button) =>
            button.isHidden && (
              <Button variant="flat" shape="smooth" color="white" className="uppercase text-xl" onClick={button.onClick ?? undefined}>
                {button.icon}
                <span>{button.title}</span>
              </Button>
            )
        )}
      </div>
      <div className="block lg:hidden">
        <Dropdown
          list={Buttons.map(
            (button, index) =>
              button.isHidden && (
                <Dropdown.Item onClick={button.onClick ?? undefined} key={index.toString(36)}>
                  {button.icon}
                  {button.title}
                </Dropdown.Item>
              )
          )}
        >
          <Button variant="flat" shape="circle" color="white" size="xs">
            <DotsVerticalIcon className="w-4 h-4" />
          </Button>
        </Dropdown>
      </div>
    </>
  );
};

BannerActions.displayName = 'BannerActions';

export default observer(BannerActions);
