import { isArray } from 'lodash';

const getSideEffectFrequencies = () => {
  return [
    { value: 0, name: 'Incidence more frequent' },
    { value: 1, name: 'Incidence less frequent' },
    { value: 2, name: 'Incidence rare or very rare' },
  ];
};

const getSideEffectSeverities = () => {
  return [
    { value: 0, name: 'less severe - non-threatening (such as constipation)' },
    { value: 1, name: 'severe - life-threatening (such as agranulocytosis)' },
  ];
};

const getGeriatricSeverities = () => {
  return [
    { value: 1, name: '1 - Absolute Contraindication' },
    { value: 2, name: '2 - Precaution Exists' },
  ];
};

const getLactationSeverities = () => {
  return [
    { value: 1, name: '1 - Absolute Contraindication' },
    { value: 2, name: '2 - Precaution Exists' },
    { value: 3, name: '3 - No Known Risk' },
  ];
};

const getExcretionSeverities = () => {
  return [
    { value: 1, name: '1 - Excreted' },
    { value: 2, name: '2 - Unknown' },
    { value: 3, name: '3 - Not Excreted' },
  ];
};

const getInfantSeverities = () => {
  return [
    { value: 1, name: '1 - Adverse Effect' },
    { value: 2, name: '2 - Not Known' },
    { value: 3, name: '3 - No Adverse Effect ' },
  ];
};

const getPediatricSeverities = () => {
  return [
    { value: 1, name: '1 - Absolute Contraindication' },
    { value: 2, name: '2 - Relative Contraindication' },
    { value: 3, name: '3 - Warning Exists' },
  ];
};

const getPregnancySeverities = () => {
  return [
    { value: 'A', name: 'A' },
    { value: 'B', name: 'B' },
    { value: 'C', name: 'C' },
    { value: 'D', name: 'D' },
    { value: 'X', name: 'X' },
  ];
};

const getTimeoutUnits = () => {
  return [
    { value: 'hours', name: 'Hours' },
    { value: 'minutes', name: 'Minutes' },
  ];
};

const getFoodSeverities = () => {
  return [
    { value: '1', name: 'Most significant. Action to reduce risk of adverse interaction usually required.' },
    { value: '2', name: 'More significant. Assess risk to patient and take action as needed.' },
    { value: '3', name: 'Significant. Conservative measures are recommended until more is known.' },
    { value: '4', name: 'Less significant. Recognize interaction potential; monitor patient.' },
    { value: '5', name: 'Minor significance. Usually not a problem.' },
  ];
};

const getTimes = () => {
  return [
    { value: '0', name: '12 AM' },
    { value: '1', name: '1 AM' },
    { value: '2', name: '2 AM' },
    { value: '3', name: '3 AM' },
    { value: '4', name: '4 AM' },
    { value: '5', name: '5 AM' },
    { value: '6', name: '6 AM' },
    { value: '7', name: '7 AM' },
    { value: '8', name: '8 AM' },
    { value: '9', name: '9 AM' },
    { value: '10', name: '10 AM' },
    { value: '11', name: '11 AM' },
    { value: '12', name: '12 PM' },
    { value: '13', name: '1 PM' },
    { value: '14', name: '2 PM' },
    { value: '15', name: '3 PM' },
    { value: '16', name: '4 PM' },
    { value: '17', name: '5 PM' },
    { value: '18', name: '6 PM' },
    { value: '19', name: '7 PM' },
    { value: '20', name: '8 PM' },
    { value: '21', name: '9 PM' },
    { value: '22', name: '10 PM' },
    { value: '23', name: '11 PM' },
  ];
};

const getIntervals = () => {
  return [
    { value: '30', name: '30 Minutes' },
    { value: '60', name: '60 Minutes' },
    { value: '120', name: '120 Minutes' },
    { value: '180', name: '180 Minutes' },
    { value: '240', name: '240 Minutes' },
  ];
};

const getEpn = () => {
  return [
    { value: '0', name: 'Default' },
    { value: '1', name: 'Show Electronic Preferred Name (EPN) ONLY' },
    { value: '2', name: 'Show Medication Name ONLY' },
    { value: '3', name: 'Show Medication Name and Electronic Preferred Name (EPN)' },
  ];
};

const getPatientMasks = () => {
  return [
    {
      value: 1,
      name: 'Auto Number',
    },
    {
      value: 2,
      name: 'Manual Entry with Mask',
    },
  ];
};

const getDrugToleranceLevels = () => {
  return [
    { value: 1, name: 'Contraindicated Drug Combination' },
    { value: 2, name: 'Severe Interaction' },
    { value: 3, name: 'Moderate Interaction' },
    { value: 9, name: 'Undetermined Severity' },
  ];
};

export function getSelectList(setting) {
  switch (setting?.selectList) {
    case 'getDrugToleranceLevels':
      return getDrugToleranceLevels();
    case 'getPatientMasks':
      return getPatientMasks();
    case 'getEpn':
      return getEpn();
    case 'getIntervals':
      return getIntervals();
    case 'getTimes':
      return getTimes();
    case 'getFoodSeverities':
      return getFoodSeverities();
    case 'getTimeoutUnits':
      return getTimeoutUnits();
    case 'getPregnancySeverities':
      return getPregnancySeverities();
    case 'getPediatricSeverities':
      return getPediatricSeverities();
    case 'getInfantSeverities':
      return getInfantSeverities();
    case 'getExcretionSeverities':
      return getExcretionSeverities();
    case 'getLactationSeverities':
      return getLactationSeverities();
    case 'getGeriatricSeverities':
      return getGeriatricSeverities();
    case 'getSideEffectSeverities':
      return getSideEffectSeverities();
    case 'getSideEffectFrequencies':
      return getSideEffectFrequencies();
    default:
      return isArray(setting?.selectList) ? setting.selectList : [];
  }
}
