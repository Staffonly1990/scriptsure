import { ComponentStory, ComponentMeta } from '@storybook/react';
import CollapsedMenu from './collapsed.menu';
import { PencilIcon, ExclamationIcon, PlusIcon, ShieldExclamationIcon, TicketIcon, DocumentAddIcon } from '@heroicons/react/solid';
import { UserIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import React from 'react';

const list = [
  {
    text: 'Prescriptions',
    icon: PencilIcon,
  },
  {
    text: 'Demographics',
    icon: UserIcon,
  },
  {
    text: 'Allergy',
    icon: ExclamationIcon,
  },
  {
    text: 'Pharmacy',
    icon: PlusIcon,
  },
  {
    text: 'Diagnoses',
    icon: ShieldExclamationIcon,
  },
  {
    text: 'Vitals',
    icon: TicketIcon,
  },
  {
    text: 'Notes',
    icon: DocumentAddIcon,
  },
  {
    text: 'Education',
    icon: QuestionMarkCircleIcon,
  },
];

export default {
  title: 'Shared/CollapsedMenu',
  component: CollapsedMenu,
  parameters: { docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-start justify-start w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof CollapsedMenu>;

const Template: ComponentStory<typeof CollapsedMenu> = () => (
  <CollapsedMenu title="CHART NAVIGATION">
    {list.map(({ text, icon }, index) => (
      <CollapsedMenu.Item key={index.toString(36)} text={text} icon={icon} />
    ))}
  </CollapsedMenu>
);

export const Default = Template.bind({});
