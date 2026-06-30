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

export const getPurchaseQuotations = createAsyncThunk('purchaseQuotation/getAll', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/purchase-quotations', { params: { top, skip } });
    return {
      orders: response.data.value,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch purchase orders');
  }
});

export const createPurchaseQuotation = createAsyncThunk('purchaseQuotation/create', async (formData, thunkAPI) => {
  try {
    const response = await API.post('/sap/purchase-quotations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;

    return thunkAPI.rejectWithValue({
      status: error.response?.status,

      message: responseData?.error?.error?.message?.value || responseData?.message || 'Purchase Order Create Failed',

      sapCode: responseData?.error?.error?.code
    });
  }
});

export const updatePurchaseQuotation = createAsyncThunk('purchaseQuotation/update', async ({ docEntry, formData }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/purchase-quotations/${docEntry}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: responseData?.error?.error?.message?.value || responseData?.message || 'Purchase Order Update Failed',
      sapCode: responseData?.error?.error?.code
    });
  }
});

export const getPurchaseQuotationById = createAsyncThunk('purchaseQuotation/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/purchase-quotations/${docEntry}`);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch purchase order');
  }
});

const purchaseQuotationSlice = createSlice({
  name: 'purchaseQuotation',
  initialState,

  reducers: {
    resetPurchaseQuotationState: (state) => {
      state.loading = false;
      state.error = null;
      state.saveSuccess = false;
      state.currentOrder = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPurchaseQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPurchaseQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(getPurchaseQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPurchaseQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(createPurchaseQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(createPurchaseQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updatePurchaseQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(updatePurchaseQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(updatePurchaseQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getPurchaseQuotationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPurchaseQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        console.log('ccccc', state.currentOrder);
      })

      .addCase(getPurchaseQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetPurchaseQuotationState } = purchaseQuotationSlice.actions;

export default purchaseQuotationSlice.reducer;
