import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getMRList = createAsyncThunk('materialRequest/getList', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/mr/list', { params: { top, skip } });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch MR list');
  }
});

export const getMyMRList = createAsyncThunk('materialRequest/getMyList', async ({ top = 25, skip = 0, email = '' } = {}, thunkAPI) => {
  try {
    const filterParts = ["Status eq 'O'"];
    if (email) filterParts.push(`U_OEM_UEMAIL eq '${email}'`);
    const response = await API.get('/sap/mr/list', {
      params: { top, skip, filter: filterParts.join(' and ') }
    });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch MR list');
  }
});

export const createMR = createAsyncThunk('materialRequest/create', async (payload, thunkAPI) => {
  try {
    const response = await API.post('/sap/mr', payload);
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

export const getMRById = createAsyncThunk('materialRequest/getById', async (docEntry, thunkAPI) => {
  try {
    const response = await API.get(`/sap/mr/${docEntry}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Material Request');
  }
});

export const updateMR = createAsyncThunk('materialRequest/update', async ({ docEntry, payload }, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/mr/${docEntry}`, payload);
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

export const getBOQList = createAsyncThunk('materialRequest/getBOQList', async ({ U_BPCode = '', U_PrjCode = '' } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/boq/active', { params: { U_BPCode, U_PrjCode } });
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch BOQ list');
  }
});

const materialRequestSlice = createSlice({
  name: 'materialRequest',
  initialState: {
    list: [],
    totalCount: 0,
    listLoading: false,

    currentMR: null,
    currentMRLoading: false,
    currentMRError: null,

    boqList: [],
    boqLoading: false,

    createLoading: false,
    updateLoading: false,
    saveSuccess: false,
    error: null
  },
  reducers: {
    resetMRState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentMR = null;
      state.currentMRError = null;
    },
    clearBOQList: (state) => {
      state.boqList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMRList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMRList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMRList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getMyMRList.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMyMRList.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMyMRList.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getMRById.pending, (state) => {
        state.currentMRLoading = true;
        state.currentMR = null;
        state.currentMRError = null;
      })
      .addCase(getMRById.fulfilled, (state, action) => {
        state.currentMRLoading = false;
        state.currentMR = action.payload;
      })
      .addCase(getMRById.rejected, (state, action) => {
        state.currentMRLoading = false;
        state.currentMRError = action.payload || 'Failed to load';
      })

      .addCase(createMR.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(createMR.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createMR.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateMR.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(updateMR.fulfilled, (state) => {
        state.updateLoading = false;
        state.saveSuccess = true;
      })
      .addCase(updateMR.rejected, (state, action) => {
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

export const { resetMRState, clearBOQList } = materialRequestSlice.actions;
export default materialRequestSlice.reducer;
