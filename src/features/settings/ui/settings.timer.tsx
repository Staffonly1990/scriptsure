import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import MaskFormat from 'shared/ui/mask.format';

const SettingsTimer: FC = observer(() => {
  const [today, setDate] = useState(new Date());
  useEffect(() => {
    setDate(new Date());
  });
  return (
    <div className="text-white m-3">
      <MaskFormat
        textContent={today.toISOString()}
        options={{ alias: 'datetime', inputFormat: 'yyyy-mm-ddThh:MM:ss', outputFormat: 'dd.mm.yyyy hh:MM:ss' }}
        unmasked
      />
    </div>
  );
});

SettingsTimer.displayName = 'SettingsTimer';

export default SettingsTimer;
