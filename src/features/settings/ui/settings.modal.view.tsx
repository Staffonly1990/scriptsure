import React, { FC, Key, useState, useEffect, useMemo } from 'react';
import { map, orderBy } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import Tabs from 'shared/ui/tabs';
import Tooltip from 'shared/ui/tooltip';
import Accordion from 'shared/ui/accordion';
import { useRouter } from 'shared/hooks';
import { ENamesSetting } from 'shared/api/settings';
import { userModel } from 'features/user';
import settingModel from '../model/settings.model';
import settingsPracticeModel from '../model/settings.practice.model';
import settingsUserModel from '../model/settings.user.model';

/**
 * @view Settings
 */

interface ISettingModalView {
  toggleBlock: (value: string) => void;
  views: any[];
}
const SettingsModalView: FC<ISettingModalView> = observer(({ toggleBlock, views }) => {
  const {
    match: { path, url },
  } = useRouter();
  const intl = useIntl();

  const fetchUser = async () => {
    try {
      await userModel.fetch();
    } catch {}
  };

  const fetchSettings = async () => {
    try {
      await settingsUserModel.getApplicationSettings();
      await settingsPracticeModel.load();
    } catch {}
  };

  useEffect(() => {
    if (userModel?.data?.practices?.length === 0) {
      fetchUser();
    }
    if (settingsUserModel.settingsList.length === 0) {
      fetchSettings();
    }
  }, []);

  // TODO: изменить значения ENamesSetting на те, что в key в name будет перевод react-intl
  const tabs = [
    { key: 'practice', name: ENamesSetting.PracticeSetting },
    { key: 'user', name: ENamesSetting.UserSetting },
  ];
  const [active, setActive] = useState<Key>(tabs?.[0]?.key);
  const handleChange = (data: Key) => {
    setActive(data);
  };

  const changeRoute = (mainId, text) => {
    const route = views.find((view) => view.mainId === mainId && view.text === text);
    return `${url}${route?.pathname}`;
  };

  const termsOfUse = {
    mainId: 2,
    name: intl.formatMessage({ id: 'settings.termsOfUse' }),
    entityType: 2,
    SettingSection: [],
    orderNumber: 6,
    direction: '',
    functionCall: null,
    SettingHeading: [],
  };
  const userSections = useMemo(() => {
    const [userSec] = settingsUserModel.settingsList.filter((item) => item.mainId === 2);
    return userSec?.SettingSection.concat([termsOfUse])
      .sort((a, b) => a.orderNumber - b.orderNumber)
      ?.filter((userSetting) => userSetting.sectionId !== 12 && userSetting.sectionId !== 15 && userSetting.sectionId !== 21);
  }, [settingsUserModel.settingsList]);

  const practiceSections = useMemo(() => {
    const practSection = settingsUserModel.settingsList.filter((item) => item.mainId !== 2);
    return practSection
      ?.map((section) => {
        const newSection = { ...section };
        if (section.name === ENamesSetting.PracticeSetting) {
          newSection.SettingSection = section.SettingSection?.filter((userSetting) => userSetting.sectionId !== 20);
        }

        return newSection;
      })
      .map(({ name, SettingSection }) => ({
        name,
        SettingSection: orderBy(SettingSection, 'orderNumber'),
      }));
  }, [settingsUserModel.settingsList]);

  const userSection = userSections?.map((userSetting) => {
    return (
      <div className="flex flex-col">
        <Tooltip content={userSetting.direction}>
          <Button
            as={Link}
            to={changeRoute(userSetting.mainId, userSetting.name)}
            color="gray"
            variant="flat"
            key={userSetting.mainId.toString(36)}
            size="md"
            className="uppercase !text-blue-500 dark:!text-blue-300"
            onClick={() => {
              settingModel.selectSection(userSetting);
              toggleBlock(userSetting.name);
            }}
          >
            {userSetting.name}
          </Button>
        </Tooltip>
      </div>
    );
  });

  const practiceSection = practiceSections?.map((mainSection) => {
    return (
      <div>
        <Accordion userName={mainSection.name}>
          {mainSection.SettingSection.map((practiceSettings) => {
            return (
              <div className="flex flex-col">
                <Tooltip content={practiceSettings.direction}>
                  <Button
                    as={Link}
                    to={changeRoute(practiceSettings.mainId, practiceSettings.name)}
                    color="gray"
                    variant="flat"
                    key={practiceSettings.mainId.toString(36)}
                    size="md"
                    className="uppercase !text-blue-500 dark:!text-blue-300"
                    onClick={() => {
                      settingModel.selectSection(practiceSettings);
                      toggleBlock(practiceSettings.name);
                    }}
                  >
                    {practiceSettings.name}
                  </Button>
                </Tooltip>
              </div>
            );
          })}
        </Accordion>
      </div>
    );
  });

  return (
    <div className="p-2">
      <Tabs selectedKey={active} onSelectionChange={handleChange}>
        <Tabs.TabList>
          {map(tabs, ({ key, name }) => (
            <Tabs.Item key={key}>
              <p className="uppercase">{name}</p>
            </Tabs.Item>
          ))}
        </Tabs.TabList>

        <Tabs.TabPanels>
          <Tabs.Item key="practice">{practiceSection}</Tabs.Item>
          <Tabs.Item key="user">{userSection}</Tabs.Item>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  );
});

SettingsModalView.displayName = 'SettingsModalView';

export default SettingsModalView;
