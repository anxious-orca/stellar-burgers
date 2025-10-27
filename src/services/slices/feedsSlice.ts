import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

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
    selectOrders: (sliceState) => sliceState.orders,
    selectTotal: (sliceState) => sliceState.total,
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
        state.error = action.error.message ?? 'Request failed';
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
  selectOrders,
  selectTotal,
  selectFeedsIsLoading,
  selectFeedsError
} = feedsSlice.selectors;

export const selectOrderById = (orderNumber: string) =>
  createSelector([selectOrders], (orders) =>
    orders.find((order) => String(order.number) === orderNumber)
  );

export const feeds = feedsSlice.reducer;
