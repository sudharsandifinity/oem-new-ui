import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getAttachments = createAsyncThunk('attachment/getAttachments', async (attachmentEntry, { rejectWithValue }) => {
  try {
    const response = await API.get(`/sap/attachments/${attachmentEntry}`);
    return response.data.Attachments2_Lines ?? [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch attachments');
  }
});

const attachmentSlice = createSlice({
  name: 'attachment',
  initialState: {
    attachments: [],
    loading: false,
    error: null
  },
  reducers: {
    clearAttachments: (state) => {
      state.attachments = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload;
      })
      .addCase(getAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAttachments } = attachmentSlice.actions;
export default attachmentSlice.reducer;
