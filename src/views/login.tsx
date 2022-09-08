import React, { FC } from 'react';

import { userModel } from 'features/user';
import { LoginModal } from 'features/login';

/**
 * @view Login
 */
const LoginView: FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LoginModal open hideBackdrop onLogin={() => userModel.isUserLock && userModel.unlock()} />
    </div>
  );
};
LoginView.displayName = 'LoginView';

export default LoginView;
