import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const syncBranches = createAsyncThunk('companies/syncBranches', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/sap/branches/sync`, data, { withCredentials: true });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Error syncing branches');
  }
});
export const getcompanies = createAsyncThunk('companies/getcompanies', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/companies');
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load companies');
  }
});
export const createCompany = createAsyncThunk('companies/create', async (payload, thunkAPI) => {
  try {
    const response = await axios.post('/admin/companies', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Company Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getCompanyId = createAsyncThunk('companies/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`/admin/companies/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Company');
  }
});

export const updateCompany = createAsyncThunk('companies/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await axios.patch(`/admin/companies/${id}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Company Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});
const initialState = {
  companies: [],
  listLoading: false,
  createLoading:false,
  updateloading:false,
  savesuccess:false,
  totalCount:0,
  error: null,

  currentCompany:null,
  currentCompanyloading:false,
  currentCompanyError:null,
};

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    resetCompanyState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentCompany = null;
      state.currentCompanyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getcompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getcompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload || [];
      })
      .addCase(getcompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCompanyId.pending, (state) => {
              state.currentCompanyloading = true;
              state.currentCompany = null;
              state.currentCompanyError = null;
            })
            .addCase(getCompanyId.fulfilled, (state, action) => {
              state.currentCompanyloading = false;
              state.currentCompany = action.payload;
            })
            .addCase(getCompanyId.rejected, (state, action) => {
              state.currentCompanyloading = false;
              state.currentCompanyError = action.payload || 'Failed to load';
            })
      
            .addCase(createCompany.pending, (state) => {
              state.createLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(createCompany.fulfilled, (state) => {
              state.createLoading = false;
              state.saveSuccess = true;
            })
            .addCase(createCompany.rejected, (state, action) => {
              state.createLoading = false;
              state.error = action.payload?.message || action.payload;
            })
      
            .addCase(updateCompany.pending, (state) => {
              state.updateLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(updateCompany.fulfilled, (state) => {
              state.updateLoading = false;
              state.saveSuccess = true;
            })
            .addCase(updateCompany.rejected, (state, action) => {
              state.updateLoading = false;
              state.error = action.payload?.message || action.payload;
            })
            .addCase(syncBranches.fulfilled, (state, action) => {
        const updatedCompany = action.payload;
        const index = state.companies.findIndex((c) => c.id === updatedCompany.id); 
        // Handle successful branch synchronization
      })
      .addCase(syncBranches.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  }
});
export const { resetCompanyState } = companySlice.actions;

export default companySlice.reducer;
