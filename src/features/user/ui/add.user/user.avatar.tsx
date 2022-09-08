import React, { ElementType } from 'react';
import { Fragment } from 'react-is';
import { UserCircleIcon } from '@heroicons/react/outline';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import { join, assign } from 'lodash';

import { userModel } from '../../model';

const UserAvatar: OverloadedFC = observer<OverloadedProp<ElementType>>(({ as: Component = 'div' }) => {
  const userFullname = computed(() => {
    if (userModel.data?.user) return join([userModel.data?.user?.firstName, userModel.data?.user?.lastName], ' ');
    return null;
  });
  const attrs = {};
  if ((Component as unknown as symbol) !== Fragment) assign(attrs, { className: 'inline-flex items-center' });
  return (
    <Component {...attrs}>
      <UserCircleIcon className="w-4 h-4 md:mr-2" />
      <span className="hidden lg:inline">{userFullname.get()}</span>
    </Component>
  );
}) as OverloadedFC;
UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
