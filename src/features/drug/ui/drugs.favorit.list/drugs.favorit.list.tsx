import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { TrashIcon, PencilIcon, ExclamationIcon, UserIcon, CurrencyDollarIcon, BeakerIcon, MenuIcon } from '@heroicons/react/solid';

import DrugCell from '../drugs.abc.list/drug.cell';
import Button from 'shared/ui/button';
import { IFavoritesDrug } from 'shared/api/drug';
import Table, { Column } from 'shared/ui/table';

interface IDrugsFavoritList {
  favoritDrugs: IFavoritesDrug[];
  openDetails: (drug: IFavoritesDrug) => void;
  removeFavorit: (drug: IFavoritesDrug) => void;
  noCoupon: number;
}

const DrugsFavoritList: FC<IDrugsFavoritList> = observer(({ favoritDrugs, noCoupon, openDetails, removeFavorit }) => {
  // ng-click=vm.showCompound($event, drug)
  const renderCompound = (drug: IFavoritesDrug) => {
    return (
      <div className="flex items-center">
        <BeakerIcon className="w-6 h-6 mr-2" />
        {drug.MED_ROUTED_MED_ID_DESC}
      </div>
    );
  };

  // ng-click=vm.showOrderset($event, drug)
  const renderOrderset = (drug: IFavoritesDrug) => {
    return (
      <div className="flex items-center">
        <MenuIcon className="w-6 h-6 mr-2" />
        {drug.MED_ROUTED_MED_ID_DESC}
      </div>
    );
  };

  const actions = {
    Cell: ({ row: { original: favoritDrug } }) => {
      return (
        <div>
          <Button
            onClick={() => {
              openDetails(favoritDrug);
            }}
            variant="flat"
            shape="circle"
            color="blue"
          >
            <PencilIcon className="w-6 h-6" />
          </Button>
          <Button
            onClick={() => {
              removeFavorit(favoritDrug);
            }}
            variant="flat"
            shape="circle"
            color="blue"
          >
            <TrashIcon className="w-6 h-6" />
          </Button>
        </div>
      );
    },
  };

  const drugs = {
    Cell: ({ row: { original: drug } }) => {
      return (
        (!drug.DrugGroupDescr && drug.ROUTED_MED_ID && <DrugCell drug={drug} noCoupon={noCoupon} />) ||
        ((drug.compoundId || drug.DrugGroupDescr === 'CO') && renderCompound(drug)) ||
        ((drug.ordersetId || drug.DrugGroupDescr === 'OR') && renderOrderset(drug))
      );
    },
  };

  const columns = useMemo<Array<Column>>(
    () => [
      {
        Header: 'drug name',
        id: 'MED_ROUTED_MED_ID_DESC',
        accessor: 'MED_ROUTED_MED_ID_DESC',
        classes: {
          header: 'sheet-table_header __name break-words',
          cell: 'sheet-table_cell __text break-words',
        },
        ...drugs,
      },
      {
        id: 'actions',
        disableSortBy: true,
        classes: {
          header: 'sheet-table_header',
          cell: 'sheet-table_cell __action',
        },
        ...actions,
      },
    ],
    [favoritDrugs]
  );

  return (
    <div className="py-3">
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
        columns={columns}
        data={favoritDrugs}
        pagination={{ pageIndex: 0, pageSize: 15 }}
        sortable
      />
    </div>
  );
});

DrugsFavoritList.displayName = 'DrugsFavoritList';
export default DrugsFavoritList;
