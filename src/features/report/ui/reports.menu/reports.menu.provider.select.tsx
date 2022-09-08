import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import Popper from 'shared/ui/popper';
import { reportsStore } from 'features/report';
import Button from 'shared/ui/button';
import { IProvider } from 'shared/api/report';
import { toJS } from 'mobx';

interface IPatientProviderSelect {
  isSelect: IProvider[];
  toggleSelect: (value: IProvider[]) => void;
}
const ReportsMenuProviderSelect: FC<IPatientProviderSelect> = observer(({ toggleSelect, isSelect }) => {
  const [checked, setChecked] = useState(isSelect);
  const [providers, setProviders] = useState(toJS(reportsStore.providersList) ?? []);
  const intl = useIntl();
  useEffect(() => {
    setProviders(toJS(reportsStore.providersList));
  }, []);
  const changeSelect = (data) => {
    const sameCheckbox = !!checked.find((item) => item.id === data.id);
    const reduceCheckbox = checked.filter((item) => item.id !== data.id);
    const selectedProviders = sameCheckbox ? reduceCheckbox : [...checked, data];
    setChecked(selectedProviders);
    toggleSelect(selectedProviders);
  };

  const findChecked = (itemChecked) => {
    const checkedProviders = checked.find((item) => item.id === itemChecked);
    return !!checkedProviders;
  };
  return (
    <Popper
      title={<Popper.Title>{intl.formatMessage({ id: 'reports.measures.searchProviders' })}</Popper.Title>}
      placement="bottom-end"
      content={
        <div className="w-60 m-2 bg-primary">
          {providers?.length !== 0 ? (
            <Popper.Listbox>
              {providers?.map((item, index) => (
                <Popper.Listbox key={index.toString(36)}>
                  <>
                    <Popper.ListboxItem as="label">
                      <input className="form-checkbox m-0 mr-4" checked={findChecked(item.id)} type="checkbox" onChange={() => changeSelect(item)} />
                      <span className={findChecked(item.id) ? 'text-blue-500' : ''}>{item?.fullName}</span>
                    </Popper.ListboxItem>
                  </>
                </Popper.Listbox>
              ))}
            </Popper.Listbox>
          ) : (
            <Popper.Content>
              <span>{intl.formatMessage({ id: 'reports.measures.noProvidersFound' })}</span>
            </Popper.Content>
          )}
        </div>
      }
    >
      <Button variant="outlined" shape="smooth" color="gray" className="w-60 h-7 mb-2">
        {intl.formatMessage({ id: 'reports.measures.selectProviders' })}
      </Button>
    </Popper>
  );
});

ReportsMenuProviderSelect.displayName = 'ReportsMenuProviderSelect';

export default ReportsMenuProviderSelect;
