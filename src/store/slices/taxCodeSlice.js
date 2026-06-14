import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  taxCodes: [],
  loading: false,
  error: null
};

export const getTaxCodes = createAsyncThunk(
  'taxCode/getTaxCodes',

  async (_, thunkAPI) => {
    try {
      const response = await API.get(
        '/sap/tax-code/sales-order'
      );
      return response.data?.value || [];
    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        'Failed to load tax codes'
      );
    }
  }
);

const taxCodeSlice = createSlice({
  name: 'taxCode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addCase(getTaxCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaxCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxCodes = action.payload;
      })
      .addCase(getTaxCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default taxCodeSlice.reducer;