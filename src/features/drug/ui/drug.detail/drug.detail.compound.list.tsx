import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ExclamationIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';

import { ICompoundObject, ICompound } from 'shared/api/compound';
import { map } from 'lodash';

interface IDrugDetailCompoundList {
  compound?: Partial<ICompoundObject>;
  select?: JSX.Element;
}

const DrugDetailCompoundList: FC<IDrugDetailCompoundList> = observer(({ compound, select }) => {
  return (
    <div className="border p-2">
      {compound && (
        <>
          <div className="p-2 font-bold">
            {map(compound.Compounds, (subCompound) =>
              map(subCompound.CompoundDrugs, (drug) => (
                <div>{`${drug.drugName ?? ''} 
            ${drug.line1 ?? ''} 
            ${drug.quantity ?? ''} 
            ${drug?.QuantityQualifier?.name}`}</div>
              ))
            )}
          </div>
          <div className="p-2 font-bold">
            {map(compound.Compounds, (subCompound) => (
              <div>{`${subCompound?.compoundQuantity} 
            ${subCompound?.QuantityQualifier?.name}`}</div>
            ))}
          </div>
          <div className="p-2">{compound.Compounds?.map((subCompound) => map(subCompound.CompoundSigs, (sig) => <div>{sig.line3}</div>))}</div>
        </>
      )}
      <div className="p-2">{select ?? null}</div>
    </div>
  );
});

DrugDetailCompoundList.displayName = 'DrugDetailCompoundList';
export default DrugDetailCompoundList;
