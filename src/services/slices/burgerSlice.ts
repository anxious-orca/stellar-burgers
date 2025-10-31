import {
  createSelector,
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TApiError, TIngredient } from '@utils-types';
import { getErrorMessage } from '../../utils/errors';

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: TApiError }
>('ingredients/getAll', async (_, thunkAPI) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue({
      success: false,
      message: getErrorMessage(err, 'Не удалось загрузить ингредиенты :(')
    });
  }
});

export type TBurgerState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TBurgerState = {
  buns: [],
  mains: [],
  sauces: [],
  isLoading: false,
  error: null
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {},
  selectors: {
    selectBuns: (sliceState) => sliceState.buns,
    selectMains: (sliceState) => sliceState.mains,
    selectSauces: (sliceState) => sliceState.sauces,
    selectIngredientsIsLoading: (sliceState) => sliceState.isLoading,
    selectIngredientsError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? 'Не удалось загрузить ингредиенты :(';
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
  selectIngredientsIsLoading,
  selectIngredientsError
} = burgerSlice.selectors;

export const selectIngredients = createSelector(
  [selectBuns, selectMains, selectSauces],
  (buns, mains, sauces) => [...buns, ...mains, ...sauces]
);

export const selectIngredientById = (id: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.find((ingredient) => ingredient._id === id)
  );

export const burger = burgerSlice.reducer;
