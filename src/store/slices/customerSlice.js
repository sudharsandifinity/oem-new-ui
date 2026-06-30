import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

const initialState = {
  vendor:[],
  customers: [],
  vendorLoading:false,
  vendorerror:null,
  loading: false,
  error: null
};

export const getCustomers = createAsyncThunk(
  'customer/getCustomers',

  async (_, thunkAPI) => {
    try {
      const response = await API.get('/sap/business-partners/customers');
      return response.data.value;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load customers');
    }
  }
);
export const getVendors = createAsyncThunk(
  'customer/getVendors',

  async (_, thunkAPI) => {
    try {
      const response = await API.get('/sap/business-partners/vendors');
      return response.data.value;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load vendors');
    }
  }
);
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.error = null;
    },
    resetVendorState:(state)=>{
      state.error=null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(getVendors.pending, (state) => {
        state.vendorLoading = true;
        state.vendorerror = null;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.vendorLoading = false;
        state.vendor = action.payload;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.vendorLoading = false;
        state.vendorerror = action.payload;
      });
  }
});

export const { resetCustomerState } = customerSlice.actions;

export default customerSlice.reducer;
