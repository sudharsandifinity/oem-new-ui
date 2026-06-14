import { IconFileInvoice } from '@tabler/icons-react';

const purchaseRequest = {
  id: 'purchase-request',
  title: 'Purchase Request',
  type: 'group',
  children: [
    {
      id: 'pr-list',
      title: 'Purchase Request',
      type: 'item',
      url: '/purchase-requests/list',
      icon: IconFileInvoice,
      breadcrumbs: false
    }
  ]
};

export default purchaseRequest;
