import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

const initialState = {
  customers: [],
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

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.error = null;
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
      });
  }
});

export const { resetCustomerState } = customerSlice.actions;

export default customerSlice.reducer;
