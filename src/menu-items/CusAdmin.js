import { IconUsers, IconShieldLock, IconFolders, IconChecklist } from '@tabler/icons-react';
const icons = { IconUsers, IconShieldLock, IconFolders, IconChecklist };

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
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'RoleManagement',
      title: ' Role Management',
      type: 'item',
      url: '/RoleManagement/list',
      icon: icons.IconShieldLock,
      breadcrumbs: false
    },
    {
      id: 'ProjectManagement',
      title: 'Project Management',
      type: 'item',
      url: '/ProjectManagement/list',
      icon: icons.IconFolders,
      breadcrumbs: false
    },
    {
      id: 'ApprovalSetup',
      title: 'Approval Setup',
      type: 'item',
      url: '/ApprovalSetup/list',
      icon: icons.IconChecklist,
      breadcrumbs: false
    }
  ]
};

export default CusAdmin;
