import { burgerConstructor, addIngredient, removeIngredient, moveIngredientUp, moveIngredientDown } from './constructorSlice';
import type { TConstructorState } from './constructorSlice';
import { bun, ingredient1, ingredient2, ingredient3, ingredients } from '../../__mocks__/ingredients';

describe('проверка работы редьюсера конструктора бургера', () => {
  let initialState: TConstructorState;

  beforeEach(() => {
    initialState = {
      bun: null,
      constructorIngredients: [],
      orderRequest: false,
      orderModalData: null,
      error: null
    };
  });

  test('добавление ингредиента', () => {
    // Добавить булку
    let state = burgerConstructor(initialState, addIngredient(bun));
    expect(state.bun).toEqual(bun);

    // Добавить ингредиент
    state = burgerConstructor(state, addIngredient(ingredient1));
    expect(state.constructorIngredients).toHaveLength(1);
    expect(state.constructorIngredients[0]).toEqual(ingredient1);
  });

  test('удаление ингредиента', () => {
    let state = {
      ...initialState,
      constructorIngredients: ingredients
    };

    // Удалить 1 ингредиент
    expect(state.constructorIngredients).toHaveLength(3);
    state = burgerConstructor(state, removeIngredient('1'));
    expect(state.constructorIngredients).toHaveLength(2);
    state = burgerConstructor(state, removeIngredient('2'));
    expect(state.constructorIngredients).toHaveLength(1);
    expect(state.constructorIngredients[0]).toEqual(ingredient3);
  });

  test('перемещение 1 ингредиента наверх', () => {
    let state = {
      ...initialState,
      constructorIngredients: ingredients
    };

    // Перемещение 3го ингредиента меняет второй и третий
    state = burgerConstructor(state, moveIngredientUp(2));
    expect(state.constructorIngredients[0]).toEqual(ingredient1);
    expect(state.constructorIngredients[1]).toEqual(ingredient3);
    expect(state.constructorIngredients[2]).toEqual(ingredient2);

    // Перемещение 1го ингредиента ничего не меняет
    state = burgerConstructor(state, moveIngredientUp(0));
    expect(state.constructorIngredients[0]).toEqual(ingredient1);
    expect(state.constructorIngredients[1]).toEqual(ingredient3);
    expect(state.constructorIngredients[2]).toEqual(ingredient2);
  });

  test('перемещение 1 ингредиента вниз', () => {
    let state = {
      ...initialState,
      constructorIngredients: ingredients
    };

    // Перемещение 1го ингредиента меняет первый и второй
    state = burgerConstructor(state, moveIngredientDown(0));
    expect(state.constructorIngredients[0]).toEqual(ingredient2);
    expect(state.constructorIngredients[1]).toEqual(ingredient1);
    expect(state.constructorIngredients[2]).toEqual(ingredient3);

    // Перемещение 3го ингредиента ничего не меняет
    state = burgerConstructor(state, moveIngredientDown(2));
    expect(state.constructorIngredients[0]).toEqual(ingredient2);
    expect(state.constructorIngredients[1]).toEqual(ingredient1);
    expect(state.constructorIngredients[2]).toEqual(ingredient3);
  });
});
