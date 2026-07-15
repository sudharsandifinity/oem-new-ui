import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

const readCount = (res) => Number(res?.data?.['odata.count'] ?? res?.data?.['@odata.count'] ?? 0) || 0;

export const getPendingCounts = createAsyncThunk('dashboard/getPendingCounts', async ({ email = '' } = {}) => {
  const withEmail = (parts) => (email ? [...parts, `U_OEM_UEMAIL eq '${email}'`] : parts).join(' and ');

  const requests = [
    API.get('/sap/mr/list', { params: { top: 1, filter: withEmail([`U_DocStatus eq 'D'`]) } }),
    API.get('/sap/purchase-requests', { params: { top: 1, filter: withEmail([`DocumentStatus eq 'bost_Open'`]) } }),
    API.get('/sap/purchase-delivery-notes', { params: { top: 1, filter: withEmail([`DocumentStatus eq 'bost_Open'`]) } })
  ];

  const [mr, pr, grpo] = await Promise.allSettled(requests);
  const val = (r) => (r.status === 'fulfilled' ? readCount(r.value) : null);
  return { mr: val(mr), pr: val(pr), grpo: val(grpo) };
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    counts: { mr: null, pr: null, grpo: null },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
      })
      .addCase(getPendingCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load counts';
      });
  }
});

export default dashboardSlice.reducer;
