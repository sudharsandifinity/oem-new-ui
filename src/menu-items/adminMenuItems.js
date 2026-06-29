





// assets
import { IconBusinessplan, IconClipboardList, IconClipboardListFilled, IconDashboard } from '@tabler/icons-react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import FormatListBulletedAddIcon from '@mui/icons-material/FormatListBulletedAdd';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

// constant
const icons = { IconDashboard,ManageAccountsIcon,SupervisedUserCircleIcon,IconBusinessplan,FormatListBulletedAddIcon,MenuOpenIcon};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const adminMenuItems = { 
  id: 'Companies',
  title: 'Companies',
  type: 'group',
  children: [
    {
      id: 'Companies',
      title: 'Companies',
      type: 'item',
      url: '/Companies/list',
      icon: icons.IconBusinessplan,
      breadcrumbs: false
    },
    {
      id: 'FormManagement',
      title: ' Form Management',
      type: 'item',
      url: '/Forms/list',
      icon: icons.FormatListBulletedAddIcon,
      breadcrumbs: false
    },
    {
      id: 'MenuManagement',
      title: ' Menu Management',
      type: 'item',
      url: '/Menu/list',
      icon: icons.MenuOpenIcon,
      breadcrumbs: false
    },
    {
      id: 'RoleManagement',
      title: ' Role Management',
      type: 'item',
      url: '/Roles/list',
      icon: icons.SupervisedUserCircleIcon,
      breadcrumbs: false
    },
    {
      id: 'AdminUserManagement',
      title: ' User Management',
      type: 'item',
      url: '/Users/list',
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false
    }
  ]
};
export default adminMenuItems;
