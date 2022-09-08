import React, { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';
import { useNotifier } from 'react-headless-notifier';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { ReplyIcon, ViewGridAddIcon, ViewGridIcon } from '@heroicons/react/outline';
import { IPharmacy, IPharmacyFilter } from 'shared/api/patient';
import Button from 'shared/ui/button';
import Modal from 'shared/ui/modal/modal';
import Alert from 'shared/ui/alert';
import { patientModel, patientPharmacyModel, PharmacyPreferredList, PharmacyCommonList, PharmacyFilterInput, PharmacySearchList } from 'features/patient';
import { userModel } from 'features/user';
import { orderSet } from 'features/order.set/model';

/**
 * @view ChartPharmacy
 */

const specialties = [
  { code: 'Retail', name: 'retail' },
  { code: 'MailOrder', name: 'mailOrder' },
  { code: 'TwentyFourHourStore', name: '24hours' },
  { code: 'SupportsDigitalSignature', name: 'controlledSubstance' },
  { code: 'LongTermCare', name: 'longTermCare' },
  { code: 'Specialty', name: 'specialty' },
  { code: 'FaxPharmacySurescripts', name: 'faxAccepted' },
];

const defaultValues = {
  ncpdpid: '',
  businessName: '',
  addressLine1: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  fax: '',
  specialties: ['Retail', 'Mail Order'],
};

interface IChartPharmacyView {
  selectClick?: () => void;
}

const ChartPharmacyView: FC<IChartPharmacyView> = observer(({ selectClick }) => {
  const { register, getValues, reset, control } = useForm<IPharmacyFilter>({
    defaultValues,
  });
  const { notify } = useNotifier();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirmDeletePharmacy, setConfirmDeletePharmacy] = useState<{ show: boolean; pharmacy: null | IPharmacy }>({
    show: false,
    pharmacy: null,
  });

  const [confirmDeleteCommon, setConfirmDeleteCommon] = useState<{ show: boolean; common: null | IPharmacy }>({
    show: false,
    common: null,
  });
  const intl = useIntl();

  useEffect(() => {
    if (!patientPharmacyModel.notify) return;
    notify(
      <Alert.Notification shape="smooth" color="green" border closable>
        {patientPharmacyModel.notify}
      </Alert.Notification>
    );
  }, [patientPharmacyModel.notify]);

  useEffect(() => {
    const practiceId = userModel?.data?.currentPractice?.id;
    if (practiceId) patientPharmacyModel.getCommon(practiceId);
  }, [userModel?.data?.currentPractice]);

  useEffect(() => {
    const chartId = patientModel.currentPatient?.chartId;
    const patientId = patientModel.currentPatient?.patientId;
    if (chartId || patientId) patientPharmacyModel.getPharmacies(chartId || patientId);
  }, [patientModel.currentPatient]);

  const handleClear = useCallback((e) => {
    e.preventDefault();
    reset(defaultValues);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    patientPharmacyModel.setPharmacyFilter(getValues());
    patientPharmacyModel.search(false);
  }, []);

  const handleAdvanced = useCallback(
    (e) => {
      e.preventDefault();
      setShowAdvanced(!showAdvanced);
    },
    [showAdvanced]
  );

  const deletePatientPreferred = useCallback((pharmacy) => {
    patientPharmacyModel.deletePatientPreferred(pharmacy);

    setConfirmDeletePharmacy({
      show: false,
      pharmacy: null,
    });
  }, []);

  return (
    <>
      <Modal open={confirmDeletePharmacy.show}>
        <Modal.Body>{intl.formatMessage({ id: 'pharmacy.sureRemove' })}</Modal.Body>
        <div className="flex justify-end px-6">
          <Button
            className="mb-3 mr-1 uppercase"
            onClick={() => {
              setConfirmDeletePharmacy({
                show: false,
                pharmacy: null,
              });
            }}
          >
            {intl.formatMessage({ id: 'measures.close' })}
          </Button>
          <Button
            className="mb-3 ml-1 uppercase"
            onClick={() => {
              deletePatientPreferred(confirmDeletePharmacy.pharmacy);
            }}
          >
            {intl.formatMessage({ id: 'yes' })}
          </Button>
        </div>
      </Modal>
      <Modal open={confirmDeleteCommon.show}>
        <Modal.Body>{intl.formatMessage({ id: 'pharmacy.sureRemoveCommon' })}</Modal.Body>
        <div className="flex justify-end px-6">
          <Button
            className="mb-3 mr-1 uppercase"
            onClick={() => {
              setConfirmDeleteCommon({
                show: false,
                common: null,
              });
            }}
          >
            {intl.formatMessage({ id: 'measures.close' })}
          </Button>
          <Button
            className="mb-3 ml-1 uppercase"
            onClick={() => {
              deletePatientPreferred(confirmDeletePharmacy.pharmacy);
            }}
          >
            {intl.formatMessage({ id: 'yes' })}
          </Button>
        </div>
      </Modal>
      <div className={cx('flex', patientPharmacyModel.isSearch ? 'flex-col' : 'flex-col xl:flex-row')}>
        <div className="flex flex-col overflow-x-scroll">
          <div className="mr-0 lg:mr-1 overflow-x-scroll pb-8">
            <form className="flex flex-col">
              <div className="flex p-1 lg:items-end">
                <PharmacyFilterInput label={intl.formatMessage({ id: 'pharmacy.name' })} id="businessName" register={register} />
              </div>
              <div className="flex flex-col lg:items-end p-1 lg:flex-row">
                <PharmacyFilterInput label={intl.formatMessage({ id: 'demographics.measures.address' })} id="addressLine1" register={register} />
                <PharmacyFilterInput
                  label={intl.formatMessage({ id: 'demographics.measures.zip' })}
                  id="zipCode"
                  type="text"
                  maxLength={5}
                  register={register}
                />
                <PharmacyFilterInput label={intl.formatMessage({ id: 'demographics.measures.city' })} id="city" register={register} />
                <PharmacyFilterInput id="state" isSelect register={register} control={control} />
                <PharmacyFilterInput
                  type="text"
                  autoComplete="on"
                  placeholder="(___) ___-____"
                  isMask
                  id="phone"
                  label={intl.formatMessage({ id: 'sheet.phone' })}
                  options={{ mask: '(999) 999-9999' }}
                  register={register}
                />
                <div className="flex gap-4 mb-2 lg:mb-0 h-[min-content]">
                  <div className="shadow">
                    <Button variant="filled" color="green" shape="smooth" onClick={handleSearch} className="w-20 !text-primary">
                      {intl.formatMessage({ id: 'home.search' })}
                    </Button>
                  </div>
                  <div className="shadow">
                    <Button variant="flat" color="white" shape="smooth" className="!text-black bg-white" onClick={handleClear}>
                      <ReplyIcon className="w-5 h-5 lg:mr-2" />
                      <span className="hidden lg:block">{intl.formatMessage({ id: 'reports.measures.clear' })}</span>
                    </Button>
                  </div>
                  <div className="shadow">
                    <Button variant="flat" color="white" shape="smooth" className="!text-black bg-white" onClick={handleAdvanced}>
                      {showAdvanced ? <ViewGridIcon className="w-5 h-5" /> : <ViewGridAddIcon className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
              {showAdvanced && (
                <div className="flex flex-col lg:items-end p-1 lg:flex-row">
                  <PharmacyFilterInput
                    type="text"
                    autoComplete="on"
                    label={intl.formatMessage({ id: 'pharmacy.fax' })}
                    placeholder="(___) ___-____"
                    isMask
                    id="fax"
                    options={{ mask: '(999) 999-9999' }}
                    register={register}
                  />
                  <div className="flex flex-col w-1/2 lg:w-auto mb-2 lg:mr-2 lg:mb-0">
                    <label className="form-label" htmlFor="specialties">
                      {intl.formatMessage({ id: 'pharmacy.specialty' })}
                    </label>
                    <select {...register('specialties')} name="specialties[]" id="specialties" multiple>
                      {specialties.map((element, index) => (
                        <option selected={index === 1} value={element.code}>
                          {intl.formatMessage({ id: `pharmacy.${element.name}` })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <PharmacyFilterInput label={intl.formatMessage({ id: 'pharmacy.ncpdpId' })} id="ncpdpid" register={register} />
                </div>
              )}
            </form>
          </div>

          {!patientPharmacyModel.isSearch && patientModel.currentPatient && (
            <PharmacyPreferredList
              pharmacies={patientPharmacyModel.pharmacies}
              deletePatientPreferred={(pharmacy) =>
                setConfirmDeletePharmacy({
                  show: true,
                  pharmacy,
                })
              }
              setDefault={patientPharmacyModel.setDefault}
              isPrescription={patientPharmacyModel.isPrescription}
              selectPharmacy={(common) => {
                patientPharmacyModel.selectPharmacy(common, patientPharmacyModel.isPrescription);
                orderSet.changeSelectedOrderSet(null, common);
                if (selectClick) {
                  selectClick();
                }
              }}
              status={patientPharmacyModel.status.search}
            />
          )}
        </div>
        {!patientPharmacyModel.isSearch && !!patientPharmacyModel.common.length && !patientPharmacyModel.hideCommon && (
          <PharmacyCommonList
            deleteCommon={patientPharmacyModel.deleteCommon}
            addPatientPreferred={patientPharmacyModel.addPatientPreferred}
            common={patientPharmacyModel.common}
            currentPatient={patientModel.currentPatient}
            editCommonMode={patientPharmacyModel.editCommonMode}
            handleSort={patientPharmacyModel.setSort}
            setEditCommonMode={patientPharmacyModel.setEditCommonMode}
            setIsSelect={patientPharmacyModel.setIsSelect}
            searchCommon={patientPharmacyModel.searchCommon}
            searchCommons={patientPharmacyModel.searchCommons}
            isPrescription={patientPharmacyModel.isPrescription}
            selectPharmacy={(common) => {
              patientPharmacyModel.selectPharmacy(common, patientPharmacyModel.isPrescription);
              orderSet.changeSelectedOrderSet(null, common);
              if (selectClick) {
                selectClick();
              }
            }}
          />
        )}
        {patientPharmacyModel.isSearch && (
          <PharmacySearchList
            hideCommon={patientPharmacyModel.hideCommon}
            addPatientPreferred={patientPharmacyModel.addPatientPreferred}
            currentPatient={patientModel.currentPatient}
            searchPharmacies={patientPharmacyModel.searchPharmacies}
            isPrescription={patientPharmacyModel.isPrescription}
            selectPharmacy={(common) => {
              patientPharmacyModel.selectPharmacy(common, patientPharmacyModel.isPrescription);
              orderSet.changeSelectedOrderSet(null, common);
              if (selectClick) {
                selectClick();
              }
            }}
            addCommon={patientPharmacyModel.addCommon}
            goBack={patientPharmacyModel.setIsSearch}
          />
        )}
      </div>
    </>
  );
});
ChartPharmacyView.displayName = 'ChartPharmacyView';

export default ChartPharmacyView;
