import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getadminCompanies = createAsyncThunk('commonCustomer/getCompanies', async (_, thunkAPI) => {
  try {
    const response = await API.get('/company-admin/companies');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
  }
});
export const getmenus = createAsyncThunk('commonCustomer/getMenus', async (_, thunkAPI) => {
  try {
    const response = await API.get('/company-admin/menus');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Menus');
  }
});

export const getadminUsers = createAsyncThunk('commonCustomer/getUsers', async (_, thunkAPI) => {
  try {
    const response = await API.get('/company-admin/users');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});
export const createAdminUsers = createAsyncThunk('commonCustomer/create', async (payload, thunkAPI) => {
  try {
    const response = await API.post('/company-admin/users', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'User Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getAdminUsersById = createAsyncThunk('commonCustomer/getById', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/company-admin/users/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Users ');
  }
});

export const updateAdminUsers = createAsyncThunk('commonCustomer/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await API.patch(`/company-admin/users/${id}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'User Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});


export const getCompanyProjects = createAsyncThunk('commonCustomer/getCompanyProjects', async (_, thunkAPI) => {
  try {
    const response = await API.get('/company-admin/projects');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
  }
});

export const syncCompanyProjects = createAsyncThunk('commonCustomer/syncCompanyProjects', async (payload = {}, thunkAPI) => {
  try {
    const response = await API.post('/company-admin/projects/sync', payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to sync projects');
  }
});

export const getEmployees = createAsyncThunk('commonCustomer/getEmployees', async (_, thunkAPI) => {
  try {
    const response = await API.get('/sap/employees');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
  }
});

export const getDepartments = createAsyncThunk('commonCustomer/getDepartments', async (_, thunkAPI) => {
  try {
    const response = await API.get('/sap/departments');
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
  }
});

export const getVendors = createAsyncThunk('commonCustomer/getVendors', async (_, thunkAPI) => {
  try {
    const response = await API.get('/sap/business-partners/vendors', { params: { top: 200 } });
    return response.data.value ?? response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
  }
});

const commonCustomerSlice = createSlice({
  name: 'commonCustomer',
  initialState: {
    users: [],
    totalCount: 0,
    usersLoading: false,
     saveSuccess: false,
     createLoading: false,
    updateLoading: false,
    error:null,

     currentAdminUser: null,
    currentAdminUserLoading: false,
    currentAdminUserError: null,

    companies:[],
    companyLoading:false,
    companyError:null,

    
    menus:[],
    menuLoading:false,
    menuError:null,

    companyProjects: [],
    companyProjectsLoading: false,
    syncLoading: false,

    employees: [],
    employeesLoading: false,

    departments: [],
    departmentsLoading: false,

    vendors: [],
    vendorsLoading: false
  },
  reducers: {
     resetAdminUserState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentAdminUser = null;
      state.currentAdminUserError = null;
    },
   
  },
  extraReducers: (builder) => {
    builder
    .addCase(getadminCompanies.pending, (state) => {
        state.companyLoading = true;
      })
      .addCase(getadminCompanies.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.companies = action.payload;
        state.totalCount = action.payload.totalCount;

      })
      .addCase(getadminCompanies.rejected, (state) => {
        state.companyLoading = false;
        state.menuError = action.payload;
      })

.addCase(getmenus.pending, (state) => {
        state.menuLoading = true;
      })
      .addCase(getmenus.fulfilled, (state, action) => {
        state.menuLoading = false;
        state.menus = action.payload;
        state.totalCount = action.payload.totalCount;

      })
      .addCase(getmenus.rejected, (state) => {
        state.menuLoading = false;
        state.error = action.payload;
      })

      .addCase(createAdminUsers.pending, (state) => {
        state.createLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(createAdminUsers.fulfilled, (state) => {
        state.createLoading = false;
        state.saveSuccess = true;
      })
      .addCase(createAdminUsers.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateAdminUsers.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.saveSuccess = false;
      })
      .addCase(updateAdminUsers.fulfilled, (state) => {
        state.updateLoading = false;
        state.saveSuccess = true;
      })
      .addCase(updateAdminUsers.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(getadminUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(getadminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
        state.totalCount = action.payload.totalCount;

      })
      .addCase(getadminUsers.rejected, (state) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      .addCase(getAdminUsersById.pending, (state) => {
        state.currentAdminUserLoading = true;
        state.currentAdminUser = null;
        state.currentAdminUserError = null;
      })
      .addCase(getAdminUsersById.fulfilled, (state, action) => {
        state.currentAdminUserLoading = false;
        state.currentAdminUser = action.payload;
      })
      .addCase(getAdminUsersById.rejected, (state, action) => {
        state.currentAdminUserLoading = false;
        state.currentAdminUserError = action.payload || 'Failed to load';
      })

      

      .addCase(getCompanyProjects.pending, (state) => {
        state.companyProjectsLoading = true;
      })
      .addCase(getCompanyProjects.fulfilled, (state, action) => {
        state.companyProjectsLoading = false;
        state.companyProjects = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCompanyProjects.rejected, (state, action) => {
        state.companyProjectsLoading = false;
        state.error = action.payload;
      })

      .addCase(syncCompanyProjects.pending, (state) => {
        state.syncLoading = true;
        state.error = null;
      })
      .addCase(syncCompanyProjects.fulfilled, (state) => {
        state.syncLoading = false;
      })
      .addCase(syncCompanyProjects.rejected, (state, action) => {
        state.syncLoading = false;
        state.error = action.payload;
      })

      .addCase(getEmployees.pending, (state) => {
        state.employeesLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.employeesLoading = false;
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state) => {
        state.employeesLoading = false;
      })

      .addCase(getDepartments.pending, (state) => {
        state.departmentsLoading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(getDepartments.rejected, (state) => {
        state.departmentsLoading = false;
      })

      .addCase(getVendors.pending, (state) => {
        state.vendorsLoading = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.vendors = action.payload;
      })
      .addCase(getVendors.rejected, (state) => {
        state.vendorsLoading = false;
      });
  }
});
export const { resetAdminUserState } = commonCustomerSlice.actions;

export default commonCustomerSlice.reducer;
