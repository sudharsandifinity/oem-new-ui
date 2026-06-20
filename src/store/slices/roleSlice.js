import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getadminRoles = createAsyncThunk('role/getRoles', async (_, thunkAPI) => {
  try {
    const response = await API.get('/company-admin/roles');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
  }
});
export const createAdminRoles = createAsyncThunk('role/create', async (payload, thunkAPI) => {
  try {
    const response = await API.post('/company-admin/roles', payload);
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

export const getAdminRoleById = createAsyncThunk('role/getById', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/company-admin/roles/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Roles ');
  }
});

export const updateAdminRoles = createAsyncThunk('role/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await API.put(`/company-admin/roles/${id}`, payload);
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

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    roles:[],
    roleloading:false,
    roleerror:null,
    roletotalCount: 0,
     rolesaveSuccess: false,
     createroleLoading: false,
    updateroleLoading: false,

     currentAdminRole: null,
    currentAdminRoleLoading: false,
    currentAdminRoleError: null,
  },
  reducers: {
     resetAdminRoleState: (state) => {
      state.createroleLoading = false;
      state.updateroleLoading = false;
      state.rolesaveSuccess = false;
      state.roleerror = null;
      state.currentAdminRole = null;
      state.currentAdminRoleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdminRoles.pending, (state) => {
              state.createroleLoading = true;
              state.roleerror = null;
              state.rolesaveSuccess = false;
            })
            .addCase(createAdminRoles.fulfilled, (state) => {
              state.createroleLoading = false;
              state.rolesaveSuccess = true;
            })
            .addCase(createAdminRoles.rejected, (state, action) => {
              state.createroleLoading = false;
              state.roleerror = action.payload?.message || action.payload;
            })
      
            .addCase(updateAdminRoles.pending, (state) => {
              state.updateroleLoading = true;
              state.roleerror = null;
              state.rolesaveSuccess = false;
            })
            .addCase(updateAdminRoles.fulfilled, (state) => {
              state.updateroleLoading = false;
              state.rolesaveSuccess = true;
            })
            .addCase(updateAdminRoles.rejected, (state, action) => {
              state.updateroleLoading = false;
              state.roleerror = action.payload?.message || action.payload;
            })
      
            .addCase(getadminRoles.pending, (state) => {
              state.roleloading = true;
            })
            .addCase(getadminRoles.fulfilled, (state, action) => {
              state.roleloading = false;
              state.roles = action.payload;
              state.totalCount = action.payload.totalCount;
      
            })
            .addCase(getadminRoles.rejected, (state) => {
              state.roleloading = false;
              state.roleerror = action.payload;
            })
      
            .addCase(getAdminRoleById.pending, (state) => {
              state.currentAdminRoleLoading = true;
              state.currentAdminRole = null;
              state.currentAdminRoleError = null;
            })
            .addCase(getAdminRoleById.fulfilled, (state, action) => {
              state.currentAdminRoleLoading = false;
              state.currentAdminRole = action.payload;
            })
            .addCase(getAdminRoleById.rejected, (state, action) => {
              state.currentAdminRoleLoading = false;
              state.currentAdminRoleError = action.payload || 'Failed to load';
            })
  }
});
export const { resetAdminRoleState } = roleSlice.actions;

export default roleSlice.reducer;
