import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Button from 'shared/ui/button';
import ReportsMenuDateSelect from './reports.menu.date.select';

interface IReportsAudit {
  isSelect: string;
  toggleSelect: (value: string) => void;
}
const ReportsMenuAudit: FC<IReportsAudit> = observer(({ isSelect, toggleSelect }) => {
  const intl = useIntl();
  const handleSubmit = () => {};
  const toggleSelectDate = (value) => {
    toggleSelect(value);
  };
  return (
    <div className="flex justify-between mx-3 my-5">
      <div className="flex flex-wrap items-end">
        <ReportsMenuDateSelect isSelect={isSelect} toggleSelect={toggleSelectDate} />
      </div>
      <Button className="uppercase" color="green" onClick={handleSubmit}>
        {intl.formatMessage({ id: 'measures.submit' })}
      </Button>
    </div>
  );
});

ReportsMenuAudit.displayName = 'ReportsMenuAudit';

export default ReportsMenuAudit;
