import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from 'api/axios';
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,

  loading: false,
  error: null,

  isAuthenticated: !!token
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',

  async (credentials, thunkAPI) => {
    try {
      const response = await API.post('/auth/login', credentials);

      const data = response.data;
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
