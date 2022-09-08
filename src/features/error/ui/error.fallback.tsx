import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { FallbackProps } from 'react-error-boundary';

const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { formatMessage } = useIntl();
  return (
    <div role="alert">
      <p>{formatMessage({ id: 'error.somethingWentWrong' })}:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>{formatMessage({ id: 'error.tryAgain' })}</button>
    </div>
  );
};
ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;
