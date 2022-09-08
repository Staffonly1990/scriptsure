import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { ExclamationIcon, XIcon, PlusIcon } from '@heroicons/react/outline';
import styles from './drug.detail.module.css';
import Button from 'shared/ui/button';
import Offcanvas from 'shared/ui/offcanvas';

interface IDrugDetail {
  open?: boolean;
  onClose?: () => void;
  sideView: number;
  warning?: JSX.Element;
  alternatives?: JSX.Element;
  subTitle: JSX.Element;
  options?: JSX.Element;
  mainTitle?: JSX.Element;
  detailsList?: JSX.Element;
  alternativesBtns?: JSX.Element[];
}

const DrugDetail: FC<IDrugDetail> = observer(
  ({ onClose, open, detailsList, sideView, warning, alternatives, subTitle, options, mainTitle, alternativesBtns }) => {
    const title = (side: number) => {
      switch (side) {
        case 0:
          return 'Drug Details';
        case 1:
          return 'Indication Drugs';
        case 2:
          return 'Compound';
        case 3:
          return 'Order Set';
        default:
          return 'ERROR';
      }
    };

    // ng-if="vm.selectedDrug.interaction || vm.selectedDrug.allergy" - warning
    // ng-if="vm.alternatives.length>0"> - alternatives
    // druglist/favorite

    const header = (
      <div className="w-full flex justify-between items-center">
        <h5 id="offcanvas_label" className="title text-white">
          {title(sideView)}
        </h5>
        <div className="ml-10 flex items-center">
          {warning ?? null}
          {alternatives ?? null}
          <Button onClick={onClose} variant="flat" shape="circle" color="white">
            <XIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );

    const body = (
      <div>
        {mainTitle ?? null}
        {options ?? null}
        {subTitle ?? null}
        {detailsList ?? null}
        {!!alternativesBtns?.length && (
          <div>
            <div className="p-3 bg-blue-500 flex justify-between items-center">
              <span className="text-2xl text-white">Possible Alternative Medications</span>
            </div>
            <div className="py-2">{alternativesBtns}</div>
          </div>
        )}
      </div>
    );

    return (
      <Offcanvas open={open} onClose={onClose} className="!min-w-1/4 !max-w-1/2">
        <Offcanvas.Header className="bg-blue-500">{header}</Offcanvas.Header>
        <Offcanvas.Body id="offcanvas_desc">{body}</Offcanvas.Body>
      </Offcanvas>
    );
  }
);

DrugDetail.displayName = 'DrugDetail';
export default DrugDetail;
