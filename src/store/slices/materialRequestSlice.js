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
    const filterParts = [];
    if (email) filterParts.push(`U_OEM_UEMAIL eq '${email}'`);
    const params = { top, skip };
    if (filterParts.length) params.filter = filterParts.join(' and ');
    const response = await API.get('/sap/mr/list', { params });
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

export const getMRApprovals = createAsyncThunk('materialRequest/getApprovals', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/mr/approvals', { params: { top, skip } });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch approvals');
  }
});

export const approveMR = createAsyncThunk('materialRequest/approve', async ({ docEntry, remark = '' } = {}, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/mr/${docEntry}/approve`, { U_Apr_remark: remark });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to approve Material Request');
  }
});

export const rejectMR = createAsyncThunk('materialRequest/reject', async ({ docEntry, remark = '' } = {}, thunkAPI) => {
  try {
    const response = await API.patch(`/sap/mr/${docEntry}/reject`, { U_Apr_remark: remark });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reject Material Request');
  }
});

export const getMRPendingReport = createAsyncThunk('materialRequest/getPendingReport', async ({ top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/mr/pending-report', { params: { top, skip } });
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch pending approval report');
  }
});

export const getPendingDeliveryReport = createAsyncThunk('materialRequest/getPendingDelivery', async (_ = {}, thunkAPI) => {
  try {
    const response = await API.get('/sap/mr/pending-delivery');
    return {
      list: response.data.value ?? response.data,
      totalCount: response.data['odata.count'] || 0
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch pending delivery report');
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

    listRequestId: null,

    approvals: [],
    approvalsCount: 0,
    approvalsLoading: false,
    approvalsRequestId: null,
    decisionLoading: false,

    pendingDelivery: [],
    pendingDeliveryLoading: false,
    pendingDeliveryRequestId: null,

    pendingReport: [],
    pendingReportCount: 0,
    pendingReportLoading: false,
    pendingReportRequestId: null,

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
      .addCase(getMRList.pending, (state, action) => {
        state.listRequestId = action.meta.requestId;
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMRList.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMRList.rejected, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getMyMRList.pending, (state, action) => {
        state.listRequestId = action.meta.requestId;
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMyMRList.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
        state.listLoading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getMyMRList.rejected, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
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

      .addCase(getMRApprovals.pending, (state, action) => {
        state.approvalsRequestId = action.meta.requestId;
        state.approvalsLoading = true;
        state.error = null;
      })
      .addCase(getMRApprovals.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.approvalsRequestId) return;
        state.approvalsLoading = false;
        state.approvals = action.payload.list;
        state.approvalsCount = action.payload.totalCount;
      })
      .addCase(getMRApprovals.rejected, (state, action) => {
        if (action.meta.requestId !== state.approvalsRequestId) return;
        state.approvalsLoading = false;
        state.error = action.payload;
      })

      .addCase(approveMR.pending, (state) => {
        state.decisionLoading = true;
        state.error = null;
      })
      .addCase(approveMR.fulfilled, (state) => {
        state.decisionLoading = false;
      })
      .addCase(approveMR.rejected, (state, action) => {
        state.decisionLoading = false;
        state.error = action.payload;
      })

      .addCase(rejectMR.pending, (state) => {
        state.decisionLoading = true;
        state.error = null;
      })
      .addCase(rejectMR.fulfilled, (state) => {
        state.decisionLoading = false;
      })
      .addCase(rejectMR.rejected, (state, action) => {
        state.decisionLoading = false;
        state.error = action.payload;
      })

      .addCase(getMRPendingReport.pending, (state, action) => {
        state.pendingReportRequestId = action.meta.requestId;
        state.pendingReportLoading = true;
        state.error = null;
      })
      .addCase(getMRPendingReport.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.pendingReportRequestId) return;
        state.pendingReportLoading = false;
        state.pendingReport = action.payload.list;
        state.pendingReportCount = action.payload.totalCount;
      })
      .addCase(getMRPendingReport.rejected, (state, action) => {
        if (action.meta.requestId !== state.pendingReportRequestId) return;
        state.pendingReportLoading = false;
        state.error = action.payload;
      })

      .addCase(getPendingDeliveryReport.pending, (state, action) => {
        state.pendingDeliveryRequestId = action.meta.requestId;
        state.pendingDeliveryLoading = true;
        state.error = null;
      })
      .addCase(getPendingDeliveryReport.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.pendingDeliveryRequestId) return;
        state.pendingDeliveryLoading = false;
        state.pendingDelivery = action.payload.list;
      })
      .addCase(getPendingDeliveryReport.rejected, (state, action) => {
        if (action.meta.requestId !== state.pendingDeliveryRequestId) return;
        state.pendingDeliveryLoading = false;
        state.error = action.payload;
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
