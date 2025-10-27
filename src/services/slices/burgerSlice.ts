import { createSelector, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

export type TBurgerState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
};

const initialBurgerState: TBurgerState = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: null
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState: initialBurgerState,
  reducers: {},
  selectors: {
    selectBuns: (sliceState) => sliceState.buns,
    selectMains: (sliceState) => sliceState.mains,
    selectSauces: (sliceState) => sliceState.sauces,
    selectIngredients: (sliceState) => [],
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buns = action.payload.filter(
          (ingredient) => ingredient.type === 'bun'
        );
        state.mains = action.payload.filter(
          (ingredient) => ingredient.type === 'main'
        );
        state.sauces = action.payload.filter(
          (ingredient) => ingredient.type === 'sauce'
        );
      });
  }
});

export const {
  selectBuns,
  selectMains,
  selectSauces,
  selectIsLoading,
  selectError
} = burgerSlice.selectors;

export const selectIngredients = createSelector(
  [selectBuns, selectMains, selectSauces],
  (buns, mains, sauces) => [...buns, ...mains, ...sauces]
);

export const burger = burgerSlice.reducer;
