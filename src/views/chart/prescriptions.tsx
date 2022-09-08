import React, { FC } from 'react';
import { DrugSearch } from 'features/drug';

import { useRouter } from 'shared/hooks';

/**
 * @view ChartPrescriptions
 */
const ChartPrescriptionsView: FC = () => {
  return <DrugSearch />;
};

ChartPrescriptionsView.displayName = 'ChartPrescriptionsView';
export default ChartPrescriptionsView;
