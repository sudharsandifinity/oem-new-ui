import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';


export const getusers = createAsyncThunk('user/getusers', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/users');
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load users');
  }
});
export const createUser = createAsyncThunk('user/create', async (payload, thunkAPI) => {
  try {
    const response = await axios.post('/admin/users', payload);
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

export const getUserId = createAsyncThunk('user/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch User');
  }
});

export const updateUser = createAsyncThunk('user/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await axios.patch(`/admin/users/${id}`, payload);
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
const initialState = {
  adminusers: [],
  listLoading: false,
  createLoading:false,
  updateloading:false,
  savesuccess:false,
  totalCount:0,
  error: null,

  currentUser:null,
  currentUserloading:false,
  currentUserError:null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentUser = null;
      state.currentUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getusers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getusers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminusers = action.payload || [];
      })
      .addCase(getusers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserId.pending, (state) => {
              state.currentUserloading = true;
              state.currentUser = null;
              state.currentUserError = null;
            })
            .addCase(getUserId.fulfilled, (state, action) => {
              state.currentUserloading = false;
              state.currentUser = action.payload;
            })
            .addCase(getUserId.rejected, (state, action) => {
              state.currentUserloading = false;
              state.currentUserError = action.payload || 'Failed to load';
            })
      
            .addCase(createUser.pending, (state) => {
              state.createLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(createUser.fulfilled, (state) => {
              state.createLoading = false;
              state.saveSuccess = true;
            })
            .addCase(createUser.rejected, (state, action) => {
              state.createLoading = false;
              state.error = action.payload?.message || action.payload;
            })
      
            .addCase(updateUser.pending, (state) => {
              state.updateLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(updateUser.fulfilled, (state) => {
              state.updateLoading = false;
              state.saveSuccess = true;
            })
            .addCase(updateUser.rejected, (state, action) => {
              state.updateLoading = false;
              state.error = action.payload?.message || action.payload;
            })
          
  }
});
export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
