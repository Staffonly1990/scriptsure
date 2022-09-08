import React, { FC } from 'react';
import { useGetSet } from 'react-use';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import { AddPatientModal } from 'features/patient/add';
import { Information } from 'features/patient';

/**
 * @view ChartDemographics
 */
const ChartDemographicsView: FC = () => {
  const intl = useIntl();
  const [isOpenEditPatient, setIsOpenEditPatient] = useGetSet<boolean>(false);
  const toggleIsOpenEditPatient = (state?: boolean) => {
    const currentState = isOpenEditPatient();
    setIsOpenEditPatient(state ?? !currentState);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between h-16 px-2">
        <span className="text-xl">{intl.formatMessage({ id: 'measures.demographics' })}</span>{' '}
        <Button className="uppercase inline-flex" color="green" shape="smooth" onClick={() => toggleIsOpenEditPatient(true)}>
          {intl.formatMessage({ id: 'measures.edit' })}
        </Button>
      </div>

      <Information />

      <AddPatientModal open={isOpenEditPatient()} onClose={toggleIsOpenEditPatient} unmount hideBackdrop={false} editable />
    </div>
  );
};
ChartDemographicsView.displayName = 'ChartDemographicsView';

export default ChartDemographicsView;
