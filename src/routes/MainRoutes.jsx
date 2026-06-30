import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';
import Admin from '../views/Admin/Admin';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const CusDashboard = Loadable(lazy(() => import('views/CustomerAdmin/dashboard/CusDashboard')));

//Admin routing
const AdminDashboard = Loadable(lazy(() => import('views/Admin/Admin.jsx')));
const MenuManagementList = Loadable(lazy(() => import('views/Admin/MenuManagement/MenuList.jsx')));
const AdminRoleManagementList = Loadable(lazy(() => import('views/Admin/RoleManagement/RoleList.jsx')));
const AdminUserManagementList = Loadable(lazy(() => import('views/Admin/UserManagement/Userlist.jsx')));

//Form routing
const MenuList = Loadable(lazy(() => import('views/Admin/MenuManagement/MenuList.jsx')));
const MenuCreate = Loadable(lazy(() => import('views/Admin/MenuManagement/MenuCreate.jsx')));
const MenuEdit = Loadable(lazy(() => import('views/Admin/MenuManagement/MenuEdit.jsx')));
const MenuView = Loadable(lazy(() => import('views/Admin/MenuManagement/MenuView.jsx')));

//Form routing
const FormList = Loadable(lazy(() => import('views/Admin/FormManagement/FormList.jsx')));
const FormCreate = Loadable(lazy(() => import('views/Admin/FormManagement/FormCreate.jsx')));
const FormEdit = Loadable(lazy(() => import('views/Admin/FormManagement/FormEdit.jsx')));
const FormView = Loadable(lazy(() => import('views/Admin/FormManagement/FormView.jsx')));

//Role routing
const RoleList = Loadable(lazy(() => import('views/Admin/RoleManagement/RoleList.jsx')));
const RoleCreate = Loadable(lazy(() => import('views/Admin/RoleManagement/RoleCreate.jsx')));
const RoleEdit = Loadable(lazy(() => import('views/Admin/FormManagement/FormEdit.jsx')));
const RoleView = Loadable(lazy(() => import('views/Admin/FormManagement/FormView.jsx')));


//Companies routing
const CompaniesList = Loadable(lazy(() => import('views/Admin/Companies/CompaniesList.jsx')));
const CompanyCreate=Loadable(lazy(()=>import('views/Admin/Companies/CompaniesCreate.jsx')));
const CompanyView=Loadable(lazy(()=>import('views/Admin/Companies/CompaniesView.jsx')));
const CompanyEdit=Loadable(lazy(()=>import('views/Admin/Companies/CompaniesEdit.jsx')));

//User routing
const UserList = Loadable(lazy(() => import('views/Admin/UserManagement/Userlist.jsx')));
const UserCreate=Loadable(lazy(()=>import('views/Admin/UserManagement/UserCreate.jsx')));
const UserView=Loadable(lazy(()=>import('views/Admin/UserManagement/UserView.jsx')));
const UserEdit=Loadable(lazy(()=>import('views/Admin/UserManagement/UserEdit.jsx')));



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

// Reports routing
const PendingApprovalReports = Loadable(lazy(() => import('views/reports/pendingreports/PendingApprovalReports')));

// Purchase Request routing
const PurchaseRequestsList = Loadable(lazy(() => import('views/purchase-request-Amit/PurchaseRequestsList')));
const PurchaseRequestCreate = Loadable(lazy(() => import('views/purchase-request-Amit/PurchaseRequestCreate')));
const PurchaseRequestView = Loadable(lazy(() => import('views/purchase-request-Amit/PurchaseRequestView')));

//purchase Quotation routing
const PurchaseQuotationList = Loadable(lazy(() => import('views/purchase-quotation/PurchaseQuotationList.jsx')));
const PurchaseQuotationsCreate = Loadable(lazy(() => import('views/purchase-quotation/PurchaseQuotationCreate.jsx')));
const PurchaseQuotationsView = Loadable(lazy(() => import('views/purchase-quotation/PurchaseQuotationView.jsx')));
const PurchaseQuotationsEdit = Loadable(lazy(() => import('views/purchase-quotation/PurchaseQuotationEdit.jsx')));

// Goods Receipt PO routing
const GoodsReceiptPOList = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOList')));
const GoodsReceiptPOCreate = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOCreate')));
const GoodsReceiptPOView = Loadable(lazy(() => import('views/goods-receipt-po/GoodsReceiptPOView')));

//sales order routing
const SalesOrdersList = Loadable(lazy(() => import('views/sales-order/SalesOrdersList.jsx')));
const SalesOrdersCreate = Loadable(lazy(() => import('views/sales-order/SalesOrdersCreate.jsx')));
const SalesOrdersView = Loadable(lazy(() => import('views/sales-order/SalesOrdersView.jsx')));
const SalesOrdersEdit = Loadable(lazy(() => import('views/sales-order/SalesOrdersEdit.jsx')));

//sales quotation routing
const SalesQuotationList = Loadable(lazy(() => import('views/sales-quotation/SalesQuotationList.jsx')));
const SalesQuotationCreate = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationCreate.jsx')));
 const SalesQuotationView = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationView.jsx')));
 const SalesQuotationEdit = Loadable(lazy(() => import('views/Sales-Quotation/SalesQuotationEdit.jsx')));

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
    //Admin
    {
      path: 'admin',
      element: <Admin />,
      
    },
    {
      path: 'Companies',
      children: [
        {
          path: 'list',
          element: <CompaniesList />
        },
        {
          path:'create',
          element:<CompanyCreate/>
        },
        {
          path:'view/:id',
          element:<CompanyView/>
        },
        {
          path:'edit/:id',
          element:<CompanyEdit/>
        }
        
      ]
    },
    {
      path: 'Forms',
      children: [
        {
          path: 'list',
          element: <FormList />
        },
        {
          path:'create',
          element:<FormCreate/>
        },
        {
          path:'view/:id',
          element:<FormView/>
        },
        {
          path:'edit/:id',
          element:<FormEdit/>
        }
        
      ]
    },
    {
      path: 'Menu',
      children: [
        {
          path: 'list',
          element: <MenuList />
        },
        {
          path:'create',
          element:<MenuCreate/>
        },
        {
          path:'view/:id',
          element:<MenuView/>
        },
        {
          path:'edit/:id',
          element:<MenuEdit/>
        }
        
      ]
    },
    {
      path: 'AdminRoleManagement',
      children: [
        {
          path: 'list',
          element: <RoleList />
        },
        {
          path:'create',
          element:<RoleCreate/>
        },
        {
          path:'view/:id',
          element:<RoleView/>
        },
        {
          path:'edit/:id',
          element:<RoleEdit/>
        }
        
      ]
    },
    {
      path: 'AdminUserManagement',
      children: [
        {
          path: 'list',
          element: <AdminUserManagementList />
        },
        // {
        //   path:'create',
        //   element:<AdminUserManagementCreate/>
        // },
        // {
        //   path:'view/:id',
        //   element:<AdminUserManagementView/>
        // },
        // {
        //   path:'edit/:id',
        //   element:<AdminUserManagementEdit/>
        // }
        
      ]
    },
    //Admin
    {
      path: 'Users',
      children: [
        {
          path: 'list',
          element: <UserList />
        },
        {
          path:'create',
          element:<UserCreate/>
        },
        {
          path:'view/:id',
          element:<UserEdit/>
        },
        {
          path:'edit/:id',
          element:<UserView/>
        }
        
      ]
    },
    {
      path: 'Roles',
      children: [
        {
          path: 'list',
          element: <RoleList />
        },
        {
          path:'create',
          element:<RoleCreate/>
        },
        {
          path:'view/:id',
          element:<RoleView/>
        },
        {
          path:'edit/:id',
          element:<RoleEdit/>
        }
      ]
    },
    {
      path: 'User',
      children: [
        {
          path: 'list',
          element: <UserList />
        },
        {
          path:'create',
          element:<UserCreate/>
        },
        {
          path:'view/:id',
          element:<UserView/>
        },
        {
          path:'edit/:id',
          element:<UserEdit/>
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
      path: 'Pending-Approvals',
      children: [{ path: 'list', element: <PendingApprovalReports /> }]
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
      path: 'Purchase-Quotation',
      children: [
        { path: 'list', element: <PurchaseQuotationList /> },
        { path: 'create', element: <PurchaseQuotationsCreate /> },
         { path: 'view/:id', element: <PurchaseQuotationsView /> },
         { path: 'edit/:id', element: <PurchaseQuotationsEdit /> },
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
      path: 'Sales-Order',
      children: [
        { path: 'list', element: <SalesOrdersList /> },
        { path: 'create', element: <SalesOrdersCreate /> },
        { path: 'view/:id', element: <SalesOrdersView /> },
        { path: 'edit/:id', element: <SalesOrdersEdit /> }
      ]
    },
    {
      path: 'Sales-Quotation',
      children: [
        { path: 'list', element: <SalesQuotationList /> },
        { path: 'create', element: <SalesQuotationCreate /> },
         { path: 'view/:id', element: <SalesQuotationView /> },
         { path: 'edit/:id', element: <SalesQuotationEdit /> },
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
