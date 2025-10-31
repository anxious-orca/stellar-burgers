import { burger, getIngredients } from './burgerSlice';
import {
  bun,
  ingredient1,
  ingredient2,
  ingredient3,
  burgerParts
} from '../../__mocks__/ingredients';
import { initialState } from './burgerSlice';
import { TApiError, TIngredient } from '@utils-types';

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса', () => {
  test('должен установить isLoading = true при getIngredients.pending', () => {
    const nextState = burger(
      initialState,
      getIngredients.pending('', undefined)
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен установить ингредиенты и установить isLoading = false при getIngredients.fulfilled', () => {
    const action = getIngredients.fulfilled(
      burgerParts as TIngredient[],
      '',
      undefined
    );

    const nextState = burger(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.buns).toEqual([bun]);
    expect(nextState.mains).toEqual([ingredient1, ingredient2]);
    expect(nextState.sauces).toEqual([ingredient3]);
  });

  test('должен записать ошибку и установить isLoading = false при getIngredients.rejected', () => {
    const errorMessage = 'Ошибка при загрузке ингредиентов';
    const action = getIngredients.rejected(null, '', undefined, {
      success: false,
      message: errorMessage
    } as TApiError);

    const nextState = burger(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  test('если rejected без payload, устанавливается сообщение по умолчанию', () => {
    const action = getIngredients.rejected(null, '', undefined);
    const nextState = burger(initialState, action);
    expect(nextState.error).toBe('Не удалось загрузить ингредиенты :(');
  });
});
