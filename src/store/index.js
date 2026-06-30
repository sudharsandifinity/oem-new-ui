import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import salesOrderReducer from './slices/salesOrderSlice';
import customerReducer from './slices/customerSlice';
import itemReducer from './slices/itemSlice';
import taxCodeReducer from './slices/taxCodeSlice';
import projectReducer from './slices/projectSlice';
import warehouseReducer from './slices/warehouseSlice';
import currencyReducer from './slices/currencySlice';
import freightReducer from './slices/freightSlice';
import materialRequestReducer from './slices/materialRequestSlice';
import purchaseRequestReducer from './slices/purchaseRequestSlice';
import goodsReceiptPOReducer from './slices/goodsReceiptPOSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import salesQuotationReducer from './slices/salesQuotationSlice'
import commonReducer from './slices/commonSlice';
import attachmentReducer from './slices/attachmentSlice';
import commonCustomerReducer from './slices/commonCustomerSlice'
import draftReducer from './slices/draftSlice';
import cusAdminroleReducer from './slices/cusAdminroleSlice';
import companyReducer from './slices/companySlice';
import FormReducer from './slices/FormSlice';
import MenuReducer from './slices/MenuSlice';
import RoleReducer from './slices/roleSlice';
import UserReducer from './slices/userSlice';
import purchaseQuotationReducer from './slices/purchaseQuotationSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    companies:companyReducer,
    forms:FormReducer,
    roles:RoleReducer,
    menus:MenuReducer,
    users:UserReducer,
    salesOrder: salesOrderReducer,
    salesQuotation:salesQuotationReducer,
    customer: customerReducer,
    item: itemReducer,
    taxCode: taxCodeReducer,
    project: projectReducer,
    warehouse: warehouseReducer,
    currency: currencyReducer,
    freight: freightReducer,
    draft:draftReducer,
    materialRequest: materialRequestReducer,
    purchaseRequest: purchaseRequestReducer,
    PurchaseQuotation:purchaseQuotationReducer,
    goodsReceiptPO: goodsReceiptPOReducer,
    purchaseOrder: purchaseOrderReducer,
    common: commonReducer,
    attachment: attachmentReducer,
    commonCustomer:commonCustomerReducer,
    cusAdminrole:cusAdminroleReducer,
  }
});

export default store;
