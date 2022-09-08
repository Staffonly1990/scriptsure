import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Button from 'shared/ui/button';
import { BanIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, ExclamationCircleIcon, TrashIcon, PencilIcon, CubeIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import styles from './edit.profile.module.css';
import Select from 'shared/ui/select';
import { useForm, useFormContext, FieldValues, UseFormReturn } from 'react-hook-form';
import Modal from 'shared/ui/modal';

import Input from './input';
import DatePicker from 'shared/ui/date.picker';
import { getTime } from 'date-fns';
import { userModel, editProfile } from '../../model';
import Label from 'shared/ui/accordion/label';
import { IPracticeProfile } from 'features/user/model/edit.profile.store';
import { useIntl } from 'react-intl';
import { isNil } from 'lodash';
import { flowResult } from 'mobx';

interface IServiceLevel {
  onClickEdit: () => Promise<boolean>;
  setElectronicRegistration: React.Dispatch<React.SetStateAction<boolean>>;
  openElectronicRegistration: boolean;
  registerUser: (
    serLevels?:
      | {
          value: number;
          checked: any;
        }[]
      | undefined
  ) => Promise<void>;
  errElectronicRegistration: Nullable<{
    message: string;
    err: boolean;
  }>;
  serviceLevels: {
    value: number;
    checked: any;
  }[];
}

const ServiceLevel: FC<IServiceLevel> = observer(
  ({ onClickEdit, setElectronicRegistration, openElectronicRegistration, registerUser, errElectronicRegistration, serviceLevels }) => {
    const breakpoints = useBreakpoints();
    const [show, setShow] = useState<boolean>(true);
    const [openIdentification, setOpenIdentification] = useState(false);

    const [selectPractice, setPractice] = useState<Nullable<IPracticeProfile>>(null);
    const intl = useIntl();
    const form = useFormContext();

    const loading = isNil(form.getValues('core'));
    useEffect(() => {
      if (loading) {
        form.setValue('core', true);
        form.setValue('controlled', true);
        form.setValue('refill', true);
        form.setValue('change', true);
      }
    }, [loading]);

    type LabelColor = Exclude<TailwindColor, 'transparent' | 'current'>;

    const epcsStatusLable: { text: string; color: LabelColor }[] = [
      { text: 'INITIALIZE', color: 'yellow' },
      { text: 'PENDING', color: 'yellow' },
      { text: 'APPROVED', color: 'green' },
      { text: 'DECLINED', color: 'yellow' },
      { text: 'CREDENTIAL', color: 'yellow' },
      { text: 'REQUEST', color: 'yellow' },
      { text: 'FOB', color: 'yellow' },
      { text: 'NOPRACTICES', color: 'yellow' },
    ];

    const advancedMessages = (advancedMessagesShow?: boolean) => {
      setShow(!advancedMessagesShow);
      if (advancedMessagesShow) {
        form.setValue('refill', false);
        form.setValue('change', false);
      }
    };

    const removeSpi = async (spi?: string) => {
      if (spi) {
        try {
          await editProfile.deactivateSpi(spi);
        } catch (error) {}
        try {
          await editProfile.deleteSpi(spi);
        } catch (error) {}
      }
    };

    const saveEpcs = async (practice: IPracticeProfile) => {
      if (userModel.dataPlatform?.id) {
        try {
          await editProfile.saveEpcs({
            practiceId: practice.id,
            status: 1,
            validateMethod: 1,
            userId: userModel.dataPlatform?.id,
            userName: `${userModel.dataPlatform.firstName} ${userModel.dataPlatform.lastLogin}`,
          });
        } catch {}
      }
    };

    const deactivateSpi = async (practice: IPracticeProfile) => {
      if (practice.spi) {
        try {
          await editProfile.deactivateSpi(practice.spi);
          await editProfile.electronicStatuses();
          await editProfile.getUserEpcs(userModel.dataPlatform?.id);
        } catch {}
      }
    };

    const handleSave = async () => {
      if (form.getValues('spi').length === 13 && selectPractice?.spi && userModel.dataPlatform?.id) {
        try {
          await editProfile.saveSpi({
            practiceId: selectPractice.id,
            userId: userModel.dataPlatform.id,
            spi: form.getValues('spi'),
          });
          await setOpenIdentification(false);
        } catch (error) {}
      }
    };

    const disableAll = () => {
      form.setValue('core', false);
      form.setValue('controlled', false);
      form.setValue('refill', false);
      form.setValue('change', false);
      setElectronicRegistration(true);
      try {
        onClickEdit().then(() => {
          registerUser();
        });
      } catch (error) {}
    };

    const closeElectronicRegistration = async () => {
      if (userModel.dataPlatform?.id) {
        try {
          await flowResult(userModel.getUserDetailFull(userModel.dataPlatform?.id));
          await editProfile.electronicStatuses();
          await editProfile.getUserEpcs(userModel.dataPlatform?.id);
        } catch (error) {}
      }
      setElectronicRegistration(false);
    };

    const practiceLevel = (spi?: string) => {
      if (spi) {
        const level = editProfile.electronStatuses.find((status) => status.spi === spi);
        if (!isNil(level)) {
          return level;
        }
      }
      return 0;
    };

    const left = (
      <div className="pl-6 pr-3 py-3">
        <div className="text-2xl">{`${userModel.dataPlatform?.firstName} ${userModel.dataPlatform?.lastName}`}</div>

        <div className="py-2">
          <div className="flex py-2 border-2 max-w-max">
            <div className="px-4 py-2">
              <label className="form-control-label __end">
                <input
                  className="form-checkbox"
                  type="checkbox"
                  // value: 138
                  {...form.register('core')}
                  aria-describedby="helper-text-id-1-b"
                />
                <div>
                  <div className="form-control-label_label text-lg">Core E-Prescribing</div>
                  <div className="form-helper-text" id="helper-text-id-1-b">
                    Basic E-Prescribing services will allow you to send new prescriptions and send cancel requests to the pharmacy in the event an incorrect
                    medication is sent to pharmacy
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="py-2">
          <div className="flex py-2 border-2 max-w-max">
            <div className="px-4 py-2">
              <label className="form-control-label __end">
                <input
                  className="form-checkbox"
                  type="checkbox"
                  // value: 32
                  {...form.register('controlled')}
                  aria-describedby="helper-text-id-1-b"
                />
                <div>
                  <div className="form-control-label_label text-lg">Controlled Substances</div>
                  <div className="form-helper-text" id="helper-text-id-1-b">
                    Controlled substances allow you to send controlled substances medications to the pharmacy. If this option is required, you will be required
                    to get permission from practice after the sign up process is complete.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {show && (
          <div className="py-2">
            <div className="flex py-2 border-2 max-w-max">
              <div className="px-4 py-2">
                <label className="form-control-label __end">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    // value: 4
                    {...form.register('refill')}
                    aria-describedby="helper-text-id-1-b"
                  />
                  <div>
                    <div className="form-control-label_label text-lg">Refill Prescription</div>
                    <div className="form-helper-text" id="helper-text-id-1-b">
                      Refill requests services will allow the pharmacy to send you refill requests on behalf of the patient when refills have been exhausted on
                      previous prescriptions. Warning: Registration for this service will not be possible if you are already registered for refill requests with
                      another vendor at this location.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {show && (
          <div className="py-2">
            <div className="flex py-2 border-2 max-w-max">
              <div className="px-4 py-2">
                <label className="form-control-label __end">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    // value: 16
                    {...form.register('change')}
                    aria-describedby="helper-text-id-1-b"
                  />
                  <div>
                    <div className="form-control-label_label text-lg">Change Prescription</div>
                    <div className="form-helper-text" id="helper-text-id-1-b">
                      Change requests allow the pharmacy to send alternative medication options or require prior authorization for a submitted prescription.
                      Warning: Registration for this service will not be possible if you are already registered for change requests with another vendor at this
                      location.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="py-2">
          <Button
            onClick={() => {
              advancedMessages(show);
            }}
            className="w-full justify-center"
            size={breakpoints.lg ? 'md' : 'xs'}
          >
            {show ? <ChevronUpIcon className="w-6 h-6 lg:mr-2" /> : <ChevronDownIcon className="w-6 h-6 lg:mr-2" />}
            {show ? <span className="hidden lg:inline">Hide Advanced Messages</span> : <span className="hidden lg:inline">Show Advanced Messages</span>}
          </Button>
        </div>
      </div>
    );
    const right = (
      <div className="pr-6 pl-3 py-3 grid grid-cols-2 gap-2">
        {editProfile.practices.map((practice) => (
          <div className="p-3 border-2 relative">
            <h5 className="title py-2">{practice.prescribingName}</h5>

            <div className="py-2 flex items-center">
              <div className="mr-2">SPI:</div>
              {practice.spi && practice.spi.length ? (
                <>
                  <div>{practice.spi}</div>

                  <Button
                    onClick={() => {
                      removeSpi(practice.spi);
                    }}
                    variant="flat"
                    color="gray"
                    className="justify-center"
                    size={breakpoints.lg ? 'md' : 'xs'}
                  >
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                </>
              ) : (
                <div>Practice Not Registered</div>
              )}
            </div>
            {practice.epcsStatement && (
              <div className="py-2 flex items-center">
                <div className="mr-2">EPCS Access:</div>
                <div>{intl.formatMessage({ id: practice.epcsStatement })}</div>
              </div>
            )}
            <div className="py-2">
              <div>{practice.addressLine1}</div>
              <div>{practice.addressLine2}</div>
              <div>{`${practice.city}, ${practice.state}`}</div>
              {practiceLevel(practice.spi) && 2 ? (
                <div className="flex items-center gap-2">
                  <CheckCircleIcon color="green" className="w-6 h-6" />
                  <div>NewRx</div>
                  <div>Active</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon color="red" className="w-6 h-6" />
                  <div>NewRx</div>
                  <div>In-Active</div>
                </div>
              )}
              {show &&
                (practiceLevel(practice.spi) && 4 ? (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon color="green" className="w-6 h-6" />
                    <div>RefillRx</div>
                    <div>Active</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon color="red" className="w-6 h-6" />
                    <div>RefillRx</div>
                    <div>In-Active</div>
                  </div>
                ))}
              {show &&
                (practiceLevel(practice.spi) && 16 ? (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon color="green" className="w-6 h-6" />
                    <div>ChangeRx</div>
                    <div>Active</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon color="red" className="w-6 h-6" />
                    <div>ChangeRx</div>
                    <div>In-Active</div>
                  </div>
                ))}

              {practiceLevel(practice.spi) && 32 ? (
                <div className="flex items-center gap-2">
                  <CheckCircleIcon color="green" className="w-6 h-6" />
                  <div>Controlled</div>
                  <div>Active</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExclamationCircleIcon color="red" className="w-6 h-6" />
                  <div>Controlled</div>
                  <div>In-Active</div>
                </div>
              )}
            </div>
            <div className="py-2 flex items-center justify-between">
              {!practice.epcsStatement ? (
                <div className="flex items-center">
                  <Button
                    onClick={() => {
                      saveEpcs(practice);
                    }}
                    variant="flat"
                    shape="smooth"
                    color="gray"
                    size={breakpoints.lg ? 'md' : 'xs'}
                  >
                    <PlusIcon className="w-6 h-6 lg:mr-2" />
                    <span className="hidden lg:inline">Request EPCS</span>
                  </Button>
                </div>
              ) : null}
              <div className="flex items-center w-full justify-end">
                {
                  // ng-click=vm.deactivateSpi(practice.spi)
                }
                {practice.spi && practice.spi.length ? (
                  <Button
                    onClick={() => {
                      deactivateSpi(practice);
                    }}
                    variant="flat"
                    shape="smooth"
                    color="gray"
                    size={breakpoints.lg ? 'md' : 'xs'}
                  >
                    <CubeIcon className="w-6 h-6 lg:mr-2" />
                    <span className="hidden lg:inline">Deactivate</span>
                  </Button>
                ) : null}
                {
                  // ng-click="vm.updateSpi(practice)"
                }
                <Button
                  onClick={() => {
                    setPractice(practice);
                    form.setValue('spi', practice.spi);
                    onClickEdit().then(() => setOpenIdentification(true));
                  }}
                  variant="flat"
                  shape="smooth"
                  color="gray"
                  size={breakpoints.lg ? 'md' : 'xs'}
                >
                  <PencilIcon className="w-6 h-6 lg:mr-2" />
                  <span className="hidden lg:inline">EDIT</span>
                </Button>
              </div>
            </div>
            {practice.epcsStatus ? <Label color={epcsStatusLable[practice.epcsStatus].color} text={`${epcsStatusLable[practice.epcsStatus].text}`} /> : null}
          </div>
        ))}
      </div>
    );

    const bodyIdentification = (
      <div>
        <div>Practice</div>
        <div>{selectPractice?.prescribingName}</div>
        <div>User</div>
        <div>{`${form.getValues('firstName')} ${form.getValues('lastName')}`}</div>
        <Input width="w-max" value={form.getValues('spi')} id="spi" label="SPI" required minLength={13} maxLength={13} form={form} />
      </div>
    );

    const bodyElectronicRegistration = (
      <div>
        <div>{editProfile.organization?.name}</div>
        {!isNil(errElectronicRegistration) &&
          (errElectronicRegistration.err ? (
            <div className="flex gap-2 items-end">
              <div>
                <ExclamationCircleIcon color="red" className="w-6 h-6" />
                <div>{`${userModel.dataPlatform?.firstName}, ${userModel.dataPlatform?.lastName}`}</div>
              </div>
              <div>
                <span className="text-red-500">Error </span>
                {errElectronicRegistration.message}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-end">
              <div>
                <CheckCircleIcon color="green" className="w-6 h-6" />
                <div>{`${userModel.dataPlatform?.firstName}, ${userModel.dataPlatform?.lastName}`}</div>
              </div>
              <div>
                <span className="text-green-500">Success </span>
                {errElectronicRegistration.message}
              </div>
            </div>
          ))}
        {isNil(errElectronicRegistration) && <div className="text-xl font-bold">Loading...</div>}
      </div>
    );

    const footerElectronicRegistration = (
      <div className="px-2 flex justify-end">
        <Button
          className="mr-2"
          variant="flat"
          color="gray"
          onClick={() => {
            registerUser(serviceLevels);
          }}
        >
          Re-Register
        </Button>
        <Button onClick={closeElectronicRegistration}>Close</Button>
      </div>
    );

    return (
      <div className="flex">
        <div className="w-1/2">
          <div className="bg-blue-500 pl-6 pr-3 py-4 flex justify-between items-center">
            <h5 className="title text-white">E-Prescribing Options</h5>
            <Button onClick={disableAll} variant="flat" shape="smooth" color="white" size={breakpoints.lg ? 'md' : 'xs'}>
              <BanIcon className="w-6 h-6 lg:mr-2" />
              <span className="hidden lg:inline">Disable All</span>
            </Button>
          </div>
          {left}
        </div>

        <div className="w-1/2">
          <div className="bg-blue-500 pr-6 pl-3 py-4 flex justify-between items-center">
            <h5 className="title text-white">Practice</h5>
            <Button
              onClick={() => {
                editProfile.requestEpcsALL(userModel.dataPlatform);
              }}
              variant="flat"
              shape="smooth"
              color="white"
              size={breakpoints.lg ? 'md' : 'xs'}
            >
              <PlusIcon className="w-6 h-6 lg:mr-2" />
              <span className="hidden lg:inline">Request EPCS ALL</span>
            </Button>
          </div>
          {right}
          <Modal open={openIdentification}>
            <Modal.Header>
              <h5 className="title text-white">Identification</h5>
            </Modal.Header>
            <Modal.Body>{bodyIdentification}</Modal.Body>
            <Modal.Actions
              onCancel={() => {
                setOpenIdentification(false);
              }}
              onOk={handleSave}
            />
          </Modal>

          <Modal open={openElectronicRegistration}>
            <Modal.Header>
              <h5 className="title text-white">Electronic Registration</h5>
            </Modal.Header>
            <Modal.Body>{bodyElectronicRegistration}</Modal.Body>
            {footerElectronicRegistration}
          </Modal>
        </div>
      </div>
    );
  }
);

ServiceLevel.displayName = 'ServiceLevel';
export default ServiceLevel;
