import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import {
  getFeeds,
  selectFeedsIsLoading,
  selectOrderById
} from '../../services/slices/feedsSlice';
import { useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredients,
  selectIsLoading
} from '../../services/slices/burgerSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const orderData = useSelector<TOrder | undefined>(
    number ? selectOrderById(number) : () => undefined
  );
  const ingredients = useSelector<TIngredient[]>(selectIngredients);
  const isFeedsLoading = useSelector<boolean>(selectFeedsIsLoading);
  const isIngredientsLoading = useSelector<boolean>(selectIsLoading);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isFeedsLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
