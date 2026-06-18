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
import commonReducer from './slices/commonSlice';
import attachmentReducer from './slices/attachmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    salesOrder: salesOrderReducer,
    customer: customerReducer,
    item: itemReducer,
    taxCode: taxCodeReducer,
    project: projectReducer,
    warehouse: warehouseReducer,
    currency: currencyReducer,
    freight: freightReducer,
    materialRequest: materialRequestReducer,
    purchaseRequest: purchaseRequestReducer,
    goodsReceiptPO: goodsReceiptPOReducer,
    purchaseOrder: purchaseOrderReducer,
    common: commonReducer,
    attachment: attachmentReducer
  }
});

export default store;
