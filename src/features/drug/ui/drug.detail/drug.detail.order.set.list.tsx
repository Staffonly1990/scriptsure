import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ChevronDoubleRightIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';

import { IOrderset, IOrdersetSequence } from 'shared/api/orderset';
import Button from 'shared/ui/button';

interface IDrugDetailOrderSetList {
  select?: JSX.Element;
  orderset?: Partial<IOrderset>;
  getSequence: (orderset: Partial<IOrdersetSequence>) => void;
}

const DrugDetailOrderSetList: FC<IDrugDetailOrderSetList> = observer(({ select, orderset, getSequence }) => {
  return (
    <div className="py-1">
      {select && <div className="py-1">{select ?? null}</div>}

      {orderset && <div className="font-bold py-1">{orderset.comment}</div>}

      <div className="py-1">
        <ul className="divide-y divide-gray-200">
          {orderset?.OrdersetSequences?.map((sequence) => (
            <li className="p-4 flex items-center justify-between">
              <div>
                <div className="font-bold">{sequence.name}</div>
                <div>{sequence.detail}</div>
                <div className="text-gray-500">{sequence.description}</div>
              </div>
              <Button
                onClick={() => {
                  getSequence(sequence);
                }}
                color="gray"
                variant="flat"
                shape="circle"
              >
                <ChevronDoubleRightIcon className="w-6 h-6" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

DrugDetailOrderSetList.displayName = 'DrugDetailOrderSetList';
export default DrugDetailOrderSetList;
