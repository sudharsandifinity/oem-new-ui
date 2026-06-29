import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from 'api/axios';

const initialState = {
  items: [],
  loading: false,
  error: null,

  childItems: [],
  childItemsLoading: false,
  childItemsError: null,

  bomChildItems: [],
  bomChildItemsLoading: false,
  bomChildItemsError: null
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

// Combined children of several parent items (one BOM's parents) merged into a
// single de-duplicated list. Each child carries its own U_HLB_ParItm.
export const getBomChildItems = createAsyncThunk('item/getBomChildItems', async (parentCodes, thunkAPI) => {
  try {
    const codes = (Array.isArray(parentCodes) ? parentCodes : [parentCodes]).filter(Boolean);
    const lists = await Promise.all(
      codes.map((code) => API.get(`/sap/items/children?parentCode=${encodeURIComponent(code)}`).then((r) => r.data?.value || []))
    );
    const merged = [];
    const seen = new Set();
    lists.flat().forEach((item) => {
      if (!seen.has(item.ItemCode)) {
        seen.add(item.ItemCode);
        merged.push(item);
      }
    });
    return merged;
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
      })
      .addCase(getBomChildItems.pending, (state) => {
        state.bomChildItemsLoading = true;
        state.bomChildItemsError = null;
      })
      .addCase(getBomChildItems.fulfilled, (state, action) => {
        state.bomChildItemsLoading = false;
        state.bomChildItems = action.payload;
      })
      .addCase(getBomChildItems.rejected, (state, action) => {
        state.bomChildItemsLoading = false;
        state.bomChildItemsError = action.payload;
      });
  }
});

export default itemSlice.reducer;
