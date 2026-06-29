import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';


export const getroles = createAsyncThunk('role/getroles', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/roles');
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load roles');
  }
});
export const createRole = createAsyncThunk('role/create', async (payload, thunkAPI) => {
  try {
    const response = await axios.post('/admin/roles', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Role Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getRoleId = createAsyncThunk('role/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`/admin/roles/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Role');
  }
});

export const updateRole = createAsyncThunk('role/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await axios.patch(`/admin/roles/${id}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Role Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});
const initialState = {
  roles: [],
  listLoading: false,
  createLoading:false,
  updateloading:false,
  savesuccess:false,
  totalCount:0,
  error: null,

  currentRole:null,
  currentRoleloading:false,
  currentRoleError:null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    resetRoleState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentRole = null;
      state.currentRoleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getroles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getroles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload || [];
      })
      .addCase(getroles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRoleId.pending, (state) => {
              state.currentRoleloading = true;
              state.currentRole = null;
              state.currentRoleError = null;
            })
            .addCase(getRoleId.fulfilled, (state, action) => {
              state.currentRoleloading = false;
              state.currentRole = action.payload;
            })
            .addCase(getRoleId.rejected, (state, action) => {
              state.currentRoleloading = false;
              state.currentRoleError = action.payload || 'Failed to load';
            })
      
            .addCase(createRole.pending, (state) => {
              state.createLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(createRole.fulfilled, (state) => {
              state.createLoading = false;
              state.saveSuccess = true;
            })
            .addCase(createRole.rejected, (state, action) => {
              state.createLoading = false;
              state.error = action.payload?.message || action.payload;
            })
      
            .addCase(updateRole.pending, (state) => {
              state.updateLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(updateRole.fulfilled, (state) => {
              state.updateLoading = false;
              state.saveSuccess = true;
            })
            .addCase(updateRole.rejected, (state, action) => {
              state.updateLoading = false;
              state.error = action.payload?.message || action.payload;
            })
          
  }
});
export const { resetRoleState } = roleSlice.actions;

export default roleSlice.reducer;
