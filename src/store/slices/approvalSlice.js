import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getMyApprovals = createAsyncThunk('approval/getMyApprovals', async ({ docType = 'MR', top = 25, skip = 0 } = {}, thunkAPI) => {
  try {
    const response = await API.get('/approvals/my-pending', { params: { docType, top, skip } });
    return { list: response.data.value ?? [], count: response.data.count ?? 0 };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch approvals');
  }
});

export const getMySentBack = createAsyncThunk('approval/getMySentBack', async ({ docType = 'MR' } = {}, thunkAPI) => {
  try {
    const response = await API.get('/approvals/my-sent-back', { params: { docType } });
    return response.data.value ?? [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch sent-back requests');
  }
});

export const getApprovalRequestById = createAsyncThunk('approval/getById', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/approvals/requests/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to load approval request');
  }
});

export const approveApprovalRequest = createAsyncThunk('approval/approve', async ({ id, remark = '' }, thunkAPI) => {
  try {
    const response = await API.post(`/approvals/requests/${id}/approve`, { remark });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to approve');
  }
});

export const rejectApprovalRequest = createAsyncThunk('approval/reject', async ({ id, remark = '' }, thunkAPI) => {
  try {
    const response = await API.post(`/approvals/requests/${id}/reject`, { remark });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reject');
  }
});

export const resubmitApprovalRequest = createAsyncThunk('approval/resubmit', async (id, thunkAPI) => {
  try {
    const response = await API.post(`/approvals/requests/${id}/resubmit`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to resubmit');
  }
});

const approvalSlice = createSlice({
  name: 'approval',
  initialState: {
    list: [],
    count: 0,
    listLoading: false,

    sentBack: [],
    sentBackLoading: false,

    current: null,
    currentLoading: false,
    currentError: null,

    decisionLoading: false,
    error: null
  },
  reducers: {
    resetApprovalState: (state) => {
      state.current = null;
      state.currentError = null;
      state.decisionLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyApprovals.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getMyApprovals.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload.list;
        state.count = action.payload.count;
      })
      .addCase(getMyApprovals.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })

      .addCase(getMySentBack.pending, (state) => {
        state.sentBackLoading = true;
      })
      .addCase(getMySentBack.fulfilled, (state, action) => {
        state.sentBackLoading = false;
        state.sentBack = action.payload;
      })
      .addCase(getMySentBack.rejected, (state) => {
        state.sentBackLoading = false;
      })

      .addCase(getApprovalRequestById.pending, (state) => {
        state.currentLoading = true;
        state.current = null;
        state.currentError = null;
      })
      .addCase(getApprovalRequestById.fulfilled, (state, action) => {
        state.currentLoading = false;
        state.current = action.payload;
      })
      .addCase(getApprovalRequestById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.payload || 'Failed to load';
      })

      .addMatcher(
        (action) => [approveApprovalRequest.pending.type, rejectApprovalRequest.pending.type, resubmitApprovalRequest.pending.type].includes(action.type),
        (state) => {
          state.decisionLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [approveApprovalRequest.fulfilled.type, rejectApprovalRequest.fulfilled.type, resubmitApprovalRequest.fulfilled.type].includes(action.type),
        (state) => {
          state.decisionLoading = false;
        }
      )
      .addMatcher(
        (action) =>
          [approveApprovalRequest.rejected.type, rejectApprovalRequest.rejected.type, resubmitApprovalRequest.rejected.type].includes(action.type),
        (state, action) => {
          state.decisionLoading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { resetApprovalState } = approvalSlice.actions;
export default approvalSlice.reducer;
