import React, { FC, useContext } from 'react';
import { useIntl } from 'react-intl';
// eslint-disable-next-line import/no-unresolved
import ReactJson from 'react-json-view';

import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { IMessageApprove } from 'shared/api/message';
import Modal from 'shared/ui/modal/modal';

import { DocumentDownloadIcon } from '@heroicons/react/outline';
import { messageViewStore } from '../../model';
import { ThemeContext } from '../../../../app/providers';

interface IMessageViewProps {
  messages: IMessageApprove[];
  show: boolean;
  onClose: () => void;
}

const MessageView: FC<IMessageViewProps> = ({ messages, show, onClose }) => {
  const { styles } = useContext(ThemeContext);
  const { formatMessage } = useIntl();

  return (
    <Modal open={show} className="w-[40rem] h-[30rem] !max-w-[60rem]">
      <Modal.Header className="text-white">
        <Modal.Title as="h2">{formatMessage({ id: 'messages.messageDetail' })}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-[24px] h-[calc(100%-112px)] overflow-y-scroll">
        {messages.map((message) => (
          <div className="my-4 border-1 shadow flex flex-col p-[16px]">
            <div className="flex justify-between">
              <span className="text-xl font-medium mb-4">{message.messageType}</span>
              <Tooltip content={formatMessage({ id: 'messages.export' })}>
                <Button shape="circle" color="white" onClick={() => messageViewStore.export(message.messageXml)}>
                  <DocumentDownloadIcon className="w-6 h-6" />
                </Button>
              </Tooltip>
            </div>
            <ReactJson theme={styles} src={message.messageXml} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
          </div>
        ))}
      </Modal.Body>
      <div className="flex justify-between border-t-2 py-[8px] px-[24px]">
        <Button shape="circle" color="white" className="overflow-hidden">
          <input
            className="absolute w-[20px] opacity-0"
            onChange={(event) => {
              messageViewStore.exportFile(event?.target?.files?.[0]);
            }}
            type="file"
            name="picture"
            accept="text/plain"
          />
          <DocumentDownloadIcon className="w-6 h-6" />
        </Button>
        <Button shape="circle" color="white" onClick={onClose}>
          {formatMessage({ id: 'measures.close' })}
        </Button>
      </div>
    </Modal>
  );
};
MessageView.displayName = 'MessageView';

export default MessageView;
