import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';


export const getforms = createAsyncThunk('forms/getforms', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/forms');
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load forms');
  }
});
export const createForms = createAsyncThunk('forms/create', async (payload, thunkAPI) => {
  try {
    const response = await axios.post('/admin/forms', payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Forms Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getFormsId = createAsyncThunk('forms/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`/admin/forms/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Forms');
  }
});

export const updateForms = createAsyncThunk('forms/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await axios.patch(`/admin/forms/${id}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Forms Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});
const initialState = {
  forms: [],
  listLoading: false,
  createLoading:false,
  updateloading:false,
  savesuccess:false,
  totalCount:0,
  error: null,

  currentForms:null,
  currentFormsloading:false,
  currentFormsError:null,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    resetFormsState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentForms = null;
      state.currentFormsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getforms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload || [];
      })
      .addCase(getforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFormsId.pending, (state) => {
              state.currentFormsloading = true;
              state.currentForms = null;
              state.currentFormsError = null;
            })
            .addCase(getFormsId.fulfilled, (state, action) => {
              state.currentFormsloading = false;
              state.currentForms = action.payload;
            })
            .addCase(getFormsId.rejected, (state, action) => {
              state.currentFormsloading = false;
              state.currentFormsError = action.payload || 'Failed to load';
            })
      
            .addCase(createForms.pending, (state) => {
              state.createLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(createForms.fulfilled, (state) => {
              state.createLoading = false;
              state.saveSuccess = true;
            })
            .addCase(createForms.rejected, (state, action) => {
              state.createLoading = false;
              state.error = action.payload?.message || action.payload;
            })
      
            .addCase(updateForms.pending, (state) => {
              state.updateLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(updateForms.fulfilled, (state) => {
              state.updateLoading = false;
              state.saveSuccess = true;
            })
            .addCase(updateForms.rejected, (state, action) => {
              state.updateLoading = false;
              state.error = action.payload?.message || action.payload;
            })
          
  }
});
export const { resetFormsState } = formsSlice.actions;

export default formsSlice.reducer;
