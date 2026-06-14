import { IconClipboardList } from '@tabler/icons-react';

const materialRequest = {
  id: 'material-request',
  title: 'Material Request',
  type: 'group',
  children: [
    {
      id: 'mr-list',
      title: 'Material Request',
      type: 'item',
      url: '/material-requests/list',
      icon: IconClipboardList,
      breadcrumbs: false
    },
    {
      id: 'mr-create',
      title: 'Create Material Request',
      type: 'item',
      url: '/material-requests/create',
      icon: IconClipboardList,
      breadcrumbs: false
    }
  ]
};

export default materialRequest;
