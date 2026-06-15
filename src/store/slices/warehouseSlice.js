import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const getWarehouses = createAsyncThunk('warehouse/getWarehouses', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/sap/warehouses');
    return response?.data?.value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load warehouses');
  }
});

const initialState = {
  warehouses: [],
  loading: false,
  error: null
};

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = action.payload || [];
      })
      .addCase(getWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default warehouseSlice.reducer;
