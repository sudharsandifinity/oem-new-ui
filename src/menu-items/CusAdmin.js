// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const CusAdmin = { 
  id: 'UserManagement',
  title: 'UserManagement',
  type: 'group',
  children: [
    {
      id: 'UserManagement',
      title: 'UserManagement',
      type: 'item',
      url: '/UserManagement/list',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'RoleManagement',
      title: ' Role Management',
      type: 'item',
      url: '/RoleManagement/list',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default CusAdmin;
