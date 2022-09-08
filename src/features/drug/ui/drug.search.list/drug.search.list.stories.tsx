import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DrugSearchList from './drug.search.list';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Features/Drug/Drug Search List',
  component: DrugSearchList,
  argTypes: {},
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchList>;

const Template: ComponentStory<typeof DrugSearchList> = ({ ...args }) => <DrugSearchList {...args} />;

export const Default = Template.bind({});
Default.args = {
  showDrugs: true,
  showIndications: false,
  noCoupon: 0,
  openDetailsDrug: action('openDetailsDrug'),
  openDetailsDrugIndication: action('openDetailsDrugIndication'),
  searchDrugs: {
    indications: [
      {
        DXID: 114,
        MED_ROUTED_MED_ID_DESC: 'abdominal actinomycosis',
      },
      {
        DXID: 1697,
        MED_ROUTED_MED_ID_DESC: 'abdominal surgery deep vein thrombosis prevention',
      },
      {
        DXID: 13944,
        MED_ROUTED_MED_ID_DESC: 'actinic prurigo',
      },
      {
        DXID: 1456,
        MED_ROUTED_MED_ID_DESC: 'acute coronary syndrome',
      },
      {
        DXID: 268,
        MED_ROUTED_MED_ID_DESC: 'acute gonococcal endometritis',
      },
    ],
    drugs: [
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '71554',
        GenericName: '1,2-pentanediol',
        MED_NAME_ID: 129122,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '1,2-pentanediol (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 155535,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
        interaction: {
          ROUTED_MED_ID: 52641,
          DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
          DDI_SL: '3',
        },
        allergy: {
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
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '69024',
        GenericName: '(d)-limonene flavor',
        MED_NAME_ID: 180826,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '(d)-limonene flavor (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 160581,
        TypeId: '40',
        multipletype: 'False',
        offerid: 2422,
        interaction: {
          ROUTED_MED_ID: 52641,
          DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
          DDI_SL: '2',
        },
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '65039',
        GenericName: 'sod Cl irrigat/decyl glucoside',
        MED_NAME_ID: 117762,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: '0.9 % sodium chloride-decyl glucoside irrigation',
        MED_ROUTE_ID: 15,
        MED_STATUS_CD: '1',
        Pharmacology: null,
        ROUTED_MED_ID: 152139,
        TypeId: '2',
        multipletype: 'False',
        offerid: null,
        interaction: {
          ROUTED_MED_ID: 52641,
          DDI_DES: 'SELECTED QT PROLONGING AGENTS/ERYTHROMYCIN; TELITHROMYCIN',
          DDI_SL: '1',
        },
      },
      {
        DrugGroup: 'A',
        FormularyStatus: '-1',
        GCN_SEQNO: '30759',
        GenericName: 'nebulizer accessories',
        MED_NAME_ID: 79271,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: 'A.I.R.S Nebulizer Replacement',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 92982,
        TypeId: '20',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '71554',
        GenericName: '1,2-pentanediol',
        MED_NAME_ID: 129122,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '1,2-pentanediol (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 155535,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '69024',
        GenericName: '(d)-limonene flavor',
        MED_NAME_ID: 180826,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '(d)-limonene flavor (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 160581,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '65039',
        GenericName: 'sod Cl irrigat/decyl glucoside',
        MED_NAME_ID: 117762,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: '0.9 % sodium chloride-decyl glucoside irrigation',
        MED_ROUTE_ID: 15,
        MED_STATUS_CD: '1',
        Pharmacology: null,
        ROUTED_MED_ID: 152139,
        TypeId: '2',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: 'A',
        FormularyStatus: '-1',
        GCN_SEQNO: '30759',
        GenericName: 'nebulizer accessories',
        MED_NAME_ID: 79271,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: 'A.I.R.S Nebulizer Replacement',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 92982,
        TypeId: '20',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '71554',
        GenericName: '1,2-pentanediol',
        MED_NAME_ID: 129122,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '1,2-pentanediol (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 155535,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '69024',
        GenericName: '(d)-limonene flavor',
        MED_NAME_ID: 180826,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '(d)-limonene flavor (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 160581,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '65039',
        GenericName: 'sod Cl irrigat/decyl glucoside',
        MED_NAME_ID: 117762,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: '0.9 % sodium chloride-decyl glucoside irrigation',
        MED_ROUTE_ID: 15,
        MED_STATUS_CD: '1',
        Pharmacology: null,
        ROUTED_MED_ID: 152139,
        TypeId: '2',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: 'A',
        FormularyStatus: '-1',
        GCN_SEQNO: '30759',
        GenericName: 'nebulizer accessories',
        MED_NAME_ID: 79271,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: 'A.I.R.S Nebulizer Replacement',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 92982,
        TypeId: '20',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '71554',
        GenericName: '1,2-pentanediol',
        MED_NAME_ID: 129122,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '1,2-pentanediol (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 155535,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '69024',
        GenericName: '(d)-limonene flavor',
        MED_NAME_ID: 180826,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '(d)-limonene flavor (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 160581,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '65039',
        GenericName: 'sod Cl irrigat/decyl glucoside',
        MED_NAME_ID: 117762,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: '0.9 % sodium chloride-decyl glucoside irrigation',
        MED_ROUTE_ID: 15,
        MED_STATUS_CD: '1',
        Pharmacology: null,
        ROUTED_MED_ID: 152139,
        TypeId: '2',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: 'A',
        FormularyStatus: '-1',
        GCN_SEQNO: '30759',
        GenericName: 'nebulizer accessories',
        MED_NAME_ID: 79271,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: 'A.I.R.S Nebulizer Replacement',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 92982,
        TypeId: '20',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '71554',
        GenericName: '1,2-pentanediol',
        MED_NAME_ID: 129122,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '1,2-pentanediol (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 155535,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '69024',
        GenericName: '(d)-limonene flavor',
        MED_NAME_ID: 180826,
        MED_NAME_TYPE_CD: '2',
        MED_ROUTED_MED_ID_DESC: '(d)-limonene flavor (bulk)',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 160581,
        TypeId: '40',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: null,
        FormularyStatus: '-1',
        GCN_SEQNO: '65039',
        GenericName: 'sod Cl irrigat/decyl glucoside',
        MED_NAME_ID: 117762,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: '0.9 % sodium chloride-decyl glucoside irrigation',
        MED_ROUTE_ID: 15,
        MED_STATUS_CD: '1',
        Pharmacology: null,
        ROUTED_MED_ID: 152139,
        TypeId: '2',
        multipletype: 'False',
        offerid: null,
      },
      {
        DrugGroup: 'A',
        FormularyStatus: '-1',
        GCN_SEQNO: '30759',
        GenericName: 'nebulizer accessories',
        MED_NAME_ID: 79271,
        MED_NAME_TYPE_CD: '1',
        MED_ROUTED_MED_ID_DESC: 'A.I.R.S Nebulizer Replacement',
        MED_ROUTE_ID: 35,
        MED_STATUS_CD: '0',
        Pharmacology: null,
        ROUTED_MED_ID: 92982,
        TypeId: '20',
        multipletype: 'False',
        offerid: null,
      },
    ],
  },
};