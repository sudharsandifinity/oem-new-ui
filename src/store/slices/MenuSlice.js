import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';


export const getadminmenus = createAsyncThunk('menus/getmenus', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/admin/user-menus');
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || 'Failed to load menus');
  }
});
export const createMenu = createAsyncThunk('menus/create', async (payload, thunkAPI) => {
  try {
    const response = await axios.post('/admin/user-menus', payload);
    console.log("response",response)
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    console.log("error",d)
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Menu Create Failed',
      sapCode: d?.error?.error?.code
    });
  }
});

export const getMenuId = createAsyncThunk('menus/getById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`/admin/user-menus/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch Menu');
  }
});

export const updateMenu = createAsyncThunk('menus/update', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await axios.put(`/admin/user-menus/${id}`, payload);
    return response.data;
  } catch (error) {
    const d = error.response?.data;
    return thunkAPI.rejectWithValue({
      status: error.response?.status,
      message: d?.error?.error?.message?.value || d?.message || 'Menu Update Failed',
      sapCode: d?.error?.error?.code
    });
  }
});
const initialState = {
  menus: [],
  listLoading: false,
  createLoading:false,
  updateloading:false,
  saveSuccess:false,
  totalCount:0,
  error: null,

  currentMenu:null,
  currentMenuloading:false,
  currentMenuError:null,
};

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    resetMenuState: (state) => {
      state.createLoading = false;
      state.updateLoading = false;
      state.saveSuccess = false;
      state.error = null;
      state.currentMenu = null;
      state.currentMenuError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getadminmenus.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(getadminmenus.fulfilled, (state, action) => {
        state.listLoading = false;
        state.menus = action.payload || [];
      })
      .addCase(getadminmenus.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload;
      })
      .addCase(getMenuId.pending, (state) => {
              state.currentMenuloading = true;
              state.currentMenu = null;
              state.currentMenuError = null;
            })
            .addCase(getMenuId.fulfilled, (state, action) => {
              state.currentMenuloading = false;
              state.currentMenu = action.payload;
            })
            .addCase(getMenuId.rejected, (state, action) => {
              state.currentMenuloading = false;
              state.currentMenuError = action.payload || 'Failed to load';
            })
      
            .addCase(createMenu.pending, (state) => {
              state.createLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(createMenu.fulfilled, (state) => {
              console.log("fullfilled")
              state.createLoading = false;
              state.saveSuccess = true;
            })
            .addCase(createMenu.rejected, (state, action) => {
              state.createLoading = false;
              state.error = action.payload?.message || action.payload;
            })
      
            .addCase(updateMenu.pending, (state) => {
              state.updateLoading = true;
              state.error = null;
              state.saveSuccess = false;
            })
            .addCase(updateMenu.fulfilled, (state) => {
              state.updateLoading = false;
              state.saveSuccess = true;
            })
            .addCase(updateMenu.rejected, (state, action) => {
              state.updateLoading = false;
              state.error = action.payload?.message || action.payload;
            })
          
  }
});
export const { resetMenuState } = menusSlice.actions;

export default menusSlice.reducer;
