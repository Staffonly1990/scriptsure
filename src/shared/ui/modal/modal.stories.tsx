import React from 'react';
import { createGlobalState } from 'react-use';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import Toggle from 'shared/ui/toggle';
import Modal from './modal';

const useDisplayTitle = createGlobalState<boolean>(false);
const useDisplayActions = createGlobalState<boolean>(false);
const useDisplayCustomActions = createGlobalState<boolean>(false);

export default {
  title: 'Shared/Modal',
  component: Modal,
  args: {
    open: false,
    scroll: false,
    keyboard: true,
    hideBackdrop: false,
    onClose: action('onClose'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    open: { control: 'boolean' },
    title: { control: false },
    footer: { control: false },
    scroll: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    hideBackdrop: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Modal>;

const onOk = action('onOk');
const onCancel = action('onCancel');

const Template: ComponentStory<typeof Modal> = ({ onClose, ...args }) => {
  const [{ open }, updateArgs] = useArgs();
  const [isDisplayTitle, setIsDisaplyTitle] = useDisplayTitle();
  const [isDisplayActions, setIsDisaplyActions] = useDisplayActions();
  const [isDisplayCustomActions, setIsDisaplyCustomActions] = useDisplayCustomActions();

  const handleOpen = () => {
    updateArgs({ open: true });
  };

  const handleClose = (value?: boolean) => {
    updateArgs({ open: value ?? false });
    if (onClose) onClose(value ?? false);
  };

  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  const handleOk = () => {
    onOk();
    handleClose();
  };

  const handleDisplayTitle = (value) => setIsDisaplyTitle(value);

  const handleDisplayAction = (value) => {
    setIsDisaplyCustomActions(false);
    setIsDisaplyActions(value);
  };

  const handleDisplayCustomAction = (value) => {
    setIsDisaplyCustomActions(value);
    setIsDisaplyActions(false);
  };

  const header = isDisplayTitle ? (
    <Modal.Header>
      <Modal.Title as="h5" className="title text-white">
        Title
      </Modal.Title>
    </Modal.Header>
  ) : undefined;
  let footer;
  if (isDisplayActions) {
    footer = <Modal.Actions onOk={handleOk} onCancel={handleCancel} />;
  } else if (isDisplayCustomActions) {
    footer = (
      <div className="px-3 py-3 sm:px-4 sm:py-2.5 sm:flex sm:justify-between">
        <Button className="w-full sm:ml-3 sm:w-auto" variant="flat" shape="smooth" color="blue" type="button" onClick={handleCancel}>
          Close
        </Button>
        <Button className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto" variant="filled" shape="smooth" color="green" type="button" onClick={handleOk}>
          Submit
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div>
          <fieldset className="form-group __row">
            <Toggle.Group as="span" className="form-control-label __end">
              <Toggle className="form-toggle" checked={isDisplayTitle} onChange={handleDisplayTitle} />
              <Toggle.Label as="span" className="form-control-label_label">
                With `title`
              </Toggle.Label>
            </Toggle.Group>

            <Toggle.Group as="span" className="form-control-label __end">
              <Toggle className="form-toggle" checked={isDisplayActions} onChange={handleDisplayAction} />
              <Toggle.Label as="span" className="form-control-label_label">
                With `actions`
              </Toggle.Label>
            </Toggle.Group>

            <Toggle.Group as="span" className="form-control-label __end">
              <Toggle className="form-toggle" checked={isDisplayCustomActions} onChange={handleDisplayCustomAction} />
              <Toggle.Label as="span" className="form-control-label_label">
                With custom `actions`
              </Toggle.Label>
            </Toggle.Group>
          </fieldset>
        </div>

        <div>
          <Button variant="outlined" shape="smooth" color="gray" onClick={handleOpen}>
            Trigger
          </Button>
        </div>
      </div>

      <Modal {...args} open={open} onClose={handleClose}>
        {header}
        <Modal.Body>Text here...</Modal.Body>
        {footer}
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
