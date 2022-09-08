import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DrugDetail from './drug.detail';

import DrugDetailMainTitle from './drug.detail.main.title';
import DrugDetailOptions from './drug.detail.options';
import { IAllergy } from 'shared/api/allergy';
import { ChevronDoubleRightIcon, DocumentIcon, DocumentTextIcon, ExclamationIcon } from '@heroicons/react/outline';

import DrugAllergyModal from './drug.allergy.modal';
import CurrentMedicationModal from './current.medication.modal';
import DrugDetailSubTitle from './drug.detail.sub.title';
import DrugDetailDoseList from './drug.detail.dose.list';
import DrugDetailDifferentDose from './drug.detail.different.dose';
import { ISig } from 'shared/api/drug';
import DrugDetailCompoundList from './drug.detail.compound.list';
import { ICompoundObject } from 'shared/api/compound';
import DrugDetailOrderSetList from './drug.detail.order.set.list';
import { IOrderset } from 'shared/api/orderset';
import Button from 'shared/ui/button';
import Dropdown from 'shared/ui/dropdown';

export default {
  title: 'Features/Drug/Drug Detail',
  component: DrugDetail,
  argTypes: {},
  args: {
    sideView: 0,
  },
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugDetail>;

const Template: ComponentStory<typeof DrugDetail> = ({ sideView, ...args }) => {
  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [allergyModal, setAllergyModal] = useState(false);
  const [currentMedicationModal, setCurrentMedicationModal] = useState(false);
  const [drugName, setDrugName] = useState('Abacavir');
  const [doses, setDoses] = useState('');

  const handleClose = () => {
    setOpen(false);
  };
  const removeFavorit = () => {
    setIsFavorite(false);
  };
  const addFavorit = () => {
    setIsFavorite(true);
  };

  const dgnamesList = ['asdfg', 'aghf', 'fghs', 'jfhnsadf'];

  const orderset: IOrderset = {
    OrdersetPractices: [],
    OrdersetSequences: [
      {
        OrderDiagnoses: [],
        OrderEducations: [],
        Orders: [],
        description: 'Take 1 tablet by mouth twice a day',
        detail: '60 Tablet',
        name: 'Eliquis 5 mg tablet',
        orderId: 97,
        ordersetId: 29,
        ordersetType: 1,
        sequenceId: 6,
      },
      {
        OrderDiagnoses: [],
        OrderEducations: [],
        Orders: [],
        description: 'Take 1 tablet by mouth daily',
        detail: '31 Tablet',
        name: 'Abilify 15 mg tablet',
        orderId: 121,
        ordersetId: 29,
        ordersetType: 1,
        sequenceId: 18,
      },
    ],
    OrdersetUsers: [],
    comment: 'for pre-op patients',
    createdAt: '2020-12-17T16:21:44.000Z',
    name: 'My Order Set',
    ordersetId: 29,
    organizationId: 486,
    updatedAt: '2020-12-17T16:21:44.000Z',
  };

  const adverseeventsList = [
    {
      adverseEventCode: '235719002',
      name: 'Food intolerance',
    },
    {
      adverseEventCode: '414285001',
      name: 'Food allergy',
    },
    {
      adverseEventCode: '416098002',
      name: 'Drug allergy',
    },
    {
      adverseEventCode: '418038007',
      name: 'Propensity to adverse reactions to substance',
    },
    {
      adverseEventCode: '418471000',
      name: 'Propensity to adverse reactions to food',
    },
    {
      adverseEventCode: '419199007',
      name: 'Allergy to substance',
    },
    {
      adverseEventCode: '419511003',
      name: 'Propensity to adverse reactions to drug',
    },
    {
      adverseEventCode: '420134006',
      name: 'Propensity to adverse reactions',
    },
    {
      adverseEventCode: '59037007',
      name: 'Drug intolerance',
    },
  ];

  const compound: ICompoundObject = {
    CompoundPractices: [],
    CompoundUsers: [],
    Compounds: [
      {
        CompoundDrugDiagnoses: [],
        CompoundDrugs: [
          {
            GCN_SEQNO: null,
            MED_NAME_TYPE_CD: null,
            MED_REF_DEA_CD: '0',
            MED_REF_FED_LEGEND_IND: null,
            MED_REF_GEN_DRUG_NAME_CD: null,
            QuantityQualifier: { potencyUnit: 'C28253', name: 'Milligram' },
            ROUTED_MED_ID: null,
            calculate: true,
            compoundId: 484,
            drugId: 1088,
            drugName: 'Benadryl',
            drugOrder: 2,
            line1: null,
            line2: null,
            maxDaily: null,
            ndc: null,
            quantity: 50,
            quantityQualifier: 'C28253',
            rxnorm: null,
            rxnormQualifier: null,
            sampleLotNumber: null,
            useSubstitution: true,
          },
        ],
        CompoundSigs: [
          {
            administrationTimingCode: '307468000',
            administrationTimingText: null,
            descriptor: null,
            dose: 1,
            doseDeliveryMethodCode: '418283001',
            doseDeliveryMethodText: 'Administer',
            doseFormCode: 'C28253',
            doseFormText: 'Milligram',
            doseQuantity: 1,
            durationNumericValue: null,
            durationText: null,
            durationTextCode: null,
            indicationPrecursorCode: '420449005',
            indicationPrecursorText: 'As needed for',
            indicationText: 'Restlessness and agitation',
            indicationTextCode: '274647009',
            indicationValueUnitofMeasureCode: '52101004',
            indicationValueUnitofMeasureText: 'Present',
            line3: 'Administer 1 milligram topically every six hours as needed for restlessness and agitation',
            multipleSigModifier: null,
            routeofAdministrationCode: '6064005',
            routeofAdministrationText: 'topically',
            secondaryAdministrationTimingCode: null,
            secondaryAdministrationTimingModifierCode: null,
            secondaryAdministrationTimingModifierText: null,
            secondaryAdministrationTimingText: null,
            sigId: 848,
            sigOrder: 0,
            siteofAdministrationCode: null,
            siteofAdministrationText: null,
          },
        ],
        QuantityQualifier: { potencyUnit: 'C28253', name: 'Milligram' },
        compoundId: 484,
        compoundQuantity: 1,
        compoundQuantityQualifier: 'C28253',
        delivered: 10,
        duration: 1,
        internalComment: null,
        maxDaily: 4,
        pharmacy: 'VA Pharmacy Store 10.6',
        pharmacyId: '9900119',
        pharmacyNote: null,
        refill: 0,
      },
    ],
    comment: 'gel',
    compoundId: 484,
    createdAt: '2021-09-28T20:15:30.000Z',
    name: 'ABH',
    organizationId: 486,
    updatedAt: '2021-09-28T20:15:30.000Z',
  };

  const responseDoses = [
    {
      GCN_SEQNO: 81857,
      MED_DOSAGE_FORM_DESC: 'suspension,extended release',
      MED_MEDID_DESC: 'Cabenuva 400 mg/2 mL-600 mg/2 mL IM suspension, extended release',
      MED_NAME_TYPE_CD: '1',
      MED_REF_DEA_CD: '0',
      MED_REF_FED_LEGEND_IND: '1',
      MED_REF_GEN_DRUG_NAME_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Cabenuva intramuscular',
      MED_STATUS_CD: '0',
      MED_STRENGTH: '400 mg/2 mL-',
      MED_STRENGTH_UOM: '600 mg/2 mL',
      ROUTED_MED_ID: 180741,
      epn: 'Cabenuva 400 mg/2 mL-600 mg/2 mL IM suspension, extended release',
      imk_preferred_ind: '1',
      med_status_cd: '0',
      ndc: '49702025315',
      rxNorm: '2475418',
      rxNormQualifier: 'BPK',
    },
    {
      GCN_SEQNO: 81862,
      MED_DOSAGE_FORM_DESC: 'suspension,extended release',
      MED_MEDID_DESC: 'Cabenuva 600 mg/3 mL-900 mg/3 mL IM suspension, extended release',
      MED_NAME_TYPE_CD: '1',
      MED_REF_DEA_CD: '0',
      MED_REF_FED_LEGEND_IND: '1',
      MED_REF_GEN_DRUG_NAME_CD: '2',
      MED_ROUTED_MED_ID_DESC: 'Cabenuva intramuscular',
      MED_STATUS_CD: '0',
      MED_STRENGTH: '600 mg/3 mL-',
      MED_STRENGTH_UOM: '900 mg/3 mL',
      ROUTED_MED_ID: 180741,
      epn: 'Cabenuva 600 mg/3 mL-900 mg/3 mL IM suspension, extended release',
      imk_preferred_ind: '1',
      med_status_cd: '0',
      ndc: '49702024015',
      rxNorm: '2475416',
      rxNormQualifier: 'BPK',
    },
  ];

  const responseDosesJSX = responseDoses.map((responseDose) => (
    <li className="hover:bg-gray-200 cursor-pointer p-2 justify-between flex items-center">
      {`${responseDose.MED_STRENGTH ?? ''}-${responseDose.MED_STRENGTH_UOM ?? ''} 
            ${responseDose.MED_DOSAGE_FORM_DESC}`}
    </li>
  ));

  const formats = [
    {
      FormularyStatus: '-1',
      GCN_SEQNO: 16930,
      line1: '100 mg/5 mL oral suspension',
      sigs: [
        {
          FormularyStatus: '-1',
          GCN_SEQNO: 16930,
          MED_REF_DEA_CD: '0',
          ROUTED_MED_ID: 8749,
          delivered: 1,
          drugId: 34770,
          drugName: 'Cefpodoxime',
          formatId: 34770,
          line1: '100 mg/5 mL oral suspension',
          ndc: '00781616946',
          rxnorm: '309077',
          rxnormQualifier: 'SCD',
          sigLine: '200 Milliliter - Take 10 milliliter by mouth every twelve hours',
          coupon: {
            CouponNdc: [],
            couponId: 1522643,
            description: 'SingleCare Generic Savings Program',
            id: 1370931,
            offerId: 2665,
          },
        },
        {
          FormularyStatus: '-1',
          GCN_SEQNO: 16930,
          MED_REF_DEA_CD: '0',
          ROUTED_MED_ID: 8749,
          delivered: 1,
          drugId: 34770,
          drugName: 'Cefpodoxime',
          formatId: 34770,
          line1: '100 mg/5 mL oral suspension',
          ndc: '00781616946',
          rxnorm: '309077',
          rxnormQualifier: 'SCD',
          sigLine: '200 Milliliter - Take 10 milliliter by mouth every twelve hours',
        },
        {
          FormularyStatus: '-1',
          GCN_SEQNO: 16930,
          MED_REF_DEA_CD: '0',
          ROUTED_MED_ID: 8749,
          delivered: 1,
          drugId: 34770,
          drugName: 'Cefpodoxime',
          formatId: 34770,
          line1: '100 mg/5 mL oral suspension',
          ndc: '00781616946',
          rxnorm: '309077',
          rxnormQualifier: 'SCD',
          sigLine: '200 Milliliter - Take 10 milliliter by mouth every twelve hours',
        },
      ],
    },
    {
      FormularyStatus: '-1',
      GCN_SEQNO: 16930,
      line1: '100 mg/5 mL oral suspension',
      sigs: [
        {
          FormularyStatus: '-1',
          GCN_SEQNO: 16930,
          MED_REF_DEA_CD: '0',
          ROUTED_MED_ID: 8749,
          delivered: 1,
          drugId: 34770,
          drugName: 'Cefpodoxime',
          formatId: 34770,
          line1: '100 mg/5 mL oral suspension',
          ndc: '00781616946',
          rxnorm: '309077',
          rxnormQualifier: 'SCD',
          sigLine: '200 Milliliter - Take 10 milliliter by mouth every twelve hours',
        },
      ],
    },
    {
      FormularyStatus: '-1',
      GCN_SEQNO: 16930,
      line1: '100 mg/5 mL oral suspension',
      sigs: [
        {
          FormularyStatus: '-1',
          GCN_SEQNO: 16930,
          MED_REF_DEA_CD: '0',
          ROUTED_MED_ID: 8749,
          delivered: 1,
          drugId: 34770,
          drugName: 'Cefpodoxime',
          formatId: 34770,
          line1: '100 mg/5 mL oral suspension',
          ndc: '00781616946',
          rxnorm: '309077',
          rxnormQualifier: 'SCD',
          sigLine: '200 Milliliter - Take 10 milliliter by mouth every twelve hours',
        },
      ],
    },
  ];

  const drugDoses = ['Cleocin HCl 300 mg capsule', 'Cleocin HCl 75 mg capsule', 'Cleocin HCl 150 mg capsule'];

  const alternativesList = ['linezolid oral', 'Sivextro intravenous', 'Sivextro oral'];

  const cogList = ['Show Drug Information', 'Clear Custom Formats'];

  const detailsList = ['SingleCare Savings Program', 'SingleCare Generic Savings Program'];

  const dgnames = dgnamesList.map((dgname) => <div className="cursor-pointer p-2 hover:bg-gray-200">{dgname}</div>);

  const adverseevents = adverseeventsList.map((adverseevent) => {
    return {
      value: adverseevent.adverseEventCode,
      label: adverseevent.name,
    };
  });

  const warning = (
    <Button className="mr-2" color="red">
      <ExclamationIcon className="w-6 h-6" />
      Warning
    </Button>
  );

  const cog = cogList.map((co) => <div className="cursor-pointer p-2 hover:bg-gray-200">{co}</div>);

  const details = detailsList.map((detail) => <div className="cursor-pointer p-2 hover:bg-gray-200">{detail}</div>);

  const alternatives = (
    <Dropdown
      list={alternativesList.map((alternative) => (
        <div
          onClick={() => {
            setDrugName(alternative);
          }}
          onKeyDown={() => {
            setDrugName(alternative);
          }}
          role="presentation"
          className="cursor-pointer p-2 hover:bg-gray-200"
        >
          {alternative}
        </div>
      ))}
    >
      <Button color="blue">
        <span>SHOW ALTERNATIVES</span>
      </Button>
    </Dropdown>
  );

  const drugDosesList = drugDoses?.map((drugDose) => (
    <div
      role="presentation"
      onKeyDown={() => {
        setDoses(drugDose ?? '');
        setCurrentMedicationModal(true);
      }}
      onClick={() => {
        setDoses(drugDose ?? '');
        setCurrentMedicationModal(true);
      }}
      className="p-2 hover:bg-gray-200 cursor-pointer"
    >
      {drugDose}
    </div>
  ));

  const setCurrentMedication = [
    <div
      onClick={() => {
        setDoses(drugName);
        setCurrentMedicationModal(true);
      }}
      role="presentation"
      onKeyDown={() => {
        setDoses(drugName);
        setCurrentMedicationModal(true);
      }}
      className="p-2 hover:bg-gray-200 cursor-pointer flex"
    >
      <DocumentIcon className="w-6 h-6" />
      SET CURRENT WITH DRUG NAME ONLY
    </div>,

    <Dropdown placement="bottom-start" className="w-full" list={drugDosesList ?? []}>
      <div className="p-2 hover:bg-gray-200 cursor-pointer flex">
        <DocumentTextIcon className="w-6 h-6" />
        CURRENT WITH DETAIL
      </div>
    </Dropdown>,
  ];

  const saveMedicationModal = (data: { chronic: boolean; expirationDate: string | Date; outsidePhysician: string; medicationComment: string }) => {
    console.log({ ...data });
    setCurrentMedicationModal(false);
  };

  const alternativesBtns = alternativesList.map((alternative) => (
    <div className="py-1">
      <Button color="green">
        <span>{alternative}</span>
      </Button>
    </div>
  ));

  const saveAllergyModal = (data: Partial<IAllergy>) => {
    console.log({ ...data });
    setAllergyModal(false);
  };

  const renderSigs = (sigs: ISig[]): JSX.Element[] => {
    return sigs.map((sig) => <div className="p-1 hover:bg-gray-200 cursor-pointer">{sig.sigLine}</div>);
  };

  const compoundSelect = (
    <Button color="green">
      <span>Select</span>
    </Button>
  );

  const orderSetSelect = (
    <Button color="green">
      <span>Select</span>
    </Button>
  );

  const optionArr = [
    <DrugDetailDoseList
      liDrugDoses={responseDosesJSX}
      formats={formats}
      createYourOwnFormat={() => {}}
      noCoupon={0}
      renderSigs={renderSigs}
      selectDifferentDose={<DrugDetailDifferentDose differentDoses={cog} />}
    />,
    <></>,
    <DrugDetailCompoundList compound={compound} select={compoundSelect} />,
    <DrugDetailOrderSetList
      orderset={orderset}
      select={orderSetSelect}
      getSequence={(sequence) => {
        console.log(sequence);
      }}
    />,
  ];

  return (
    <>
      <Button
        variant="outlined"
        shape="smooth"
        color="black"
        onClick={() => {
          setOpen(true);
        }}
      >
        Trigger
      </Button>
      <DrugDetail
        sideView={sideView}
        open={open}
        onClose={handleClose}
        warning={warning}
        alternatives={alternatives}
        mainTitle={
          <DrugDetailMainTitle
            drugName={drugName}
            pharmacologyText="pharmacologyText..."
            dgnames={dgnames}
            isFavorite={isFavorite}
            removeFavorit={removeFavorit}
            addFavorit={addFavorit}
          />
        }
        options={
          <DrugDetailOptions
            setAllergyClick={() => {
              setAllergyModal(true);
            }}
            setCurrentMedication={setCurrentMedication}
            cog={cog}
          />
        }
        subTitle={<DrugDetailSubTitle details={details} addFormat={details} sideView={sideView} />}
        detailsList={optionArr[sideView] ?? <></>}
        alternativesBtns={!sideView ? alternativesBtns : []}
      />
      <DrugAllergyModal
        saveAllergy={saveAllergyModal}
        severities={adverseevents}
        reactions={adverseevents}
        adverseevents={adverseevents}
        drugName={drugName}
        open={allergyModal}
        onCancel={() => {
          setAllergyModal(false);
        }}
      />
      <CurrentMedicationModal
        saveMedication={saveMedicationModal}
        outsidePhysician="Doctor Aaron"
        drugName={doses}
        open={currentMedicationModal}
        onCancel={() => {
          setCurrentMedicationModal(false);
        }}
      />
    </>
  );
};
export const Default = Template.bind({});
