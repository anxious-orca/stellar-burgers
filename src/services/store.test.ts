import { burger, burgerSlice } from './slices/burgerSlice';
import { burgerConstructor, constructorSlice } from './slices/constructorSlice';
import { feeds, feedsSlice } from './slices/feedsSlice';
import { user, userSlice } from './slices/userSlice';
import { orders, ordersSlice } from './slices/ordersSlice';
import { combineReducers } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    burger: burger,
    burgerConstructor: burgerConstructor,
    feeds: feeds,
    user: user,
    orders: orders
  });

  test('возвращает корректное начальное состояние хранилища при undefined state и неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.burger).toEqual(burgerSlice.getInitialState());
    expect(state.burgerConstructor).toEqual(constructorSlice.getInitialState());
    expect(state.feeds).toEqual(feedsSlice.getInitialState());
    expect(state.user).toEqual(userSlice.getInitialState());
    expect(state.orders).toEqual(ordersSlice.getInitialState());
  });
});
