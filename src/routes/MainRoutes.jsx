import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const CusDashboard = Loadable(lazy(() => import('views/CustomerAdmin/dashboard/CusDashboard')));

//Role management routing
const RoleManagementList = Loadable(lazy(()=>import('views/CustomerAdmin/RoleManagement/RoleManagementList')));
const RoleManagementCreate=Loadable(lazy(()=>import('views/CustomerAdmin/RoleManagement/RoleManagementCreate.jsx')));
const RoleManagementView=Loadable(lazy(()=>import('views/CustomerAdmin/RoleManagement/RoleManagementView.jsx')));
const RoleManagementEdit=Loadable(lazy(()=>import('views/CustomerAdmin/RoleManagement/RoleManagementEdit.jsx')));

//User management routing
const UserManagementList=Loadable(lazy(()=>import('views/CustomerAdmin/UserManagement/UserManagementList')));
const UserManagementCreate=Loadable(lazy(()=>import('views/CustomerAdmin/UserManagement/UserManagementCreate.jsx')));
const UserManagementView=Loadable(lazy(()=>import('views/CustomerAdmin/UserManagement/UserManagementView.jsx')));
const UserManagementEdit=Loadable(lazy(()=>import('views/CustomerAdmin/UserManagement/UserManagementEdit.jsx')));


// Material Request routing
const MaterialRequestsList = Loadable(lazy(() => import('views/material-request/MaterialRequestsList')));
const MaterialRequestCreate = Loadable(lazy(() => import('views/material-request/MaterialRequestCreate')));
const MaterialRequestView = Loadable(lazy(() => import('views/material-request/MaterialRequestView')));
const MaterialRequestEdit = Loadable(lazy(() => import('views/material-request/MaterialRequestEdit')));
const MaterialRequestApprovals = Loadable(lazy(() => import('views/material-request/MaterialRequestApprovals')));
const MaterialRequestApprovalView = Loadable(lazy(() => import('views/material-request/MaterialRequestApprovalView')));

// Purchase Request routing
const PurchaseRequestsList = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestsList')));
const PurchaseRequestCreate = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestCreate')));
const PurchaseRequestView = Loadable(lazy(() => import('views/purchase-request/PurchaseRequestView')));

// Goods Receipt PO routing
const GoodsReceiptPOList = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOList')));
const GoodsReceiptPOCreate = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOCreate')));
const GoodsReceiptPOView = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOView')));

//sales quotation routing
const SalesQuotationList = Loadable(lazy(() => import('views/sales-quotation/SalesQuotationList.jsx')));
//const SalesQuotationCreate = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationCreate.jsx')));
//  const SalesQuotationView = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationView.jsx')));
//  const SalesQuotationEdit = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationEdit.jsx')));

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
      element: <DashboardDefault />
    },
    {
      path: 'CustomerAdmin',
      element: <CusDashboard />,
      
    },
    {
      path: 'UserManagement',
      children: [
        {
          path: 'list',
          element: <UserManagementList />
        },
        {
          path:'create',
          element:<UserManagementCreate/>
        },
        {
          path:'view/:id',
          element:<UserManagementView/>
        },
        {
          path:'edit/:id',
          element:<UserManagementEdit/>
        }
        
      ]
    },
    {
      path: 'RoleManagement',
      children: [
        {
          path: 'list',
          element: <RoleManagementList />
        },
        {
          path:'create',
          element:<RoleManagementCreate/>
        },
        {
          path:'view/:id',
          element:<RoleManagementView/>
        },
        {
          path:'edit/:id',
          element:<RoleManagementEdit/>
        }
      ]
    },
    {
      path: 'material-request',
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
      path: 'Approvals',
      children: [
        { path: 'list', element: <MaterialRequestApprovals /> },
        { path: 'view/:id', element: <MaterialRequestApprovalView /> }
      ]
    },
    {
      path: 'purchase-request',
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
      path: 'GRPO',
      children: [
        { path: 'list', element: <GoodsReceiptPOList /> },
        { path: 'create', element: <GoodsReceiptPOCreate /> },
        { path: 'view/:id', element: <GoodsReceiptPOView /> }
      ]
    },
    {
      path: 'Sales-Quotation',
      children: [
        { path: 'list', element: <SalesQuotationList /> }
        // { path: 'create', element: <SalesQuotationCreate /> },
        //  { path: 'view/:id', element: <SalesQuotationView /> },
        //  { path: 'view/:id', element: <SalesQuotationEdit /> },
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
