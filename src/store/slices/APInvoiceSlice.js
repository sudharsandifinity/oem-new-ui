import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  invoices: [],
  totalCount: 0, 
  currentInvoice: null,
  loading: false,
  error: null,
  saveSuccess: false
};

export const getAPInvoices = createAsyncThunk('APInvoice/getAll', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/purchase-invoices', { params: { top, skip } });
    return {
      invoices: response.data.value,
      totalCount: response.data['@odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales invoices');
  }
});

export const createAPInvoice = createAsyncThunk('APInvoice/create', async (formData, thunkAPI) => {
  try {
    const response = await API.post('/sap/purchase-invoices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;

    return thunkAPI.rejectWithValue({
      status: error.response?.status,

      message: responseData?.error?.error?.message?.value || responseData?.message || 'Sales Invoice Create Failed',

      sapCode: responseData?.error?.error?.code
    });
  }
});

export const updateAPInvoice = createAsyncThunk('APInvoice/update', async ({ docEntry, formData }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/purchase-invoices/${docEntry}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: responseData?.error?.error?.message?.value || responseData?.message || 'Sales Invoice Update Failed',
      sapCode: responseData?.error?.error?.code
    });
  }
});

export const getAPInvoiceById = createAsyncThunk('APInvoice/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/purchase-invoices/${docEntry}`);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales invoice');
  }
});

const APInvoiceSlice = createSlice({
  name: 'APInvoice',
  initialState,

  reducers: {
    resetAPInvoiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.saveSuccess = false;
      state.currentInvoice = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAPInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAPInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(getAPInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAPInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(createAPInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        state.saveSuccess = true;
      })

      .addCase(createAPInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateAPInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(updateAPInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        state.saveSuccess = true;
      })

      .addCase(updateAPInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getAPInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAPInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        console.log('ccccc', state.currentInvoice);
      })

      .addCase(getAPInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAPInvoiceState } = APInvoiceSlice.actions;

export default APInvoiceSlice.reducer;
