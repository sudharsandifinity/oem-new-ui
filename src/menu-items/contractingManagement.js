import { IconClipboardList, IconFileInvoice, IconPackageImport } from '@tabler/icons-react';

const contractingManagement = {
  id: 'contracting-management',
  title: 'Contracting Management',
  type: 'group',
  children: [
    {
      id: 'mr-list',
      title: 'Material Request',
      type: 'item',
      url: '//list',
      icon: IconClipboardList,
      breadcrumbs: false
    },
    {
      id: 'pr-list',
      title: 'Purchase Request',
      type: 'item',
      url: '/purchase-request/list',
      icon: IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'grpo-list',
      title: 'Goods Receipt PO',
      type: 'item',
      url: '/GRPO/list',
      icon: IconPackageImport,
      breadcrumbs: false
    }
  ]
};

export default contractingManagement;
