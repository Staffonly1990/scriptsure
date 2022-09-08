import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';

import { AdjustmentsIcon, CheckCircleIcon, CheckIcon } from '@heroicons/react/outline';
import { InformationCircleIcon, LocationMarkerIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/solid';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import { IPharmacy } from 'shared/api/patient';
import { ActionStatus, OActionStatus } from 'shared/lib/model';

interface IPharmacyPreferredList {
  pharmacies: IPharmacy[];
  deletePatientPreferred: (pharmacyItem: IPharmacy) => void;
  setDefault: (pharmacyItem: IPharmacy) => void;
  selectPharmacy: (common: IPharmacy) => void;
  isPrescription: boolean;
  status: ActionStatus;
}

const PharmacyPreferredList: FC<IPharmacyPreferredList> = ({ pharmacies, deletePatientPreferred, setDefault, selectPharmacy, isPrescription, status }) => {
  const [showHelp, setShowHelp] = useState(false);
  const intl = useIntl();
  const getMapsLink = (pharmacyItem) => `https://maps.google.com/maps?q=${pharmacyItem.addressLine1}
                                            +${pharmacyItem.city}+${pharmacyItem.stateProvince}
                                            +${pharmacyItem.postalCode}`;

  const handleShowHelp = useCallback(() => {
    setShowHelp(!showHelp);
  }, []);

  return (
    <div className="flex flex-col shadow mx-0 lg:mx-1">
      <div className="bg-blue-500 py-2 px-1 text-white">
        <span>{intl.formatMessage({ id: 'pharmacy.patientPreferred' })}</span>
      </div>
      <div className="flex flex-wrap p-2">
        {!!pharmacies.length &&
          pharmacies.map((pharmacyItem) => (
            <div className="flex flex-col justify-between shadow p-2 mr-4 my-2 w-[250px] relative" key={pharmacyItem.ncpdpId}>
              {pharmacyItem?.PatientPharmacy?.[0].default && (
                <span className="opacity-50 bg-green-200 top-0 right-0 absolute px-[2px] py[10px]">{intl.formatMessage({ id: 'pharmacy.default' })}</span>
              )}
              <div className="flex flex-col">
                <span className="font-bold">{pharmacyItem.businessName}</span>
                <span className="font-bold">{pharmacyItem.addressLine1}</span>
                <span>
                  {pharmacyItem.city}, {pharmacyItem.stateProvince} {pharmacyItem?.postalCode?.substring(0, 5)}
                </span>
                <span>{pharmacyItem.primaryTelephone} (P)</span>
                <span>{pharmacyItem.fax} (F)</span>
                {pharmacyItem?.specialties && pharmacyItem.specialties.length > 0 && (
                  <div className="flex flex-col">
                    <span>{intl.formatMessage({ id: 'pharmacy.pharmacySpeciality' })}</span>
                    {pharmacyItem.specialties.map((speciality) => (
                      <div className="flex">
                        <CheckCircleIcon className="w-6 h-6 mr-1" />
                        <span>{speciality}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                {isPrescription && (
                  <Button color="green" variant="filled" shape="smooth" className="uppercase" onClick={() => selectPharmacy(pharmacyItem)}>
                    <CheckIcon className="w-6 h-6" />
                    <span>{intl.formatMessage({ id: 'measures.select' })}</span>
                  </Button>
                )}
                <Tooltip content={intl.formatMessage({ id: 'pharmacy.pharmacyOnMap' })}>
                  <Button as="a" target="_blank" variant="flat" shape="circle" href={getMapsLink(pharmacyItem)}>
                    <LocationMarkerIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                <Tooltip content={intl.formatMessage({ id: 'pharmacy.removePharmacy' })}>
                  <Button color="red" variant="flat" shape="circle" onClick={() => deletePatientPreferred(pharmacyItem)}>
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                {!pharmacyItem?.PatientPharmacy?.[0].default && (
                  <Tooltip content={intl.formatMessage({ id: 'pharmacy.setDefaultPharmacy' })}>
                    <Button color="blue" variant="flat" shape="circle" onClick={() => setDefault(pharmacyItem)}>
                      <AdjustmentsIcon className="w-6 h-6" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          ))}
        {!pharmacies.length && status !== OActionStatus.Pending && (
          <div className={cx(!showHelp ? 'w-1/2' : 'w-full', 'flex flex-col p-4 gap-4')}>
            <InformationCircleIcon className="w-10 h-10 mb-2 text-gray-300" />
            <p className="text-gray-300">{intl.formatMessage({ id: 'pharmacy.noPharmaciesHaveBeenAssigned' })}</p>
            <Button onClick={handleShowHelp} color="green" variant="filled" shape="smooth" className="uppercase">
              <QuestionMarkCircleIcon className="w-6 h-6" />
              <span>{intl.formatMessage({ id: 'pharmacy.showHelp' })}</span>
            </Button>
            {showHelp && <p>{intl.formatMessage({ id: 'pharmacy.directions' })}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

PharmacyPreferredList.displayName = 'PharmacyPreferredList';

export default PharmacyPreferredList;
