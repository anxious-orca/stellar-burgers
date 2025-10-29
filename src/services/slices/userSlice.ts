import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TApiError, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { getErrorMessage } from 'src/utils/errors';

/* Async thunks */

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: TApiError }
>('user/registerUser', async (userData: TRegisterData, thunkAPI) => {
  try {
    const res = await registerUserApi(userData);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Ошибка регистрации')
    });
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: TApiError }
>('user/loginUser', async (userData: TLoginData, thunkAPI) => {
  try {
    const res = await loginUserApi(userData);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Ошибка входа')
    });
  }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  try {
    await logoutApi();
  } catch (err) {
    console.warn('Logout failed', err);
  } finally {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
});

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, thunkAPI) => {
    try {
      const res = await updateUserApi(userData);
      return res.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: TApiError }
>('user/forgotPassword', async (data, thunkAPI) => {
  try {
    await forgotPasswordApi(data);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Ошибка восстановления пароля')
    });
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: TApiError }
>('user/resetPassword', async (data, thunkAPI) => {
  try {
    await resetPasswordApi(data);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Ошибка сброса пароля')
    });
  }
});

/* Slice */

export type TUserState = {
  data: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  error: string | null;
  loading: boolean;
};

const initialUserState: TUserState = {
  data: null,
  isAuthenticated: false,
  isAuthChecked: false,
  error: null,
  loading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectIsAuthChecked: (sliceState) => sliceState.isAuthChecked,
    selectIsAuthenticated: (sliceState) => sliceState.isAuthenticated,
    selectUserData: (sliceState) => sliceState.data,
    selectAuthIsLoading: (sliceState) => sliceState.loading,
    selectAuthError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      // getUser
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Ошибка восстановления пароля';
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Ошибка сброса пароля';
      });
  }
});

export const { setAuthChecked } = userSlice.actions;

export const {
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUserData,
  selectAuthIsLoading,
  selectAuthError
} = userSlice.selectors;

export const user = userSlice.reducer;
