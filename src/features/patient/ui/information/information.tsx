import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { trim } from 'lodash';

import InformationList from './information.list';
import InformationRaw from './information.raw';
import demographicStore from '../../model/demographics.store';

interface IInformationProps {
  className?: string;
}

const Information: FC<IInformationProps> = ({ className }) => {
  const intl = useIntl();
  const dob = useMemo(() => {
    if (demographicStore._currentPatient?.dob) {
      return moment(demographicStore._currentPatient?.dob).format('MMM D, YYYY');
    }
    return '';
  }, [demographicStore._currentPatient?.dob]);

  const hiipaCompilianceDate = useMemo(() => {
    if (demographicStore._currentPatient?.hippaComplianceDate) {
      return moment(demographicStore._currentPatient?.hippaComplianceDate).format('MMM D, YYYY');
    }
    return '';
  }, [demographicStore._currentPatient?.hippaComplianceDate]);

  const createdDate = useMemo(() => {
    if (demographicStore._currentPatient?.createdAt) {
      return moment(demographicStore._currentPatient?.createdAt).format('MMM D, YYYY');
    }

    return '';
  }, [demographicStore._currentPatient?.createdAt]);

  const deathData = useMemo(() => {
    if (demographicStore._currentPatient?.deathDate) {
      return moment(demographicStore._currentPatient?.deathDate).format('MMM D, YYYY');
    }

    return '';
  }, [demographicStore._currentPatient?.deathDate]);

  const patientSource = () => {
    switch (demographicStore._currentPatient?.patientSource) {
      case 1:
        return intl.formatMessage({ id: 'demographics.measures.manual' });
      case 2:
        return intl.formatMessage({ id: 'demographics.measures.uploaded' });
      case 9:
        return intl.formatMessage({ id: 'demographics.measures.unknown' });
      default:
        return intl.formatMessage({ id: 'demographics.measures.external' });
    }
  };

  const motherName = `${demographicStore._currentPatient?.motherFirstName || ''} ${demographicStore._currentPatient?.motherLastName || ''}`;
  const hiipaCompiliance = demographicStore._currentPatient?.hippaCompliance ? 'Yes' : '';

  const suffix = demographicStore._currentPatient?.suffix && `, ${demographicStore._currentPatient?.suffix}`;
  const name = `${demographicStore._currentPatient?.firstName || ''} ${demographicStore._currentPatient?.middleName || ''} ${
    demographicStore._currentPatient?.lastName || ''
  } ${suffix || ''}`;

  const homeAddress = useMemo(() => {
    let address = '';
    if (demographicStore._currentPatient?.addressLine2) {
      address = `, ${demographicStore._currentPatient?.addressLine2}`;
    }
    address += `${demographicStore._currentPatient?.city},  
    ${demographicStore._currentPatient?.state} 
    ${demographicStore._currentPatient?.zip}`;

    return address;
  }, [demographicStore._currentPatient]);

  const gender = () => {
    switch (demographicStore._currentPatient?.gender) {
      case 'F':
        return intl.formatMessage({ id: 'user.gender.identity.female' });
      case 'M':
        return intl.formatMessage({ id: 'user.gender.identity.male' });
      default:
        return intl.formatMessage({ id: 'user.gender.identity.unknown' });
    }
  };

  const isEmergemcyInformation = trim(
    demographicStore._currentPatient?.emergencyContact || demographicStore._currentPatient?.phone1Emergency || demographicStore._currentPatient?.phone2Emergency
  );
  const isNextOfKinInformation = trim(
    demographicStore._currentPatient?.nextOfKinName ||
      demographicStore._currentPatient?.nextOfKinPhone ||
      demographicStore._currentPatient?.patientKinRelation ||
      motherName
  );

  const isWorkInformation = trim(
    demographicStore._currentPatient?.addressLine1Work ||
      demographicStore._currentPatient?.addressLine2Work ||
      demographicStore._currentPatient?.cityWork ||
      demographicStore._currentPatient?.stateWork ||
      demographicStore._currentPatient?.zipWork ||
      demographicStore._currentPatient?.work ||
      demographicStore._currentPatient?.phone2Work
  );

  const isHealthInformation = trim(demographicStore._currentPatient?.generalComment || demographicStore._currentPatient?.generalHealth);

  const isWorkAddress =
    demographicStore._currentPatient?.addressLine1Work ||
    demographicStore._currentPatient?.addressLine2Work ||
    demographicStore._currentPatient?.cityWork ||
    demographicStore._currentPatient?.stateWork ||
    demographicStore._currentPatient?.zipWork;

  return (
    <div className="flex flex-col gap-4">
      {demographicStore._currentPatient?.deathDate && (
        <div>
          <div className="flex items-center justify-between h-12 p-1 text-white bg-red-500 sm:p-2">
            {intl.formatMessage({ id: 'demographics.measures.death' })}
          </div>
          <div className="border border-gray-200">
            <InformationRaw
              condition={demographicStore._currentPatient?.deathDate}
              className="p-4"
              label={intl.formatMessage({ id: 'demographics.measures.death' })}
              contentFirstLine={deathData}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.deathCause}
              className="p-4"
              label={intl.formatMessage({ id: 'demographics.measures.deathReason' })}
              contentFirstLine={demographicStore._currentPatient?.deathCause}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 xl:flex-row xl:mx-2">
        <InformationList header={intl.formatMessage({ id: 'demographics.measures.basicInfo' })}>
          <InformationRaw condition={name} label={intl.formatMessage({ id: 'demographics.measures.name' })} contentFirstLine={name} />
          <InformationRaw
            condition={demographicStore._currentPatient?.gender}
            label={intl.formatMessage({ id: 'demographics.measures.gender' })}
            contentFirstLine={gender()}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.home}
            label={intl.formatMessage({ id: 'demographics.measures.homePhone' })}
            mask="(999) 999-9999"
            contentFirstLine={demographicStore._currentPatient?.home}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.cell}
            label={intl.formatMessage({ id: 'demographics.measures.cellPhone' })}
            mask="(999) 999-9999"
            contentFirstLine={demographicStore._currentPatient?.cell}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.work}
            label={intl.formatMessage({ id: 'demographics.measures.workPhone' })}
            mask="(999) 999-9999"
            contentFirstLine={demographicStore._currentPatient?.work}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.email}
            label={intl.formatMessage({ id: 'demographics.measures.email' })}
            contentFirstLine={demographicStore._currentPatient?.email}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.dob}
            label={intl.formatMessage({ id: 'demographics.measures.dob' })}
            contentFirstLine={dob}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.ssn}
            label={intl.formatMessage({ id: 'demographics.measures.ssn' })}
            mask="❋❋❋-❋❋-9999"
            contentFirstLine={demographicStore._currentPatient?.ssn}
          />
          <InformationRaw
            condition={
              demographicStore._currentPatient?.addressLine1 ||
              demographicStore._currentPatient?.addressLine2 ||
              demographicStore._currentPatient?.city ||
              demographicStore._currentPatient?.state ||
              demographicStore._currentPatient?.zip
            }
            label={intl.formatMessage({ id: 'demographics.measures.homeAddress' })}
            contentFirstLine={demographicStore._currentPatient?.addressLine1}
            contentSecondLine={homeAddress}
          />
        </InformationList>
        {isNextOfKinInformation && (
          <InformationList header={intl.formatMessage({ id: 'demographics.measures.kinInfo' })}>
            <InformationRaw
              condition={demographicStore._currentPatient?.nextOfKinName}
              label={intl.formatMessage({ id: 'demographics.measures.kinName' })}
              contentFirstLine={demographicStore._currentPatient?.nextOfKinName}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.nextOfKinPhone}
              label={intl.formatMessage({ id: 'demographics.measures.kinPhone' })}
              mask="(999) 999-9999"
              contentFirstLine={demographicStore._currentPatient?.nextOfKinPhone}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.relationId}
              label={intl.formatMessage({ id: 'demographics.measures.kinRelation' })}
              contentFirstLine={demographicStore.getRelation(demographicStore._currentPatient?.relationId)}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.motherLastName}
              label={intl.formatMessage({ id: `demographics.measures.motherName` })}
              contentSecondLine={`${demographicStore._currentPatient?.motherFirstName} 
              ${demographicStore._currentPatient?.motherLastName}`}
            />
          </InformationList>
        )}
        {isEmergemcyInformation && (
          <InformationList header={intl.formatMessage({ id: 'demographics.measures.emergencyInfo' })}>
            <InformationRaw
              condition={demographicStore._currentPatient?.emergencyContact}
              label={intl.formatMessage({ id: 'demographics.measures.emergencyContact' })}
              contentFirstLine={demographicStore._currentPatient?.emergencyContact}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.phone1Emergency}
              label={`${intl.formatMessage({ id: 'demographics.measures.emergencyContact' })} 1`}
              mask="(999) 999-9999"
              contentFirstLine={demographicStore._currentPatient?.phone1Emergency}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.phone2Emergency}
              label={`${intl.formatMessage({ id: 'demographics.measures.emergencyContact' })} 2`}
              mask="(999) 999-9999"
              contentFirstLine={demographicStore._currentPatient?.phone2Emergency}
            />
          </InformationList>
        )}
        <InformationList header={intl.formatMessage({ id: 'demographics.measures.otherInfo' })}>
          <InformationRaw
            condition={demographicStore.patientMaritalStatus}
            label={intl.formatMessage({ id: 'demographics.measures.maritalStatus' })}
            contentFirstLine={demographicStore.patientMaritalStatus}
          />
          <InformationRaw
            condition={demographicStore.patientStatus}
            label={intl.formatMessage({ id: 'demographics.measures.patientStatus' })}
            contentFirstLine={demographicStore.patientStatus}
          />
          <InformationRaw
            condition={demographicStore.patientPractice?.prescribingName}
            label={intl.formatMessage({ id: 'demographics.measures.practiceId' })}
            contentFirstLine={demographicStore.patientPractice?.prescribingName}
          />
          <InformationRaw
            condition={demographicStore.patientDoctor?.firstName}
            label={intl.formatMessage({ id: 'demographics.measures.doctorId' })}
            contentFirstLine={`${demographicStore.patientDoctor?.firstName} 
            ${demographicStore.patientDoctor?.lastName}`}
          />
          <InformationRaw
            condition={!!demographicStore._currentPatient?.selectedRace}
            label={intl.formatMessage({ id: 'demographics.measures.race' })}
            contentFirstLine={demographicStore._currentPatient?.selectedRace?.descr}
          />
          <InformationRaw
            condition={!!demographicStore._currentPatient?.selectedAlternateRace}
            label={intl.formatMessage({ id: 'demographics.measures.altRace' })}
            contentFirstLine={demographicStore._currentPatient?.selectedAlternateRace?.descr}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.ethnicityId && Number(demographicStore._currentPatient?.ethnicityId) > 0}
            label={intl.formatMessage({ id: 'demographics.measures.ethnicity' })}
            contentFirstLine={demographicStore.getEthnicity(demographicStore._currentPatient?.ethnicityId)}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.alternateEthnicityId}
            label={intl.formatMessage({ id: 'demographics.measures.altEthnicity' })}
            contentFirstLine={demographicStore.getEthnicity(demographicStore._currentPatient?.alternateEthnicityId)}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.sexualOrientation}
            label={intl.formatMessage({ id: 'demographics.measures.sexual' })}
            contentFirstLine={intl.formatMessage({
              id: demographicStore.getSexualOrientation(demographicStore._currentPatient?.sexualOrientation) || 'user.gender.identity.unknown',
            })}
            contentSecondLine={
              demographicStore._currentPatient?.sexualOrientation === 'OTH' ? `-${demographicStore._currentPatient?.sexualOrientationDescription}` : ''
            }
          />
          <InformationRaw
            label={intl.formatMessage({ id: 'demographics.measures.genderIdentity' })}
            contentFirstLine={intl.formatMessage({
              id: demographicStore.getGenderIdentity(demographicStore._currentPatient?.genderIdentity) || 'user.gender.identity.unknown',
            })}
            condition={demographicStore._currentPatient?.genderIdentity}
            contentSecondLine={
              demographicStore._currentPatient?.genderIdentity === 'OTH' ? `-${demographicStore._currentPatient?.genderIdentityDescription}` : ''
            }
          />
          <InformationRaw
            condition={demographicStore.patientPreferredCommunication}
            label={intl.formatMessage({ id: 'demographics.measures.communication' })}
            contentFirstLine={demographicStore.patientPreferredCommunication}
          />
          <InformationRaw
            condition={!!demographicStore._currentPatient?.selectedLanguage}
            label={intl.formatMessage({ id: 'demographics.measures.prefLang' })}
            contentFirstLine={demographicStore._currentPatient?.selectedLanguage?.descr}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.consent}
            label={intl.formatMessage({ id: 'demographics.measures.download.consent' })}
            contentFirstLine={demographicStore._currentPatient?.consent ? intl.formatMessage({ id: 'yes' }) : intl.formatMessage({ id: 'no' })}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.hippaCompliance}
            label={intl.formatMessage({ id: 'demographics.measures.hipaaCompliance' })}
            contentFirstLine={hiipaCompiliance}
          />
          <InformationRaw
            condition={demographicStore._currentPatient?.hippaComplianceDate}
            label={intl.formatMessage({ id: 'demographics.measures.hipaaComplianceDate' })}
            contentFirstLine={hiipaCompilianceDate}
          />
          <InformationRaw
            condition
            label={intl.formatMessage({ id: 'demographics.measures.createdBy' })}
            contentFirstLine={demographicStore._currentPatient?.userAdded}
          />
          <InformationRaw condition label={intl.formatMessage({ id: 'demographics.measures.createdDate' })} contentFirstLine={createdDate} />
          <InformationRaw condition label={intl.formatMessage({ id: 'demographics.measures.source' })} contentFirstLine={patientSource()} />
        </InformationList>
      </div>
      <div className="flex flex-col gap-2 xl:flex-row xl:mx-2">
        {isWorkInformation && (
          <InformationList header={intl.formatMessage({ id: 'demographics.measures.workInfo' })}>
            {isWorkAddress && (
              <>
                <InformationRaw
                  condition
                  label={intl.formatMessage({ id: 'demographics.measures.workAddress' })}
                  contentFirstLine={`${demographicStore._currentPatient?.addressLine1Work} 
                  ${demographicStore._currentPatient?.addressLine2Work ? `, ${demographicStore._currentPatient?.addressLine2Work}` : ''}`}
                  contentSecondLine={`${demographicStore._currentPatient?.cityWork}, 
                  ${demographicStore._currentPatient?.stateWork} ${demographicStore._currentPatient?.zipWork}`}
                />
              </>
            )}
            <InformationRaw
              condition={demographicStore._currentPatient?.work}
              label={`${intl.formatMessage({ id: 'demographics.measures.workPhone' })} 1`}
              mask="(999) 999-9999"
              contentFirstLine={demographicStore._currentPatient?.work}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.phone2Work}
              label={`${intl.formatMessage({ id: 'demographics.measures.workPhone' })} 2`}
              mask="(999) 999-9999"
              contentFirstLine={demographicStore._currentPatient?.phone2Work}
            />
          </InformationList>
        )}
        {isHealthInformation && (
          <InformationList header={intl.formatMessage({ id: 'demographics.measures.healthInfo' })}>
            <InformationRaw
              condition={demographicStore._currentPatient?.generalComment}
              label={intl.formatMessage({ id: 'demographics.measures.comments' })}
              contentFirstLine={demographicStore._currentPatient?.generalComment}
            />
            <InformationRaw
              condition={demographicStore._currentPatient?.generalHealth}
              label={intl.formatMessage({ id: 'demographics.measures.generalComments' })}
              contentFirstLine={demographicStore._currentPatient?.generalHealth}
            />
          </InformationList>
        )}
      </div>
    </div>
  );
};

Information.displayName = 'Information';

export default observer(Information);
