import dashboard from './dashboard';
import sales from './sales';
import purchase from './purchase';
import contractingManagement from './contractingManagement';

const menuItems = (salesMenus = [], purchaseMenus = []) => ({
  items: [
    dashboard,
    sales(salesMenus),
    purchase(purchaseMenus),
    contractingManagement
  ]
});

export default menuItems;