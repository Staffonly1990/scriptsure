import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Button from 'shared/ui/button';
import { TrashIcon, CheckIcon, ChatAlt2Icon, PencilIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Tooltip from 'shared/ui/tooltip';
import Dropdown from 'shared/ui/dropdown';
import { prescriptionQueue } from '../../model';

const QueuePrescription: FC = observer(() => {
  const { formatMessage } = useIntl();
  const breakpoints = useBreakpoints();
  const prescriptionDropdown = [
    <Dropdown.Item>
      <Button variant="flat" color="gray">
        <PencilIcon className="w-6 h-6 mr-4" />
        {formatMessage({ id: 'measures.edit' })}
      </Button>
    </Dropdown.Item>,
    <Dropdown.Item>
      <Button variant="flat" color="gray">
        <CheckIcon className="w-6 h-6 mr-4" />
        {formatMessage({ id: 'messages.approve' })}
      </Button>
    </Dropdown.Item>,
    <Dropdown.Item>
      <Button variant="flat" color="gray">
        <TrashIcon className="w-6 h-6 mr-4" />
        {formatMessage({ id: 'queue.deny' })}
      </Button>
    </Dropdown.Item>,
  ];

  const queueIcons = breakpoints.sm ? (
    <>
      <Tooltip content={formatMessage({ id: 'measures.edit' })}>
        <Button variant="flat" color="black" shape="circle" className="ml-4">
          <PencilIcon className="w-5 h-5" />
        </Button>
      </Tooltip>
      <Button color="green" className="uppercase m-2">
        <CheckIcon className="w-5 h-5" />
        {formatMessage({ id: 'messages.approve' })}
      </Button>
      <Button color="red" className="uppercase m-2">
        <TrashIcon className="w-5 h-5" />
        {formatMessage({ id: 'queue.deny' })}
      </Button>
    </>
  ) : (
    <Dropdown placement="top" list={prescriptionDropdown}>
      <Button variant="flat" color="black" shape="circle">
        <DotsVerticalIcon className="w-5 h-5" />
      </Button>
    </Dropdown>
  );
  return (
    <div className="bg-secondary">
      <div className="bg-blue-500">
        <p className="w-full py-4 px-7 text-white text-lg md:text-xl md:pr-12">{formatMessage({ id: 'queue.prescriptionQueue' })}</p>
      </div>

      <div className="bg-blue-400 dark:bg-blue-600 flex justify-start py-2">
        <Button color="black" className="uppercase ml-1" size="lg" variant="flat">
          <TrashIcon className="w-6 h-6 mr-2" />
          {formatMessage({ id: 'queue.denyAllInQueue' })}
        </Button>
      </div>
      {prescriptionQueue.list.map((item) => {
        return (
          <div key={item.patientId} className="mx-2">
            <div className="m-2 flex xs:items-start md:items-center xs:flex-col md:flex-row">
              <Button variant="flat" color="black" className="uppercase m-1 md:m-2">
                {item.name}
              </Button>
              <Button color="green" className="m-1 md:m-2 uppercase">
                <CheckIcon className="w-6 h-6" />
                {formatMessage({ id: 'queue.approveAllForPatient' })}
              </Button>
              <Button color="red" className="m-1 md:m-2 uppercase">
                <TrashIcon className="w-6 h-6" />
                {formatMessage({ id: 'queue.denyAllForPatient' })}
              </Button>
            </div>
            {item.messages.map((drugItem) => {
              return (
                <div className={`flex justify-between pb-2  ${item.messages.length > 1 ? 'border-b-2 last:border-b-0' : ''}`}>
                  <div className="flex flex-row mt-2">
                    {breakpoints.md && (
                      <div className="flex flex-col items-center ml-5" key={drugItem.requestId}>
                        <Button shape="circle">
                          <ChatAlt2Icon className="w-10 h-10" />
                        </Button>
                        <p>{formatMessage({ id: 'queue.new' })}</p>
                      </div>
                    )}

                    <div className="px-4">
                      <p className="text-xl">{drugItem.drugName}</p>
                      <p className="text-sm font-light text-opacity-50">{drugItem.instruction}</p>
                      <p className="text-sm font-light text-opacity-50">{drugItem.pharmacy}</p>
                    </div>
                  </div>
                  <div className="flex items-center"> {queueIcons}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

QueuePrescription.displayName = 'QueuePrescription';
export default QueuePrescription;
