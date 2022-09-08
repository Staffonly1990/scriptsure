import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DrugsABCList from './drugs.abc.list';
import DrugCell from './drug.cell';
import CompoundCell from './compound.cell';
import OrdersetCell from './orderset.cell';
import Button from 'shared/ui/button';

export default {
  title: 'Features/Drug/Drugs ABC List',
  component: DrugsABCList,
  argTypes: {},
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugsABCList>;

const Template: ComponentStory<typeof DrugsABCList> = ({ ...args }) => {
  const drugsArr = [
    {
      FontColorUser: null,
      FontNameUser: null,
      FontSizeUser: null,
      FontStyleUser: null,
      FormularyStatus: '-1',
      GCN_SEQNO: '40964,40965',
      GenericName: 'abacavir sulfate',
      MED_NAME_TYPE_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Abacavir',
      ROUTED_MED_ID: 16830,
      ReactionCode: '',
      ReasonAllergy: '',
      ReasonInteraction: '',
      TypeId: '1',
      offerid: null,
      interaction: {
        ROUTED_MED_ID: 52641,
        DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
        DDI_SL: '2',
      },
      allergie: {
        allergy: 0,
        detail: {
          DAM_AGCCSD: 'SULFONE',
          DAM_AGCSPD: 'SULFONE',
          DAM_ALRGN_GRP: 900237,
          DAM_ALRGN_XSENSE: 264,
          HIC: 'W4PA',
          HIC_SEQN: 3003,
          ROUTED_MED_ID: 6744,
          chemicalDescription: 'dapsone',
          medicationDescription: 'dapsone',
        },
        title: '<b>Ingredient</b>: dapsone',
      },
    },
    {
      FontColorUser: null,
      FontNameUser: null,
      FontSizeUser: null,
      FontStyleUser: null,
      FormularyStatus: '-1',
      GCN_SEQNO: '40964,40965',
      GenericName: 'abacavir sulfate',
      MED_NAME_TYPE_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Abacavir',
      ROUTED_MED_ID: 16830,
      ReactionCode: '',
      ReasonAllergy: '',
      ReasonInteraction: '',
      TypeId: '1',
      offerid: 2012,
    },
    {
      FontColorUser: null,
      FontNameUser: null,
      FontSizeUser: null,
      FontStyleUser: null,
      FormularyStatus: '-1',
      GCN_SEQNO: '40964,40965',
      GenericName: 'abacavir sulfate',
      MED_NAME_TYPE_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Abacavir',
      ROUTED_MED_ID: 16830,
      ReactionCode: '',
      ReasonAllergy: '',
      ReasonInteraction: '',
      TypeId: '1',
      offerid: null,
      interaction: {
        ROUTED_MED_ID: 52641,
        DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
        DDI_SL: '1',
      },
    },
    {
      FontColorUser: null,
      FontNameUser: null,
      FontSizeUser: null,
      FontStyleUser: null,
      FormularyStatus: '-1',
      GCN_SEQNO: '40964,40965',
      GenericName: 'abacavir sulfate',
      MED_NAME_TYPE_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Abacavir',
      ROUTED_MED_ID: 16830,
      ReactionCode: '',
      ReasonAllergy: '',
      ReasonInteraction: '',
      TypeId: '1',
      offerid: null,
      interaction: {
        ROUTED_MED_ID: 52641,
        DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
        DDI_SL: '3',
      },
      allergie: {
        allergy: 0,
        detail: {
          DAM_AGCCSD: 'SULFONE',
          DAM_AGCSPD: 'SULFONE',
          DAM_ALRGN_GRP: 900237,
          DAM_ALRGN_XSENSE: 264,
          HIC: 'W4PA',
          HIC_SEQN: 3003,
          ROUTED_MED_ID: 6744,
          chemicalDescription: 'dapsone',
          medicationDescription: 'dapsone',
        },
        title: '<b>Ingredient</b>: dapsone',
      },
    },
  ];

  const compoundArr = [
    {
      CompoundPractices: [],
      CompoundUsers: [],
      Compounds: [],
      comment: 'asdf',
      compoundId: 468,
      createdAt: '2020-10-08T19:12:20.000Z',
      name: 'asdf',
      organizationId: 486,
      updatedAt: '2020-10-08T19:12:20.000Z',
    },
    {
      CompoundPractices: [],
      CompoundUsers: [],
      Compounds: [],
      comment: 'For pain',
      compoundId: 460,
      createdAt: '2020-05-18T13:43:32.000Z',
      name: 'Naltrexone',
      organizationId: 486,
      updatedAt: '2020-05-18T13:43:32.000Z',
    },
    {
      CompoundPractices: [],
      CompoundUsers: [],
      Compounds: [],
      comment: 'for pain',
      compoundId: 480,
      createdAt: '2021-07-23T18:25:46.000Z',
      name: 'Testing TM',
      organizationId: 486,
      updatedAt: '2021-07-23T18:37:44.000Z',
    },
  ];

  const odersetArr = [
    {
      OrdersetPractices: [],
      OrdersetSequences: [],
      OrdersetUsers: [],
      comment: 'for pre-op patients',
      createdAt: '2020-12-17T16:21:44.000Z',
      name: 'My Order Set',
      ordersetId: 29,
      organizationId: 486,
      updatedAt: '2020-12-17T16:21:44.000Z',
    },
    {
      OrdersetPractices: [],
      OrdersetSequences: [],
      OrdersetUsers: [],
      comment: 'Example of non-controlled prescriptions',
      createdAt: '2019-10-09T00:39:10.000Z',
      name: 'Non-Controlled',
      ordersetId: 3,
      organizationId: 486,
      updatedAt: '2019-10-09T00:39:10.000Z',
    },
    {
      OrdersetPractices: [],
      OrdersetSequences: [],
      OrdersetUsers: [],
      comment: 'sdfsdf',
      createdAt: '2022-01-27T09:41:58.000Z',
      name: 'sdfsdfsdf',
      ordersetId: 48,
      organizationId: 486,
      updatedAt: '2022-01-27T09:41:58.000Z',
    },
  ];

  const drugs = drugsArr.map((drugCell) => (
    <DrugCell
      onClick={(drug) => {
        console.log(drug);
      }}
      drug={drugCell}
      noCoupon={0}
    />
  ));

  const compounds = compoundArr.map((compoundCell) => (
    <CompoundCell
      onClick={(compound) => {
        console.log(compound);
      }}
      compound={compoundCell}
    />
  ));

  const odersets = odersetArr.map((oderset) => (
    <OrdersetCell
      onClick={(orderset) => {
        console.log(orderset);
      }}
      orderset={oderset}
    />
  ));

  const [cells, setCell] = useState<JSX.Element[]>([]);

  const addCell = () => {
    if (cells.length) {
      setCell([...cells, cells[0]]);
    }
  };

  const showCompounds = () => {
    setCell(compounds);
  };

  const showDrugs = () => {
    setCell(drugs);
  };

  const showOdersets = () => {
    setCell(odersets);
  };

  return (
    <>
      <DrugsABCList drugList={cells} />

      <div className="flex">
        <Button className="m-1" onClick={addCell}>
          Add Cell
        </Button>
        <Button className="m-1" onClick={showDrugs}>
          Show Drugs
        </Button>
        <Button className="m-1" onClick={showCompounds}>
          Show Compounds
        </Button>
        <Button className="m-1" onClick={showOdersets}>
          Show Odersets
        </Button>
      </div>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
