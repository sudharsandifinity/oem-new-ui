import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const getProjects = createAsyncThunk('project/getProjects', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/sap/projects');
    return response?.data?.value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load projects');
  }
});

const initialState = {
  projects: [],
  loading: false,
  error: null
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default projectSlice.reducer;
