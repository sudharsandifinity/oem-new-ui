import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getDraftList = createAsyncThunk('draft/getList', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/drafts', { params: { top, skip } });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Draft list');
  }
});

export const createDraft = createAsyncThunk('draft/create', async (payload, thunkAPI) => {
  try {
    const response = await API.post('/sap/drafts', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Material Request Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getDraftById = createAsyncThunk('draft/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/drafts/${docEntry}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Material Request');
  }
});

export const updateDraft = createAsyncThunk('draft/update', async ({ docEntry, payload }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/drafts/${docEntry}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Material Request Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getBOQList = createAsyncThunk('draft/getBOQList', async ({ U_BPCode = '', U_PrjCode = '' } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/boq/active', { params: { U_BPCode, U_PrjCode } });
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch BOQ list');
  }
});

const draftSlice = createSlice({
  name: 'draft',
  initialState: {
    list: [],
    totalCount: 0,
    listLoading: false,

    currentDraft: null,
    currentDraftLoading: false,
    currentDraftError: null,

    boqList: [],
    boqLoading: false,

    createLoading: false,
    updateLoading: false,
    saveSuccess: false,
    error: null
  },
  reducers: {
    resetDraftState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentDraft = null;
      state.currentDraftError = null;
    },
    clearBOQList: (state) => {
      state.boqList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDraftList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getDraftList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getDraftList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getDraftById.pending, (state) => {
        state.currentDraftLoading = true;
        state.currentDraft = null;
        state.currentDraftError = null;
      })
      .addCase(getDraftById.fulfilled, (state, action) => {
        state.currentDraftLoading = false;
        state.currentDraft = action.payload;
      })
      .addCase(getDraftById.rejected, (state, action) => {
        state.currentDraftLoading = false;
        state.currentDraftError = action.payload || 'Failed to load';
      })

      .addCase(createDraft.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(createDraft.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateDraft.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(updateDraft.fulfilled, (state) => {
        state.updateLoading = false;
        state.saveSuccess = true;
      })
      .addCase(updateDraft.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getBOQList.pending, (state) => {
        state.boqLoading = true;
      })
      .addCase(getBOQList.fulfilled, (state, action) => {
        state.boqLoading = false;
        state.boqList = action.payload;
      })
      .addCase(getBOQList.rejected, (state) => {
        state.boqLoading = false;
      });
  }
});

export const { resetDraftState, clearBOQList } = draftSlice.actions;
export default draftSlice.reducer;
