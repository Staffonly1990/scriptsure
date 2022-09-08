import React, { FC, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { lastValueFrom } from 'rxjs';
import moment from 'moment';

import Modal, { IModalProps } from 'shared/ui/modal';
import Button from 'shared/ui/button';
import { IPatient, searchPatient } from 'shared/api/patient';
import { phoneToMask } from 'shared/lib/mask.phone';
import { SearchIcon, UserIcon } from '@heroicons/react/solid';

interface IPatientSearchModalProps extends IModalProps {
  editable: boolean;
  defaultSearchValue?: string;
  onSelect: (e: React.SyntheticEvent, patient: IPatient) => void;
  onClose?: () => void;
}

const SearchPatientModal: FC<IPatientSearchModalProps> = observer(({ onSelect, open, unmount, hideBackdrop, onClose, editable, defaultSearchValue }) => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState<IPatient[]>([]);
  const intl = useIntl();

  const handleChangeInput = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const search = async (value: string) => {
    await lastValueFrom(searchPatient({ query: value })).then((output) => {
      if (output?.response?.results) {
        setList(output.response.results);
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    search(inputValue);
  };

  useEffect(() => {
    if (defaultSearchValue) {
      search(defaultSearchValue);
    }
  }, []);

  useEffect(() => {
    if (defaultSearchValue) setInputValue(defaultSearchValue);
  }, [defaultSearchValue]);

  return (
    <Modal as="form" className="min-h-[20rem] max-h-[40rem] overflow-y-hidden" open={open} unmount={unmount} hideBackdrop={hideBackdrop} onClose={onClose}>
      <Modal.Header className="!bg-green-600">
        <Modal.Title as="h5" className="title text-white">
          {intl.formatMessage({ id: 'pharmacy.patientSearch' })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex">
          <div className="form-control mr-2 w-full lg:w-1/3">
            <input
              className="form-input placeholder-search sm:text-lg"
              placeholder={intl.formatMessage({ id: 'home.enterLastName' })}
              autoComplete="off"
              value={inputValue}
              onChange={handleChangeInput}
            />
            <label className="form-label __hidden">{intl.formatMessage({ id: 'home.enterName' })}</label>
          </div>
          <Button
            className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto uppercase"
            variant="filled"
            shape="smooth"
            color="green"
            type="submit"
            onClick={(e) => handleSearch(e)}
          >
            <SearchIcon className="w-5 h-5" />
            <span>{intl.formatMessage({ id: 'home.search' })}</span>
          </Button>
        </div>
        <div className="h-full mt-[50px] overflow-y-scroll max-h-[20rem]">
          {!!list.length &&
            list.map((patient) => (
              <div className="flex justify-between border-b-2 items-center my-[16px]">
                <div className="flex flex-col text-sm px-[16px]">
                  <div>
                    <span className="font-bold">
                      {patient.lastName || '-'}, {patient.firstName || '-'}
                    </span>
                    <span>{patient.suffix}</span>
                  </div>
                  <span>{moment(patient.dob).format('MM/DD/YYYY')}</span>

                  <span>
                    {patient.addressLine1} {patient.city}, {patient.state} {patient.zip}
                  </span>
                  <span>{phoneToMask(patient.cell || patient.home || patient.work)}</span>
                  <span className="uppercase opacity-50">Chart Id: {patient.chartId || patient.patientId}</span>
                </div>
                <Button className="uppercase" variant="filled" shape="smooth" color="green" type="submit" onClick={(e) => onSelect(e, patient)}>
                  <UserIcon className="w-5 h-5" />
                  <span>{intl.formatMessage({ id: 'measures.select' })}</span>
                </Button>
              </div>
            ))}
        </div>
        {onClose && (
          <div className="flex justify-end mt-[20px]">
            <Button className="uppercase" variant="filled" shape="smooth" color="green" type="submit" onClick={onClose}>
              <span>{intl.formatMessage({ id: 'measures.close' })}</span>
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
});

SearchPatientModal.displayName = 'SearchPatientModal';

export default SearchPatientModal;
