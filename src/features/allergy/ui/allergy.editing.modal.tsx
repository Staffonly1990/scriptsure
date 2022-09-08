import React, { FC, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { toJS } from 'mobx'; // flowResult
import { observer, Observer } from 'mobx-react-lite';
import { map } from 'lodash';
import cx from 'classnames';

import { IAllergy } from 'shared/api/allergy';
import Modal from 'shared/ui/modal';
import Select from 'shared/ui/select';
import MaskInput from 'shared/ui/mask.input';
import { allergyStore } from '../model';

interface IAllergyEditingModalProps {
  open: boolean;
  defaultValues: Partial<IAllergy>;
  onCancel: () => void;
  onSubmit: (data: Partial<IAllergy>) => void;
}

const AllergyEditingModal: FC<IAllergyEditingModalProps> = ({ open, defaultValues, onCancel, onSubmit }) => {
  const intl = useIntl();
  const containerRef = useRef(null);
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<Partial<IAllergy>>({
    mode: 'onChange',
    defaultValues: { ...defaultValues },
  });

  // useEffect(() => {
  //   const subscription = watch((data, { name }) => {
  //     if (isNil(name)) return;
  //     if (name === 'adverseEventCode') setValue('allergyType', data[name]);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    if (!open) return;
    reset({ ...defaultValues });
  }, [open]);

  const isSubmitDisabled = isSubmitted && !isValid;

  return (
    <Modal as="form" innerRef={containerRef} className="sm:!max-w-md" open={open} unmount onSubmit={handleSubmit(onSubmit)} onClose={onCancel}>
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
                  className={cx('form-input !form-input-error', { __error: errors.name })}
                  id="param-name"
                  // aria-describedby="helper-text-name"
                  // placeholder="Text here..."
                  type="text"
                  {...register('name', { required: true, minLength: 1 })}
                />
                {/* <span className="form-helper-text" id="helper-text-name">
      Helper text
    </span> */}
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
                  // min-date="onsetDate"
                />
              </div>
            </fieldset>
          </div>

          <div className="form-control">
            <legend className="form-label text-lg text-blue-500 dark:text-blue-400">{intl.formatMessage({ id: 'measures.detail' })}</legend>
            <fieldset className="form-group">
              <div className="form-control">
                <fieldset className="form-group">
                  <Controller
                    control={control}
                    name="adverseEventCode"
                    render={({ field: { value, onChange } }) => (
                      <Observer>
                        {() => (
                          <Select
                            className="form-control"
                            classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                            shape="round"
                            label={<label className="form-label">{intl.formatMessage({ id: 'measures.type' })}</label>}
                            options={map(toJS(allergyStore.adverseEvents), (adverseEvent) => ({
                              // @ts-ignore
                              value: adverseEvent?.adverseEventCode,
                              // @ts-ignore
                              label: adverseEvent?.name,
                            }))}
                            name="adverseEventCode"
                            value={value ?? ''}
                            container={containerRef.current}
                            onChange={onChange}
                          />
                        )}
                      </Observer>
                    )}
                  />
                </fieldset>
                {/* <span className="form-helper-text" id="helper-text-removeSearch">
        Helper text
      </span> */}
              </div>

              <div className="form-control">
                <fieldset className="form-group">
                  <Controller
                    control={control}
                    name="reactionId"
                    render={({ field: { value, onChange } }) => (
                      <Observer>
                        {() => (
                          <Select
                            className="form-control"
                            classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                            shape="round"
                            label={<label className="form-label">{intl.formatMessage({ id: 'measures.reaction' })}</label>}
                            options={map(toJS(allergyStore.reactionsList), (reaction) => ({
                              // @ts-ignore
                              value: String(reaction?.reactionId),
                              // @ts-ignore
                              label: String(reaction?.name),
                            }))}
                            name="reactionId"
                            value={value ?? ''}
                            container={containerRef.current}
                            onChange={onChange}
                          />
                        )}
                      </Observer>
                    )}
                  />
                </fieldset>
                {/* <span className="form-helper-text" id="helper-text-removeSearch">
        Helper text
      </span> */}
              </div>

              <div className="form-control">
                <fieldset className="form-group">
                  <Controller
                    control={control}
                    name="severityCode"
                    render={({ field: { value, onChange } }) => (
                      <Observer>
                        {() => (
                          <Select
                            className="form-control"
                            classes={{ placeholder: 'w-full', options: '!z-modalForefront' }}
                            shape="round"
                            label={<label className="form-label">{intl.formatMessage({ id: 'measures.severity' })}</label>}
                            options={map(toJS(allergyStore.severitiesList), (severity) => ({
                              // @ts-ignore
                              value: String(severity?.severityId),
                              // @ts-ignore
                              label: String(severity?.severityName),
                            }))}
                            name="severityCode"
                            value={value ?? ''}
                            container={containerRef.current}
                            onChange={onChange}
                          />
                        )}
                      </Observer>
                    )}
                  />
                </fieldset>
                {/* <span className="form-helper-text" id="helper-text-removeSearch">
        Helper text
      </span> */}
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
                <textarea
                  className={cx('form-input', { __error: errors.comment })}
                  id="param-comment"
                  // aria-describedby="helper-text-comment"
                  // placeholder="Text here..."
                  {...register('comment', { minLength: 1 })}
                />
                {/* <span className="form-helper-text" id="helper-text-comment">
      Helper text
    </span> */}
              </div>
            </fieldset>
          </div>
        </div>
      </Modal.Body>

      <Modal.Actions okText="Save" okType="submit" okAttrs={{ disabled: isSubmitDisabled }} onCancel={onCancel} />
    </Modal>
  );
};
AllergyEditingModal.displayName = 'AllergyEditingModal';

export default observer(AllergyEditingModal);
