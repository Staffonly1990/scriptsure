import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { find, isBoolean, map, orderBy } from 'lodash';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { observer, Observer } from 'mobx-react-lite';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import Select from 'shared/ui/select';
import Modal from 'shared/ui/modal/modal';
import { EntityTypeEnum, ISettingTitle } from 'shared/api/settings';

import settingModel from '../../model/settings.model';
import { isShow } from '../../lib/set.show.setting';
import { getSelectList } from '../../lib/get.select.list';
import settingsPracticeModel from '../../model/settings.practice.model';
import settingsUserModel from '../../model/settings.user.model';
import Alert from 'shared/ui/alert';

interface ISettingsPracticeForm {
  settings: {
    title: string;
    settings: ISettingTitle[];
  }[];
}

/**
 * @view SettingsPracticeAdvanced
 */

const SettingsForm: FC<ISettingsPracticeForm> = observer(({ settings: allSettings }) => {
  const [showValidForm, setShowValidForm] = useState(false);
  const [showSelectPractices, setShowSelectPractices] = useState(false);
  const [showCommonCheckbox, setShowCommonCheckbox] = useState(false);
  const {
    register,
    getValues,
    setValue,
    control,
    reset,
    watch,
    formState: { isValid },
  } = useForm();
  const intl = useIntl();
  const { notify } = useNotifier();
  const { isDirty } = useFormState({
    control,
  });

  const notifies = {
    SAVE_SUCCESS: intl.formatMessage({ id: 'save.success' }),
  };

  /**
   * update because of miro.
   *     some settings should hide and open by clicking on a common checkbox
   */
  const withCheckbox = (title) => {
    const titleNames = ['Session Timeout', 'Alert Types'];
    return titleNames.some((titleName) => titleName === title.name);
  };

  useEffect(() => {
    const notifyKey = settingModel.notify;
    if (!notifyKey) return;
    settingModel.notify = '';
    notify(
      <Alert.Notification
        actions={(close) => (
          <Button
            variant="flat"
            onClick={() => {
              close();
            }}
          >
            {intl.formatMessage({ id: 'measures.ok' })}
          </Button>
        )}
        shape="smooth"
        color="green"
        border
        closable
      >
        {notifies[notifyKey]}
      </Alert.Notification>
    );
  }, [settingModel.notify]);

  const resetDefaultSms = useCallback((setting, title) => {
    const textField = find(title.Setting, (titleSetting) => titleSetting.entityType === EntityTypeEnum.PRACTICE && titleSetting.settingId === 139);
    if (textField) {
      setValue(textField.key, `(<messageCount>) pending www.scriptsure.com ERX order(s)<wait> at <practicename>. You can STOP alerts in settings.`);
    }
  }, []);

  const selectSetting = (setting, title) => {
    switch (setting.functionCall) {
      case 'resetDefaultSms':
        resetDefaultSms(setting, title);
        break;
      default:
        settingModel.selectSetting(setting, getValues);
        break;
    }
  };

  const handleRadio = useCallback((e) => {
    if (e.target.value === 'defaultSettings') {
      settingsPracticeModel.currentPractice = settingsPracticeModel.practices[0].id;
      settingsPracticeModel.setPractice();
      setShowSelectPractices(false);
    } else {
      setShowSelectPractices(true);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!isValid) {
      setShowValidForm(true);
      return;
    }
    settingModel.saveForm(watch(), reset);
  }, [isValid]);

  const handleRestoreAllDefaults = useCallback(() => {
    if (settingModel.currentSection?.mainId === 1) {
      settingsPracticeModel.handleModalSetPracticeDefaults();
    }

    if (settingModel.currentSection?.mainId === 2) {
      settingsUserModel.handleModalSetUserDefaults();
    }
  }, [isValid]);

  const handleCancel = useCallback(() => {
    settingModel.cancelSetting(isDirty);
  }, [isDirty]);
  /**
   * tooltip by condition
   */
  const nodeWithTooltip = (node, condition, tooltip) => {
    if (typeof condition === 'function' ? condition() : condition) {
      return <Tooltip content={tooltip}>{node}</Tooltip>;
    }
    return node;
  };

  const content = useMemo(() => {
    return allSettings.map(({ settings: settingsOfAll, title }) => ({
      title,
      settings: orderBy(settingsOfAll, 'orderNumber').map((settingTitle) => ({
        title: settingTitle,
        isTopDirection: settingTitle.direction && settingTitle.name === 'User Pending Prescription Alerts',
        isDownDirection: !!settingTitle.direction,
        isWithCheckbox: withCheckbox(settingTitle),
        settingTitleSettings: orderBy(settingTitle.Setting, 'orderNumber').map((setting) => ({
          setting,
          isShowSetting: isShow(settingTitle, setting, watch()),
          list: setting?.controlType === 4 ? getSelectList(setting) : undefined,
          isFieldDirection: !!setting.direction,
        })),
      })),
    }));
  }, [watch(), allSettings]);

  const renderContent = (settings) => {
    return settings.map(({ title, isDownDirection, isTopDirection, isWithCheckbox, settingTitleSettings }) => (
      <div className="flex flex-col">
        {isTopDirection && <span className="form-helper-text w-full mt-8 mb-2">{title.direction}</span>}
        <div className="flex my-2">
          {isWithCheckbox && (
            <div className="flex w-full justify-end ml-16">
              <div className="flex flex-col min-w-[50%] w-[50%] text-right">
                <label className="form-label text-right" htmlFor={title.name}>
                  {title.name}
                </label>
                {isDownDirection && !isTopDirection && <span className="form-helper-text">({title.direction})</span>}
              </div>

              <input
                id={title.name}
                className="form-checkbox m-0 ml-4"
                type="checkbox"
                onChange={() => {
                  setShowCommonCheckbox(!showCommonCheckbox);
                }}
              />
            </div>
          )}

          <div className={`flex w-full gap-4 ${(isWithCheckbox && showCommonCheckbox) || settingTitleSettings.length > 1 ? 'flex-row flex-wrap' : ''}`}>
            {settingTitleSettings.map(({ setting, isShowSetting, list, isFieldDirection }) => {
              if (!isShowSetting) return null;
              if (setting?.controlType === 1 && (isWithCheckbox ? showCommonCheckbox : true)) {
                return nodeWithTooltip(
                  <div className="flex mx-2 items-center w-full">
                    {String(setting?.name)?.length && (
                      <div className="flex flex-col min-w-[50%] w-[50%] text-right">
                        <label className="form-label" htmlFor={setting.name}>
                          {title.name === 'Prescription Layout' || title.name === 'Patient Identification' ? `${title.name}: ${setting.name}` : setting.name}
                        </label>
                        {isDownDirection && !isTopDirection && <span className="form-helper-text">({title.direction})</span>}
                      </div>
                    )}
                    <div className="flex flex-col ml-4">
                      <Controller
                        control={control}
                        name={`${setting.key}`}
                        render={({ field: { value: valueField, onChange } }) => (
                          <Observer>
                            {() => {
                              return (
                                <input
                                  id={setting.name}
                                  className="form-checkbox m-0"
                                  disabled={settingModel.checkRestrictions(setting, title)}
                                  type="checkbox"
                                  defaultChecked={!!Number(setting.value)}
                                  checked={valueField !== undefined ? valueField : !!Number(setting.value)}
                                  aria-describedby={`${setting.name}-1`}
                                  onChange={(e) => {
                                    if (settingModel.checkPracticeControl(setting, e.target.checked)) {
                                      setValue(setting.key, e.target.checked);
                                      onChange(e);
                                    }
                                  }}
                                />
                              );
                            }}
                          </Observer>
                        )}
                      />
                      {isFieldDirection && (
                        <span className="form-helper-text w-full ml-1" id={`${setting.name}-1`}>
                          {setting.direction}
                        </span>
                      )}
                    </div>
                  </div>,
                  () => settingModel.checkRestrictions(setting, title),
                  intl.formatMessage({ id: 'settings.notAllowed' })
                );
              }

              if (setting?.controlType === 2) {
                return (
                  <div className="form-control flex flex-row items-center w-full">
                    {setting.name && (
                      <label className="form-label min-w-[50%] w-[50%] text-right" htmlFor={setting.name}>
                        {setting.name}
                      </label>
                    )}
                    <div className="flex flex-col">
                      <input
                        className="form-input !mt-0 w-[10rem] ml-4"
                        id={setting.name}
                        type="text"
                        placeholder=""
                        aria-describedby={`${setting.name}-1`}
                        defaultValue={!isBoolean(setting.value) ? setting.value : ''}
                        {...register(`${setting.key}`)}
                      />
                      {isFieldDirection && (
                        <span className="form-helper-text ml-1" id={`${setting.name}-1`}>
                          {setting.direction}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              if (setting?.controlType === 3 && (isWithCheckbox ? showCommonCheckbox : true)) {
                return (
                  <div className="form-control flex items-center flex-row w-full">
                    {setting.name && (
                      <label className="form-label min-w-[50%] w-[50%] text-right" htmlFor={setting.name}>
                        {setting.name}
                      </label>
                    )}
                    <div className="flex flex-col">
                      <input
                        className="form-input !mt-0 w-[10rem] ml-4"
                        id="controlType3"
                        type="text"
                        placeholder=""
                        aria-describedby={`${setting.name}-1`}
                        defaultValue={Number(setting.value)}
                        {...register(`${setting.key}`)}
                      />
                      {isFieldDirection && (
                        <span className="form-helper-text ml-1" id={`${setting.name}-1`}>
                          {setting.direction}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              if (setting?.controlType === 4 && (isWithCheckbox ? showCommonCheckbox : true)) {
                return (
                  <div className="form-control flex flex-row w-full items-center">
                    {setting.name && (
                      <label className="form-label min-w-[50%] w-[50%] text-right" htmlFor={setting.name}>
                        {setting.name}
                      </label>
                    )}
                    <Controller
                      control={control}
                      name={`${setting.key}`}
                      render={({ field: { value: valueField, onChange } }) => (
                        <Observer>
                          {() => {
                            return (
                              <Select
                                className="mr-2 ml-4"
                                value={valueField !== undefined ? valueField : setting.value}
                                disabled={settingModel.checkRestrictions(setting, title)}
                                width="w-[20rem]"
                                name={setting.key}
                                onChange={onChange}
                                options={
                                  !list.length
                                    ? []
                                    : map(list, ({ value, name }) => ({
                                        value,
                                        label: name,
                                      }))
                                }
                                label={<span>{setting.direction}</span>}
                              />
                            );
                          }}
                        </Observer>
                      )}
                    />
                  </div>
                );
              }

              if (setting?.controlType === 5) {
                return nodeWithTooltip(
                  <Button variant="filled" className="w-max" onClick={() => selectSetting(setting, title)}>
                    <span className="uppercase">{setting.name}</span>
                  </Button>,
                  isFieldDirection,
                  setting.direction
                );
              }

              if (setting?.controlType === 6) {
                return (
                  <div className="form-control flex flex-row w-full items-center">
                    {setting.name && (
                      <label className="form-label min-w-[50%] w-[50%] text-right" htmlFor={setting.name}>
                        {setting.name}
                      </label>
                    )}
                    <div className="flex flex-col">
                      <input
                        className="form-input !mt-0 w-[10rem] ml-4"
                        id={setting.name}
                        type="password"
                        placeholder=""
                        aria-describedby={`${setting.name}-1`}
                        defaultValue={Number(setting.value)}
                        {...register(`${setting.key}`)}
                      />
                      {isFieldDirection && (
                        <span className="form-helper-text ml-4" id={`${setting.name}-1`}>
                          {setting.direction}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              if (setting?.controlType === 7) {
                return (
                  <div className="form-control flex flex-row w-full items-center">
                    {setting.name && (
                      <div className="flex flex-col min-w-[50%] w-[50%] text-right">
                        <label className="form-label" htmlFor={setting.name}>
                          {setting.name}
                        </label>
                        <span className="form-helper-text ml-1">({setting.direction})</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <Controller
                        control={control}
                        name={`${setting.key}`}
                        render={({ field: { value: valueField } }) => (
                          <Observer>
                            {() => {
                              return (
                                <textarea
                                  className="form-textarea ml-2"
                                  rows={3}
                                  maxLength={150}
                                  id={setting.name}
                                  placeholder=""
                                  aria-describedby={`${setting.name}-1`}
                                  defaultValue={setting.value}
                                  value={valueField !== undefined ? valueField : setting.value}
                                  {...register(`${setting.key}`)}
                                />
                              );
                            }}
                          </Observer>
                        )}
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    ));
  };
  return (
    <div className="flex flex-col w-full">
      <Modal onClose={() => setShowValidForm(false)} open={showValidForm}>
        <Modal.Body> {intl.formatMessage({ id: 'settings.validation' })}</Modal.Body>
        <button onClick={() => setShowValidForm(false)}>Ok</button>
      </Modal>
      <Modal
        onClose={() => {
          settingModel.showModalPracticeConflict = false;
        }}
        open={settingModel.showModalPracticeConflict}
      >
        <Modal.Header>
          <Modal.Title className="text-white">WARNING</Modal.Title>
        </Modal.Header>
        <Modal.Body>{intl.formatMessage({ id: 'settings.practiceConflict' })}</Modal.Body>
        <Button
          onClick={() => {
            settingModel.showModalPracticeConflict = false;
          }}
        >
          {intl.formatMessage({ id: 'ok' })}
        </Button>
      </Modal>
      <Modal
        onClose={() => {
          settingModel.showModalDiscardChanges = false;
        }}
        open={settingModel.showModalDiscardChanges}
      >
        <Modal.Body>Are you sure you want to discard any setting changes?</Modal.Body>
        <div className="flex p-[24px] justify-between">
          <Button
            as={Link}
            to="/"
            onClick={() => {
              settingModel.showModalDiscardChanges = false;
            }}
          >
            {intl.formatMessage({ id: 'yes' })}
          </Button>
          <Button
            onClick={() => {
              settingModel.showModalDiscardChanges = false;
            }}
          >
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
        </div>
      </Modal>
      <Modal
        as="div"
        className="sm:!max-w-[50vw]"
        onClose={settingsPracticeModel.handleModalSetPracticeDefaults}
        open={settingsPracticeModel.showModalSetPracticeDefaults}
      >
        <Modal.Header>
          <Modal.Title as="h5" className="title text-white">
            {intl.formatMessage({ id: 'settings.setDefaults' })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Actions onCancel={settingsPracticeModel.handleModalSetPracticeDefaults} onOk={settingsPracticeModel.setPracticeDefaults} />
      </Modal>
      <Modal as="div" className="sm:!max-w-[50vw]" onClose={settingsUserModel.handleModalSetUserDefaults} open={settingsUserModel.showModalSetUserDefaults}>
        <Modal.Header>
          <Modal.Title as="h5" className="title text-white">
            {intl.formatMessage({ id: 'settings.setDefaults' })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Actions onCancel={settingsUserModel.handleModalSetUserDefaults} onOk={settingsUserModel.setUserDefaults} />
      </Modal>
      <div className="flex flex-col mb-8">
        <div className="flex py-2">
          <input
            checked={!showSelectPractices}
            id="defaultSettings"
            value="defaultSettings"
            className="form-checkbox m-0 mr-4"
            type="radio"
            name="settings"
            onChange={handleRadio}
          />
          <label className="form-label" htmlFor="defaultSettings">
            {intl.formatMessage({ id: 'settings.defaultPractices' })}
          </label>
        </div>
        <div className="flex py-2">
          <input
            checked={showSelectPractices}
            id="individualSettings"
            value="individualSettings"
            className="form-checkbox m-0 mr-4"
            type="radio"
            name="settings"
            onChange={handleRadio}
          />
          <label className="form-label" htmlFor="individualSettings">
            {intl.formatMessage({ id: 'settings.selectIndividualSettings' })}
          </label>
        </div>
        {showSelectPractices && (
          <Select
            className="mr-2 ml-4"
            width="w-[30rem]"
            value={String(settingsPracticeModel.currentPractice)}
            options={
              settingsPracticeModel.practices?.map((practice) => ({
                value: practice.id,
                label: practice.prescribingName,
              })) || []
            }
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              reset({});
              settingsPracticeModel.currentPractice = Number(e.target.value);
              settingsPracticeModel.setPractice();
            }}
          />
        )}
      </div>
      {content.map(({ settings, title }) => (
        <div className="flex flex-col mt-8">
          {title && <span className="form-label text-base uppercase italic text-right w-[50%]">{title}</span>}
          <div className="flex flex-col">{renderContent(settings)}</div>
        </div>
      ))}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {allSettings.find((setting) => setting?.title !== 'Electronic Options') && (
            <Button> {intl.formatMessage({ id: 'settings.copyToAllPractices' })}</Button>
          )}
          <Button color="indigo" onClick={() => handleRestoreAllDefaults()}>
            {intl.formatMessage({ id: 'settings.restoreAllDefault' })}
          </Button>
        </div>

        {isDirty && (
          <div className="flex gap-2">
            <Button onClick={handleSave}> {intl.formatMessage({ id: 'save' })}</Button>
            <Button onClick={handleCancel}>{intl.formatMessage({ id: 'cancel' })}</Button>
          </div>
        )}
      </div>
    </div>
  );
});

SettingsForm.displayName = 'SettingsForm';
export default SettingsForm;
