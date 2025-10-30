import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';
import { TApiError, TOrder } from '@utils-types';
import { getErrorMessage } from '../../utils/errors';

export const getFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: TApiError }
>('feeds/getAll', async (_, thunkAPI) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Не удалось загрузить ленту заказов :(')
    });
  }
});

export type TFeedsState = {
  orders: TOrder[];
  total: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
};

const initialFeedsState: TFeedsState = {
  orders: [],
  total: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: initialFeedsState,
  reducers: {},
  selectors: {
    selectFeeds: (sliceState) => sliceState.orders,
    selectFeedsTotal: (sliceState) => sliceState.total,
    selectFeedsIsLoading: (sliceState) => sliceState.isLoading,
    selectFeedsError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? 'Не удалось загрузить ленту заказов :(';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      });
  }
});

export const {
  selectFeeds,
  selectFeedsTotal,
  selectFeedsIsLoading,
  selectFeedsError
} = feedsSlice.selectors;

export const feeds = feedsSlice.reducer;
