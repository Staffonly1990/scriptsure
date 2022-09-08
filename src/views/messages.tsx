import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNotifier } from 'react-headless-notifier';
import { useIntl } from 'react-intl';

import { ExternalLinkIcon, LibraryIcon, UserIcon, ViewGridAddIcon, ViewGridIcon, ViewListIcon } from '@heroicons/react/outline';
import Button from 'shared/ui/button';
import { FilterModal, DropdownToSort, PanelTab, MessageItem, NoMessage, messageStore } from 'features/message';
import Tooltip from 'shared/ui/tooltip';
import Offcanvas from 'shared/ui/offcanvas/offcanvas';
import Alert from 'shared/ui/alert';
import Modal from 'shared/ui/modal/modal';
import { IFilter, ONameModals, OTabList, OTabListType } from 'shared/api/message';
import { PrescriptionDetail, prescriptionDetailModel } from 'features/prescription';
import { XIcon } from '@heroicons/react/solid';

/**
 * @view Message
 */
const MessagesView: FC = observer(() => {
  const { formatMessage } = useIntl();
  const { notify } = useNotifier();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModalPractice, setShowModalPractice] = useState(false);
  const [showModalPrescriber, setShowModalPrescriber] = useState(false);
  const [searchPatientValue, setSearchPatientValue] = useState('');

  const modals = {
    PATIENT: {
      title: formatMessage({ id: 'patient' }),
      textContent: formatMessage({ id: 'messages.noPatient' }),
      ok: formatMessage({ id: 'ok' }),
      handleOk: () => {
        messageStore.showModal = null;
      },
      handleCancel: () => {
        messageStore.showModal = null;
      },
    },
    CANCEL_PRESCRIPTION_ACTION: {
      title: formatMessage({ id: 'cancel prescription' }),
      textContent: formatMessage({ id: 'messages.cancelPrescriber' }),
      ok: formatMessage({ id: 'ok' }),
      cancel: formatMessage({ id: 'cancel' }),
      handleCancel: () => {
        messageStore.showModal = null;
      },
      handleOk: messageStore.showModal?.handle,
    },
    REMOVE_ORIGINAL: {
      title: formatMessage({ id: 'cancel prescription' }),
      textContent: formatMessage({ id: 'messages.removeOriginal' }),
      ok: formatMessage({ id: 'yes' }),
      cancel: formatMessage({ id: 'no' }),
      handleCancel: () => {
        messageStore.showModal = null;
      },
      handleOk: messageStore.showModal?.handle,
    },
    CANCEL_PRESCRIPTION: {
      title: formatMessage({ id: 'cancel prescription' }),
      textContent: formatMessage({ id: 'messages.cancelPrescriber' }),
      ok: formatMessage({ id: 'ok' }),
      handleOk: () => {
        messageStore.showModal = null;
      },
      handleCancel: () => {
        messageStore.showModal = null;
      },
    },
    CANCEL_CONFIRM: {
      title: formatMessage({ id: 'cancel prescription' }),
      textContent: formatMessage({ id: 'messages.cancelConfirm' }, { drugName: `${messageStore.showModal?.value}` }),
      ok: formatMessage({ id: 'yes' }),
      cancel: formatMessage({ id: 'cancel' }),
      handleCancel: () => {
        messageStore.showModal = null;
      },
      handleOk: messageStore.showModal?.handle,
    },
  };

  const notifies = {
    CLEAR_ALL_ERRORS_STATEMENT: {
      text: formatMessage({ id: 'messages.clearAllErrorsStatement' }),
      type: 'success',
    },
    CLEAR_ALL_REFILLS_STATEMENT: {
      text: formatMessage({ id: 'messages.clearAllRefillsStatement' }),
      type: 'success',
    },
    NO_ACCESS: {
      text: formatMessage({ id: 'messages.noAccess' }),
      type: 'error',
    },
    CURRENT_PRACTICE: {
      text: formatMessage({ id: 'messages.currentPractice' }),
      type: 'success',
    },
    INHOUSE_APPROVED: {
      text: formatMessage({ id: 'messages.inhouseApproves' }),
      type: 'success',
    },
    REVIEWED_MESSAGE_STATEMENT: {
      text: formatMessage({ id: 'messages.reviewedMessageStatement' }),
      type: 'success',
    },
  };

  useEffect(() => {
    if (!messageStore.showNotify) return;
    const onClose = () => {
      messageStore.showNotify = null;
    };
    notify(
      <Alert.Notification onClose={onClose} shape="smooth" color={notifies[messageStore.showNotify].type === 'error' ? 'red' : 'green'} border closable>
        {notifies[messageStore.showNotify].text}
      </Alert.Notification>
    );
  }, [messageStore.showNotify]);

  const handleModal = (modal, value) => {
    messageStore.setValueSearchItems('');
    if (value) {
      if (modal === ONameModals.Practice) {
        setShowModalPrescriber(false);
      } else {
        setShowModalPractice(false);
      }
    } else {
      if (modal === ONameModals.Practice) {
        messageStore.setPracticeFilter();
      } else {
        messageStore.setUserFilter();
      }
      switch (messageStore.selectedTab) {
        case OTabList.Pending:
        case OTabList.ChangeRequest:
        case OTabList.RefillRequest:
        case OTabList.NewPrescription:
        case OTabList.Error:
        case OTabList.InHousePharmacy:
          messageStore.viewAllPending(false);
          break;
        default:
          messageStore.viewAllHistory(false);
      }
    }

    if (modal === ONameModals.Practice) return setShowModalPractice(value);

    return setShowModalPrescriber(value);
  };

  const handleClickTab = useCallback((item: OTabListType, filter: IFilter, messageType: string, messageStatus: string) => {
    messageStore.resetSearch();
    messageStore.setTab(item, filter, messageType, messageStatus);
    setSidebarOpen(false);
  }, []);

  const handlerClearSearch = useCallback(() => {
    messageStore.clearSearch();
    messageStore.getMessagesByFilter();
  }, []);

  const handlerSearchOnChange = useCallback((event) => {
    setSearchPatientValue(event.target.value);
  }, []);

  const handlerSearchKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      messageStore.searchForPatient(event.target.value);
    }
  }, []);

  const resetHandleSearch = useCallback((value) => {
    setSearchPatientValue('');
    messageStore.searchForPatient('');
  }, []);

  const handlerChangeSortedBy = useCallback((sortType) => {
    messageStore.setSortedBy(sortType);
  }, []);

  return (
    <>
      {messageStore.showModal && (
        <Modal open={!!messageStore.showModal} onClose={modals[messageStore.showModal.type].handleCancel}>
          {modals[messageStore.showModal.type].title && (
            <Modal.Header as="h5" className="bg-primary text-2xl">
              {modals[messageStore.showModal.type].title}
            </Modal.Header>
          )}
          <Modal.Body>
            <div>
              <p>{modals[messageStore.showModal.type].textContent}</p>
              <div className="flex justify-end">
                {modals[messageStore.showModal.type].cancel && (
                  <Button variant="flat" size="lg" className="uppercase" type="button" onClick={modals[messageStore.showModal.type].handleCancel}>
                    {modals[messageStore.showModal.type].cancel}
                  </Button>
                )}
                {modals[messageStore.showModal.type].ok && (
                  <Button variant="flat" size="lg" className="uppercase" type="submit" onClick={modals[messageStore.showModal.type].handleOk}>
                    {modals[messageStore.showModal.type].ok}
                  </Button>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <PrescriptionDetail show={prescriptionDetailModel.showPrescriptionDetail} />
      <div className="overflow-x-scroll	px-4 py-4 sm:px-6 lg:px-8 flex h-[calc(100vh-3rem)] xl:overflow-auto">
        <Offcanvas
          placement="left"
          scroll
          classes={{ right: 'w-80', left: 'w-80' }}
          open={sidebarOpen}
          onOpen={() => setSidebarOpen(true)}
          onClose={() => setSidebarOpen(false)}
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full overflow-y-scroll">
            <div className="flex-1 h-0 overflow-y-auto">
              <div className="flex-1 pb-4 space-y-1 bg-primary">
                {messageStore.tabList.map((tab) => (
                  <PanelTab key={tab} tab={tab} handleClickTab={handleClickTab} />
                ))}
              </div>
            </div>
          </div>
        </Offcanvas>
        <div className="w-0 duration-300 overflow-y-scroll xl:w-80">
          <div className="bg-blue-500 overflow-y-auto">
            <div className="flex-1 flex">
              <div className="flex-1 pb-4 space-y-1 bg-primary">
                {messageStore.tabList.map((tab) => (
                  <PanelTab tab={tab} handleClickTab={handleClickTab} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 bg-lightgray">
          <div className="flex justify-between shadow py-2 bg-blue-500">
            <div className="flex flex-nowrap items-center justify-between w-full h-12">
              <Button variant="flat" color="white">
                <ViewListIcon className="block w-4 h-4 mr-2 xl:hidden" onClick={() => setSidebarOpen(true)} />
                <span>
                  {formatMessage({ id: 'header.messages' })} ({messageStore.total})
                </span>
              </Button>
            </div>
            <div className="flex justify-end flex-nowrap items-center h-12">
              {(!messageStore.settings.isPagingHidden || !messageStore.settings.isPagingHiddenTask) && (
                <>
                  <Button variant="flat" color="white" className="whitespace-nowrap" onClick={() => messageStore.loadMore()}>
                    <ViewGridAddIcon className="block w-4 h-4 mr-1" />
                    <span className="hidden md:block">{formatMessage({ id: 'messages.loadMore' })}</span>
                  </Button>
                  <Button variant="flat" color="white" className="whitespace-nowrap" onClick={() => messageStore.showAll()}>
                    <ViewGridIcon className="block w-4 h-4 mr-1" />
                    <span className="hidden md:block">{formatMessage({ id: 'prescriber.measures.showAll' })}</span>
                  </Button>
                </>
              )}
              <Tooltip content={formatMessage({ id: 'invite.practice' })}>
                <FilterModal
                  setValueSearchItems={(value) => {
                    messageStore.setValueSearchItems(value);
                    messageStore.findPractices(value);
                  }}
                  onSelect={(value) => messageStore.practiceFilterSelected(value)}
                  searchItemsFilterModal={messageStore.searchItemsFilterModal}
                  title={ONameModals.Practice}
                  handleClose={() => handleModal(ONameModals.Practice, false)}
                  show={showModalPractice}
                  onOpen={() => handleModal(ONameModals.Practice, true)}
                  list={messageStore.practices}
                  selectAll={() => messageStore.selectAllPractices()}
                  clearAll={() => messageStore.clearAllPractices()}
                  deleteOne={(removeId) => messageStore.deleteOnePractice(removeId)}
                  clearSearchItemsFilterModal={() => messageStore.clearSearchItemsFilterModal()}
                >
                  <Button className="whitespace-nowrap" variant="flat" color="white">
                    <LibraryIcon className="w-4 h-4 mr-1" />
                    <span className="hidden md:block">
                      {formatMessage({ id: `reports.measures.${ONameModals.Practice}` })}({messageStore.practices.length})
                    </span>
                  </Button>
                </FilterModal>
              </Tooltip>
              <Tooltip content={formatMessage({ id: 'measures.prescriber' })}>
                <FilterModal
                  setValueSearchItems={(value) => {
                    messageStore.setValueSearchItems(value);
                    messageStore.findUsers(value);
                  }}
                  onSelect={(value) => messageStore.userFilterSelected(value)}
                  searchItemsFilterModal={messageStore.searchItemsFilterModal}
                  title={ONameModals.User}
                  handleClose={() => handleModal(ONameModals.Prescriber, false)}
                  show={showModalPrescriber}
                  onOpen={() => handleModal(ONameModals.Prescriber, true)}
                  list={messageStore.prescribers}
                  clearSearchItemsFilterModal={() => messageStore.clearSearchItemsFilterModal()}
                  selectAll={() => messageStore.selectAllPrescribers()}
                  clearAll={() => messageStore.clearAllPrescribers()}
                  deleteOne={(removeId) => messageStore.deleteOnePrescriber(removeId)}
                >
                  <Button className="whitespace-nowrap" variant="flat" color="white">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span className="hidden md:block">
                      {formatMessage({ id: `measures.${ONameModals.Prescriber}` })}({messageStore.prescribers.length})
                    </span>
                  </Button>
                </FilterModal>
              </Tooltip>
              <Tooltip content={formatMessage({ id: 'messages.managePAApp' })}>
                <Button className="whitespace-nowrap" variant="flat" color="white">
                  <ExternalLinkIcon className="w-4 h-4 mr-1" />
                  <span className="hidden md:block">{formatMessage({ id: 'messages.managePA' })}</span>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-between shadow py-4 bg-primary">
            <Button className="!text-base text-left" variant="flat" color="black">
              {formatMessage({ id: `messages.${messageStore.selectedTab}` })}
            </Button>
            <div className="flex justify-end items-center">
              <div className="form-control mr-2 w-full relative">
                <input
                  className="form-input placeholder-search placeholder-gray-500 shadow sm:text-lg pr-6"
                  placeholder={formatMessage({ id: 'messages.searchPatient' })}
                  autoComplete="off"
                  value={searchPatientValue}
                  onKeyPress={handlerSearchKeyPress}
                  onChange={handlerSearchOnChange}
                />
                {searchPatientValue && <XIcon className="absolute w-4 h-4 right-0 -translate-x-1/4 translate-y-1/3" onClick={resetHandleSearch} />}
              </div>
              <DropdownToSort handleChange={handlerChangeSortedBy} sortedBy={messageStore.messageFilter.sortedBy} />
            </div>
          </div>
          <div className="overflow-y-scroll mt-5 xl:w-auto shadow">
            {!messageStore.messages.length ? (
              <NoMessage clearSearch={handlerClearSearch} />
            ) : (
              messageStore.messages.map((message) => <MessageItem key={message.updatedAt} message={message} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
});
MessagesView.displayName = 'MessagesView';

export default MessagesView;
