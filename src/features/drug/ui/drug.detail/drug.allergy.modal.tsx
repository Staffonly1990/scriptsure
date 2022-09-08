import React, { FC, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Modal from 'shared/ui/modal';

import { IAllergy } from 'shared/api/allergy';
import MaskInput from 'shared/ui/mask.input';
import Select from 'shared/ui/select';

interface IDrugAllergyModal {
  allergy?: Partial<IAllergy>;
  open: boolean;
  onCancel: () => void;
  drugName?: string;
  saveAllergy: (data: Partial<IAllergy>) => void;
  adverseevents?: {
    value: string | number;
    label?: string | undefined;
  }[];
  reactions?: {
    value: string | number;
    label?: string | undefined;
  }[];
  severities?: {
    value: string | number;
    label?: string | undefined;
  }[];
}

const DrugAllergyModal: FC<IDrugAllergyModal> = ({ open, onCancel, drugName, adverseevents, reactions, severities, saveAllergy, allergy }) => {
  const intl = useIntl();
  const {
    setValue,
    register,
    getValues,
    formState: { isValid, isSubmitted },
  } = useForm();
  const containerRef = useRef(null);
  const isSubmitDisabled = isSubmitted && !isValid;
  useEffect(() => {
    setValue('onsetDate', allergy?.onsetDate);
    setValue('endDate', allergy?.endDate);
    setValue('adverseEventCode', allergy?.adverseEventCode);
    setValue('reactionId', allergy?.reactionId);
    setValue('severityCode', allergy?.severityCode);
    setValue('allergyComment', allergy?.comment);
  }, []);

  useEffect(() => {
    setValue('allergyName', allergy?.name ?? drugName);
  }, [drugName]);
  const save = () => {
    saveAllergy({
      onsetDate: getValues('onsetDate'),
      endDate: getValues('endDate'),
      adverseEventCode: getValues('adverseEventCode'),
      reactionId: getValues('reactionId'),
      severityCode: getValues('severityCode'),
      allergyType: getValues('allergyComment'),
    });
  };

  return (
    <Modal className="sm:!max-w-md" open={open} onClose={onCancel}>
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {intl.formatMessage({ id: 'allergies.measures.allergy' })}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col space-y-2">
          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.general' })}</legend>
            <fieldset className="form-group">
              <div className="form-control">
                <label className="form-label" htmlFor="param-name">
                  {intl.formatMessage({ id: 'allergies.measures.allergyName' })}
                </label>
                <input
                  className="form-input !form-input-error"
                  id="param-name"
                  type="text"
                  value={getValues('allergyName')}
                  {...register('allergyName', { required: true, minLength: 1 })}
                />
              </div>
            </fieldset>
          </div>

          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.date' })}</legend>
            <fieldset className="form-group md:__row">
              <div className="form-control md:w-3/6">
                <label className="form-label" htmlFor="param-onsetDate">
                  {intl.formatMessage({ id: 'measures.onsetDate' })}
                </label>
                <MaskInput
                  className="form-input"
                  id="param-onsetDate"
                  type="text"
                  autoComplete="off"
                  placeholder="yyyy-mm-dd"
                  options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd' }}
                  {...register('onsetDate', { setValueAs: (v) => (v?.length ? new Date(v).toJSON() : undefined) })}
                />
              </div>

              <div className="form-control md:w-3/6">
                <label className="form-label" htmlFor="param-endDate">
                  {intl.formatMessage({ id: 'measures.endDate' })}
                </label>
                <MaskInput
                  className="form-input"
                  id="param-endDate"
                  type="text"
                  autoComplete="off"
                  placeholder="yyyy-mm-dd"
                  options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd' }}
                  {...register('endDate', { setValueAs: (v) => (v?.length ? new Date(v).toJSON() : undefined) })}
                />
              </div>
            </fieldset>
          </div>

          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.detail' })}</legend>
            <fieldset className="form-group">
              <div className="form-control">
                <fieldset className="form-group">
                  <Select
                    className="form-control"
                    classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                    shape="round"
                    label={<label className="form-label">{intl.formatMessage({ id: 'measures.type' })}</label>}
                    options={adverseevents ?? []}
                    {...register('adverseEventCode')}
                    name="adverseEventCode"
                    container={containerRef.current}
                  />
                </fieldset>
              </div>
              <div className="form-control">
                <fieldset className="form-group">
                  <Select
                    className="form-control"
                    classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                    shape="round"
                    label={<label className="form-label">{intl.formatMessage({ id: 'measures.reaction' })}</label>}
                    options={reactions ?? []}
                    {...register('reactionId')}
                    name="reactionId"
                    container={containerRef.current}
                  />
                </fieldset>
              </div>

              <div className="form-control">
                <fieldset className="form-group">
                  <Select
                    className="form-control"
                    classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                    shape="round"
                    label={<label className="form-label">{intl.formatMessage({ id: 'measures.severity' })}</label>}
                    options={severities ?? []}
                    {...register('severityCode')}
                    name="severityCode"
                    container={containerRef.current}
                  />
                </fieldset>
              </div>
            </fieldset>
          </div>

          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.comment' })}</legend>
            <fieldset className="form-group">
              <div className="form-control">
                <label className="form-label" htmlFor="param-name">
                  {intl.formatMessage({ id: 'measures.comment' })}
                </label>
                <textarea className="form-input" id="param-allergyComment" {...register('allergyComment', { minLength: 1 })} />
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>

      <Modal.Actions onOk={save} okText="Save" okType="submit" okAttrs={{ disabled: isSubmitDisabled }} onCancel={onCancel} />
    </Modal>
  );
};
DrugAllergyModal.displayName = 'DrugAllergyModal';

export default observer(DrugAllergyModal);
