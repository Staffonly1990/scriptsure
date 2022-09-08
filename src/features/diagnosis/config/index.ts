export const editTypeStatus: { value: string; label: string }[] = [
  { value: '0', label: 'unknown' },
  { value: '1', label: 'acute' },
  { value: '2', label: 'chronic' },
  { value: '3', label: 'temporary' },
  { value: '4', label: 'permanent' },
  { value: '5', label: 'selfLimiting' },
  { value: '6', label: 'terminal' },
  { value: '7', label: 'other' },
  { value: '8', label: 'active' },
  { value: '9', label: 'inactive' },
  { value: '10', label: 'resolved' },
];

export const editProblemTypeStatus: { value: string; conceptId: number; label: string; codingSystem: string }[] = [
  {
    value: '1',
    conceptId: 404684003,
    label: 'finding',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '2',
    conceptId: 409586006,
    label: 'complaint',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '3',
    conceptId: 282291009,
    label: 'diagnosis',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '4',
    conceptId: 64572001,
    label: 'condition',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '5',
    conceptId: 248536006,
    label: 'findingActivity',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '6',
    conceptId: 418799008,
    label: 'symptom',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '7',
    conceptId: 55607006,
    label: 'problem3',
    codingSystem: 'SNOMED-CT',
  },
  {
    value: '8',
    conceptId: 73930000,
    label: 'cognitiveFunctionFinding',
    codingSystem: 'SNOMED-CT',
  },
];

export const terminalStages: { value: string; label: string }[] = [
  { value: '1', label: 'earlyStageOnset' },
  { value: '2', label: 'unspecified' },
];
