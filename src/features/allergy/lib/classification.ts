import { IAllergy } from 'shared/api/allergy';

export function getResultClassText(allergyType: IAllergy['allergyType']) {
  let classification: string;
  switch (allergyType) {
    case '0':
      classification = 'INGREDIENT';
      break;
    case '1':
      classification = 'DRUG_BRAND';
      break;
    case '2':
      classification = 'DRUG_GENERIC';
      break;
    default:
      classification = 'CLASS';
      break;
  }
  return classification;
}
