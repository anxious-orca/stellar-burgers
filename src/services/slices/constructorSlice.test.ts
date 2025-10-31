import {
  burgerConstructor,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  orderBurger,
  initialState,
  clearConstructor,
  clearOrderModal
} from './constructorSlice';
import {
  bun,
  ingredient1,
  ingredient2,
  ingredient3,
  ingredients
} from '../../__mocks__/ingredients';
import {
  orderResponse
} from '../../__mocks__/order';
import { TApiError } from '@utils-types';

describe('проверка работы редьюсера конструктора бургера', () => {
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

  test('clearConstructor должен очищать bun и constructorIngredients', () => {
    const prevState = {
      ...initialState,
      bun,
      constructorIngredients: ingredients,
      orderModalData: orderResponse.order,
      error: 'Ошибка'
    };

    const nextState = burgerConstructor(prevState, clearConstructor());

    expect(nextState.bun).toBeNull();
    expect(nextState.constructorIngredients).toEqual([]);
    expect(nextState.orderModalData).toEqual(orderResponse.order);
    expect(nextState.error).toBe('Ошибка');
  });

  test('clearOrderModal должен очищать orderModalData', () => {
    const prevState = {
      ...initialState,
      orderModalData: orderResponse.order,
      orderRequest: false
    };

    const nextState = burgerConstructor(prevState, clearOrderModal());
    expect(nextState.orderModalData).toBeNull();
    expect(nextState.orderRequest).toBe(false);
  });
});

describe('проверка обработки редьюсером экшенов, генерируемых при выполнении асинхронного запроса orderBurger', () => {
  test('должен установить orderRequest = true при orderBurger.pending', () => {
    const nextState = burgerConstructor(initialState, orderBurger.pending('', []));
    expect(nextState.orderRequest).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен установить данные заказа и очистить конструктор при orderBurger.fulfilled', () => {
    const action = orderBurger.fulfilled(
      orderResponse,
      '',
      orderResponse.order.ingredients
    );

    const prevState = {
      ...initialState,
      bun: bun,
      constructorIngredients: ingredients,
      orderRequest: true
    };

    const nextState = burgerConstructor(prevState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toEqual(orderResponse.order);
    expect(nextState.bun).toBeNull();
    expect(nextState.constructorIngredients).toEqual([]);
  });

  test('должен записать ошибку и установить orderRequest = false при orderBurger.rejected', () => {
    const errorMessage = 'Ошибка при создании заказа';
    const action = orderBurger.rejected(null, '', [], {
      success: false,
      message: errorMessage
    } as TApiError);

    const nextState = burgerConstructor(initialState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  test('если rejected без payload, устанавливается сообщение по умолчанию', () => {
    const action = orderBurger.rejected(null, '', []);
    const nextState = burgerConstructor(initialState, action);

    expect(nextState.error).toBe('Не удалось создать заказ');
    expect(nextState.orderRequest).toBe(false);
  });
});
