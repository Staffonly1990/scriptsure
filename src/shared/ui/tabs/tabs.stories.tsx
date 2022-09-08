import React, { Key, useState } from 'react';
import { map } from 'lodash';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tabs from './tabs';

const tabs = [
  { key: 'FoR', name: 'Founding of Rome', children: 'Arma virumque cano, Troiae qui primus ab oris.' },
  { key: 'MaR', name: 'Monarchy and Republic', children: 'Senatus Populusque Romanus.' },
  { key: 'Emp', name: 'Empire', children: 'Alea jacta est.' },
];

export default {
  title: 'Shared/Tabs',
  component: Tabs,
  args: {
    color: 'blue',
    orientation: 'horizontal',
  },
  argTypes: {
    color: {
      options: ['black', 'white', 'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'],
      control: { type: 'radio' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = ({ ...args }) => {
  return (
    <div>
      <Tabs {...args} aria-label="History of Ancient Rome">
        <Tabs.TabList>
          {map(tabs, ({ key, name }) => (
            <Tabs.Item key={key}>{name}</Tabs.Item>
          ))}
        </Tabs.TabList>
        <Tabs.TabPanels>
          {map(tabs, ({ key, children }) => (
            <Tabs.Item key={key}>{children}</Tabs.Item>
          ))}
        </Tabs.TabPanels>
      </Tabs>
    </div>
  );
};

export const Default = Template.bind({});

const TemplateExtensive: ComponentStory<typeof Tabs> = ({ ...args }) => {
  const [selectedKey, setSelectedKey] = useState<Key>(tabs?.[1]?.key);

  return (
    <div>
      <Tabs
        {...args}
        aria-label="History of Ancient Rome"
        items={tabs}
        selectedKey={selectedKey}
        disabledKeys={[tabs?.[2]?.key]}
        onSelectionChange={setSelectedKey}
        keyboardActivation="manual"
      >
        <Tabs.TabList>{(item: any) => <Tabs.Item>{item.name}</Tabs.Item>}</Tabs.TabList>
        <div>
          <Tabs.TabPanels keep>{(item: any) => <Tabs.Item>{item.children}</Tabs.Item>}</Tabs.TabPanels>
          <Tabs.TabSummary>Text here...</Tabs.TabSummary>
        </div>
      </Tabs>
    </div>
  );
};

export const Extensive = TemplateExtensive.bind({});
