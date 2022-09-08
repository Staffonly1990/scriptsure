import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { observer } from 'mobx-react-lite';
import { diagnosisStore } from '../../model';
import { toJS } from 'mobx';
import Button from 'shared/ui/button';
import moment from 'moment';

const MedlineInformationModal: FC<Pick<any, 'open' | 'unmount' | 'hideBackdrop' | 'onClose'>> = observer(({ open, unmount, hideBackdrop, onClose }) => {
  const intl = useIntl();
  const medlineInformation = toJS(diagnosisStore.medlineInformation);
  const description = medlineInformation?.feed.author.name._value;
  const category = medlineInformation?.feed.category[2].term;
  const buttonsContent = medlineInformation?.feed.entry;
  const updatedDate = moment(medlineInformation?.feed.updated._value).format('MMM D, YYYY');
  return (
    <Modal as="div" className="sm:!max-w-[50vw]" unmount={unmount} hideBackdrop={hideBackdrop} onClose={onClose} open={open}>
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {intl.formatMessage({ id: 'diagnosis.measures.medlinePlusConnect' })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <span className="text-3xl">{category}</span>
          <span>
            {description} - {updatedDate}
          </span>
          <div className="px-4 flex gap-2 justify-between">
            <div>
              {buttonsContent?.map((button) => {
                const name = button.title._value;
                const { href } = button.link[0];
                return (
                  <Button as="a" href={href} target="_blank" className="mr-2">
                    {name}
                  </Button>
                );
              })}
            </div>
            <Button variant="outlined" shape="square" color="white" onClick={() => onClose()}>
              {intl.formatMessage({ id: 'measures.close' })}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
});

MedlineInformationModal.displayName = 'MedlineInformationModal';

export default MedlineInformationModal;
