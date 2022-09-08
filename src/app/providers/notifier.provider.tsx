import React, { FC, useEffect } from 'react';
import { useNotifier, NotifierContextProvider, positions } from 'react-headless-notifier';
import { assign } from 'lodash';

import { ONotification, subscribe, info, error } from 'shared/lib/notification';
import Alert from 'shared/ui/alert';

function NotifierSubscriber(props: PropsWithChildren) {
  const { children } = props;
  const { notify } = useNotifier();

  useEffect(() => {
    const subscription = subscribe((action) => {
      const data = { ...action.payload };
      switch (action.type) {
        case ONotification.Success:
          assign(data, { type: ONotification.Success, color: 'green' });
          break;
        case ONotification.Warning:
          assign(data, { type: ONotification.Warning, color: 'yellow' });
          break;
        case ONotification.Error:
          assign(data, { type: ONotification.Error, color: 'red' });
          break;
        case ONotification.Info:
        default:
          assign(data, { type: ONotification.Info, color: 'blue' });
          break;
      }

      const { title, description, closable, type, color } = data;
      return notify(
        <Alert.Notification title={title} closable={closable} color={color} type={type}>
          {description}
        </Alert.Notification>
      );
    });

    // info(
    //   {
    //     title: 'Demo 1',
    //     description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //     Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.`,
    //     closable: true,
    //   },
    //   2000
    // );
    // info({ title: 'Demo 2' }, 4000);
    // info({ title: 'Demo 3' }, 3000);
    // info({ title: 'Demo 4' }, 1000);
    // info({ title: 'Demo 5' }, 1500);

    // error(
    //   {
    //     title: 'Demo 1',
    //     description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
    // Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.`,
    //     closable: true,
    //   },
    //   1000
    // );
    // error({ title: 'Demo 2' }, 2000);
    // error({ title: 'Demo 3' }, 4000);
    // error({ title: 'Demo 4' }, 3000);
    // error({ title: 'Demo 5' }, 1500);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
NotifierSubscriber.displayName = `NotifierSubscriber`;

/**
 * @provider Notifier
 */
export const NotifierProvider: FC = ({ children }) => {
  return (
    <NotifierContextProvider
      config={{
        // Max number of notiication simultaneously, `null` will result in no maximum
        max: 16,
        // Duration by notification in milliseconds, `2147483647` is maximum
        duration: 6000,
        // You can specify a position where the notification should appears,
        // valid positions are 'top', 'topRight', 'topLeft', 'bottomRight', 'bottomLeft', 'bottom'
        position: positions.TOP_RIGHT,
      }}
    >
      <NotifierSubscriber>{children}</NotifierSubscriber>
    </NotifierContextProvider>
  );
};
NotifierProvider.displayName = `NotifierProvider`;
