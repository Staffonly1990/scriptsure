import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LinkButton from './link.button';

const history = createBrowserHistory();
history.push = action('history.push');

const routes = { home: '/home', profile: '/profile', notFound: '/404' };

export default {
  title: 'Shared/LinkButton',
  component: LinkButton,
  args: {
    onClick: action('onClick'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    to: {
      options: Object.keys(routes),
      mapping: routes,
      control: {
        type: 'select',
        labels: {
          home: 'Home Page',
          profile: 'Profile Page',
          notFound: 'Not Found Page',
        },
      },
    },
  },
  decorators: [
    (Story) => {
      const render = () => Story();
      return (
        <Router history={history}>
          <Route path="*" component={render} />
        </Router>
      );
    },
  ],
  parameters: {
    docs: { source: { type: 'code' } },
  },
} as ComponentMeta<typeof LinkButton>;

const Template: ComponentStory<typeof LinkButton> = ({ to, ...args }) => (
  <LinkButton {...args} to={to}>
    {to ? <>Go to path - {to}</> : 'Not selected path'}
  </LinkButton>
);

export const Default = Template.bind({});
