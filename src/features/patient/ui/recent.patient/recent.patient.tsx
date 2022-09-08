import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { RefreshIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react-lite';
import { useIntl } from 'react-intl';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';
import Dropdown from 'shared/ui/dropdown';
import { recentPatientsStore } from '../../model';
import styles from './recent.patient.module.css';

const RecentPatient: FC = observer(() => {
  const intl = useIntl();
  const list = recentPatientsStore.list.map((res) => (
    <div>
      <Button as={NavLink} className={styles.btn} to={res.href}>
        {res.patient}
      </Button>
    </div>
  ));

  return (
    <Dropdown placement="bottom-start" list={list}>
      <Tooltip content={intl.formatMessage({ id: 'home.lookupRecentPatients' })}>
        <Button color="gray" variant="flat" shape="circle" disabled={!recentPatientsStore.list.length}>
          <RefreshIcon className="w-6 h-6" />
        </Button>
      </Tooltip>
    </Dropdown>
  );
});

RecentPatient.displayName = 'RecentPatient';
export default RecentPatient;
