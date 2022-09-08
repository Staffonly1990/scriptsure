import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { BackspaceIcon, HeartIcon, LocationMarkerIcon } from '@heroicons/react/solid';
import { AdjustmentsIcon, CheckIcon } from '@heroicons/react/outline';
import { IPatient, IPharmacy } from 'shared/api/patient';
import Button from 'shared/ui/button';
import Table from 'shared/ui/table';
import Tooltip from 'shared/ui/tooltip';
import MaskFormat from 'shared/ui/mask.format';

interface IPharmacySearchList {
  searchPharmacies: IPharmacy[];
  setDefault?: (pharmacyItem: IPharmacy) => void;
  selectPharmacy: (common: IPharmacy) => void;
  addCommon: (common: IPharmacy) => void;
  isPrescription: boolean;
  currentPatient: IPatient | null;
  addPatientPreferred: (common: IPharmacy) => void;
  hideCommon: boolean;
  goBack: (value: boolean) => void;
}

const PharmacySearchList: FC<IPharmacySearchList> = ({
  hideCommon,
  searchPharmacies,
  isPrescription,
  addPatientPreferred,
  selectPharmacy,
  currentPatient,
  goBack,
  addCommon,
}) => {
  const intl = useIntl();
  const getMapsLink = (pharmacyItem) => `https://maps.google.com/maps?q=${pharmacyItem.addressLine1}
                                            +${pharmacyItem.city}+${pharmacyItem.stateProvince}
                                            +${pharmacyItem.postalCode}`;
  const columns = useMemo<any>(
    () => [
      {
        id: 'actions',
        accessor: 'actions',
        Cell: ({ row: { original } }) => (
          <>
            {isPrescription && (
              <Button color="green" variant="filled" shape="smooth" className="uppercase" onClick={() => selectPharmacy(original)}>
                <CheckIcon className="w-6 h-6" />
                <span>{intl.formatMessage({ id: 'measures.select' })}</span>
              </Button>
            )}
            {currentPatient && (
              <Tooltip content={intl.formatMessage({ id: 'pharmacy.setCommonPharmacy' })}>
                <Button color="gray" variant="flat" shape="circle" onClick={() => addPatientPreferred(original)}>
                  <AdjustmentsIcon className="w-6 h-6" />
                </Button>
              </Tooltip>
            )}
            {!hideCommon && (
              <Tooltip content={intl.formatMessage({ id: 'pharmacy.setCommonPharmacy' })}>
                <Button color="gray" variant="flat" shape="circle" onClick={() => addCommon(original)}>
                  <HeartIcon className="w-6 h-6" />
                </Button>
              </Tooltip>
            )}

            <Tooltip content={intl.formatMessage({ id: 'pharmacy.pharmacyOnMap' })}>
              <Button color="gray" as="a" target="_blank" variant="flat" shape="circle" href={getMapsLink(original)}>
                <LocationMarkerIcon className="w-6 h-6" />
              </Button>
            </Tooltip>
          </>
        ),
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap uppercase',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
      {
        Header: intl.formatMessage({ id: 'pharmacy.name' }),
        id: 'businessName',
        accessor: 'businessName',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap uppercase',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.address' }),
        id: 'addressLine1',
        accessor: 'addressLine1',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.city' }),
        id: 'city',
        accessor: 'city',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.state' }),
        id: 'stateProvince',
        accessor: 'stateProvince',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
        style: { minWidth: 100, maxWidth: 100 },
      },
      {
        Header: intl.formatMessage({ id: 'demographics.measures.zip' }),
        id: 'postalCode',
        accessor: 'postalCode',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
        style: { minWidth: 100, maxWidth: 100 },
      },
      {
        Header: intl.formatMessage({ id: 'sheet.phone' }),
        id: 'primaryTelephone',
        accessor: 'primaryTelephone',
        Cell: ({ row: { original } }) => <MaskFormat textContent={original?.primaryTelephone} options={{ mask: '(999) 999-9999' }} />,
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'pharmacy.fax' }),
        id: 'fax',
        accessor: 'fax',
        Cell: ({ row: { original } }) => <MaskFormat textContent={original?.fax} options={{ mask: '(999) 999-9999' }} />,
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
        style: { minWidth: 200, maxWidth: 200 },
      },
      {
        Header: intl.formatMessage({ id: 'pharmacy.crossStreet' }),
        id: 'crossStreet',
        accessor: 'crossStreet',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
      {
        Header: intl.formatMessage({ id: 'pharmacy.ncpdpId' }),
        id: 'ncpdpId',
        accessor: 'ncpdpId',
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
        style: { minWidth: 100, maxWidth: 100 },
      },
      {
        Header: intl.formatMessage({ id: 'pharmacy.pharmacyServices' }),
        id: 'services',
        accessor: 'services',
        Cell: ({ row: { original } }) => String(original.services?.join(', ')),
        classes: {
          header: 'sheet-table_header __name whitespace-nowrap',
          cell: 'sheet-table_cell __text whitespace-nowrap',
        },
      },
    ],
    []
  );
  return (
    <div className="flex flex-col shadow mx-0 lg:mx-1">
      <div className="bg-blue-500 py-2 px-1 text-white">
        <Button color="white" variant="flat" shape="circle" className="uppercase" onClick={() => goBack(false)}>
          <BackspaceIcon className="w-6 h-6 mr-1" />
          <span>{intl.formatMessage({ id: 'pharmacy.back' })}</span>
        </Button>
      </div>
      <Table
        classes={{
          root: 'sheet __border',
          container: 'sheet_container',
          table: 'sheet-table',
          thead: 'sheet-table_thead',
          row: 'sheet-table_row',
          column: 'sheet-table_column',
          columnSorted: '__sorted',
          pagination: 'sheet-pagination',
        }}
        title={() => (searchPharmacies.length > 50 ? <p className="text-red-400 p-2">{intl.formatMessage({ id: 'pharmacy.firstPharmacies' })}</p> : '')}
        columns={columns}
        data={searchPharmacies}
        pagination={{ pageIndex: 0, pageSize: 50 }}
        sortable
      />
    </div>
  );
};

PharmacySearchList.displayName = 'PharmacySearchList';

export default PharmacySearchList;
