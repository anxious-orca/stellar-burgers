import {
  combineReducers,
  configureStore
} from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { burger } from './slices/burgerSlice';
import { feeds } from './slices/feedsSlice';
import { burgerConstructor } from './slices/constructorSlice';
import { user } from './slices/userSlice';
import { orders } from './slices/ordersSlice';

const rootReducer = combineReducers({
  burger: burger,
  burgerConstructor: burgerConstructor,
  feeds: feeds,
  user: user,
  orders: orders
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
