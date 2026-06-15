// src/store/slices/currencySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getCurrencies = createAsyncThunk('currency/getCurrencies', async (_, thunkAPI) => {
  try {
    const response = await api.get('/ess/currency');
    return response?.data?.value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to fetch currencies');
  }
});

const currencySlice = createSlice({
  name: 'currency',

  initialState: {
    currencies: [],
    loading: false,
    error: null
  },

  reducers: {
    clearCurrencyError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload || [];
      })
      .addCase(getCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { clearCurrencyError } = currencySlice.actions;

export default currencySlice.reducer;
