import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

// import 'app/styles/tailwind.css';
import Sample from './sample';

/**
 * @link https://storybook.js.org/docs/react/essentials/controls
 * @link https://storybook.js.org/docs/react/configure/story-layout
 */
export default {
  title: 'Shared/Sample',
  component: Sample,
  argTypes: {
    title: { control: 'text' },
  },
} as ComponentMeta<typeof Sample>;

const Template: ComponentStory<typeof Sample> = (args) => <Sample {...args} />;

export const Default = Template.bind({});

export const WithDescription = Template.bind({});
WithDescription.args = {
  description: 'Text here...',
};
