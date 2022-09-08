import React, { FC } from 'react';
import Button from 'shared/ui/button';
import { XIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';

interface IQueueTitleProps {
  isVisible?: () => void;
}

const QueuePrescriptionTitle: FC<StyledComponentProps<IQueueTitleProps>> = observer((props) => {
  const { isVisible } = props;
  return (
    <Button color="white" variant="flat" shape="circle" className="absolute right-2 top-4" onClick={isVisible}>
      <XIcon className="w-5 h-5" />
    </Button>
  );
});
QueuePrescriptionTitle.displayName = 'QueuePrescriptionTitle';
export default QueuePrescriptionTitle;
