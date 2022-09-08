import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';

import Button from 'shared/ui/button';
import { XIcon, CollectionIcon, MenuAlt3Icon } from '@heroicons/react/outline';
import Popper from 'shared/ui/popper';
import ModalItem from './modal.item';

import { IPrescribe } from 'shared/api/user';
import { IPractice } from 'shared/api/practice';
import { ONameModalsType } from 'shared/api/message';
import Autocomplete from 'shared/ui/autocomplete/autocomplete';
import { messageStore } from '../../model';

export interface IModalProps {
  title: ONameModalsType | string;
  show: boolean;
  handleClose: () => void;
  onOpen: () => void;
  selectAll: () => void;
  setValueSearchItems: (value: string) => void;
  clearAll: () => void;
  clearSearchItemsFilterModal: () => void;
  deleteOne: (removeId: number) => void;
  onSelect: (value: string) => void;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  list: IPractice[] | IPrescribe[];
  searchItemsFilterModal: IPractice[] | IPrescribe[];
}

const FilterModal: FC<IModalProps> = observer(
  ({
    title,
    searchItemsFilterModal,
    clearSearchItemsFilterModal,
    show,
    setValueSearchItems,
    handleClose,
    onOpen,
    list,
    children,
    selectAll,
    clearAll,
    deleteOne,
    onSelect,
  }: IModalProps) => {
    const { formatMessage } = useIntl();
    return (
      <Popper
        open={show}
        onClose={show ? handleClose : undefined}
        onOpen={!show ? onOpen : undefined}
        content={
          <div className="w-80 z-50 shadow max-h-[30rem] overflow-y-hidden flex flex-col bg-primary">
            <div className="flex flex-nowrap items-center justify-between w-full px-4 py-2.5 bg-blue-500">
              <Button className="!text-xl" variant="flat" shape="smooth" color="white">
                {formatMessage({ id: `measures.${title}` })}
              </Button>
              <Button className="!text-md" variant="flat" shape="smooth" color="white" onClick={handleClose}>
                <XIcon className="w-6 h-6" />
                <span className="uppercase">{formatMessage({ id: 'measures.close' })}</span>
              </Button>
            </div>
            <div className="flex flex-nowrap items-center justify-start w-full px-4 py-2.5 bg-blue-400">
              <Button className="!text-md" variant="flat" shape="smooth" color="white" onClick={selectAll}>
                <CollectionIcon className="w-6 h-6 mr-2" />
                <span className="uppercase">{formatMessage({ id: 'messages.selectAll' })}</span>
              </Button>
              <Button className="!text-md" variant="flat" shape="smooth" color="white" onClick={clearAll}>
                <MenuAlt3Icon className="w-6 h-6 mr-2" />
                <span className="uppercase">{formatMessage({ id: 'reports.measures.clear' })}</span>
              </Button>
            </div>
            <div className="form-control py-2 px-4 w-full">
              <Autocomplete onSelect={onSelect}>
                <Popper
                  className="w-72 max-h-[20rem] overflow-y-auto"
                  trigger="focus"
                  onClose={clearSearchItemsFilterModal}
                  content={
                    <>
                      {searchItemsFilterModal.length > 0 ? (
                        <Popper.Listbox>
                          {searchItemsFilterModal.map((suggestion) => {
                            return (
                              <Popper.ListboxItem
                                as={Autocomplete.Option}
                                key={suggestion.id}
                                value={suggestion.prescribingName || `${suggestion.lastName}, ${suggestion.firstName}`}
                                dismissed
                              />
                            );
                          })}
                        </Popper.Listbox>
                      ) : (
                        <Popper.Content>
                          <span>{formatMessage({ id: 'diagnosis.measures.noMatch' })}</span>
                        </Popper.Content>
                      )}
                    </>
                  }
                >
                  {({ ref }) => (
                    <span className="inline-flex relative">
                      <Autocomplete.Input
                        ref={ref}
                        className="form-input placeholder-search placeholder-gray-500 shadow sm:text-lg w-full"
                        onChange={(e) => setValueSearchItems(e.target.value)}
                      />
                      {messageStore.valueSearchItems && (
                        <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                          <Autocomplete.Reset className="w-4 h-4" onClick={() => setValueSearchItems(' ')} />
                        </span>
                      )}
                    </span>
                  )}
                </Popper>
              </Autocomplete>
            </div>
            <div className="h-full overflow-y-scroll min-h-[10rem]">
              {list?.map((item) => (
                <ModalItem item={item} title={title} deleteOne={deleteOne} />
              ))}
            </div>
          </div>
        }
      >
        {children}
      </Popper>
    );
  }
);

FilterModal.displayName = 'FilterModal';
export default FilterModal;
