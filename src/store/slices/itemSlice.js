import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  items: [],
  loading: false,
  error: null,

  childItems: [],
  childItemsLoading: false,
  childItemsError: null
};

export const getItems = createAsyncThunk('item/getItems', async (_, thunkAPI) => {
  try {
    const response = await API.get('/sap/items');
    return response.data?.value || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load items');
  }
});

export const getChildItems = createAsyncThunk('item/getChildItems', async (parentCode, thunkAPI) => {
  try {
    const response = await API.get(`/sap/items/children?parentCode=${parentCode}`);
    return response.data?.value || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load child items');
  }
});

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
      })
      .addCase(getChildItems.pending, (state) => {
        state.childItemsLoading = true;
        state.childItemsError = null;
      })
      .addCase(getChildItems.fulfilled, (state, action) => {
        state.childItemsLoading = false;
        state.childItems = action.payload;
      })
      .addCase(getChildItems.rejected, (state, action) => {
        state.childItemsLoading = false;
        state.childItemsError = action.payload;
      });
  }
});

export default itemSlice.reducer;
