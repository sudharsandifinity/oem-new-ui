import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getPurchaseOrderList = createAsyncThunk('purchaseOrder/getList', async ({ top = 25, skip = 0 } = {}, { rejectWithValue }) => {
  try {
    const response = await API.get('/sap/purchase-orders', { params: { top, skip } });
    return { list: response.data.value ?? response.data, totalCount: response.data['odata.count'] || 0 };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createPurchaseOrder = createAsyncThunk('purchaseOrder/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await API.post('/sap/purchase-orders', payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getPurchaseOrderById = createAsyncThunk('purchaseOrder/getById', async (docEntry, { rejectWithValue }) => {
  try {
    const response = await API.get(`/sap/purchase-orders/${docEntry}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState: {
    list: [],
    totalCount: 0,
    listLoading: false,
    currentPO: null,
    currentPOLoading: false,
    currentPOError: null,
    createLoading: false,
    saveSuccess: false,
    error: null
  },
  reducers: {
    resetPOState: (state) => {
      state.createLoading = false;
      state.saveSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPurchaseOrderList.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(getPurchaseOrderList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getPurchaseOrderList.rejected, (state) => {
        state.listLoading = false;
      })

      .addCase(createPurchaseOrder.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create Purchase Order';
      })

      .addCase(getPurchaseOrderById.pending, (state) => {
        state.currentPOLoading = true;
        state.currentPOError = null;
      })
      .addCase(getPurchaseOrderById.fulfilled, (state, action) => {
        state.currentPOLoading = false;
        state.currentPO = action.payload;
      })
      .addCase(getPurchaseOrderById.rejected, (state, action) => {
        state.currentPOLoading = false;
        state.currentPOError = action.payload || action.error.message || 'Failed to load';
      });
  }
});

export const { resetPOState } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
