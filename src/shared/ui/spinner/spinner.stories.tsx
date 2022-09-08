import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import 'app/styles/tailwind.css';
import Spinner from './spinner';

export default {
  title: 'Shared/Spinner',
  component: Spinner,
  argTypes: {
    block: { control: 'boolean' },
    component: { control: false },
  },
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Default = Template.bind({});

export const Sickle = Template.bind({});
Sickle.args = { component: Spinner.Sickle };

export const Disk = Template.bind({});
Disk.args = { component: Spinner.Disk };

export const Dots = Template.bind({});
Dots.args = { component: Spinner.Dots };

export const Loader = Template.bind({});
Loader.args = { component: Spinner.Loader };

export const LoaderWithCustomSize = Template.bind({});
LoaderWithCustomSize.args = { component: Spinner.Loader, className: `w-24 h-24`, size: null };

export const ReactLoader = Template.bind({});
ReactLoader.args = { component: Spinner.ReactLoader };
