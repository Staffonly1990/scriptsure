import React, { FC, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './drugs.abc.list.module.css';

interface IDrugsABCList {
  drugList: JSX.Element[];
}

const DrugsABCList: FC<IDrugsABCList> = observer(({ drugList }) => {
  return (
    <div className="relative overflow-auto">
      <div className={styles.grid}>{drugList}</div>
    </div>
  );
});

DrugsABCList.displayName = 'DrugsABCList';
export default DrugsABCList;
