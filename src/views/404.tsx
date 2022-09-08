import React, { FC, memo } from 'react';
import { useIntl } from 'react-intl';

import { useRouter } from 'shared/hooks';

/**
 * @view NotFound
 */
const NotFoundView: FC = memo(() => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  return (
    <div className="flex flex-col items-center">
      <div className="text-xl">{formatMessage({ id: 'charts.pageNotFound' })}</div>
      <button onClick={() => router.history.goBack()}>{formatMessage({ id: 'pharmacy.back' })}</button>
    </div>
  );
});
NotFoundView.displayName = 'NotFoundView';

export default NotFoundView;
