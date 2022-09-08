import React, { FC, useEffect, useRef, useState } from 'react';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';
import { PlusIcon, ViewGridAddIcon, LockOpenIcon, LockClosedIcon, PrinterIcon, MenuAlt2Icon, XIcon, MinusIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { flowResult, toJS } from 'mobx';
import { chartNotes } from '../model';
import Modal from 'shared/ui/modal';
import { useForm } from 'react-hook-form';
import { userModel } from 'features/user';
import { INote } from 'shared/api/soap';
import { patientModel } from 'features/patient';
import { html } from '../lib/model';
import { encounterModel } from 'features/encounter';
import DatePicker from 'shared/ui/date.picker';
import { useIntl } from 'react-intl';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useBreakpoints } from '../../../shared/lib/media.breakpoints';

interface IWindowNote {
  headerTitle: string;
  note?: Nullable<INote>;
  openClick: () => void;
  closeClick: () => void;
  method: string;
  isEncounter?: boolean;
}

const PopUpNote: FC<IWindowNote> = observer(({ children, note, headerTitle, openClick, closeClick, method, isEncounter }) => {
  const breakpoints = useBreakpoints();
  const [showPreviewNote, setShowPreviewNote] = useState(true);
  const [open, updateArgs] = useState(false);
  const innerRef = useRef();
  const [showPickList, setShowPickList] = useState(false);
  const [focusFlag, setFocusFlag] = useState('c');
  const [current, setCurrent] = useState(false);
  const [orders, setOrders] = useState(false);
  const [allergies, setAllergies] = useState(false);
  const intl = useIntl();
  const { register, watch, getValues, setValue, reset } = useForm();
  const handleOpen = () => {
    updateArgs(true);
  };
  const handleClose = (value?: boolean) => {
    reset({});
    updateArgs(value ?? false);
  };

  const newNoteWritten = (value: Date | string | null | undefined) => {
    if (value) {
      setValue('newNoteWritten', new Date(value) ?? new Date());
    }
  };

  watch(['newNoteWritten']);

  const noteValues = (
    sign: number
  ): {
    parentSoapId: number | null | undefined;
    soapId: number | null | undefined;
    archive: number | null | undefined;
    signStatus: number | null | undefined;
    encounterId: number | null | undefined;
  } => {
    let soapIdV: number | null | undefined;
    let parentSoapIdV: number | null | undefined;
    let archiveV: number | null | undefined;
    let signStatusV: number | null | undefined;
    let encounterIdV: number | null | undefined;
    if (headerTitle === 'newNote') {
      soapIdV = null;
      parentSoapIdV = null;
      archiveV = 0;
      signStatusV = sign;
      encounterIdV = chartNotes.encounterResult?.savedEncounterObj.encounterId;
    }
    if (headerTitle === 'completeDraft') {
      soapIdV = note?.soapId;
      parentSoapIdV = note?.parentSoapId;
      archiveV = note?.archive;
      signStatusV = sign;
      encounterIdV = note?.encounterId;
    }
    if (headerTitle === 'createFollowup') {
      soapIdV = null;
      parentSoapIdV = note?.soapId;
      archiveV = 0;
      signStatusV = sign === 0 ? 3 : 2;
      encounterIdV = note?.encounterId;
    }
    return {
      parentSoapId: parentSoapIdV,
      soapId: soapIdV,
      archive: archiveV,
      signStatus: signStatusV,
      encounterId: isEncounter ? toJS(encounterModel.currentEncounter)?.encounterId : encounterIdV,
    };
  };

  const setNote = async (sign: number) => {
    try {
      await flowResult(
        chartNotes.editNote(
          {
            ...noteValues(sign),
            assessment: getValues('a') ? getValues('a') : intl.formatMessage({ id: 'notes.measures.noneSpecified' }),
            chiefComplaint: getValues('c') ? getValues('c') : intl.formatMessage({ id: 'notes.measures.noneSpecified' }),
            createdAt: getValues('newNoteWritten') ?? new Date(),
            objective: getValues('o') ? getValues('o') : intl.formatMessage({ id: 'notes.measures.noneSpecified' }),
            subjective: getValues('s') ? getValues('s') : intl.formatMessage({ id: 'notes.measures.noneSpecified' }),
            title: getValues('newNoteTitle') ? getValues('newNoteTitle') : intl.formatMessage({ id: 'notes.measures.workingNote' }),
            treatmentPlan: getValues('p') ? getValues('p') : intl.formatMessage({ id: 'notes.measures.noneSpecified' }),
            doctorId: userModel.data?.currentPrescriber.id,
            // eslint-disable-next-line max-len
            doctorName: `${userModel.data?.currentPrescriber.firstName} ${userModel.data?.currentPrescriber.lastName}`,
            userName: `${userModel.data?.user.firstName} ${userModel.data?.user.lastName}`,
            userId: userModel.data?.user.id,
            practiceId: userModel.data?.currentPractice?.id,
            patientId: patientModel.currentPatient?.patientId,
            html: html({
              newNoteComplaint: getValues('c'),
              newNoteSubjective: getValues('s'),
              newNoteObjective: getValues('o'),
              newNoteAssessment: getValues('a'),
              newNotePlan: getValues('p'),
              currentMedications: chartNotes.currentMedications,
              allergies: chartNotes.allergies,
              orders: chartNotes.orders,
            }),
            json: {
              allergies: chartNotes.allergies,
              currentMedications: chartNotes.currentMedications,
              orders: chartNotes.orders,
            },
          },
          method
        )
      );
      await flowResult(chartNotes.getNotes('All Notes', patientModel.currentPatient?.patientId));
    } catch {}
  };

  const newPickList = async () => {
    try {
      await flowResult(chartNotes.newPickList(getValues('newPickList'), getValues('titleNewPickList'), focusFlag, userModel.data?.user.id));
    } catch {}
  };

  const addCurrentMeds = async (show: boolean) => {
    try {
      await flowResult(chartNotes.addCurrentMeds(show, patientModel.currentPatient?.patientId));
    } catch {}
  };

  const addOrders = async (show: boolean) => {
    try {
      await flowResult(chartNotes.addOrders(show, chartNotes.encounterResult?.savedEncounterObj.encounterId));
    } catch {}
  };

  const addAllergies = async (show: boolean) => {
    try {
      await flowResult(chartNotes.addAllergies(show, patientModel.currentPatient?.patientId));
    } catch {}
  };

  const handlePreviewNote = () => {
    setShowPreviewNote(!showPreviewNote);
  };

  const renew = () => {
    if (note) {
      setValue('newNoteTitle', note.title ?? intl.formatMessage({ id: 'notes.measures.workingNote' }));
      newNoteWritten(note.createdAt);
      setValue('c', note.chiefComplaint ?? '');
      setValue('s', note.subjective ?? '');
      setValue('o', note.objective ?? '');
      setValue('a', note.assessment ?? '');
      setValue('p', note.treatmentPlan ?? '');
    } else {
      setValue('newNoteTitle', intl.formatMessage({ id: 'notes.measures.workingNote' }));
      newNoteWritten(null);
      setValue('c', '');
      setValue('s', '');
      setValue('o', '');
      setValue('a', '');
      setValue('p', '');
    }
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white flex justify-between items-center w-full">
        <div>{intl.formatMessage({ id: `measures.${headerTitle}` })}</div>
        <div className="flex">
          <Dropdown
            list={[
              <Dropdown.Item
                onClick={() => {
                  setCurrent(!current);
                  addCurrentMeds(!current);
                }}
              >
                {intl.formatMessage({ id: 'popup.notes.measures.currentMedications' })}
              </Dropdown.Item>,
              <Dropdown.Item
                onClick={() => {
                  setOrders(!orders);
                  addOrders(!orders);
                }}
              >
                {intl.formatMessage({ id: 'popup.notes.measures.orders' })}
              </Dropdown.Item>,
              <Dropdown.Item
                onClick={() => {
                  setAllergies(!allergies);
                  addAllergies(!allergies);
                }}
              >
                {intl.formatMessage({ id: 'measures.allergies' })}
              </Dropdown.Item>,
            ]}
          >
            <Button>
              <ViewGridAddIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'popup.notes.measures.include' })}
            </Button>
          </Dropdown>
          <div className="block xl:hidden">
            <Dropdown
              list={[
                <Dropdown.Item>
                  <Button
                    onClick={() => {
                      setNote(note?.parentSoapId ? 3 : 0).then(() => closeClick());
                      handleClose();
                    }}
                  >
                    <LockOpenIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'popup.notes.measures.draft' })}
                  </Button>
                </Dropdown.Item>,
                <Dropdown.Item>
                  <Button
                    onClick={() => {
                      setNote(note?.parentSoapId ? 2 : 1).then(() => closeClick());
                      handleClose();
                    }}
                  >
                    <LockClosedIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'popup.notes.measures.sign' })}
                  </Button>
                </Dropdown.Item>,
                <Dropdown.Item>
                  <Button>
                    <PrinterIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'popup.notes.measures.printSign' })}
                  </Button>
                </Dropdown.Item>,
                <Dropdown.Item>
                  <Button onClick={handlePreviewNote}>
                    <MenuAlt2Icon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'popup.notes.measures.previewNote' })}
                  </Button>
                </Dropdown.Item>,
                <Dropdown.Item>
                  <Button
                    onClick={() => {
                      handleClose(false);
                      closeClick();
                    }}
                  >
                    <XIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'measures.cancel' })}
                  </Button>
                </Dropdown.Item>,
              ]}
            >
              <Button>
                <DotsVerticalIcon className="w-6 h-6" />
              </Button>
            </Dropdown>
          </div>
          {breakpoints.xl && (
            <Button
              onClick={() => {
                setNote(note?.parentSoapId ? 3 : 0).then(() => closeClick());
                handleClose();
              }}
            >
              <LockOpenIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'popup.notes.measures.draft' })}
            </Button>
          )}
          {breakpoints.xl && (
            <Button
              onClick={() => {
                setNote(note?.parentSoapId ? 2 : 1).then(() => closeClick());
                handleClose();
              }}
            >
              <LockClosedIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'popup.notes.measures.sign' })}
            </Button>
          )}
          {breakpoints.xl && (
            <Button>
              <PrinterIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'popup.notes.measures.printSign' })}
            </Button>
          )}
          {breakpoints.xl && (
            <Button onClick={handlePreviewNote}>
              <MenuAlt2Icon className="w-6 h-6" />
              {intl.formatMessage({ id: 'popup.notes.measures.previewNote' })}
            </Button>
          )}
          {breakpoints.xl && (
            <Button
              onClick={() => {
                handleClose(false);
                closeClick();
              }}
            >
              <XIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'measures.cancel' })}
            </Button>
          )}
        </div>
      </Modal.Title>
    </Modal.Header>
  );

  const body = (
    <Modal.Body ref={innerRef}>
      <div className="flex">
        <div className="w-2/3">
          <div className="flex">
            <div className="form-control">
              <label className="form-label" htmlFor="newNoteTitle">
                {intl.formatMessage({ id: 'measures.title' })}
              </label>
              <input
                className="form-input"
                id="newNoteTitle"
                type="text"
                placeholder="Title"
                aria-describedby="helper-text-id-1-a"
                {...register('newNoteTitle')}
              />
            </div>
            <div className="form-control">
              <label className="form-label" htmlFor="newNoteWritten">
                {intl.formatMessage({ id: 'popup.notes.measures.written' })}
              </label>

              <DatePicker container={innerRef?.current} format="dd.MM.yyyy" date={getValues('newNoteWritten')} onDateChange={newNoteWritten}>
                {({ inputProps, focused }) => <input id="newNoteWritten" className={`form-input${focused ? ' -focused' : ''}`} {...inputProps} />}
              </DatePicker>
            </div>
          </div>
          <div className="flex">
            <div className="w-2/4 border-2 rounded flex flex-col justify-between">
              <div>
                {chartNotes.pickLists
                  .filter((obj) => obj.type === focusFlag)
                  .map((item) => (
                    <div
                      role="presentation"
                      onKeyDown={() => {
                        setValue(focusFlag, `${getValues(focusFlag)} ${item.text}`);
                      }}
                      onClick={() => {
                        setValue(focusFlag, `${getValues(focusFlag)} ${item.text}`);
                      }}
                      className="hover:bg-gray-300 cursor-pointer"
                    >
                      {item.title}
                    </div>
                  ))}
              </div>
              <div className="border-t-2">
                {showPickList ? (
                  <div>
                    <div className="form-control">
                      <label className="form-label" htmlFor="titleNewPickList">
                        {intl.formatMessage({ id: 'measures.title' })}
                      </label>
                      <input
                        className="form-input"
                        id="titleNewPickList"
                        type="text"
                        aria-describedby="helper-text-id-1-a"
                        {...register('titleNewPickList', { required: true })}
                      />
                    </div>
                    <div className="form-control">
                      <label className="form-label" htmlFor="newPickList">
                        {intl.formatMessage({ id: 'popup.notes.measures.enterNewItem' })}
                      </label>
                      <input
                        className="form-input"
                        id="newPickList"
                        type="text"
                        aria-describedby="helper-text-id-1-a"
                        {...register('newPickList', { required: true })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <div>
                        <Button
                          onClick={() => {
                            setShowPickList(false);
                          }}
                        >
                          {intl.formatMessage({ id: 'measures.cancel' })}
                        </Button>
                        <Button onClick={newPickList}>{intl.formatMessage({ id: 'measures.add' })}</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        setShowPickList(true);
                      }}
                    >
                      <PlusIcon className="w-6 h-6" />
                      {intl.formatMessage({ id: 'popup.notes.measures.addPickList' })}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-2/4 px-6 flex flex-col">
              <div className="form-control">
                <label className="form-label" htmlFor="c">
                  {intl.formatMessage({ id: 'notes.measures.chiefComplaint' })}
                </label>
                <input
                  onFocus={() => {
                    setFocusFlag('c');
                  }}
                  className="form-input"
                  id="c"
                  type="text"
                  aria-describedby="helper-text-id-1-a"
                  value={String(getValues('c'))?.replace('None Specified', '') ?? getValues('c')}
                  {...register('c')}
                />
              </div>
              <div className="form-control">
                <label className="form-label" htmlFor="s">
                  {intl.formatMessage({ id: 'notes.measures.subjective' })}
                </label>
                <input
                  onFocus={() => {
                    setFocusFlag('s');
                  }}
                  className="form-input"
                  id="s"
                  type="text"
                  aria-describedby="helper-text-id-1-a"
                  value={String(getValues('s'))?.replace('None Specified', '') ?? getValues('s')}
                  {...register('s')}
                />
              </div>
              <div className="form-control">
                <label className="form-label" htmlFor="o">
                  {intl.formatMessage({ id: 'notes.measures.objective' })}
                </label>
                <input
                  onFocus={() => {
                    setFocusFlag('o');
                  }}
                  className="form-input"
                  id="o"
                  type="text"
                  aria-describedby="helper-text-id-1-a"
                  value={String(getValues('o'))?.replace('None Specified', '') ?? getValues('o')}
                  {...register('o')}
                />
              </div>
              <div className="form-control">
                <label className="form-label" htmlFor="a">
                  {intl.formatMessage({ id: 'notes.measures.assessment' })}
                </label>
                <input
                  onFocus={() => {
                    setFocusFlag('a');
                  }}
                  className="form-input"
                  id="a"
                  type="text"
                  aria-describedby="helper-text-id-1-a"
                  value={String(getValues('a'))?.replace('None Specified', '') ?? getValues('a')}
                  {...register('a')}
                />
              </div>
              <div className="form-control">
                <label className="form-label" htmlFor="p">
                  {intl.formatMessage({ id: 'notes.measures.plan' })}
                </label>
                <input
                  onFocus={() => {
                    setFocusFlag('p');
                  }}
                  className="form-input"
                  id="p"
                  type="text"
                  aria-describedby="helper-text-id-1-a"
                  value={String(getValues('p'))?.replace('None Specified', '') ?? getValues('p')}
                  {...register('p')}
                />
              </div>
            </div>
          </div>
        </div>
        {showPreviewNote && (
          <div className="w-1/3 border-2 rounded">
            <div className="flex justify-between items-center border-b-2">
              <div>{intl.formatMessage({ id: 'popup.notes.measures.previewNote' })}</div>
              <Button>
                <MinusIcon className="w-6 h-6" onClick={handlePreviewNote} />
              </Button>
            </div>
            <div className="break-words">
              <div>
                <div className="font-bold">{intl.formatMessage({ id: 'notes.measures.chiefComplaint' })}</div>
                <div className="min-h-[1.75rem]">{watch('c')}</div>
              </div>
              <div>
                <div className="font-bold">{intl.formatMessage({ id: 'notes.measures.subjective' })}</div>
                <div className="min-h-[1.75rem]">{watch('s')}</div>
              </div>
              <div>
                <div className="font-bold">{intl.formatMessage({ id: 'notes.measures.objective' })}</div>
                <div className="min-h-[1.75rem]">{watch('o')}</div>
              </div>
              <div>
                <div className="font-bold">{intl.formatMessage({ id: 'notes.measures.assessment' })}</div>
                <div className="min-h-[1.75rem]">{watch('a')}</div>
              </div>
              <div>
                <div className="font-bold">{intl.formatMessage({ id: 'notes.measures.plan' })}</div>
                <div className="min-h-[1.75rem]">{watch('p')}</div>
              </div>
              {current ? (
                <div>
                  <div className="font-bold">{intl.formatMessage({ id: 'popup.notes.measures.currentMedications' })}</div>
                  {chartNotes.currentMedications.length > 0 ? (
                    chartNotes.currentMedications.map((medication) => <div className="min-h-[1.75rem]">{medication}</div>)
                  ) : (
                    <div className="min-h-[1.75rem]">{intl.formatMessage({ id: 'popup.notes.measures.noCurrentMedications' })}</div>
                  )}
                </div>
              ) : (
                <></>
              )}
              {orders ? (
                <div>
                  <div className="font-bold">{intl.formatMessage({ id: 'popup.notes.measures.orders' })}</div>
                  {chartNotes.orders.length > 0 ? (
                    chartNotes.orders.map((order) => <div className="min-h-[1.75rem]">{order}</div>)
                  ) : (
                    <div className="min-h-[1.75rem]">{intl.formatMessage({ id: 'popup.notes.measures.noOrders' })}</div>
                  )}
                </div>
              ) : (
                <></>
              )}
              {allergies ? (
                <div>
                  <div className="font-bold">{intl.formatMessage({ id: 'measures.allergies' })}</div>
                  {chartNotes.allergies.length > 0 ? (
                    chartNotes.allergies.map((allergie) => <div className="min-h-[1.75rem]">{allergie}</div>)
                  ) : (
                    <div className="min-h-[1.75rem]">{intl.formatMessage({ id: 'popup.notes.measures.noAllergies' })}</div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal.Body>
  );

  // we need isEncounter for opening modal in use effect, because we can't call handleOpen() in encounter.content
  useEffect(() => {
    if (isEncounter) {
      handleOpen();
      renew();
      openClick();
    }
  }, []);

  return (
    <>
      <Button
        color={isEncounter ? 'white' : 'blue'}
        onClick={() => {
          handleOpen();
          renew();
          openClick();
        }}
      >
        {children}
      </Button>
      <Modal open={open} className="!max-w-none !w-11/12">
        {header}
        {body}
      </Modal>
    </>
  );
});

PopUpNote.displayName = 'PopUpNote';
export default PopUpNote;
