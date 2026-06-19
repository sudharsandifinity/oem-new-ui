import { IconPackageImport } from '@tabler/icons-react';

const goodsReceiptPO = {
  id: 'goods-receipt-po',
  title: 'Goods Receipt PO',
  type: 'group',
  children: [
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

export default goodsReceiptPO;
