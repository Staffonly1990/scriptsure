import React from 'react';
import renderer from 'react-test-renderer';
import { IntlProvider } from 'react-intl';
import App from 'app/index';

const createComponentWithIntl = (children, props = { locale: 'en' }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return renderer.create(<IntlProvider {...props}>{children}</IntlProvider>);
};

test('app main should be rendered', () => {
  const component = createComponentWithIntl(<App />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
