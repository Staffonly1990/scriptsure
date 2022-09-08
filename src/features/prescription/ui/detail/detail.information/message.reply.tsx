import React, { FC, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import { prescriptionDetailModel } from '../../../model';
import Popper from 'shared/ui/popper/popper';
import Autocomplete from 'shared/ui/autocomplete/autocomplete';
import Dropdown from 'shared/ui/dropdown/dropdown';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import InputDefault from 'features/patient/add/ui/input.default';
import { ChatAltIcon } from '@heroicons/react/solid';

interface IMessageReplyProps {
  register: any;
  errors: any;
  trigger: any;
  getValues: any;
}

const MessageReply: FC<IMessageReplyProps> = observer(({ register, errors, trigger, getValues }) => {
  const { formatMessage } = useIntl();
  const containerRef = useRef(null);

  const showFirstBlock =
    prescriptionDetailModel.message.messageType !== 'NewRx' &&
    ((prescriptionDetailModel.message.messageType !== 'RxChangeRequest' &&
      prescriptionDetailModel.response === 'A' &&
      (prescriptionDetailModel.message.messageStatus === 'Pending' || prescriptionDetailModel.message.messageStatus === 'WaitingApproval')) ||
      (prescriptionDetailModel.response !== 'A' && prescriptionDetailModel.response !== 'ZZ' && prescriptionDetailModel.response !== ''));

  const showSecondBlock =
    prescriptionDetailModel.response === 'ZZ' &&
    prescriptionDetailModel.message.messageType === 'RxRenewalRequest' &&
    (prescriptionDetailModel.message.messageStatus === 'Pending' || prescriptionDetailModel.message.messageStatus === 'WaitingApproval');

  if (!showFirstBlock && !showSecondBlock) return null;
  return (
    <>
      {showFirstBlock && (
        <div className="w-full flex flex-col xl:flex-row shadow p-[16px]">
          <div className="flex flex-col w-full">
            <span className="text-xl">{prescriptionDetailModel.responseTitle}</span>
            {(prescriptionDetailModel.response === 'A' || prescriptionDetailModel.response === '') &&
              prescriptionDetailModel.showRefill &&
              prescriptionDetailModel.message.messageType !== 'RxChangeRequest' && (
                <div className="flex pt-[20px] flex-col">
                  <InputDefault label={formatMessage({ id: 'medication.howRefillsApprove' })} error={errors.ssRefill?.message}>
                    <input
                      className="form-input"
                      minLength="1"
                      type="number"
                      {...register('ssRefill', {
                        setValueAs: (value) => (Number.isNaN(Number(value)) ? value : Number(value)),
                        required: true,
                        min: { value: 1, message: formatMessage({ id: 'medication.minimumIs' }, { value: 1 }) },
                        maxLength: { value: 2, message: formatMessage({ id: 'medication.maxLength' }, { value: 2 }) },
                        max: {
                          value: prescriptionDetailModel.maxRefill,
                          message: `${formatMessage({ id: 'medication.maximumIs' })} ${prescriptionDetailModel.maxRefill}`,
                        },
                        pattern: {
                          value: /^[\d]*$/,
                          message: formatMessage({ id: 'medication.removeDecimal' }),
                        },
                      })}
                      onChange={(e) => {
                        prescriptionDetailModel.message.ssRefill = Number(e.target.value);
                        trigger('ssRefill');
                      }}
                    />
                  </InputDefault>
                </div>
              )}
            <div className="flex flex-col md:flex-row md:items-end">
              <InputDefault label={formatMessage({ id: 'original.pharmacyNote' })} error={errors.ssPharmacyNote?.message}>
                <input
                  className="form-input w-full"
                  value={prescriptionDetailModel.message.comment}
                  {...register('ssPharmacyNote', {
                    maxLength: {
                      value: 70,
                      message: formatMessage({ id: 'medication.maxLengthComment' }, { value: 70 }),
                    },
                  })}
                  onChange={(e) => {
                    prescriptionDetailModel.message.comment = e.target.value;
                    trigger('ssPharmacyNote');
                  }}
                />
              </InputDefault>
              {!!prescriptionDetailModel.comments?.length && (
                <Dropdown
                  list={prescriptionDetailModel.comments.map((comment, index) => (
                    <Dropdown.Item key={index.toString(36)} className="capitalize p-2" onClick={() => prescriptionDetailModel.selectComment(comment.comment)}>
                      {comment.name}
                    </Dropdown.Item>
                  ))}
                  placement="top-end"
                >
                  <Tooltip content={formatMessage({ id: 'medication.addComment' })}>
                    <Button color="transparent">
                      <ChatAltIcon className="w-6 h-6" />
                    </Button>
                  </Tooltip>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      )}
      {showSecondBlock && (
        <div className="w-full flex flex-col xl:flex-row shadow p-[8px]">
          <div className="flex flex-col w-full">
            <div className="bg-blue-500 xl:text-xl p-[16px] font-white">{formatMessage({ id: 'medication.replacePrescription' })}</div>
            <div className="flex flex-col p-[8px]">
              <span className="mb-[20px]">
                {formatMessage({ id: 'medication.pleaseFindMedication' })} {prescriptionDetailModel?.message?.messageXml?.MedicationDispensed?.DrugDescription}
              </span>
              <Autocomplete onSelect={() => prescriptionDetailModel.drugFilterChange(getValues())}>
                <Popper
                  container={containerRef?.current}
                  className="w-72 max-h-[20rem] overflow-y-auto"
                  trigger="focus"
                  onClose={() => {
                    prescriptionDetailModel.drugSearchResult = [];
                  }}
                  content={
                    <>
                      {prescriptionDetailModel.drugSearchResult.length > 0 && (
                        <Popper.Listbox>
                          {prescriptionDetailModel.drugSearchResult.map((suggestion: any) => {
                            return (
                              <Popper.ListboxItem
                                as={Autocomplete.Option}
                                key={suggestion.id}
                                value={suggestion?.ROUTED_MED_ID}
                                label={<span>{suggestion?.MED_ROUTED_MED_ID_DESC}</span>}
                                dismissed
                              />
                            );
                          })}
                        </Popper.Listbox>
                      )}
                      {!prescriptionDetailModel.drugSearchResult.length && prescriptionDetailModel.drugFilter && (
                        <Popper.Content>
                          <span>{formatMessage({ id: 'medication.noDrugFound' }, { value: `${prescriptionDetailModel.drugFilter}` })}</span>
                        </Popper.Content>
                      )}
                    </>
                  }
                >
                  {({ ref }) => (
                    <span className="inline-flex relative">
                      <Autocomplete.Input
                        ref={ref}
                        value={prescriptionDetailModel.drugFilterSelected}
                        className="form-input placeholder-search placeholder-gray-500 shadow sm:text-lg w-full"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          prescriptionDetailModel.drugSearch(e.target.value);
                        }}
                      />
                    </span>
                  )}
                </Popper>
              </Autocomplete>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

MessageReply.displayName = 'MessageReply';
export default MessageReply;
