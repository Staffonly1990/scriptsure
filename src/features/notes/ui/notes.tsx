import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import Dropdown from 'shared/ui/dropdown';
import { ClockIcon, LockOpenIcon, LockClosedIcon, PlusIcon, MailOpenIcon, PencilIcon, InboxIcon, SearchIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { flowResult } from 'mobx';
import { chartNotes } from '../model';
import PopUpNote from './pop.up.note';
import AddAddendum from './add.addendum';
import ArchiveNote from './archive.note';
import DeleteNote from './delete.note';
import { patientModel } from 'features/patient';
import styles from './notes.module.css';
import moment from 'moment';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { highlightWordFilter } from '../lib';
import cx from 'classnames';

const ChartNotes: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const intl = useIntl();
  const variants = ['all', 'current', 'archived'];
  const [checkedVar, setCheckedVar] = useState(variants[0]);

  const getNotes = async (action: string) => {
    try {
      await flowResult(chartNotes.getNotes(action, patientModel.currentPatient?.patientId));
    } catch {}
  };

  const getNote = async (soapId?: number) => {
    try {
      await flowResult(chartNotes.getNote(soapId));
    } catch {}
  };

  const getAddendum = async (addendumId?: number) => {
    try {
      await flowResult(chartNotes.getAddendum(addendumId));
    } catch {}
  };

  const getNoteСheckout = async (soapId: number) => {
    try {
      await flowResult(chartNotes.getNoteСheckout(soapId));
    } catch {}
  };

  const encounter = async () => {
    try {
      await flowResult(chartNotes.getCurrentEncounter(patientModel.currentPatient?.patientId));
    } catch {}
  };

  const pickList = async () => {
    try {
      await flowResult(chartNotes.pickList());
    } catch {}
  };

  const deleteNoteCheckout = async (soapId: number) => {
    try {
      await flowResult(chartNotes.deleteNoteCheckout(soapId, false));
    } catch {}
  };

  useEffect(() => {
    getNotes(checkedVar);
  }, []);

  const noteActions = [
    variants.map((variant) => {
      return (
        <Dropdown.Item>
          <Button
            onClick={() => {
              setCheckedVar(variant);
              getNotes(variant);
            }}
            variant="flat"
            color="gray"
            className="uppercase"
          >
            {intl.formatMessage({ id: `measures.${variant}` })}
          </Button>
        </Dropdown.Item>
      );
    }),
  ];

  const notesColumn = (
    <div className="min-w-1/4">
      {chartNotes.notes.map((note) => (
        <div className={styles.notes}>
          <Button
            onClick={() => {
              getNote(note.soapId!);
            }}
            className={styles.note}
          >
            <div className="flex flex-col items-start">
              <div className="text-left">{note.title}</div>
              {note.createdAt && <div>{moment(new Date(note.createdAt)).format('MM/DD/YYYY h:mma')}</div>}
            </div>
            {note.signStatus === 0 || note.signStatus === 3 ? <LockOpenIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
          </Button>
          {chartNotes.addendums
            .filter((addendum) => addendum.parentSoapId === note.soapId)
            .map((addendum) => (
              <Button
                onClick={() => {
                  getAddendum(addendum.addendumId);
                }}
                className={styles.addendum}
              >
                <div className="flex flex-col items-start">
                  <div>{intl.formatMessage({ id: 'notes.measures.addendum' })}</div>
                </div>
              </Button>
            ))}
        </div>
      ))}
      <div>
        {chartNotes.parentNotes.map((notes) => (
          <div className="!border-gray-300 border">
            {notes.map((note) => (
              <Button
                onClick={() => {
                  getNote(note.soapId!);
                }}
                className={styles.note}
              >
                <div className="flex flex-col items-start">
                  <div className="text-left">{note.title}</div>
                  {note.createdAt && <div>{moment(new Date(note.createdAt)).format('MM/DD/YYYY h:mma')}</div>}
                </div>
                {note.signStatus === 0 || note.signStatus === 3 ? <LockOpenIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
              </Button>
            ))}
            {chartNotes.addendums
              .filter((addendum) => addendum.parentSoapId === notes[0].soapId)
              .map((addendum) => (
                <Button
                  onClick={() => {
                    getAddendum(addendum.addendumId);
                  }}
                  className={styles.addendum}
                >
                  <div className="flex flex-col items-start">
                    <div>{intl.formatMessage({ id: 'notes.measures.addendum' })}</div>
                  </div>
                </Button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center h-16 border-b sm:p-2 border-gray-300">
        <div className="flex items-center">
          <div>{intl.formatMessage({ id: `notes.measures.${checkedVar}` })}</div>
          <Dropdown list={noteActions} className="m-2" placement="bottom-start">
            <Tooltip content={intl.formatMessage({ id: 'measures.actions' })}>
              <Button shape="circle">
                <ClockIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </Dropdown>
        </div>
        <div className={cx(chartNotes.showSearch && 'items-stretch', 'flex items-center gap-2')}>
          {breakpoints.xl && chartNotes.selectedNote?.archive === 0 && <ArchiveNote />}
          {breakpoints.xl && chartNotes.selectedNote && chartNotes.selectedNote?.signStatus !== 1 && <DeleteNote />}
          {!!chartNotes.selectedNote?.signStatus && chartNotes.selectedNote.signStatus > 0 && (
            <AddAddendum
              newAddendum={() => {
                getNote(chartNotes.selectedNote!.soapId!).then(() => getNoteСheckout(chartNotes.selectedNote!.soapId!));
              }}
            />
          )}
          {breakpoints.xl && (
            <PopUpNote
              method="POST"
              closeClick={() => {}}
              openClick={() => {
                encounter();
                pickList();
              }}
              headerTitle="newNote"
            >
              <PlusIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'measures.newNote' })}
            </PopUpNote>
          )}
          {breakpoints.xl && (chartNotes.selectedNote?.signStatus === 0 || chartNotes.selectedNote?.signStatus === 3) ? (
            <PopUpNote
              method="PUT"
              closeClick={() => {
                deleteNoteCheckout(chartNotes.selectedNote!.soapId!);
              }}
              openClick={() => {
                pickList();
                getNoteСheckout(chartNotes.selectedNote!.soapId!);
              }}
              note={chartNotes.selectedNote}
              headerTitle="completeDraft"
            >
              <MailOpenIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'measures.completeDraft' })}
            </PopUpNote>
          ) : null}
          {breakpoints.xl && chartNotes.selectedNote && (
            <PopUpNote method="POST" closeClick={() => {}} note={chartNotes.selectedNote} openClick={pickList} headerTitle="createFollowup">
              <PencilIcon className="w-6 h-6" />
              {intl.formatMessage({ id: 'measures.createFollowup' })}
            </PopUpNote>
          )}
          {breakpoints.xl && (
            <div className="flex items-center gap-2">
              {chartNotes.showSearch && (
                <input
                  className="form-input"
                  type="text"
                  onChange={(e) => chartNotes.setSearchValue(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'measures.search' })}
                />
              )}
              <SearchIcon className="w-5 h-5 mr-1" onClick={() => chartNotes.setShowSearch(!chartNotes.showSearch)} />
            </div>
          )}
        </div>
        <div className="block xl:hidden">
          <Dropdown
            unmount={false}
            list={[
              <Dropdown.Item>
                <PopUpNote
                  method="POST"
                  closeClick={() => {}}
                  openClick={() => {
                    encounter();
                    pickList();
                  }}
                  headerTitle="newNote"
                >
                  <PlusIcon className="w-6 h-6" />
                  {intl.formatMessage({ id: 'measures.newNote' })}
                </PopUpNote>
              </Dropdown.Item>,
              !!chartNotes.selectedNote?.signStatus && chartNotes.selectedNote?.signStatus > 0 && (
                <Dropdown.Item>
                  <AddAddendum
                    newAddendum={() => {
                      getNote(chartNotes.selectedNote!.soapId!).then(() => getNoteСheckout(chartNotes.selectedNote!.soapId!));
                    }}
                  />
                </Dropdown.Item>
              ),
              (chartNotes.selectedNote?.signStatus === 0 || chartNotes.selectedNote?.signStatus === 3) && (
                <Dropdown.Item>
                  <PopUpNote
                    method="PUT"
                    closeClick={() => {
                      deleteNoteCheckout(chartNotes.selectedNote!.soapId!);
                    }}
                    openClick={() => {
                      pickList();
                      getNoteСheckout(chartNotes.selectedNote!.soapId!);
                    }}
                    note={chartNotes.selectedNote}
                    headerTitle="completeDraft"
                  >
                    <MailOpenIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'measures.completeDraft' })}
                  </PopUpNote>
                </Dropdown.Item>
              ),
              chartNotes.selectedNote && (
                <Dropdown.Item>
                  <PopUpNote method="POST" closeClick={() => {}} note={chartNotes.selectedNote} openClick={pickList} headerTitle="createFollowup">
                    <PencilIcon className="w-6 h-6" />
                    {intl.formatMessage({ id: 'measures.createFollowup' })}
                  </PopUpNote>
                </Dropdown.Item>
              ),
              chartNotes.selectedNote?.archive === 0 && (
                <Dropdown.Item>
                  <ArchiveNote />
                </Dropdown.Item>
              ),
              chartNotes.selectedNote && chartNotes.selectedNote?.signStatus !== 1 && (
                <Dropdown.Item>
                  <DeleteNote />
                </Dropdown.Item>
              ),
            ]}
          >
            <Button variant="flat" shape="circle" color="black" size="xs">
              <DotsVerticalIcon className="w-4 h-4" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="flex border-gray-300 h-full">
        {notesColumn}
        <div className="sm:p-2 border-b border-l border-gray-300 min-w-3/4">
          {chartNotes.selectedNote ? (
            <>
              <div className="text-lg">{chartNotes.selectedNote.title}</div>
              <div>
                <div className="text-xl font-bold">{intl.formatMessage({ id: 'notes.measures.chiefComplaint' })}</div>
                <div className="min-h-[1.75rem] break-words">{chartNotes.selectedNote.chiefComplaint}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{intl.formatMessage({ id: 'notes.measures.subjective' })}</div>
                <div className="min-h-[1.75rem] break-words">{chartNotes.selectedNote.subjective}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{intl.formatMessage({ id: 'notes.measures.objective' })}</div>
                <div className="min-h-[1.75rem] break-words">{chartNotes.selectedNote.objective}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{intl.formatMessage({ id: 'notes.measures.assessment' })}</div>
                <div className="min-h-[1.75rem] break-words">{chartNotes.selectedNote.assessment}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{intl.formatMessage({ id: 'notes.measures.plan' })}</div>
                <div className="min-h-[1.75rem] break-words">{chartNotes.selectedNote.treatmentPlan}</div>
              </div>
              {chartNotes.selectedNote?.json && JSON.parse(`${chartNotes.selectedNote.json}`)?.currentMedications && (
                <div>
                  <div className="text-xl font-bold">Current Medications</div>
                  <div className="min-h-[1.75rem] break-words">
                    {JSON.parse(chartNotes.selectedNote?.json as any)?.currentMedications?.map((input, index) => (
                      <span>
                        {index !== 0 ? ', ' : ''}
                        {highlightWordFilter(input, chartNotes.searchValue) ? <span className="bg-yellow-300">{input}</span> : input}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {chartNotes.selectedNote?.json && JSON.parse(chartNotes.selectedNote?.json as string)?.allergies && (
                <div>
                  <div className="text-xl font-bold">{intl.formatMessage({ id: 'measures.allergies' })}</div>
                  <div className="min-h-[1.75rem] break-words">
                    {JSON.parse(chartNotes.selectedNote?.json as any)?.allergies?.map((input, index) => (
                      <span>
                        {index !== 0 ? ', ' : ''}
                        {highlightWordFilter(input, chartNotes.searchValue) ? <span className="bg-yellow-300">{input}</span> : input}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {chartNotes.selectedNote?.json && JSON.parse(chartNotes.selectedNote?.json as string)?.orders && (
                <div>
                  <div className="text-xl font-bold">Orders</div>
                  <div className="min-h-[1.75rem] break-words">
                    {JSON.parse(chartNotes.selectedNote?.json as any)?.orders?.map((input, index) => (
                      <span>
                        {index !== 0 ? ', ' : ''}
                        {highlightWordFilter(input, chartNotes.searchValue) ? <span className="bg-yellow-300">{input}</span> : input}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {chartNotes.addendums
                .filter((addendum) => addendum.parentSoapId === chartNotes.selectedNote?.soapId)
                .map((addendum) => (
                  <div>
                    <div className="text-xl font-bold">{intl.formatMessage({ id: 'measures.comment' })}</div>
                    <div className="min-h-[1.75rem] break-words">{addendum.comment}</div>
                  </div>
                ))}
            </>
          ) : (
            <div className="flex justify-start w-full shadow bg-primary self-center p-10">
              <InboxIcon className="hidden w-20 h-20 mr-10 !text-gray-300 xl:block" />
              <div className="flex flex-col self-center">
                <Button className="!text-xl !text-gray-400" variant="flat" color="gray">
                  {intl.formatMessage({ id: 'measures.selectOrNew' })}
                </Button>
                <PopUpNote
                  method="POST"
                  closeClick={() => {}}
                  openClick={() => {
                    encounter();
                    pickList();
                  }}
                  headerTitle="newNote"
                >
                  <PlusIcon className="w-6 h-6" />
                  {intl.formatMessage({ id: 'measures.newNote' })}
                </PopUpNote>
              </div>
            </div>
          )}
          {chartNotes.selectedAddendum ? (
            <>
              <div>{intl.formatMessage({ id: 'measures.comment' })}</div>
              <div>{chartNotes.selectedAddendum.comment}</div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
});
ChartNotes.displayName = 'ChartNotes';

export default ChartNotes;
