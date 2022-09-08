import React, { Dispatch, FC, MutableRefObject, SetStateAction, memo } from 'react';
import LeftSide from './left.side';
import RightSide from './right.side';

interface IIsBlurChangeData {
  first: boolean;
  last: boolean;
  dob: boolean;
}

interface IPatientContentProps {
  control: any;
  trigger: any;
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  watch: any;
  innerRef: MutableRefObject<HTMLDivElement | null> | undefined;
  isMedHistory: boolean;
  setIsMedHistory: Dispatch<SetStateAction<boolean>>;
  setIsChangeDataBlur: Dispatch<SetStateAction<IIsBlurChangeData>>;
  setPictureFormData: Dispatch<SetStateAction<FormData | undefined>>;
  setListWatchedFields: Dispatch<SetStateAction<string[]>>;
}

const PatientContent: FC<IPatientContentProps> = ({
  control,
  trigger,
  register,
  errors,
  setValue,
  getValues,
  watch,
  innerRef,
  isMedHistory,
  setIsMedHistory,
  setIsChangeDataBlur,
  setPictureFormData,
  setListWatchedFields,
}) => {
  return (
    <div className="w-full flex gap-3">
      <LeftSide
        errors={errors}
        control={control}
        trigger={trigger}
        register={register}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        innerRef={innerRef}
        setIsMedHistory={setIsMedHistory}
        isMedHistory={isMedHistory}
        setIsChangeDataBlur={setIsChangeDataBlur}
        setListWatchedFields={setListWatchedFields}
      />

      <RightSide
        control={control}
        trigger={trigger}
        register={register}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        innerRef={innerRef}
        setPictureFormData={setPictureFormData}
      />
    </div>
  );
};
PatientContent.displayName = 'PatientContent';

export default PatientContent;
