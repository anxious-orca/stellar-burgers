import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TApiError, TOrder } from '@utils-types';
import { getErrorMessage } from '../../utils/errors';

export const getOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: TApiError }
>('orders/getAll', async (_, thunkAPI) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Не удалось загрузить ваши заказы :(')
    });
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: TApiError }
>('orders/getByNumber', async (orderNumber, thunkAPI) => {
  try {
    const data = await getOrderByNumberApi(orderNumber);

    if (data?.success && data.orders.length > 0) {
      return data.orders[0];
    }

    return thunkAPI.rejectWithValue({
      success: false,
      message: 'Заказ не найден'
    });
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Ошибка при получении заказа')
    });
  }
});

export type TOrdersState = {
  orders: TOrder[];
  selectedOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectOrdersIsLoading: (sliceState) => sliceState.isLoading,
    selectOrdersError: (sliceState) => sliceState.error,
    selectSelectedOrder: (sliceState) => sliceState.selectedOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? 'Не удалось загрузить ваши заказы :(';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const {
  selectOrders,
  selectOrdersIsLoading,
  selectOrdersError,
  selectSelectedOrder
} = ordersSlice.selectors;

export const { clearOrders } = ordersSlice.actions;

export const orders = ordersSlice.reducer;
