import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  quotationlist: [],
  totalCount: 0, 
  currentOrder: null,
  loading: false,
  error: null,
  saveSuccess: false
};

export const getSalesQuotations = createAsyncThunk('SalesQuotation/getAll', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/quotations', { params: { top, skip } });
    return {
      quotationlist: response.data.value,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales orders');
  }
});

export const createSalesQuotation = createAsyncThunk('SalesQuotation/create', async (formData, thunkAPI) => {
  try {
    const response = await API.post('/sap/quotations', formData, {
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

export const updateSalesQuotation = createAsyncThunk('SalesQuotation/update', async ({ docEntry, formData }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/quotations/${docEntry}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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

export const getSalesQuotationById = createAsyncThunk('SalesQuotation/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/quotations/${docEntry}`);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sales order');
  }
});

const SalesQuotationSlice = createSlice({
  name: 'SalesQuotation',
  initialState,

  reducers: {
    resetSalesQuotationState: (state) => {
      state.loading = false;
      state.error = null;
      state.saveSuccess = false;
      state.currentOrder = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getSalesQuotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSalesQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotationlist = action.payload.quotationlist;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(getSalesQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSalesQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(createSalesQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(createSalesQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateSalesQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveSuccess = false;
      })

      .addCase(updateSalesQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.saveSuccess = true;
      })

      .addCase(updateSalesQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getSalesQuotationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSalesQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        console.log('ccccc', state.currentOrder);
      })

      .addCase(getSalesQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSalesQuotationState } = SalesQuotationSlice.actions;

export default SalesQuotationSlice.reducer;
