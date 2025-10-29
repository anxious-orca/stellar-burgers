import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, TNewOrderResponse } from '@api';
import {
  TApiError,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '@utils-types';
import { getErrorMessage } from 'src/utils/errors';

export const orderBurger = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: TApiError }
>('burger/order', async (ingredientsIds, thunkAPI) => {
  try {
    const data = await orderBurgerApi(ingredientsIds);
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Не удалось создать заказ')
    });
  }
});

export type TConstructorState = {
  bun: TIngredient | null;
  constructorIngredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialConstructorState: TConstructorState = {
  bun: null,
  constructorIngredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructorState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.constructorIngredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      const temp = state.constructorIngredients[index - 1];
      state.constructorIngredients[index - 1] =
        state.constructorIngredients[index];
      state.constructorIngredients[index] = temp;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= state.constructorIngredients.length - 1) return;
      const temp = state.constructorIngredients[index + 1];
      state.constructorIngredients[index + 1] =
        state.constructorIngredients[index];
      state.constructorIngredients[index] = temp;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.constructorIngredients = [];
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectBurgerConstructor: (sliceState) => sliceState,
    selectOrderModalData: (sliceState) => sliceState.orderModalData,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorIngredients = [];
        state.bun = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload?.message ?? 'Не удалось создать заказ';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export const {
  selectBurgerConstructor,
  selectOrderModalData,
  selectOrderRequest,
  selectOrderError
} = constructorSlice.selectors;

export const burgerConstructor = constructorSlice.reducer;
