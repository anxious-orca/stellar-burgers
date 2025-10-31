import { feeds, getFeeds, initialState } from './feedsSlice';
import { feedResponse } from '../../__mocks__/feed';
import { TApiError } from '@utils-types';

describe('проверка обработки редьюсером экшенов генерируемых при выполнении асинхронного запроса feedsSlice', () => {
  test('должен установить isLoading = true при getFeeds.pending', () => {
    const nextState = feeds(initialState, getFeeds.pending('', undefined));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test('должен установить данные и isLoading = false при getFeeds.fulfilled', () => {
    const action = getFeeds.fulfilled(feedResponse, '', undefined);
    const nextState = feeds(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.orders).toEqual(feedResponse.orders);
    expect(nextState.total).toEqual({
      total: feedResponse.total,
      totalToday: feedResponse.totalToday
    });
  });

  test('должен записать ошибку и установить isLoading = false при getFeeds.rejected', () => {
    const errorMessage = 'Ошибка при загрузке ленты заказов';
    const action = getFeeds.rejected(null, '', undefined, {
      success: false,
      message: errorMessage
    } as TApiError);

    const nextState = feeds(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(errorMessage);
  });

  test('если rejected без payload, устанавливается сообщение по умолчанию', () => {
    const action = getFeeds.rejected(null, '', undefined);
    const nextState = feeds(initialState, action);

    expect(nextState.error).toBe('Не удалось загрузить ленту заказов :(');
    expect(nextState.isLoading).toBe(false);
  });
});
