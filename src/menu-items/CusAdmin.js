// assets
import { IconClipboardList, IconClipboardListFilled, IconDashboard } from '@tabler/icons-react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

// constant
const icons = { IconDashboard,ManageAccountsIcon,SupervisedUserCircleIcon };

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
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false
    },
    {
      id: 'RoleManagement',
      title: ' Role Management',
      type: 'item',
      url: '/RoleManagement/list',
      icon: icons.SupervisedUserCircleIcon,
      breadcrumbs: false
    }
  ]
};

export default CusAdmin;
