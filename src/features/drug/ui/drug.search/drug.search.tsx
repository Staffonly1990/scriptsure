import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DrugSearchCategory, DrugSearchCategorySelect, DrugSearchCustom, DrugSearchFilter, IDrugFilterData } from 'features/drug';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { map } from 'lodash';

import { findSetting } from 'features/settings/lib/find.setting';
import { userModel } from 'features/user';
import { patientModel } from 'features/patient';
import { drugSearch } from '../../model';
import { IAllergies } from '../../model/drug.search.store';

import { IDrugABC, IFavoritesDrug, ISearchDrug } from 'shared/api/drug';

import Button from 'shared/ui/button';
import { MenuIcon } from '@heroicons/react/solid';
import { orderSet, OrderSetSelection } from 'features/order.set';
import DrugCell from '../drugs.abc.list/drug.cell';
import CompoundCell from '../drugs.abc.list/compound.cell';
import OrdersetCell from '../drugs.abc.list/orderset.cell';
import DrugsFavoritList from '../drugs.favorit.list';
import DrugsABCList from '../drugs.abc.list';
import DrugSearchList from '../drug.search.list';

const DrugSearch: FC = observer(() => {
  const intl = useIntl();
  const [categoryTitle, setCategory] = useState(intl.formatMessage({ id: 'favorite' }));
  const [data, setData] = useState<IDrugFilterData>({
    couponOnly: false,
    searchBrand: true,
    searchGeneric: true,
    searchOtc: true,
    searchSupply: true,
    searchStatus: 0,
    searchMedication: true,
    searchIndication: true,
  });
  const [cells, setCell] = useState<JSX.Element[]>([]);
  const [openOrderSet, setOpenOrderSet] = useState(false);
  const noCoupon = Number(findSetting(userModel.data?.settings, 'DO_NOT_PRINT_DISCOUNT_CARD', 'User'));

  const createOrder = () => {
    setOpenOrderSet(true);
    orderSet.getOrderSets(userModel.data?.currentOrganization?.id);
  };

  // THe practice can control whether or not the interaction check is turned on.
  // The practice, if turned on, will override checks that have been turned off
  // by a single user
  const checkInteraction = async (patientId: number, drugSearchDrugs: IFavoritesDrug[] | IDrugABC[] | ISearchDrug[]) => {
    if (!patientId) {
      return;
    }
    let allergies: IAllergies = {
      damAlrgnGrp: [],
      damAlrgnXsense: [],
      hicRoot: [],
      hicSeqn: [],
    };
    if (
      Boolean(Number(findSetting(userModel.data?.settings, 'DRUG_TO_DRUG_INTERACTION_CHECK', 'User'))) === true ||
      Boolean(Number(findSetting(userModel.data?.settings, 'DRUG_TO_DRUG_INTERACTION_CHECK', 'Practice'))) === true
    ) {
      await drugSearch.getCurrentMedications(patientId, 0);
    }
    if (
      Boolean(Number(findSetting(userModel.data?.settings, 'PATIENT_ALLERGY_CHECK', 'User'))) === true ||
      Boolean(Number(findSetting(userModel.data?.settings, 'PATIENT_ALLERGY_CHECK', 'Practice'))) === true
    ) {
      allergies = {
        hicRoot: patientModel.allergyPatientData.hicRoot,
        hicSeqn: patientModel.allergyPatientData.hicSeqn,
        damAlrgnGrp: patientModel.allergyPatientData.damAlrgnGrp,
        damAlrgnXsense: patientModel.allergyPatientData.damAlrgnXsense,
      };
    }
    if (drugSearch.currentMedications.length > 0) {
      await drugSearch.getInteractionsAllergies(drugSearchDrugs, allergies, drugSearch.currentMedications);
      await drugSearch.setAllergyInteractions(categoryTitle);
    } else {
      await drugSearch.getInteractionsAllergies(drugSearchDrugs, allergies, []);
      await drugSearch.setAllergyInteractions(categoryTitle);
    }
  };

  /**
   * Load the correct drug list based on the passed in group.
   * @param group
   */

  const getFavorites = async () => {
    if (patientModel.currentPatient?.patientId) {
      try {
        await drugSearch.getFavorites();
        if (!drugSearch.favoritesDrugs.length) {
          return;
        }
        await checkInteraction(patientModel.currentPatient?.patientId, drugSearch.favoritesDrugs);
      } catch (error) {}
    }
  };

  const getDrugList = async (category: string) => {
    if (patientModel.currentPatient?.patientId) {
      try {
        await drugSearch.getDrugList(category);
        await setCell(
          drugSearch.drugABCList.map((drugABC) => (
            <DrugCell
              onClick={(drug) => {
                console.log(drug);
              }}
              drug={drugABC}
              noCoupon={noCoupon}
            />
          ))
        );
        if (!drugSearch.drugABCList.length) {
          return;
        }
        await checkInteraction(patientModel.currentPatient?.patientId, drugSearch.drugABCList);
      } catch (error) {}
    }
  };

  const getCompoundList = async () => {
    try {
      await drugSearch.getCompounds(true, userModel.data?.currentOrganization?.id);
      await setCell(
        drugSearch.compounds.map((compoundCell) => (
          <CompoundCell
            onClick={(compound) => {
              console.log(compound);
            }}
            compound={compoundCell}
          />
        ))
      );
    } catch (error) {}
  };

  const OrderSetList = async () => {
    try {
      await orderSet.getOrderSets(userModel.data?.currentOrganization?.id);
      await setCell(
        orderSet.orderSets.map((orderSetCell) => (
          <OrdersetCell
            onClick={(order) => {
              console.log(order);
            }}
            orderset={orderSetCell}
          />
        ))
      );
    } catch (error) {}
  };

  const search = async (searchTerm: string) => {
    if (patientModel.currentPatient?.patientId) {
      await drugSearch.search({
        searchBrand: data.searchBrand,
        searchGeneric: data.searchGeneric,
        searchIndication: data.searchIndication,
        searchMedication: data.searchMedication,
        searchOtc: data.searchOtc,
        searchStatus: data.searchStatus,
        searchSupply: data.searchSupply,
        searchTerm,
      });
      if (!drugSearch.searchDrags.drugs?.length) {
        return;
      }
      await checkInteraction(patientModel.currentPatient?.patientId, drugSearch.searchDrags.drugs);
    }
  };

  const setList = (category: string) => {
    if (category === 'F') {
      getFavorites();
    }
    if (category === 'OR') {
      OrderSetList();
    }
    if (category === 'CO') {
      getCompoundList();
    }
    if (
      category === 'B' ||
      category === 'A' ||
      category === 'C' ||
      category === 'D' ||
      category === 'E' ||
      category === 'G' ||
      category === 'K+' ||
      category === 'O' ||
      category === 'P' ||
      category === 'SD' ||
      category === 'PSY' ||
      category === 'Z'
    ) {
      getDrugList(category);
    }
  };

  const drugCategories = [
    { value: 'F', name: 'favorite' },
    { value: 'A', name: 'drug.antibiotics' },
    { value: 'B', name: 'drug.bronchodilator' },
    { value: 'C', name: 'drug.cardiac' },
    { value: 'D', name: 'drug.decongestant' },
    { value: 'E', name: 'drug.endocrine' },
    { value: 'G', name: 'drug.gi' },
    { value: 'K+', name: 'drug.htn' },
    { value: 'O', name: 'drug.ophth' },
    { value: 'P', name: 'drug.pain' },
    { value: 'SD', name: 'drug.salves' },
    { value: 'PSY', name: 'drug.psychotropic' },
    { value: 'Z', name: 'drug.misc' },
    { value: 'CO', name: 'drug.compound' },
    { value: 'OR', name: 'drug.order.set' },
  ];

  return (
    <div className="p-2">
      <div>
        {intl.formatMessage({
          id: drugCategories.find((category) => category.value === categoryTitle)?.name ?? 'favorite',
        })}
      </div>

      <div className="flex items-center">
        <DrugSearchFilter
          data={data}
          categories={map(drugCategories, ({ value, name: id }) => ({ value, name: <FormattedMessage id={id} /> }))}
          selectedCategory={categoryTitle}
          onSelectCategory={(value) => {
            setList(value.toString());
            setCategory(value.toString());
          }}
          onChangeData={(value) => {
            setData(value);
          }}
          onSearch={(value) => {
            search(value);
            setCategory('');
          }}
          onCopy={() => {}}
        />
        <Button color="green" shape="smooth" className="uppercase mx-2" onClick={createOrder}>
          <MenuIcon className="w-6 h-6" />
          <span className="hidden md:inline-block">{intl.formatMessage({ id: 'create.order.set' })}</span>
        </Button>
        <OrderSetSelection
          open={openOrderSet}
          handleClose={() => {
            setOpenOrderSet(false);
          }}
        />
      </div>

      <div className="py-2">
        <DrugSearchCategory
          items={map(drugCategories, ({ value, name: id }) => ({ value, name: <FormattedMessage id={id} /> }))}
          selected={categoryTitle}
          onSelect={(value) => {
            setList(value.toString());
            setCategory(value.toString());
          }}
        />
      </div>

      <div>
        {categoryTitle === 'F' && (
          <DrugsFavoritList
            favoritDrugs={drugSearch.favoritesDrugs}
            openDetails={(drug) => {
              console.log(drug);
            }}
            removeFavorit={(drug) => {
              console.log(drug);
            }}
            noCoupon={noCoupon}
          />
        )}

        {(categoryTitle === 'B' ||
          categoryTitle === 'A' ||
          categoryTitle === 'C' ||
          categoryTitle === 'D' ||
          categoryTitle === 'E' ||
          categoryTitle === 'G' ||
          categoryTitle === 'K+' ||
          categoryTitle === 'O' ||
          categoryTitle === 'P' ||
          categoryTitle === 'SD' ||
          categoryTitle === 'PSY' ||
          categoryTitle === 'Z' ||
          categoryTitle === 'CO' ||
          categoryTitle === 'OR') && <DrugsABCList drugList={cells} />}

        {categoryTitle === '' && (
          <DrugSearchList
            showDrugs={data.searchMedication ?? false}
            showIndications={data.searchIndication ?? false}
            searchDrugs={{ drugs: drugSearch.searchDrags.drugs, indications: drugSearch.searchDrags.indications }}
            openDetailsDrug={(drug) => {
              console.log(drug);
            }}
            openDetailsDrugIndication={(indication) => {
              console.log(indication);
            }}
            noCoupon={noCoupon}
          />
        )}
      </div>
    </div>
  );
});

DrugSearch.displayName = 'DrugSearch';
export default DrugSearch;
