import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  orders: [],
  totalCount: 0,
  currentOrder: null,
  loading: false,
  error: null,
  saveSuccess: false
};

export const getSalesOrders = createAsyncThunk('salesOrder/getAll', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/orders', { params: { top, skip } });
    return {
      orders: response.data.value,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales orders');
  }
});

export const createSalesOrder = createAsyncThunk('salesOrder/create', async (formData, thunkAPI) => {
  try {
    const response = await API.post('/sap/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;

    return thunkAPI.rejectWithValue({
      status: error.response?.status,

      message: responseData?.error?.error?.message?.value || responseData?.message || 'Sales Order Create Failed',

      sapCode: responseData?.error?.error?.code
    });
  }
});

export const updateSalesOrder = createAsyncThunk('salesOrder/update', async ({ docEntry, formData }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/orders/${docEntry}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: responseData?.error?.error?.message?.value || responseData?.message || 'Sales Order Update Failed',
      sapCode: responseData?.error?.error?.code
    });
  }
});

export const getSalesOrderById = createAsyncThunk('salesOrder/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/orders/${docEntry}`);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales order');
  }
});

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState,

  reducers: {
    resetSalesOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.saveSuccess = false;
      state.currentOrder = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getSalesOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSalesOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(getSalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(createSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(updateSalesOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(updateSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getSalesOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSalesOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        console.log('ccccc', state.currentOrder);
      })

      .addCase(getSalesOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSalesOrderState } = salesOrderSlice.actions;

export default salesOrderSlice.reducer;
