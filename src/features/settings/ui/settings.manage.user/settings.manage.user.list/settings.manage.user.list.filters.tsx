import React, { FC, useState } from 'react';
import Button from 'shared/ui/button/button';
import { observer } from 'mobx-react-lite';
import Popper from 'shared/ui/popper';
import { useIntl } from 'react-intl';

interface IManageFilter {
  toggleInput: (value: string) => void;
  toggleCheckedFilter: (value: any[]) => void;
}

const SettingsManageUserListFilters: FC<IManageFilter> = observer(({ toggleInput, toggleCheckedFilter }) => {
  const [checked, setChecked] = useState<any[]>([]);
  const intl = useIntl();

  const toggleCheckbox = (group, variant) => {
    const sameCheckbox = !!checked.find((item) => item.type === variant);
    const reduceCheckbox = checked.filter((item) => item.type !== variant);
    const selectedFilter = sameCheckbox ? reduceCheckbox : [...checked, { title: group, type: variant }];
    setChecked(selectedFilter);
    toggleCheckedFilter(selectedFilter);
  };
  const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target;
    toggleInput(inputValue.value.toLowerCase());
  };
  const clearSearch = () => {
    setChecked([]);
    toggleCheckedFilter([]);
  };
  const findChecked = (itemChecked) => {
    const checkedItem = checked.find((item) => item.type === itemChecked);
    return !!checkedItem;
  };
  const filterUser = [
    { title: 'status of user', type: ['All', 'Active', 'Inactive', 'Pending'] },
    { title: 'type of user', type: ['All users', 'Administrators', 'Providers', 'Supporting Users'] },
  ];
  return (
    <div>
      <input type="text" className="shadow-lg form-input my-3" placeholder="Search user name" onChange={(event) => changeInput(event)} />
      <Popper
        placement="bottom-start"
        title={
          <Popper.Title className="flex justify-between items-center">
            <Button color="gray" variant="outlined" onClick={clearSearch}>
              {intl.formatMessage({ id: 'reports.measures.clear' })}
            </Button>
            <span className="my-2 mx-5">{intl.formatMessage({ id: 'filters' })}</span>
            {/* <Button shape="round">Done</Button> */}
          </Popper.Title>
        }
        content={filterUser.map((item) => {
          return (
            <>
              <Popper.Content>
                <div className="flex items-center justify-between space-x-2">
                  <span className="uppercase">{item.title}</span>
                </div>
              </Popper.Content>
              {item.type.map((variant) => {
                return (
                  <Popper.Listbox className="bg-gray-100">
                    <>
                      <Popper.ListboxItem as="label">
                        <input
                          className="form-checkbox m-0 mr-4"
                          type="checkbox"
                          checked={findChecked(variant)}
                          onChange={() => toggleCheckbox(item.title, variant)}
                        />
                        {variant}
                      </Popper.ListboxItem>
                    </>
                  </Popper.Listbox>
                );
              })}
            </>
          );
        })}
      >
        <Button variant="outlined" shape="smooth" color="gray" className="w-60 h-7 mx-2 my-2">
          {intl.formatMessage({ id: 'filters' })}
        </Button>
      </Popper>
    </div>
  );
});

SettingsManageUserListFilters.displayName = 'SettingsManageUserListFilters';
export default SettingsManageUserListFilters;
