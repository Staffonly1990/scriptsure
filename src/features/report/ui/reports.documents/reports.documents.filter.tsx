import React, { FC, MutableRefObject, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Modal from 'shared/ui/modal';
import { Observer, observer } from 'mobx-react-lite';
import { useStateRef } from 'shared/hooks';
import { toJS } from 'mobx';
import { IDocumentsPayload } from 'shared/api/report';
import moment from 'moment';
import { map } from 'lodash';
import Select from 'shared/ui/select';
import { Controller, useForm } from 'react-hook-form';
import { patientModel } from 'features/patient';
import { currentPracticeStore } from 'features/practice';
import DatePicker from 'shared/ui/date.picker';
import { reportsStore } from 'features/report';
import Button from 'shared/ui/button';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { userModel } from 'features/user';

interface IDocumentsFilter {
  innerRef?: MutableRefObject<HTMLElement | null>;
}

const ReportsDocumentsFilter: FC<IDocumentsFilter> = observer(({ innerRef }) => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const [innerRefState, setInnerRef, formRef] = useStateRef<Nullable<HTMLElement>>(null);
  useEffect(() => {
    async function documentTypes() {
      try {
        await reportsStore.getAllDocumentTypes();
      } catch {}
    }
    if (reportsStore.documentTypes.length !== 0) return;
    documentTypes();
  }, []);
  const documentTypes = toJS(reportsStore.documentTypes);
  const { control, handleSubmit } = useForm<IDocumentsPayload>({
    mode: 'onChange',
    defaultValues: {
      practiceId: '',
      doctorId: '',
      startDate: moment().format(),
      endDate: null,
      lastDocumentId: '',
      documentType: '',
    },
  });
  const sendForm = async (data) => {
    try {
      await reportsStore.getAllDocuments(data);
    } catch {}
  };

  return (
    <form
      ref={setInnerRef}
      className="flex flex-col items-start m-2 text-primary bg-primary"
      onSubmit={handleSubmit((data) => {
        sendForm(data);
      })}
    >
      <Controller
        control={control}
        name="practiceId"
        render={({ field: { value, onChange } }) => (
          <Observer>
            {() => (
              <Select
                container={formRef?.current}
                className="form-control md:flex-auto md:w-1/6 my-2"
                classes={{ placeholder: 'w-full', options: '!w-auto' }}
                shape="round"
                label={<label className="text-primary form-helper-text">{intl.formatMessage({ id: 'reports.measures.practice' })}</label>}
                options={map(userModel.data?.practices, (practice) => ({
                  value: Number(practice?.id),
                  label: practice?.name,
                }))}
                name="practiceId"
                value={value}
                onChange={onChange}
              />
            )}
          </Observer>
        )}
      />
      <Controller
        control={control}
        name="doctorId"
        render={({ field: { value, onChange } }) => (
          <Observer>
            {() => (
              <Select
                container={formRef?.current}
                className="form-control md:flex-auto md:w-1/6 my-2"
                classes={{ placeholder: 'w-full', options: '!w-auto' }}
                shape="round"
                label={<label className="text-primary form-helper-text">{intl.formatMessage({ id: 'reports.physician' })}</label>}
                options={map(toJS(patientModel?.doctorsPractice), (doctorPractice) => ({
                  value: String(doctorPractice?.id),
                  label: doctorPractice?.fullName,
                }))}
                name="doctorId"
                value={value}
                onChange={onChange}
              />
            )}
          </Observer>
        )}
      />
      <Controller
        control={control}
        name="documentType"
        render={({ field: { value, onChange } }) => (
          <Observer>
            {() => (
              <Select
                container={formRef?.current}
                className="form-control md:flex-auto md:w-1/6 my-2"
                classes={{ placeholder: 'w-full', options: '!w-auto' }}
                shape="round"
                label={<label className="text-primary form-helper-text">{intl.formatMessage({ id: 'reports.measures.documentType' })}</label>}
                options={map(documentTypes, (type) => ({
                  value: Number(type.documentType),
                  label: type.name,
                }))}
                name="documentType"
                value={value}
                onChange={onChange}
              />
            )}
          </Observer>
        )}
      />
      <div className="flex -ml-2">
        <div className="flex flex-col m-2">
          <label className="form-helper-text" htmlFor="date-start">
            {intl.formatMessage({ id: 'reports.measures.startDate' })}
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker date={value} container={innerRef?.current} onDateChange={onChange}>
                {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
              </DatePicker>
            )}
          />
        </div>
        <div className="flex flex-col m-2">
          <label className="form-helper-text" htmlFor="date-end">
            {intl.formatMessage({ id: 'measures.endDate' })}
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker date={value} container={innerRef?.current} onDateChange={onChange}>
                {({ inputProps, focused }) => <input className={`form-input w-full${focused ? ' -focused' : ''}`} id="date-start" {...inputProps} />}
              </DatePicker>
            )}
          />
        </div>
      </div>
      <Button className="uppercase m-2 ml-0" color="green" shape="round" type="submit">
        {intl.formatMessage({ id: 'measures.search' })}
      </Button>
    </form>
  );
});

ReportsDocumentsFilter.displayName = 'ReportsDocumentsFilter';
export default ReportsDocumentsFilter;
