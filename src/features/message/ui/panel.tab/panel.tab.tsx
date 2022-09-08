import React, { FC, useCallback } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { IFilter, OTabList, OTabListType } from 'shared/api/message';
import { messageStore } from 'features/message/model';
import DatePicker from 'shared/ui/date.picker';
import Dropdown from 'shared/ui/dropdown/dropdown';
import { ExclamationCircleIcon, ReplyIcon } from '@heroicons/react/outline';
import { DotsVerticalIcon, LogoutIcon } from '@heroicons/react/solid';

interface IPanelTabInterface {
  tab: OTabListType;
  handleClickTab: (item: OTabListType, filter: IFilter, messageType: string, messageStatus: string) => void;
}

const PanelTab: FC<IPanelTabInterface> = observer(({ tab, handleClickTab }) => {
  const { formatMessage } = useIntl();
  const withDatePicker = tab === OTabList.History || tab === OTabList.Pending;

  const getDateToInput = () => {
    if (tab === OTabList.Pending) {
      return {
        toDate: moment(messageStore.messageFilter.toDate).format('YYYY-MM-DD'),
        fromDate: moment(messageStore.messageFilter.fromDate).format('YYYY-MM-DD'),
      };
    }

    return {
      toDate: moment(messageStore.messageHistoryFilter.toDate).format('YYYY-MM-DD'),
      fromDate: moment(messageStore.messageHistoryFilter.fromDate).format('YYYY-MM-DD'),
    };
  };

  const onClickViewAll = useCallback(() => {
    switch (tab) {
      case OTabList.Pending:
      case OTabList.ChangeRequest:
      case OTabList.RefillRequest:
      case OTabList.NewPrescription:
      case OTabList.Error:
      case OTabList.InHousePharmacy:
        messageStore.viewAllPending();
        break;
      default:
        messageStore.viewAllHistory();
    }
  }, [tab]);

  const onChangeDate = useCallback(
    (name, value) => {
      switch (tab) {
        case OTabList.Pending:
        case OTabList.ChangeRequest:
        case OTabList.RefillRequest:
        case OTabList.NewPrescription:
        case OTabList.Error:
        case OTabList.InHousePharmacy:
          messageStore.reloadPending(name, value);
          break;
        default:
          messageStore.reloadHistory(name, value);
      }
    },
    [tab]
  );

  const handleClick = useCallback(() => {
    let filter;
    let messageType = '';
    let messageStatus = '';
    switch (tab) {
      case OTabList.ChangeRequest:
        filter = { ...messageStore.messageFilter };
        messageType = 'RxChangeRequest';
        messageStatus = 'Pending';
        break;
      case OTabList.RefillRequest:
        filter = { ...messageStore.messageFilter };
        messageType = 'RxRenewalRequest';
        messageStatus = 'Pending';
        break;
      case OTabList.NewPrescription:
        filter = { ...messageStore.messageFilter };
        messageType = 'NewRx';
        messageStatus = 'WaitingApproval';
        break;
      case OTabList.Error:
        filter = { ...messageStore.messageFilter };
        messageType = '%';
        messageStatus = 'Error';
        break;
      case OTabList.InHousePharmacy:
        filter = { ...messageStore.messageFilter };
        messageType = 'NewRx';
        messageStatus = 'InhouseNewRx';
        break;
      case OTabList.Approved:
        filter = { ...messageStore.messageHistoryFilter };
        messageType = '%';
        messageStatus = 'Success';
        break;
      case OTabList.Declined:
        filter = { ...messageStore.messageHistoryFilter };
        messageType = '%';
        messageStatus = 'Declined';
        break;
      case OTabList.Cancel:
        filter = { ...messageStore.messageHistoryFilter };
        messageType = 'CancelRxResponse';
        messageStatus = 'Success';
        break;
      case OTabList.ErrorReviewed:
        filter = { ...messageStore.messageHistoryFilter };
        messageType = '%';
        messageStatus = 'Error Reviewed';
        break;
      default:
        filter = { ...messageStore.messageFilter };
        messageType = 'RxChangeRequest';
        messageStatus = 'Pending';
        break;
    }

    handleClickTab(tab, filter, messageType, messageStatus);
  }, [tab]);

  const getTotal = () => {
    switch (tab) {
      case OTabList.ChangeRequest:
        return messageStore.messagesCount.changeRx;
      case OTabList.RefillRequest:
        return messageStore.messagesCount.refillRx;
      case OTabList.NewPrescription:
        return messageStore.messagesCount.newRx;
      case OTabList.Error:
        return messageStore.messagesCount.error;
      case OTabList.Approved:
        return messageStore.messagesCount.approved;
      case OTabList.Declined:
        return messageStore.messagesCount.declined;
      case OTabList.Cancel:
        return messageStore.messagesCount.cancelRxResponse;
      case OTabList.ErrorReviewed:
        return messageStore.messagesCount.errorReviewed;
      default:
        return 0;
    }
  };

  if (withDatePicker) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center flex-shrink-0 px-4 py-2.5 bg-blue-500 justify-between">
          <Button className="!text-xl text-left" variant="flat" color="white">
            {formatMessage({ id: `messages.${tab}` })}
          </Button>
          {tab === OTabList.Pending && messageStore.isBusinessUnitAdmin && (
            <Dropdown
              list={[
                <Dropdown.Item>
                  <Button variant="flat" color="black" onClick={() => messageStore.reviewedAllErrors()}>
                    <ExclamationCircleIcon className="w-6 h-6 mr-4" />
                    <span>{formatMessage({ id: 'messages.reviewedAllErrors' })}</span>
                  </Button>
                </Dropdown.Item>,
                <Dropdown.Item>
                  <Button variant="flat" color="black" onClick={() => messageStore.clearAllRefills()}>
                    <LogoutIcon className="w-6 h-6 mr-4" />
                    <span>{formatMessage({ id: 'messages.clearAllRefills' })}</span>
                  </Button>
                </Dropdown.Item>,
              ]}
            >
              <Button variant="flat" shape="circle" color="white" size="xs">
                <DotsVerticalIcon className="w-4 h-4" />
              </Button>
            </Dropdown>
          )}
        </div>
        <div className="flex flex-col bg-blue-300">
          <div className="flex items-center justify-between">
            <Button className="!text-base uppercase" variant="flat" color="white" onClick={onClickViewAll}>
              {formatMessage({ id: 'messages.viewAll' })}
            </Button>
            <div className="flex">
              <ReplyIcon className="w-7 h-7 mr-2 !text-white" onClick={() => messageStore.setTimeFrame(tab, 0)} />
              <ReplyIcon className="w-7 h-7 mr-2 !text-white" onClick={() => messageStore.setTimeFrame(tab, 5)} />
              <ReplyIcon className="w-7 h-7 mr-2 !text-white" onClick={() => messageStore.setTimeFrame(tab, 10)} />
              <ReplyIcon className="w-7 h-7 mr-2 !text-white" onClick={() => messageStore.setTimeFrame(tab, 30)} />
            </div>
          </div>
          <div className="flex items-center justify-around my-4 text-primary">
            <div className="flex flex-col">
              <span className="mx-2">{formatMessage({ id: 'reports.measures.startDate' })}</span>
              <DatePicker date={new Date(getDateToInput().fromDate)} onDateChange={(value) => onChangeDate('fromDate', value)}>
                {({ inputProps, focused }) => (
                  <input className={`form-input mx-2 w-[80%]${focused ? ' -focused' : ''}`} id="date-start" max={getDateToInput().toDate} {...inputProps} />
                )}
              </DatePicker>
            </div>
            <div className="flex flex-col">
              <span className="mx-2">{formatMessage({ id: 'measures.endDate' })}</span>
              <DatePicker date={new Date(getDateToInput().toDate)} onDateChange={(value) => onChangeDate('toDate', value)}>
                {({ inputProps, focused }) => (
                  <input className={`form-input mx-2 w-[80%]${focused ? ' -focused' : ''}`} id="date-start" min={getDateToInput().fromDate} {...inputProps} />
                )}
              </DatePicker>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <Button className="!text-base text-left" variant="flat" color="black" onClick={handleClick}>
        {formatMessage({ id: `messages.${tab}` })}
      </Button>
      {!!Number(getTotal()) && (
        <Button
          variant="filled"
          shape="circle"
          color={tab === OTabList.Error || tab === OTabList.ErrorReviewed ? 'red' : 'blue'}
          className="mr-4 w-10 justify-center"
        >
          {getTotal()}
        </Button>
      )}
    </div>
  );
});

PanelTab.displayName = 'PanelTab';
export default PanelTab;
