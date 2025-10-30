import { FC, useEffect, useMemo } from 'react';
import styles from './order-info.module.css';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { selectFeedsIsLoading } from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsIsLoading
} from '../../services/slices/burgerSlice';
import {
  getOrderByNumber,
  selectOrdersError,
  selectOrdersIsLoading,
  selectSelectedOrder
} from '../../services/slices/ordersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector<TOrder | null>(selectSelectedOrder);
  const ingredients = useSelector<TIngredient[]>(selectIngredients);
  const isFeedsLoading = useSelector<boolean>(selectFeedsIsLoading);
  const isOrdersLoading = useSelector<boolean>(selectOrdersIsLoading);
  const ordersError = useSelector<string | null>(selectOrdersError);
  const isIngredientsLoading = useSelector<boolean>(selectIngredientsIsLoading);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [number, dispatch]);

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

  const showError = ordersError ? ordersError : 'Заказ не найден';

  if (isFeedsLoading || isIngredientsLoading || isOrdersLoading) {
    return <Preloader />;
  } else if (ordersError || !orderInfo) {
    return (
      <p className={`${styles.error} text text_type_main-default pb-6`}>
        {showError}
      </p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
