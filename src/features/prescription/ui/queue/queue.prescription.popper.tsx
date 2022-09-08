import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Popper from 'shared/ui/popper';
import Button from 'shared/ui/button';
import { observer } from 'mobx-react-lite';
import QueuePrescription from './queue.prescription';
import QueuePrescriptionTitle from './queue.prescription.title';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { DatabaseIcon } from '@heroicons/react/solid';

const QueuePrescriptionPopper: FC = observer(() => {
  const { formatMessage } = useIntl();
  const breakpoints = useBreakpoints();
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Popper content={<QueuePrescription />} title={<QueuePrescriptionTitle isVisible={isVisible} />} open={isOpen}>
      <Button as={Link} to="/#" variant="flat" shape="smooth" color="gray" size={breakpoints.lg ? 'md' : 'xs'} onClick={isVisible}>
        <DatabaseIcon className="w-4 h-4 md:mr-2" stroke="red" />
        <span className="hidden 2xl:inline">{formatMessage({ id: 'queue.queue' })}</span>
      </Button>
    </Popper>
  );
});
QueuePrescriptionPopper.displayName = 'QueuePrescriptionPopper';
export default QueuePrescriptionPopper;
