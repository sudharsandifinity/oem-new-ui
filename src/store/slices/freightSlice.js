import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getFreights = createAsyncThunk('freight/getFreights', async (_, thunkAPI) => {
  try {
    const response = await api.get('/sap/others/freights');
    return response?.data?.value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to fetch freights');
  }
});

const freightSlice = createSlice({
  name: 'freight',
  initialState: {
    freights: [],
    loading: false,
    error: null
  },

  reducers: {
    clearFreightError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFreights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFreights.fulfilled, (state, action) => {
        state.loading = false;
        state.freights = action.payload || [];
      })
      .addCase(getFreights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export const { clearFreightError } = freightSlice.actions;
export default freightSlice.reducer;
