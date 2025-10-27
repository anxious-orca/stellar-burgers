import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
};

const initialFeedsState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState: initialFeedsState,
  reducers: {},
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectTotal: (sliceState) => sliceState.total,
    selectTotalToday: (sliceState) => sliceState.totalToday,
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
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const {
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectFeedsIsLoading,
  selectFeedsError
} = feedsSlice.selectors;

export const feeds = feedsSlice.reducer;
