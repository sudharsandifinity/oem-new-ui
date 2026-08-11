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

export const getARInvoices = createAsyncThunk('ARInvoice/getAll', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/sales-invoices', { params: { top, skip } });
    return {
      invoices: response.data.value,
      totalCount: response.data['@odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales invoices');
  }
});

export const createARInvoice = createAsyncThunk('ARInvoice/create', async (formData, thunkAPI) => {
  try {
    const response = await API.post('/sap/sales-invoices', formData, {
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

export const updateARInvoice = createAsyncThunk('ARInvoice/update', async ({ docEntry, formData }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/sales-invoices/${docEntry}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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

export const getARInvoiceById = createAsyncThunk('ARInvoice/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/sales-invoices/${docEntry}`);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales invoice');
  }
});

const ARInvoiceSlice = createSlice({
  name: 'ARInvoice',
  initialState,

  reducers: {
    resetARInvoiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.saveSuccess = false;
      state.currentInvoice = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getARInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getARInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(getARInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createARInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(createARInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        state.saveSuccess = true;
      })

      .addCase(createARInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateARInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(updateARInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        state.saveSuccess = true;
      })

      .addCase(updateARInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getARInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getARInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        console.log('ccccc', state.currentInvoice);
      })

      .addCase(getARInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetARInvoiceState } = ARInvoiceSlice.actions;

export default ARInvoiceSlice.reducer;
