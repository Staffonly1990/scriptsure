import React, { FC, memo, useState } from 'react';
// import { useErrorHandler } from 'react-error-boundary';
import { assign } from 'lodash';

import styles from './sample.module.css';
import Child from './sample.child';

function Bomb() {
  throw new Error('💥 CABOOM 💥');
  return null;
}

interface ISampleProps {
  title?: string;
  description?: string;
}

const Sample: FC<ISampleProps> = memo(({ title, description }) => {
  const [explode, setExplode] = useState(false);
  // const handleError = useErrorHandler();

  return (
    <div className={styles.root}>
      {title && <h4>{title}</h4>}
      {description && <p>{description}</p>}
      <input type="text" className="form-input mr-1 rounded text-pink-500" />
      <button
        className={styles.btn}
        onClick={() => {
          setExplode((e) => !e);
          // handleError(new Error('💥 CABOOM 💥'));
        }}
      >
        TODO
      </button>
      {explode ? <Bomb /> : null}
    </div>
  );
});
Sample.displayName = 'Sample';

export default assign(Sample, { Child });
