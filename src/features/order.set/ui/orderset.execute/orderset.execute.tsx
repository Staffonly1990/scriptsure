import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Observer, observer } from 'mobx-react-lite';
import Modal from 'shared/ui/modal';
import { useIntl } from 'react-intl';
import { UsersIcon, TrashIcon, PencilIcon, PlusIcon, ChevronDownIcon, AnnotationIcon } from '@heroicons/react/solid';
import Button from 'shared/ui/button';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { CurrentPractice } from 'features/practice';
import { CurrentPrescriber } from 'features/prescriber';
import { userModel } from 'features/user';
import Dropdown from 'shared/ui/dropdown';
import Tooltip from 'shared/ui/tooltip';
import { patientPharmacyModel } from 'features/patient';
import orderSet from '../../model/order.set.store';
import ChartPharmacyView from 'views/chart/pharmacy';
import Select from 'shared/ui/select';
import { useForm } from 'react-hook-form';
import Input from 'features/user/ui/edit.profile/input';
import Popper from 'shared/ui/popper';
import OrdersetExecuteAnnotation from './orderset.execute.annotation';

interface IOrdersetExecute {
  open: boolean;
  handleClose: () => void;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
}

const OrdersetExecute: FC<IOrdersetExecute> = observer(({ open, handleClose, innerRef }) => {
  const payerType = [
    { value: 'M', label: 'Coupon' },
    { value: 'L', label: 'Discount Program' },
    { value: 'G', label: 'Hospice Responsible' },
    { value: 'F', label: 'Managed Care' },
    { value: 'E', label: 'Medicaid' },
    { value: 'A', label: 'Medicare Part A' },
    { value: 'B', label: 'Medicare Part B' },
    { value: 'C', label: 'Medicare Part C' },
    { value: 'D', label: 'Medicare Part D' },
    { value: 'P', label: 'Military / VA' },
    { value: 'N', label: 'Voucher' },
    { value: 'K', label: 'Workers Compensation' },
    { value: 'ZZ', label: 'Unknown' },
  ];

  const breakpoints = useBreakpoints();
  const intl = useIntl();
  const form = useForm();
  const popoverRef = useRef<HTMLDivElement>(null);

  const [openPharmacy, setOpenPharmacy] = useState(false);
  const [collapseInsurance, setCollapseInsurance] = useState(true);
  const [openAnnotation, setOpenAnnotation] = useState(false);

  form.watch(['payerType', 'bin', 'pcn', 'group', 'payerName', 'cardHolder']);

  const header = (
    <Modal.Header>
      <div className="flex items-center">
        <CurrentPractice />
        <CurrentPrescriber />
        {userModel.data?.currentPractice?.supervisors && (
          <Dropdown list={userModel.data?.currentPractice?.supervisors?.map((supervisor) => <div>{supervisor}</div>) ?? []}>
            <Button className="relative h-full" variant="flat" shape="smooth" color="white" size={breakpoints.lg ? 'md' : 'xs'}>
              <UsersIcon className="w-4 h-4 text-current md:mr-2" />
              <span className="hidden xl:inline">{`${userModel.data?.currentPrescriber.firstName} ${userModel.data?.currentPrescriber.lastName}`}</span>
              <span className="absolute -top-1 left-4 text-green-200 text-xs leading-5 hidden xl:block">
                {intl.formatMessage({ id: 'current.supervisor' })}
              </span>
            </Button>
          </Dropdown>
        )}
      </div>
    </Modal.Header>
  );

  const body = (
    <div>
      <div>
        <Modal.Title as="h5" className="title text-white bg-blue-400 p-3">
          {orderSet.selectedOrderSet?.name}
        </Modal.Title>
        <div>
          <div className="p-2 text-2xl">{orderSet.selectedOrderSet?.comment}</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {orderSet.selectedOrderSet?.OrdersetSequences.map((sequence) => (
            <li className="p-2 flex items-center justify-between">
              <div>
                <div className="font-bold">{sequence.name}</div>
                <div>{sequence.detail}</div>
                <div className="text-gray-400">{sequence.description}</div>

                {sequence.ordersetType === 1 && (
                  <div className="font-bold text-gray-500">
                    {`${intl.formatMessage({ id: 'settings.pharmacy.destination' })}: 
                    ${sequence.Orders?.[0].pharmacy}`}
                  </div>
                )}

                {sequence.ordersetType === 1 && sequence.Orders?.[0].pharmacyNote && (
                  <div className="font-bold text-gray-500">{`${intl.formatMessage({ id: 'note.pharmacist' })}: ${sequence.Orders?.[0].pharmacyNote}`}</div>
                )}

                {sequence.ordersetType === 1 && sequence.Orders?.[0].internalComment && (
                  <div className="font-bold text-gray-500">{`${intl.formatMessage({ id: 'internal.comment' })}: ${sequence.Orders?.[0].internalComment}`}</div>
                )}
              </div>
              <div className="flex items-center">
                <Tooltip placement="bottom" content={intl.formatMessage({ id: 'modify' })}>
                  <Button variant="flat" shape="circle" color="gray">
                    <PencilIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>

                <Tooltip placement="bottom" content={intl.formatMessage({ id: 'delete' })}>
                  <Button variant="flat" shape="circle" color="gray">
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Modal.Title as="h5" className="title text-white bg-blue-400 p-3">
          {intl.formatMessage({ id: 'measures.pharmacy' })}
        </Modal.Title>

        <div className="p-3 flex">
          <div className="max-w-1/2">
            <div className="flex">
              <div>
                <div className="text-sm">{intl.formatMessage({ id: 'settings.pharmacy.destination' })}</div>
                <div className="font-bold text-lg">{patientPharmacyModel.selectedPharmacy?.businessName}</div>
                <div className="font-bold">{patientPharmacyModel.selectedPharmacy?.addressLine1}</div>
                <div className="text-lg">
                  {`${patientPharmacyModel.selectedPharmacy?.city} 
              ${patientPharmacyModel.selectedPharmacy?.stateProvince} 
              ${patientPharmacyModel.selectedPharmacy?.postalCode}`}
                </div>
                <div className="text-sm">{patientPharmacyModel.selectedPharmacy?.primaryTelephone}</div>
              </div>
              <div className="p-3">
                <Dropdown
                  placement="bottom-start"
                  list={patientPharmacyModel.pharmacies.map((pharmacy) => (
                    <Dropdown.Item
                      onClick={() => {
                        patientPharmacyModel.selectPharmacy(pharmacy, true);
                        orderSet.changeSelectedOrderSet(null, pharmacy);
                      }}
                    >
                      {`${pharmacy.businessName} ${pharmacy.addressLine1} ${pharmacy.city} ${pharmacy.stateProvince}`}
                    </Dropdown.Item>
                  ))}
                >
                  <Button shape="circle" color="gray">
                    <ChevronDownIcon className="w-6 h-6" />
                  </Button>
                </Dropdown>
              </div>
            </div>

            <Button
              color="gray"
              onClick={() => {
                patientPharmacyModel.specifyIsPrescription(true);
                setOpenPharmacy(true);
              }}
            >
              <PlusIcon className="w-6 h-6" />
              <span>{intl.formatMessage({ id: 'measures.new.pharmacy' })}</span>
            </Button>
            <div>{intl.formatMessage({ id: 'note.pharmacy' })}</div>
          </div>

          <div className="max-w-1/2">
            <div>Notes to Pharmacist (do not enter insurance, diagnosis, patient demographics or prescription instructions in this field)</div>
            <div className="flex items-center">
              <Input
                width="w-full"
                id="pharmacyNote"
                label="Note To Pharmacist (Pharmacy Note)"
                maxLength={210}
                value={form.getValues('pharmacyNote')}
                form={form}
              />

              <div className="pl-3">
                <Popper
                  trigger="focus"
                  container={popoverRef?.current}
                  placement="bottom-end"
                  content={
                    <div>
                      <Popper.Listbox>
                        {orderSet.commentsOne.map((comment) => (
                          <Popper.ListboxItem
                            onClick={() => {
                              form.setValue('pharmacyNote', comment.comment);
                            }}
                          >
                            {comment.name}
                          </Popper.ListboxItem>
                        ))}
                      </Popper.Listbox>

                      <Button
                        onClick={() => {
                          setOpenAnnotation(true);
                        }}
                        color="gray"
                      >
                        <PlusIcon className="w-6 h-6" />
                        <span>ADD NEW COMMENT</span>
                      </Button>
                    </div>
                  }
                >
                  <Button variant="flat" shape="circle" color="blue">
                    <AnnotationIcon className="w-6 h-6" />
                  </Button>
                </Popper>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  setCollapseInsurance(!collapseInsurance);
                  if (collapseInsurance) {
                    form.setValue('bin', '');
                    form.setValue('pcn', '');
                    form.setValue('group', '');
                    form.setValue('payerName', '');
                    form.setValue('payerType', '');
                    form.setValue('cardHolder', '');
                  }
                }}
                color="blue"
              >
                <span>Patient insurance (optional)</span>
              </Button>
              {collapseInsurance && (
                <>
                  <div className="flex items-center">
                    <Input value={form.getValues('payerName')} id="payerName" label="Payer Name" form={form} width="w-full" />
                    <div className="flex items-center relative h-24">
                      <Select
                        container={innerRef?.current}
                        classes={{ options: '!w-auto !z-modalForefront' }}
                        width="w-40"
                        selectIcon={<ChevronDownIcon />}
                        options={payerType}
                        value={form.getValues('payerType') ?? ''}
                        {...form.register('payerType')}
                        label={<label className="form-label text-xs opacity-50 absolute bottom-16">Payer Type</label>}
                      />
                    </div>
                    <Input value={form.getValues('cardHolder')} id="cardHolder" label="Card Holder #" form={form} width="w-full" />
                  </div>
                  <div className="flex items-center flex-wrap">
                    <Input value={form.getValues('pcn')} id="pcn" label="PCN #" form={form} />
                    <Input value={form.getValues('bin')} id="bin" label="BIN #" form={form} />
                    <Input value={form.getValues('group')} id="group" label="Group #" form={form} />

                    <Button
                      onClick={() => {
                        form.setValue('bin', '');
                        form.setValue('pcn', '');
                        form.setValue('group', '');
                        form.setValue('payerName', '');
                        form.setValue('payerType', '');
                        form.setValue('cardHolder', '');
                      }}
                      variant="flat"
                      shape="circle"
                      color="blue"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </Button>

                    <Popper
                      trigger="focus"
                      container={popoverRef?.current}
                      placement="bottom-end"
                      content={
                        <div>
                          <Popper.Listbox>
                            {orderSet.insurances.map((insurance) => (
                              <Popper.ListboxItem
                                onClick={() => {
                                  const commentJSON = JSON.parse(insurance.comment);
                                  form.setValue('payerName', commentJSON.payerName ?? '');
                                  form.setValue('payerType', commentJSON.payerType ?? '');
                                  form.setValue('cardHolder', commentJSON.cardHolderId ?? '');
                                  form.setValue('pcn', commentJSON.pcnId ?? '');
                                  form.setValue('bin', commentJSON.binId ?? '');
                                  form.setValue('group', commentJSON.groupId ?? '');
                                }}
                              >
                                {insurance.name}
                              </Popper.ListboxItem>
                            ))}
                          </Popper.Listbox>
                          <Button color="gray">
                            <PlusIcon className="w-6 h-6" />
                            <span>ADD NEW INSURANCE</span>
                          </Button>
                        </div>
                      }
                    >
                      <Button variant="flat" shape="circle" color="blue">
                        <AnnotationIcon className="w-6 h-6" />
                      </Button>
                    </Popper>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="!max-w-none !w-3/4 overflow-auto"
        onClose={() => {
          setOpenPharmacy(false);
          patientPharmacyModel.specifyIsPrescription(false);
        }}
        open={openPharmacy}
      >
        <Modal.Header as="h5" className="title text-white bg-blue-400 p-3">
          {intl.formatMessage({ id: 'measures.patient.pharmacy' })}
        </Modal.Header>

        <Modal.Body className="p-2">
          <ChartPharmacyView
            selectClick={() => {
              setOpenPharmacy(false);
              patientPharmacyModel.specifyIsPrescription(false);
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setOpenPharmacy(false);
                patientPharmacyModel.specifyIsPrescription(false);
              }}
            >
              <span>{intl.formatMessage({ id: 'close' })}</span>
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );

  const footer = <div className="p-2 flex justify-end">OrdersetExecute</div>;

  return (
    <Modal className="!max-w-none !w-3/4" open={open} onClose={handleClose}>
      {header}
      <Modal.Body className="!p-0">{body}</Modal.Body>
      {footer}
      <OrdersetExecuteAnnotation
        modifyAnnotation={(annotation) => {
          console.log(annotation);
        }}
        deleteAnnotation={(annotation) => {
          console.log(annotation);
        }}
        title="Comment"
        open={openAnnotation}
        listAnnotations={orderSet.commentsOne ?? []}
        handleClose={() => {
          setOpenAnnotation(false);
        }}
      />
    </Modal>
  );
});

OrdersetExecute.displayName = 'OrdersetExecute';
export default OrdersetExecute;
