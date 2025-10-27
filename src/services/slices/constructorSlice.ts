import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientsIds: string[]) => {
    const response = await orderBurgerApi(ingredientsIds);
    return response.order;
  }
);

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
    selectConstructor: (sliceState) => sliceState,
    selectOrderModalData: (sliceState) => sliceState.orderModalData,
    selectOrderRequest: (sliceState) => sliceState.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorIngredients = [];
        state.bun = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Order failed';
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

export const { selectConstructor, selectOrderModalData, selectOrderRequest } =
  constructorSlice.selectors;

export const burgerConstructor = constructorSlice.reducer;
