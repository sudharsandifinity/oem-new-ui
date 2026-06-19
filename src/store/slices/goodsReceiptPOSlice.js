import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getGRPOList = createAsyncThunk('goodsReceiptPO/getList', async ({ top = 25, skip = 0 } = {}, { rejectWithValue }) => {
  try {
    const response = await API.get('/sap/purchase-delivery-notes', { params: { top, skip } });
    return { list: response.data.value ?? response.data, totalCount: response.data['odata.count'] || 0 };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getMyGRPOList = createAsyncThunk(
  'goodsReceiptPO/getMyList',
  async ({ top = 25, skip = 0, email = '' } = {}, { rejectWithValue }) => {
    try {
      const filterParts = ["DocumentStatus eq 'bost_Open'"];
      if (email) filterParts.push(`U_OEM_UEMAIL eq '${email}'`);
      const response = await API.get('/sap/purchase-delivery-notes', {
        params: { top, skip, filter: filterParts.join(' and ') }
      });
      return { list: response.data.value ?? response.data, totalCount: response.data['odata.count'] || 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createGRPO = createAsyncThunk('goodsReceiptPO/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await API.post('/sap/purchase-delivery-notes', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (err) {
    const d = err.response?.data;
    return rejectWithValue({
      status: err.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Goods Receipt PO Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getGRPOById = createAsyncThunk('goodsReceiptPO/getById', async (docEntry, { rejectWithValue }) => {
  try {
    const response = await API.get(`/sap/purchase-delivery-notes/${docEntry}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const getPurchaseDeliveryNotes = createAsyncThunk(
  'goodsReceiptPO/getPurchaseDeliveryNotes',
  async ({ top = 25, skip = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await API.get('/sap/purchase-delivery-notes', { params: { top, skip } });
      return { list: response.data.value ?? response.data, totalCount: response.data['odata.count'] || 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const goodsReceiptPOSlice = createSlice({
  name: 'goodsReceiptPO',
  initialState: {
    list: [],
    totalCount: 0,
    listLoading: false,
    currentGRPO: null,
    currentGRPOLoading: false,
    currentGRPOError: null,
    deliveryNotes: [],
    deliveryNotesTotalCount: 0,
    deliveryNotesLoading: false,
    createLoading: false,
    saveSuccess: false,
    error: null
  },
  reducers: {
    resetGRPOState: (state) => {
      state.createLoading = false;
      state.saveSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGRPOList.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(getGRPOList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getGRPOList.rejected, (state) => {
        state.listLoading = false;
      })

      .addCase(getMyGRPOList.pending, (state) => {
        state.listLoading = true;
      })
      .addCase(getMyGRPOList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMyGRPOList.rejected, (state) => {
        state.listLoading = false;
      })

      .addCase(createGRPO.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createGRPO.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createGRPO.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getGRPOById.pending, (state) => {
        state.currentGRPOLoading = true;
        state.currentGRPOError = null;
      })
      .addCase(getGRPOById.fulfilled, (state, action) => {
        state.currentGRPOLoading = false;
        state.currentGRPO = action.payload;
      })
      .addCase(getGRPOById.rejected, (state, action) => {
        state.currentGRPOLoading = false;
        state.currentGRPOError = action.payload || action.error.message || 'Failed to load';
      })

      .addCase(getPurchaseDeliveryNotes.pending, (state) => {
        state.deliveryNotesLoading = true;
      })
      .addCase(getPurchaseDeliveryNotes.fulfilled, (state, action) => {
        state.deliveryNotesLoading = false;
        state.deliveryNotes = action.payload.list;
        state.deliveryNotesTotalCount = action.payload.totalCount;
      })
      .addCase(getPurchaseDeliveryNotes.rejected, (state) => {
        state.deliveryNotesLoading = false;
      });
  }
});

export const { resetGRPOState } = goodsReceiptPOSlice.actions;
export default goodsReceiptPOSlice.reducer;
