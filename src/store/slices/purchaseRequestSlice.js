import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getPRList = createAsyncThunk('purchaseRequest/getList', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/purchase-requests', { params: { top, skip } });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch PR list');
  }
});

export const getMyPRList = createAsyncThunk('purchaseRequest/getMyList', async ({ top = 25, skip = 0, email = '' } = {}, thunkAPI) => {
  try {
    const filterParts = ["DocumentStatus eq 'bost_Open'"];
    if (email) filterParts.push(`U_OEM_UEMAIL eq '${email}'`);
    const response = await API.get('/sap/purchase-requests', {
      params: { top, skip, filter: filterParts.join(' and ') }
    });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch PR list');
  }
});

export const createPR = createAsyncThunk('purchaseRequest/create', async (payload, thunkAPI) => {
  try {
    const response = await API.post('/sap/purchase-requests', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Purchase Request Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getPRById = createAsyncThunk('purchaseRequest/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/purchase-requests/${docEntry}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Purchase Request');
  }
});

const purchaseRequestSlice = createSlice({
  name: 'purchaseRequest',
  initialState: {
    list: [],
    totalCount: 0,
    listLoading: false,

    currentPR: null,
    currentPRLoading: false,
    currentPRError: null,

    createLoading: false,
    saveSuccess: false,
    error: null
  },
  reducers: {
    resetPRState: (state) => {
      state.createLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentPR = null;
      state.currentPRError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPRList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getPRList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getPRList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getMyPRList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMyPRList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMyPRList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getPRById.pending, (state) => {
        state.currentPRLoading = true;
        state.currentPR = null;
        state.currentPRError = null;
      })
      .addCase(getPRById.fulfilled, (state, action) => {
        state.currentPRLoading = false;
        state.currentPR = action.payload;
      })
      .addCase(getPRById.rejected, (state, action) => {
        state.currentPRLoading = false;
        state.currentPRError = action.payload || 'Failed to load';
      })

      .addCase(createPR.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(createPR.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createPR.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || action.payload;
      });
  }
});

export const { resetPRState } = purchaseRequestSlice.actions;
export default purchaseRequestSlice.reducer;
