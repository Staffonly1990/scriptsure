import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Modal from 'shared/ui/modal';
import { IComment } from 'shared/api/comment';
import Button from 'shared/ui/button';
import { TrashIcon, PencilIcon } from '@heroicons/react/solid';

interface IOrdersetExecuteAnnotation {
  open: boolean;
  handleClose: () => void;
  title: string;
  listAnnotations: IComment[];
  deleteAnnotation: (annotation: IComment) => void;
  modifyAnnotation: (annotation: IComment) => void;
}

const OrdersetExecuteAnnotation: FC<IOrdersetExecuteAnnotation> = observer(
  ({ open, handleClose, title, listAnnotations, deleteAnnotation, modifyAnnotation }) => {
    const [localAnnotation, setAnnotation] = useState<IComment>(listAnnotations[0]);

    const header = (
      <Modal.Header>
        <Modal.Title as="h5" className="title text-white">
          {title}
        </Modal.Title>
      </Modal.Header>
    );

    const body = (
      <div className="flex h-full">
        <div className="w-1/2 max-w-1/2 border p-3">
          <ul className="divide-y divide-gray-200">
            {listAnnotations.map((annotation) => (
              <li
                onClick={() => {
                  setAnnotation(annotation);
                }}
                onKeyDown={() => {
                  setAnnotation(annotation);
                }}
                role="presentation"
                className="cursor-pointer hover:bg-gray-300 flex justify-between items-center"
              >
                <div>{annotation.name}</div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => {
                      deleteAnnotation(annotation);
                    }}
                    variant="flat"
                    shape="circle"
                    color="blue"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={() => {
                      modifyAnnotation(annotation);
                    }}
                    variant="flat"
                    shape="circle"
                    color="blue"
                  >
                    <PencilIcon className="w-6 h-6" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 max-w-1/2 p-3">
          <div className="flex">123</div>
        </div>
      </div>
    );

    const footer = <div>footer</div>;

    return (
      <Modal open={open} onClose={handleClose}>
        {header}
        <Modal.Body className="h-96 max-h-96 !p-1">{body}</Modal.Body>
        {footer}
      </Modal>
    );
  }
);

OrdersetExecuteAnnotation.displayName = 'OrdersetExecuteAnnotation';
export default OrdersetExecuteAnnotation;
