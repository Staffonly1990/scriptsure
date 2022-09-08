import { useState } from 'react';
import { allergyEntity } from '../model';

/**
 * @hook useAllergyEntity
 */
const useAllergyEntity = () => {
  const [entity] = useState(() => allergyEntity);
  return entity;
};

export default useAllergyEntity;
