import React, { FC, useCallback, useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/outline';
import { useRouter } from 'shared/hooks';
import Dropdown from 'shared/ui/dropdown';
import Tooltip from 'shared/ui/tooltip/tooltip';
import Button from 'shared/ui/button/button';
import { IEducation } from 'shared/api/education';
import { useGetSet } from 'react-use';
import { ArchiveEducationModal, educationStore, EducationTable } from 'features/education';
import { toJS } from 'mobx';
import { useIntl } from 'react-intl';

/**
 * @view ChartEducation
 */
const ChartEducationView: FC = () => {
  const {
    match: { url },
    query: { patientId },
  } = useRouter<{ patientId: string | number }>();

  const [isOpenArchiveEdu, setIsOpenArchiveEdu] = useGetSet<boolean>(false);
  const [eduList, setEduList] = useState(toJS(educationStore.list));
  const [isArchived, setIsArchived] = useState<IEducation | any>();
  const toggleIsOpenArchiveEdu = (state?: boolean) => {
    const currentState = isOpenArchiveEdu();
    setIsOpenArchiveEdu(state ?? !currentState);
  };
  const [isAddEdFlag, setIsAddEdFlag] = useState<boolean>(false);
  const intl = useIntl();
  const eduVars = ['all', 'current', 'archived'];
  const [checkedVar, setCheckedVar] = useState('current');
  useEffect(() => {
    async function fetchMyAPI() {
      await educationStore.getAllEducation(patientId, checkedVar);
      await setEduList(toJS(educationStore.list));
    }
    fetchMyAPI();
  }, []);
  const changeVariant = useCallback(
    async (variant) => {
      setCheckedVar(variant);
      try {
        await educationStore.getAllEducation(patientId, variant);
        await setEduList(eduList);
      } catch {}
    },
    [checkedVar]
  );
  useEffect(() => {
    changeVariant('current');
  }, [isAddEdFlag]);

  const sendArchive = (data) => {
    setIsArchived(data);
    toggleIsOpenArchiveEdu(true);
  };
  const eduActions = [
    eduVars.map((variant) => {
      return (
        <Dropdown.Item className={`uppercase ${variant === checkedVar ? '!text-blue-500' : ''}`} onClick={() => changeVariant(variant)}>
          {intl.formatMessage({ id: `measures.${variant}` })}
        </Dropdown.Item>
      );
    }),
  ];
  return (
    <div className="flex flex-col m-4">
      <div className="flex items-center justify-start">
        <span className="text-xl m-2 capitalize">
          {intl.formatMessage({ id: `measures.${checkedVar}` })} {intl.formatMessage({ id: 'measures.education' })}
        </span>
        <Dropdown list={eduActions} className="m-2" placement="bottom-start">
          <Tooltip content={intl.formatMessage({ id: 'measures.actions' })}>
            <Button shape="circle">
              <ClockIcon className="w-6 h-6" />
            </Button>
          </Tooltip>
        </Dropdown>
      </div>
      <EducationTable sendArchive={sendArchive} checkedVar={checkedVar} />
      <ArchiveEducationModal open={isOpenArchiveEdu()} isArchived={isArchived} onClose={toggleIsOpenArchiveEdu} setIsAddEdFlag={setIsAddEdFlag} />
    </div>
  );
};

ChartEducationView.displayName = 'ChartEducationView';

export default ChartEducationView;
