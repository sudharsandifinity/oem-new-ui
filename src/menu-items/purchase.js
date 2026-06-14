// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const purchase = {
  id: 'purchase',
  title: 'Purchase',
  type: 'group',
  children: [
    {
      id: 'list',
      title: 'Purchase Orders',
      type: 'item',
      url: '/purchase-orders/list',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'create',
      title: 'Create Purchase Order',
      type: 'item',
      url: '/purchase-orders/create',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'quotation',
      title: 'Purchase Quotation',
      type: 'item',
      url: '/purchase-orders/quotation',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'purchase-requisition',
      title: 'Purchase Requisition',
      type: 'item',
      url: '/purchase-orders/requisition',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
  ]
};

export default purchase;
