import {
  orders,
  getOrders,
  getOrderByNumber,
  clearOrders,
  initialState,
  TOrdersState
} from './ordersSlice';
import { feedResponse } from '../../__mocks__/feed';
import { orderResponse } from '../../__mocks__/order';
import { TApiError } from '@utils-types';

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса getOrders и getOrderByNumber', () => {
  // getOrders
  test('должен установить isLoading = true при getOrders.pending', () => {
    const nextState = orders(initialState, getOrders.pending('', undefined));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен установить заказы и isLoading = false при getOrders.fulfilled', () => {
    const action = getOrders.fulfilled(feedResponse.orders, '', undefined);
    const nextState = orders(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.orders).toEqual(feedResponse.orders);
  });

  test('должен записать ошибку и установить isLoading = false при getOrders.rejected', () => {
    const errorMessage = 'Ошибка при загрузке заказов';
    const action = getOrders.rejected(null, '', undefined, {
      success: false,
      message: errorMessage
    } as TApiError);

    const nextState = orders(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  test('если getOrders.rejected без payload, устанавливается сообщение по умолчанию', () => {
    const action = getOrders.rejected(null, '', undefined);
    const nextState = orders(initialState, action);
    expect(nextState.error).toBe('Не удалось загрузить ваши заказы :(');
    expect(nextState.isLoading).toBe(false);
  });

  // getOrderByNumber
  test('должен установить isLoading = true и очистить selectedOrder при getOrderByNumber.pending', () => {
    const prevState = {
      ...initialState,
      selectedOrder: orderResponse.order
    };

    const nextState = orders(prevState, getOrderByNumber.pending('', 92788));

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.selectedOrder).toBeNull();
  });

  test('должен установить выбранный заказ и isLoading = false при getOrderByNumber.fulfilled', () => {
    const action = getOrderByNumber.fulfilled(orderResponse.order, '', 92788);
    const nextState = orders(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.selectedOrder).toEqual(orderResponse.order);
    expect(nextState.error).toBeNull();
  });

  test('должен записать ошибку и установить isLoading = false при getOrderByNumber.rejected', () => {
    const errorMessage = 'Ошибка при получении заказа';
    const action = getOrderByNumber.rejected(null, '', 92788, {
      success: false,
      message: errorMessage
    } as TApiError);

    const nextState = orders(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  test('если getOrderByNumber.rejected без payload, устанавливается сообщение по умолчанию', () => {
    const action = getOrderByNumber.rejected(null, '', 92788);
    const nextState = orders(initialState, action);
    expect(nextState.error).toBe('Ошибка загрузки заказа');
    expect(nextState.isLoading).toBe(false);
  });

  // clearOrders
  test('должен очищать заказы, выбранный заказ и ошибки', () => {
    const prevState: TOrdersState = {
      orders: feedResponse.orders,
      selectedOrder: orderResponse.order,
      isLoading: true,
      error: 'Ошибка'
    };

    const nextState = orders(prevState, clearOrders());

    expect(nextState.orders).toEqual([]);
    expect(nextState.selectedOrder).toBeNull();
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });
});
