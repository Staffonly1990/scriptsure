import React, { FC, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import cx from 'classnames';

import { AdjustmentsIcon, CheckCircleIcon, CheckIcon, CollectionIcon, PencilIcon, SearchIcon } from '@heroicons/react/outline';
import { LocationMarkerIcon, TrashIcon } from '@heroicons/react/solid';
import { IPatient, IPharmacy, OSortCommonsList, SortCommonsList } from 'shared/api/patient';
import Tooltip from 'shared/ui/tooltip';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';

interface IPharmacyCommonListProps {
  common: IPharmacy[];
  searchCommons: IPharmacy[];
  editCommonMode: boolean;
  deleteCommon: (common: IPharmacy) => void;
  addPatientPreferred: (common: IPharmacy) => void;
  handleSort: (sortType: OSortCommonsList) => void;
  currentPatient: IPatient | null;
  setEditCommonMode: () => void;
  setIsSelect: (common: IPharmacy) => void;
  selectPharmacy: (common: IPharmacy) => void;
  searchCommon: (value: string) => void;
  isPrescription: boolean;
}

const PharmacyCommonList: FC<IPharmacyCommonListProps> = ({
  handleSort,
  common,
  deleteCommon,
  currentPatient,
  addPatientPreferred,
  setEditCommonMode,
  editCommonMode,
  setIsSelect,
  searchCommons,
  searchCommon,
  isPrescription,
  selectPharmacy,
}) => {
  const [commonList, setCommonList] = useState(common);
  const [searchValue, setSearchValue] = useState('');
  const intl = useIntl();
  const getMapsLink = (commonItem) => `https://maps.google.com/maps?q=${commonItem.addressLine1}
                                            +${commonItem.city}+${commonItem.stateProvince}
                                            +${commonItem.postalCode}`;

  useEffect(() => {
    if (searchValue) {
      setCommonList(searchCommons);
    } else {
      setCommonList(common);
    }
  }, [searchCommons, common]);

  const onChangeSearch = useCallback((e) => {
    setSearchValue(e.target.value);
    if (!e.target.value) {
      setCommonList(common);
    } else {
      searchCommon(e.target.value);
    }
  }, []);

  const dropdownList = [
    {
      text: 'storeName',
      onClick: () => handleSort(SortCommonsList.BusinessName),
    },
    {
      text: 'city',
      onClick: () => handleSort(SortCommonsList.City),
    },
    {
      text: 'state',
      onClick: () => handleSort(SortCommonsList.State),
    },
    {
      text: 'zipCode',
      onClick: () => handleSort(SortCommonsList.ZipCode),
    },
  ].map(({ onClick, text }) => <Dropdown.Item onClick={onClick}>{intl.formatMessage({ id: `pharmacy.${text}` })}</Dropdown.Item>);

  return (
    <div className="flex flex-col w-[50rem] shadow mx-0 lg:mx-1">
      <div className="bg-blue-500 py-2 px-1 text-white">
        <span>{intl.formatMessage({ id: 'pharmacy.frequentlyUsedPharmacies' })}</span>
      </div>
      <div className="flex p-3 items-center">
        <input type="text" className="form-input" placeholder={intl.formatMessage({ id: 'pharmacy.search' })} onChange={onChangeSearch} />
        <Tooltip content={intl.formatMessage({ id: 'pharmacy.search' })}>
          <Button color="gray" shape="smooth" variant="flat">
            <SearchIcon className="w-5 h-5 mr-1" />
          </Button>
        </Tooltip>
        <Tooltip content={intl.formatMessage({ id: 'pharmacy.sortResults' })}>
          <Dropdown list={dropdownList}>
            <CollectionIcon className="w-5 h-5 mr-1" />
          </Dropdown>
        </Tooltip>
        <Tooltip content={intl.formatMessage({ id: 'pharmacy.editCommonList' })}>
          <Button color="gray" shape="smooth" variant="flat" onClick={setEditCommonMode}>
            <PencilIcon className="w-5 h-5 mr-1" />
          </Button>
        </Tooltip>
      </div>
      <div className={cx(editCommonMode ? '' : 'px-3', 'flex flex-col')}>
        {commonList.map((commonItem) => (
          <div className="flex items-center" key={commonItem.ncpdpId}>
            {editCommonMode && (
              <div>
                <input checked={commonItem.isSelected} onChange={() => setIsSelect(commonItem)} className="form-checkbox" type="checkbox" />
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="font-bold">{commonItem.businessName}</span>
                <span className="font-bold">{commonItem.addressLine1}</span>
                <span>
                  {commonItem.city}, {commonItem.stateProvince} {commonItem?.postalCode?.substring(0, 5)}
                </span>
                <span>
                  {commonItem.primaryTelephone} {intl.formatMessage({ id: 'pharmacy.p' })}
                </span>
                <span>
                  {commonItem.fax} {intl.formatMessage({ id: 'pharmacy.f' })}
                </span>
                {commonItem.specialties && commonItem.specialties.length > 0 && (
                  <div className="flex flex-col">
                    <span>{intl.formatMessage({ id: 'pharmacy.pharmacySpeciality' })}</span>
                    {commonItem.specialties.map((speciality) => (
                      <div className="flex">
                        <CheckCircleIcon className="w-6 h-6 mr-1" />
                        <span>{speciality}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex">
                <Tooltip content={intl.formatMessage({ id: 'pharmacy.removePharmacyList' })}>
                  <Button color="gray" variant="flat" shape="circle" onClick={() => deleteCommon(commonItem)}>
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                <Tooltip content={intl.formatMessage({ id: 'pharmacy.pharmacyOnMap' })}>
                  <Button color="gray" as="a" target="_blank" variant="flat" shape="circle" href={getMapsLink(commonItem)}>
                    <LocationMarkerIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
                {currentPatient && (
                  <Tooltip content={intl.formatMessage({ id: 'pharmacy.setPatientPharmacy' })}>
                    <Button color="gray" variant="flat" shape="circle" onClick={() => addPatientPreferred(commonItem)}>
                      <AdjustmentsIcon className="w-6 h-6" />
                    </Button>
                  </Tooltip>
                )}
                {isPrescription && (
                  <Button color="green" variant="filled" shape="smooth" className="uppercase" onClick={() => selectPharmacy(commonItem)}>
                    <CheckIcon className="w-6 h-6" />
                    <span>{intl.formatMessage({ id: 'measures.select' })}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PharmacyCommonList.displayName = 'PharmacyCommonList';

export default PharmacyCommonList;
