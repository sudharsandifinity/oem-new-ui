import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Material Request routing
const MaterialRequestsList   = Loadable(lazy(() => import('views/material-request/MaterialRequestsList')));
const MaterialRequestCreate  = Loadable(lazy(() => import('views/material-request/MaterialRequestCreate')));
const MaterialRequestView    = Loadable(lazy(() => import('views/material-request/MaterialRequestView')));
const MaterialRequestEdit    = Loadable(lazy(() => import('views/material-request/MaterialRequestEdit')));

// Purchase Request routing
const PurchaseRequestsList  = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestsList')));
const PurchaseRequestCreate = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestCreate')));
const PurchaseRequestView   = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestView')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <MainLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    
    {
      path: 'material-requests',
      children: [
        {
          path: 'list',
          element: <MaterialRequestsList />
        },
        {
          path: 'create',
          element: <MaterialRequestCreate />
        },
        {
          path: 'view/:id',
          element: <MaterialRequestView />
        },
        {
          path: 'edit/:id',
          element: <MaterialRequestEdit />
        }
      ]
    },
    {
      path: 'purchase-requests',
      children: [
        {
          path: 'list',
          element: <PurchaseRequestsList />
        },
        {
          path: 'create',
          element: <PurchaseRequestCreate />
        },
        {
          path: 'view/:id',
          element: <PurchaseRequestView />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
