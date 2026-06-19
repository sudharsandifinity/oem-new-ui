import { useSelector } from 'react-redux';
import createMenuItems from 'menu-items';

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const authUserMenus = user
    ? user.Roles.flatMap((role) => role.UserMenus)
    : [];

  const salesMenus = authUserMenus.filter(
    (menu) => menu.moduleName === 'Sales'
  );

  const purchaseMenus = authUserMenus.filter(
    (menu) => menu.moduleName === 'Purchase'
  );

  const menuItems = createMenuItems(
    salesMenus,
    purchaseMenus
  );

 
}