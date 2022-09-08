import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from 'shared/ui/modal';
import Accordion from 'shared/ui/accordion';
import { useIntl } from 'react-intl';
import { CogIcon } from '@heroicons/react/solid';
import Button from 'shared/ui/button';
import orderSet from '../../model/order.set.store';
import OrdersetExecute from '../orderset.execute/orderset.execute';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { patientModel, patientPharmacyModel } from 'features/patient/model';
import DrugDetailOrderSetList from 'features/drug/ui/drug.detail/drug.detail.order.set.list';
import { userModel } from 'features/user';
import { IOrderset } from 'shared/api/orderset';
import { useStateRef } from 'shared/hooks';

interface IOrderSetSelection {
  open: boolean;
  handleClose: () => void;
}

const OrderSetSelection: FC<IOrderSetSelection> = observer(({ open, handleClose }) => {
  const breakpoints = useBreakpoints();
  const intl = useIntl();
  const [openOrderExecute, setOrderExecute] = useState(false);
  const [innerRefState, setInnerRef, innerRef] = useStateRef<Nullable<HTMLDivElement>>(null);

  const orderSetSelect = async (order: IOrderset) => {
    try {
      await patientPharmacyModel.getPharmacies(patientModel.currentPatient?.chartId || patientModel.currentPatient?.patientId);
      await orderSet.getComments(1, userModel.data?.currentPractice?.id);
      await orderSet.getComments(2, userModel.data?.currentPractice?.id);
      await orderSet.getComments(3, userModel.data?.currentPractice?.id);
      orderSet.changeSelectedOrderSet(order, patientPharmacyModel.selectedPharmacy);
      setOrderExecute(true);
    } catch (error) {}
  };

  const header = (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        <div>{intl.formatMessage({ id: 'order.set.selection' })}</div>
      </Modal.Title>
      <Button color="blue" className="uppercase" size={breakpoints.lg ? 'md' : 'xs'}>
        <CogIcon className="w-5 h-5 mr-2" />
        <span>{intl.formatMessage({ id: 'setup' })}</span>
      </Button>
    </Modal.Header>
  );

  const body = (
    <div>
      <ul className="divide-y divide-gray-200">
        {orderSet.orderSets.map((order) => (
          <li>
            <Accordion
              label={<span>{order.name}</span>}
              actionBtn={
                <Button
                  onClick={() => {
                    orderSetSelect(order);
                  }}
                  color="green"
                >
                  <span>{intl.formatMessage({ id: 'measures.select' })}</span>
                </Button>
              }
            >
              <DrugDetailOrderSetList
                orderset={order}
                getSequence={(sequence) => {
                  orderSetSelect(order);
                }}
              />
            </Accordion>
          </li>
        ))}
      </ul>
      <OrdersetExecute
        innerRef={innerRef}
        handleClose={() => {
          setOrderExecute(false);
        }}
        open={openOrderExecute}
      />
    </div>
  );

  const footer = (
    <div className="p-2 flex justify-end">
      <Button onClick={handleClose}>
        <span>{intl.formatMessage({ id: 'close' })}</span>
      </Button>
    </div>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      {header}
      <Modal.Body className="h-96 max-h-96">{body}</Modal.Body>
      {footer}
    </Modal>
  );
});

OrderSetSelection.displayName = 'OrderSetSelection';
export default OrderSetSelection;
