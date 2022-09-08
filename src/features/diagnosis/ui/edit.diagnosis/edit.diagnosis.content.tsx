import React, { Dispatch, FC, MutableRefObject, SetStateAction, useEffect, useState, useMemo } from 'react';
import { useMountedState } from 'react-use';
import { useIntl } from 'react-intl';
import { toJS } from 'mobx';
import moment from 'moment';
import { Observer } from 'mobx-react-lite';
import { map, isNumber } from 'lodash';
import { Controller } from 'react-hook-form';

import Select from 'shared/ui/select';
import { IPatientEncounter } from 'shared/api/diagnosis';

import { diagnosisStore } from '../../model';
import { editProblemTypeStatus, editTypeStatus, terminalStages } from '../../config';
import EditFormContainer from './edit.form.container';

interface IEditDiagnosisContent {
  setIsMounted: Dispatch<SetStateAction<boolean>>;
  innerRefCurrent: MutableRefObject<HTMLInputElement | undefined> | undefined;
  register: any;
  control: any;
  getValues: any;
  watch: any;
  errors: any;
}

const EditDiagnosisContent: FC<IEditDiagnosisContent> = ({ setIsMounted, innerRefCurrent, register, control, getValues, watch, errors }) => {
  const isMountedFormContent = useMountedState();
  const diagnosis = toJS(diagnosisStore.diagnosisList.list);
  const [isCondition, setIsCondition] = useState<boolean>(false);
  const [isTerminal, setIsTerminal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string | Date>();
  const [endDate, setEndDate] = useState<string | Date>();
  const intl = useIntl();

  const getDateToInput = () => {
    const date = new Date();
    return { toDate: moment(date).format('YYYY-MM-DD') };
  };

  const uniqDiagnosis = useMemo(() => {
    // we can get duplicate names and diagnosis this function help use for duplicate all duplicate data
    const clearArray = (data: IPatientEncounter[]) => {
      const names: string[] = [];
      const uniques: IPatientEncounter[] = [];
      data.forEach((element) => {
        const name = `${element.conceptId} ${element.name}`;
        if (names.indexOf(name) === -1) {
          names.push(name);
          uniques.push(element);
        }
      });
      return uniques;
    };

    const mappedDiagnosis = (data: IPatientEncounter[]) => {
      const newFormDataArray = data.map((el) => ({
        value: el.conceptId,
        label: `${el.conceptId} ${el.name}`,
      }));
      return newFormDataArray;
    };

    return mappedDiagnosis(clearArray(diagnosis));
  }, [diagnosis]);

  useEffect(() => {
    const allValues = getValues();
    if (allValues.isCondition) {
      setIsCondition(true);
    }

    if (allValues.terminal) {
      setIsTerminal(true);
    }
    const data = isMountedFormContent();
    setIsMounted(data);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      <EditFormContainer className="flex flex-col" header={intl.formatMessage({ id: 'measures.general' })}>
        <div className="flex flex-col">
          <span>{intl.formatMessage({ id: 'measures.onsetDate' })}*</span>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Observer>
                {() => {
                  const currentValue = moment(value).format('YYYY-MM-DD');
                  if (currentValue) {
                    setStartDate(currentValue);
                  } else {
                    setStartDate(getDateToInput().toDate);
                  }
                  return (
                    <input
                      className="form-input"
                      // @ts-ignore
                      min={startDate}
                      // @ts-ignore
                      value={startDate}
                      type="date"
                      onChange={(e) => {
                        onChange(e);
                        setStartDate(e.target.value);
                      }}
                    />
                  );
                }}
              </Observer>
            )}
          />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" {...register('isCondition')} onChange={(e) => setIsCondition(e.target.checked)} />
          {intl.formatMessage({ id: 'diagnosis.measures.condition' })}
          {isCondition && (
            <div className="flex flex-col">
              <span>{intl.formatMessage({ id: 'diagnosis.measures.resolutionDate' })}*</span>
              <Controller
                control={control}
                name="endDate"
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Observer>
                    {() => {
                      const currentValue = moment(value).format('YYYY-MM-DD');
                      if (currentValue) {
                        setEndDate(currentValue);
                      } else {
                        setEndDate(getDateToInput().toDate);
                      }
                      return (
                        <input
                          className="form-input"
                          // @ts-ignore
                          min={endDate}
                          // @ts-ignore
                          value={endDate}
                          type="date"
                          onChange={(e) => {
                            onChange(e);
                            setEndDate(e.target.value);
                          }}
                        />
                      );
                    }}
                  </Observer>
                )}
              />
            </div>
          )}
        </div>
      </EditFormContainer>
      <EditFormContainer className="flex flex-col gap-2" header={intl.formatMessage({ id: 'measures.type' })}>
        <Controller
          control={control}
          name="chronicId"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            const currentValue = isNumber(value) ? String(value) : value;
            return (
              <Observer>
                {() => (
                  <Select
                    placeholder={intl.formatMessage({ id: 'measures.status' })}
                    container={innerRefCurrent?.current}
                    options={map(editTypeStatus, (element) => ({
                      value: element.value,
                      label: intl.formatMessage({ id: `diagnosis.measures.${element.label}` }),
                    }))}
                    name="chronicId"
                    value={currentValue}
                    onChange={onChange}
                  />
                )}
              </Observer>
            );
          }}
        />
        <Controller
          control={control}
          name="problemTypeId"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            const currentValue = isNumber(value) ? String(value) : value;
            return (
              <Observer>
                {() => (
                  <Select
                    placeholder={intl.formatMessage({ id: 'measures.problemType' })}
                    container={innerRefCurrent?.current}
                    options={map(editProblemTypeStatus, (element) => ({
                      value: element.value,
                      label: intl.formatMessage({ id: `diagnosis.measures.${element.label}` }),
                    }))}
                    name="problemTypeId"
                    value={currentValue}
                    onChange={onChange}
                  />
                )}
              </Observer>
            );
          }}
        />
      </EditFormContainer>
      <EditFormContainer header={intl.formatMessage({ id: 'measures.initialDiagnosis' })}>
        <Controller
          control={control}
          name="associatedConceptId"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            const currentValue = isNumber(value) ? String(value) : value;
            return (
              <Observer>
                {() => (
                  <Select
                    placeholder={intl.formatMessage({ id: 'measures.initialDiagnosis' })}
                    container={innerRefCurrent?.current}
                    options={map(uniqDiagnosis, (element) => ({
                      value: element.value,
                      label: element.label,
                    }))}
                    name="associatedConceptId"
                    value={currentValue}
                    onChange={onChange}
                  />
                )}
              </Observer>
            );
          }}
        />
      </EditFormContainer>
      <EditFormContainer header={intl.formatMessage({ id: 'measures.finalDiagnosis' })}>
        <Controller
          control={control}
          name="finalConceptId"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => {
            const currentValue = isNumber(value) ? String(value) : value;
            return (
              <Observer>
                {() => (
                  <Select
                    placeholder={intl.formatMessage({ id: 'measures.finalDiagnosis' })}
                    container={innerRefCurrent?.current}
                    options={map(uniqDiagnosis, (element) => ({
                      value: element.value,
                      label: element.label,
                    }))}
                    name="finalConceptId"
                    value={currentValue}
                    onChange={onChange}
                  />
                )}
              </Observer>
            );
          }}
        />
      </EditFormContainer>
      <EditFormContainer className="flex flex-col gap-2" header={intl.formatMessage({ id: 'measures.terminalIllness' })}>
        <div>
          <input type="checkbox" {...register('terminal')} onChange={(e) => setIsTerminal(e.target.checked)} />
          <span className="ml-2">{intl.formatMessage({ id: 'measures.terminalIllness' })}</span>
        </div>
        {isTerminal && (
          <div>
            <Controller
              control={control}
              name="terminalStageId"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => {
                const currentValue = isNumber(value) ? String(value) : value;
                return (
                  <Observer>
                    {() => (
                      <Select
                        placeholder={intl.formatMessage({ id: 'measures.terminalStage' })}
                        container={innerRefCurrent?.current}
                        options={map(terminalStages, (element) => ({
                          value: element.value,
                          label: intl.formatMessage({ id: `diagnosis.measures.${element.label}` }),
                        }))}
                        name="terminalStageId"
                        value={currentValue}
                        onChange={onChange}
                      />
                    )}
                  </Observer>
                );
              }}
            />
          </div>
        )}
      </EditFormContainer>
      <EditFormContainer header={intl.formatMessage({ id: 'measures.comment' })}>
        <div className="flex items-end flex-col">
          <textarea
            rows={1}
            className="w-full form-input"
            placeholder={intl.formatMessage({ id: 'measures.comment' })}
            {...register('comment', {
              maxLength: {
                value: 500,
                message: intl.formatMessage({ id: 'medication.maxLengthComment' }, { value: 500 }),
              },
            })}
          />
          <div className="flex justify-between w-full">
            {errors.comment && <span className="text-red-500">{errors.comment.message}</span>}
            <span>{watch('comment')?.length || 0}/500</span>
          </div>
        </div>
      </EditFormContainer>
    </div>
  );
};

EditDiagnosisContent.displayName = 'EditDiagnosisContent';

export default EditDiagnosisContent;
