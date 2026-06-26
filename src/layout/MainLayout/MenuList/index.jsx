import { Activity, memo, useState } from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import cusmenuItems from 'menu-items';

import { useGetMenuMaster } from 'api/menu';
import { useSelector } from 'react-redux';
import {
  IconDashboard,
  IconUsers,
  IconShoppingCart,
  IconFileInvoice,
  IconBuilding,
  IconBriefcase,
  IconClipboardCheck,
  IconReportAnalytics,
  IconTruckDelivery
} from '@tabler/icons-react';

const menuIcons = {
  Dashboard: IconDashboard,
  '': IconUsers,
  'Material Request': IconShoppingCart,
  'Purchase Request': IconFileInvoice,
  'GRPO': IconBriefcase,
  'Contracting Management': IconBuilding,
  'Approvals': IconClipboardCheck,
  'Pending Approvals': IconReportAnalytics,
  'Pending Delivery': IconTruckDelivery
};

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selectedID, setSelectedID] = useState('');

  const lastItem = null;
  const { user } = useSelector((state) => state.auth);

  const authUserMenus = user ? [...new Map(user.Roles.flatMap((role) => role.UserMenus).map((menu) => [menu.id, menu])).values()] : [];

 const menuItems = Boolean(user?.is_com_admin)?cusmenuItems:{
  items: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'group',
      children: [
        {
          id: 'dashboard-item',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard',
          icon: IconDashboard,
          breadcrumbs: false
        }
      ]
    },

    ...authUserMenus
      .filter((menu) => menu.status === 1)
      .map((menu) => ({
        id: menu.id,
        title: menu.display_name,
        type: 'group',
        children: (menu.children || [])
          .filter((child) => child.status === 1)
          .map((child) => ({
            id: child.id,
            title: child.display_name,
            type: 'item',
            url: `/${child.display_name.replace(/\s+/g, '-')}/list`,
            icon:
              menuIcons[child.display_name] ||
              IconDashboard,
            breadcrumbs: false
          }))
      }))
  ]
};

console.log('menuItems', menuItems);

  let lastItemIndex = menuItems?.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navItems = menuItems.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              <Activity mode={index !== 0 ? 'visible' : 'hidden'}>
                <Divider sx={{ py: 0.5 }} />
              </Activity>
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" align="center" sx={{ color: 'error.main' }}>
            Menu Items Error
          </Typography>
        );
    }
  });

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);
