import React, { FC, Key, useState, useEffect, useMemo, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { useMountedState } from 'react-use';
import { useIntl } from 'react-intl';
import { map, find } from 'lodash';

import Tabs from 'shared/ui/tabs';

import PatientContent from '../patient.content';
import EmergencyContent from '../emergency.content';
import WorkContent from '../work.content';
import HealthCommentsContent from '../health.comments.content';
import OtherContent from '../other.content';
import AddPatientHeader from '../header';

interface IIsBlurChangeData {
  first: boolean;
  last: boolean;
  dob: boolean;
}

interface IFormContent {
  control: any;
  trigger: any;
  errors: any;
  register: any;
  setValue: any;
  getValues: any;
  watch: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  setIsMounted: Dispatch<SetStateAction<boolean>>;
  setIsChangeDataBlur: Dispatch<SetStateAction<IIsBlurChangeData>>;
  setPictureFormData: Dispatch<SetStateAction<FormData | undefined>>;
  setListWatchedFields: Dispatch<SetStateAction<string[]>>;
}

const FormContent: FC<IFormContent> = ({
  control,
  trigger,
  errors,
  register,
  setValue,
  getValues,
  watch,
  innerRef,
  setIsMounted,
  setIsChangeDataBlur,
  setPictureFormData,
  setListWatchedFields,
}) => {
  const intl = useIntl();

  const tabs = [
    { key: 'patient', name: intl.formatMessage({ id: `add.patient.patient` }) },
    { key: 'emergency', name: intl.formatMessage({ id: `add.patient.emergency` }) },
    { key: 'work', name: intl.formatMessage({ id: `add.patient.work` }) },
    { key: 'healthComments', name: intl.formatMessage({ id: `add.patient.healthComments` }) },
    { key: 'other', name: intl.formatMessage({ id: `add.patient.other` }) },
  ];
  const [active, setActive] = useState<Key>('Practice');
  const activeTab = useMemo(() => find(tabs, ['key', active]), [active]);

  const [isRemoveChecked, setIsRemoveChecked] = useState<boolean>(false);
  const [isMedHistory, setIsMedHistory] = useState<boolean>(false);
  const isMountedFormContent = useMountedState();

  useEffect(() => {
    const data = isMountedFormContent();
    setIsMounted(data);
  }, []);

  const handleChange = (data: Key) => {
    setActive(data);
    trigger('work');
  };

  const isRemovePatient = active === 'patient';

  return (
    <div>
      <Tabs selectedKey={active} onSelectionChange={handleChange}>
        <Tabs.TabList>
          {map(tabs, ({ key, name }) => (
            <Tabs.Item key={key}>{name}</Tabs.Item>
          ))}
        </Tabs.TabList>

        <AddPatientHeader label={activeTab?.name ?? null} isRemovePatient={isRemovePatient} checked={isRemoveChecked} onChange={setIsRemoveChecked} />

        <Tabs.TabPanels keep>
          <Tabs.Item key="patient">
            <PatientContent
              control={control}
              errors={errors}
              trigger={trigger}
              register={register}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              innerRef={innerRef}
              isMedHistory={isMedHistory}
              setIsMedHistory={setIsMedHistory}
              setIsChangeDataBlur={setIsChangeDataBlur}
              setPictureFormData={setPictureFormData}
              setListWatchedFields={setListWatchedFields}
            />
          </Tabs.Item>

          <Tabs.Item key="emergency">
            <EmergencyContent control={control} register={register} innerRef={innerRef} />
          </Tabs.Item>

          <Tabs.Item key="work">
            <WorkContent control={control} register={register} innerRef={innerRef} trigger={trigger} setValue={setValue} />
          </Tabs.Item>

          <Tabs.Item key="healthComments">
            <HealthCommentsContent control={control} register={register} />
          </Tabs.Item>

          <Tabs.Item key="other">
            <OtherContent control={control} register={register} getValues={getValues} innerRef={innerRef} />
          </Tabs.Item>
        </Tabs.TabPanels>
      </Tabs>

      <input disabled className="hidden" {...register('removeSearch', { value: isRemoveChecked || null })} />
    </div>
  );
};
FormContent.displayName = 'FormContent';

export default FormContent;
