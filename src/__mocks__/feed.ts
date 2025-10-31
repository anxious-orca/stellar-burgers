import { TFeedsResponse } from '@api';

export const feedResponse: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Экзо-плантаго краторный бургер',
      createdAt: '2025-10-31T08:15:21.197Z',
      updatedAt: '2025-10-31T08:15:21.468Z',
      number: 92788,
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa093c'
      ]
    }
  ],
  total: 1,
  totalToday: 1
};
