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
      id: 'CusUserManagement',
      title: 'UserManagement',
      type: 'item',
      url: '/CusUserManagement/list', 
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false
    },
    {
      id: 'CusRoleManagement',
      title: ' Role Management',
      type: 'item',
      url: '/CusRoleManagement/list',
      icon: icons.SupervisedUserCircleIcon,
      breadcrumbs: false
    }
  ]
};

export default CusAdmin;
