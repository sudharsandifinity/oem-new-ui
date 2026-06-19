import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from '../layout/MainLayout'
import PublicRoute from './PublicRoute';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element:  <PublicRoute>
          <LoginPage />
        </PublicRoute>
    }
  ]
};

export default AuthenticationRoutes;
