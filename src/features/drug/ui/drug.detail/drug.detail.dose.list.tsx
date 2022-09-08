import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ExclamationIcon, XIcon, PlusIcon, CurrencyDollarIcon, MenuIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';

import { IFormat, ISig } from 'shared/api/drug';

import { useIntl } from 'react-intl';
import Tooltip from 'shared/ui/tooltip';
import Popper from 'shared/ui/popper';
import Button from 'shared/ui/button';

interface IDrugDetailDoseList {
  selectDifferentDose?: JSX.Element;
  formats?: Partial<IFormat>[];
  renderSigs: (sigs: ISig[]) => JSX.Element[];
  noCoupon: number;
  createYourOwnFormat: () => void;
  liDrugDoses?: JSX.Element[];
}

const DrugDetailDoseList: FC<IDrugDetailDoseList> = observer(({ selectDifferentDose, formats, createYourOwnFormat, renderSigs, noCoupon, liDrugDoses }) => {
  const intl = useIntl();
  return (
    <div className="my-3">
      {selectDifferentDose ?? null}

      {formats?.length && (
        <ul>
          {formats?.map((dose) => (
            <Popper
              title={
                <Popper.Title>
                  <div className="text-lg">Formats</div>
                  <Button onClick={createYourOwnFormat} color="green">
                    <PlusIcon className="w-6 h-6 mr-1" />
                    <span>CREATE YOUR OWN FORMAT</span>
                  </Button>
                </Popper.Title>
              }
              content={renderSigs(dose.sigs ?? [])}
            >
              <li className="hover:bg-gray-200 cursor-pointer p-2 justify-between flex items-center">
                <div>{dose.line1}</div>
                {dose.sigs?.[0].coupon?.offerId && noCoupon !== 1 && (
                  <Tooltip content={`Coupon Offer: ${dose.sigs?.[0].coupon.description}`}>
                    <div>
                      <CurrencyDollarIcon color="green" className="w-6 h-6" />
                    </div>
                  </Tooltip>
                )}
              </li>
            </Popper>
          ))}
        </ul>
      )}

      {liDrugDoses?.length && <ul>{liDrugDoses}</ul>}

      {!formats?.length && !liDrugDoses?.length && (
        <div className="border p-3 flex items-center">
          <div className="max-w-1/4 w-full pr-3">
            <MenuIcon color="gray" />
          </div>
          <span>{intl.formatMessage({ id: 'drug.detail.not.available' })}</span>
        </div>
      )}
    </div>
  );
});

DrugDetailDoseList.displayName = 'DrugDetailDoseList';
export default DrugDetailDoseList;
