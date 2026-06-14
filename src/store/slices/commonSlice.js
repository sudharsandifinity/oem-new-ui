import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';

export const getUsers = createAsyncThunk(
  'common/getUsers',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/sap/users');
      return response.data.value ?? response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getEmployees = createAsyncThunk(
  'common/getEmployees',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/sap/employees');
      return response.data.value ?? response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const getDepartments = createAsyncThunk(
  'common/getDepartments',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/sap/departments');
      return response.data.value ?? response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    users: [],
    usersLoading: false,

    employees: [],
    employeesLoading: false,

    departments: [],
    departmentsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending,    (state) => { state.usersLoading = true; })
      .addCase(getUsers.fulfilled,  (state, action) => { state.usersLoading = false; state.users = action.payload; })
      .addCase(getUsers.rejected,   (state) => { state.usersLoading = false; })

      .addCase(getEmployees.pending,    (state) => { state.employeesLoading = true; })
      .addCase(getEmployees.fulfilled,  (state, action) => { state.employeesLoading = false; state.employees = action.payload; })
      .addCase(getEmployees.rejected,   (state) => { state.employeesLoading = false; })

      .addCase(getDepartments.pending,    (state) => { state.departmentsLoading = true; })
      .addCase(getDepartments.fulfilled,  (state, action) => { state.departmentsLoading = false; state.departments = action.payload; })
      .addCase(getDepartments.rejected,   (state) => { state.departmentsLoading = false; });
  }
});

export default commonSlice.reducer;
