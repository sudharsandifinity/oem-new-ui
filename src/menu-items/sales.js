// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const sales = {
  id: 'sales',
  title: 'Sales',
  type: 'group',
  children: [
    {
      id: 'list',
      title: 'Sales',
      type: 'item',
      url: '/sales-orders/list',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'create',
      title: 'Create Sales Order',
      type: 'item',
      url: '/sales-orders/create',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default sales;
