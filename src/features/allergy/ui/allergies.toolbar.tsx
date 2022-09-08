import React, { FC, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { ClockIcon } from '@heroicons/react/outline';

import Dropdown from 'shared/ui/dropdown';
import Button from 'shared/ui/button';
import { allergyStore } from '../model';

const AllergiesToolbar: FC = () => {
  const intl = useIntl();
  const setHistoryValue = useCallback((value) => {
    runInAction(() => {
      allergyStore.historyValue = value;
    });
  }, []);

  const title = useMemo(() => {
    switch (allergyStore.historyValue) {
      case 'active':
        return intl.formatMessage({ id: 'allergies.measures.currentAllergies' });
      case 'inactive':
        return intl.formatMessage({ id: 'allergies.measures.inactiveAllergies' });
      case 'archived':
        return intl.formatMessage({ id: 'allergies.measures.archiveAllergies' });
      case null:
      default:
        return intl.formatMessage({ id: 'allergies.measures.allAllergies' });
    }
  }, [allergyStore.historyValue, intl]);

  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
      <Dropdown
        list={[
          <Dropdown.Item onClick={() => setHistoryValue(null)}>{intl.formatMessage({ id: 'measures.all' })}</Dropdown.Item>,
          <Dropdown.Item onClick={() => setHistoryValue('active')}>{intl.formatMessage({ id: 'measures.current' })}</Dropdown.Item>,
          <Dropdown.Item onClick={() => setHistoryValue('inactive')}>{intl.formatMessage({ id: 'diagnosis.measures.inactive' })}</Dropdown.Item>,
          <Dropdown.Item onClick={() => setHistoryValue('archived')}>{intl.formatMessage({ id: 'measures.archived' })}</Dropdown.Item>,
        ]}
        placement="bottom-start"
      >
        <Button variant="filled" shape="circle" color="blue">
          <ClockIcon className="w-5 h-5" />
        </Button>
      </Dropdown>
    </div>
  );
};
AllergiesToolbar.displayName = 'AllergiesToolbar';

export default observer(AllergiesToolbar);
