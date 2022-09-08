import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './drug.detail.module.css';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { useForm, useFormContext } from 'react-hook-form';
import MaskInput from 'shared/ui/mask.input';

interface ICurrentMedicationModal {
  open: boolean;
  onCancel: () => void;
  drugName?: string;
  outsidePhysician?: string;
  saveMedication: (data: { chronic: boolean; expirationDate: string | Date; outsidePhysician: string; medicationComment: string }) => void;
}

const CurrentMedicationModal: FC<ICurrentMedicationModal> = observer(({ open, onCancel, drugName, outsidePhysician, saveMedication }) => {
  const intl = useIntl();
  const {
    setValue,
    register,
    getValues,
    watch,
    formState: { isValid, isSubmitted },
  } = useForm();

  useEffect(() => {
    setValue('expirationDate', new Date().toJSON());
    setValue('outsidePhysician', outsidePhysician ?? '');
  }, []);

  const isSubmitDisabled = isSubmitted && !isValid;

  const save = () => {
    saveMedication({
      chronic: !!getValues('chronic'),
      expirationDate: getValues('expirationDate'),
      outsidePhysician: getValues('outsidePhysician'),
      medicationComment: getValues('medicationComment'),
    });
  };

  watch(['chronic', 'outsidePhysician']);

  return (
    <Modal className="sm:!max-w-md" open={open} onClose={onCancel}>
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {intl.formatMessage({ id: 'popup.notes.measures.currentMedication' })}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="flex flex-col space-y-2">
          <div className="form-control">
            <h5 className="text-3xl">{drugName ?? ''}</h5>
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">Expiration</legend>

            <label className="form-control-label __end">
              <input className="form-checkbox" type="checkbox" {...register('chronic')} aria-describedby="helper-text-id-1-b" />
              <div>
                <span className="form-control-label_label text-lg">Chronic</span>
              </div>
            </label>
            {!getValues('chronic') && (
              <fieldset className="form-group">
                <div className="form-control md:w-3/6">
                  <label className="form-label" htmlFor="param-expirationDate">
                    {intl.formatMessage({ id: 'measures.expirationDate' })}
                  </label>
                  <MaskInput
                    required
                    className="form-input"
                    id="param-expirationDate"
                    type="text"
                    autoComplete="off"
                    placeholder="yyyy-mm-dd"
                    options={{ alias: 'datetime', inputFormat: 'yyyy-mm-dd' }}
                    {...register('expirationDate', {
                      setValueAs: (v) => (v?.length ? new Date(v).toJSON() : undefined),
                    })}
                  />
                </div>
              </fieldset>
            )}
          </div>
          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.detail' })}</legend>
            <fieldset className="form-group">
              <div className="form-control">
                <fieldset className="form-group">
                  <div className="form-control">
                    <label className="form-label" htmlFor="param-name">
                      {intl.formatMessage({ id: 'outside.physician' })}
                    </label>
                    <input
                      className="form-input !form-input-error"
                      id="param-name"
                      type="text"
                      {...register('outsidePhysician', { required: true, minLength: 1, maxLength: 50 })}
                    />
                  </div>
                </fieldset>
              </div>
            </fieldset>
          </div>
          <div className="form-control">
            <fieldset className="form-group">
              <div className="form-control">
                <label className="form-label" htmlFor="param-name">
                  {intl.formatMessage({ id: 'measures.comment' })}
                </label>
                <textarea className="form-input" id="param-medicationComment" {...register('medicationComment', { minLength: 1, maxLength: 255 })} />
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>
      <Modal.Actions onOk={save} okAttrs={{ disabled: isSubmitDisabled }} okText="Save" okType="submit" onCancel={onCancel} />
    </Modal>
  );
});

CurrentMedicationModal.displayName = 'CurrentMedicationModal';
export default CurrentMedicationModal;
