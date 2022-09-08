import React, { FC, useMemo } from 'react';
import moment from 'moment';

import RxChangeRequestItem from './rx.change.request.item';
import RxChangeResponseItem from './rx.change.response.item';
import NewRxItem from './new.rx.item';
import RxRenewalRequestItem from './rx.renewal.request.item';
import RxRenewalResponseItem from './rx.renewal.response.item';
import CancelRxResponseItem from './cancel.rx.response.item';
import CancelRxItem from './cancel.rx.item';
import RxFillItem from './rx.fill.item';
import ErrorItem from './error.item';
import RxFillIndicatorChangeItem from './rx.fill.indicator.change.item';

interface IDetailHistoryItemProps {
  messageHistory: any;
  isMedication: boolean;
}

const DetailHistoryItem: FC<StyledComponentProps<IDetailHistoryItemProps>> = ({ messageHistory, isMedication }) => {
  const body = messageHistory.messageXml.Message.Body;
  const RxChangeResponse = body?.RxChangeResponse;
  const RxChangeRequest = body?.RxChangeRequest;
  const RxRenewalRequest = body?.RxRenewalRequest;
  const RxFill = body?.RxFill;
  const RxRenewalResponse = body?.RxRenewalResponse;
  const CancelRxResponse = body?.CancelRxResponse;
  const CancelRx = body?.CancelRx;
  const NewRx = body?.NewRx;
  const Error = body?.Error;
  const RxFillIndicatorChange = body?.RxFillIndicatorChange;

  const mediumMessageDate = useMemo(() => {
    return `${moment(new Date(messageHistory.messageDate)).format('MMM D, YYYY hh:mm:ss A')}`;
  }, []);

  return (
    <div className="flex flex-col mt-2 shadow">
      {RxChangeRequest && (
        <RxChangeRequestItem
          RxChangeRequest={RxChangeRequest}
          messageHistory={messageHistory}
          mediumMessageDate={mediumMessageDate}
          isMedication={isMedication}
        />
      )}

      {RxChangeResponse && (
        <RxChangeResponseItem
          RxChangeResponse={RxChangeResponse}
          messageHistory={messageHistory}
          mediumMessageDate={mediumMessageDate}
          isMedication={isMedication}
        />
      )}

      {NewRx && <NewRxItem NewRx={NewRx} messageHistory={messageHistory} mediumMessageDate={mediumMessageDate} />}

      {RxRenewalRequest && (
        <RxRenewalRequestItem
          isMedication={isMedication}
          RxRenewalRequest={RxRenewalRequest}
          mediumMessageDate={mediumMessageDate}
          messageHistory={messageHistory}
        />
      )}

      {RxRenewalResponse && (
        <RxRenewalResponseItem
          isMedication={isMedication}
          RxRenewalResponse={RxRenewalResponse}
          messageHistory={messageHistory}
          mediumMessageDate={mediumMessageDate}
        />
      )}

      {CancelRxResponse && <CancelRxResponseItem CancelRxResponse={CancelRxResponse} messageHistory={messageHistory} />}

      {CancelRx && <CancelRxItem CancelRx={CancelRx} messageHistory={messageHistory} mediumMessageDate={mediumMessageDate} />}

      {RxFill && <RxFillItem RxFill={RxFill} mediumMessageDate={mediumMessageDate} messageHistory={messageHistory} />}

      {isMedication && RxFillIndicatorChange && <RxFillIndicatorChangeItem RxFillIndicatorChange={RxFillIndicatorChange} messageHistory={messageHistory} />}

      {Error && <ErrorItem Error={Error} messageHistory={messageHistory} />}
    </div>
  );
};
DetailHistoryItem.displayName = 'DetailHistoryItem';
export default DetailHistoryItem;
