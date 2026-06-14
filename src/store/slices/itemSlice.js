import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export const getItems = createAsyncThunk(
  'item/getItems',
  async (_, thunkAPI) => {
    try {
      const response = await API.get(
        '/sap/items'
      );
      return response.data?.value || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        'Failed to load items'
      );
    }
  }
);

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default itemSlice.reducer;