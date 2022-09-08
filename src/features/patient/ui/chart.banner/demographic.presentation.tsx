import React, { ComponentProps, FC, useMemo, VFC } from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { map } from 'lodash';
import { NavLink, RouteComponentProps } from 'react-router-dom';

import Dropdown from 'shared/ui/dropdown/dropdown';
import Button from 'shared/ui/button';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { useBreakpoints } from 'shared/lib/media.breakpoints';
import { IPatient } from 'shared/api/patient';
import { useRouter } from 'shared/hooks';

enum Gender {
  M = 'male',
  F = 'female',
}

interface IDemographicPresentationProps {
  currentPatient: IPatient | null;
  views: Array<{
    pathname: string;
    view: FC<RouteComponentProps<any>> | VFC<RouteComponentProps<any>>;
    icon: FC<ComponentProps<'svg'>> | VFC<ComponentProps<'svg'>>;
    text: string;
  }>;
}

const DemographicPresentation: FC<IDemographicPresentationProps> = ({ currentPatient, views }) => {
  const intl = useIntl();
  const breakpoints = useBreakpoints();
  const {
    match: { url },
  } = useRouter();

  const dob = useMemo(() => {
    return `${moment(currentPatient?.dob).format('MMM D, YYYY')} - 
          ${moment().diff(moment(currentPatient?.dob), 'years')} years `;
  }, []);

  const gender = useMemo(() => {
    if (currentPatient?.gender) {
      return Gender[currentPatient?.gender] || 'unknown';
    }

    return 'unknown';
  }, []);

  return (
    <div>
      <div>
        <div className="text-base font-medium">
          {currentPatient?.firstName} {currentPatient?.middleName} {currentPatient?.lastName}
        </div>
        <div className="text-xs font-normal text-white text-opacity-75 flex">
          {intl.formatMessage({ id: 'reports.measures.dob' })}: {dob}
          {intl.formatMessage({ id: `user.gender.identity.${gender}` })}
          <span className="hidden xl:block">
            -{intl.formatMessage({ id: 'sheet.chartId' })} #{currentPatient?.chartId || currentPatient?.patientId}
          </span>
        </div>
      </div>

      {!breakpoints.sm && (
        <Dropdown
          list={map(views, ({ pathname, text, icon: Icon }, index) => (
            <Dropdown.Item key={index.toString(36)} as={NavLink} activeClassName="!text-primary !bg-blue-500" to={`${url}${pathname}`}>
              <Icon className="w-4 h-4 mr-2" />
              {text}
            </Dropdown.Item>
          ))}
        >
          <Button variant="flat" shape="circle" color="white" size="xs">
            <DotsVerticalIcon className="w-4 h-4" />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

DemographicPresentation.displayName = 'DemographicPresentation';

export default DemographicPresentation;
