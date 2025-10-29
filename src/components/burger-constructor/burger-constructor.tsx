import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  orderBurger,
  selectBurgerConstructor,
  selectOrderModalData,
  selectOrderRequest,
  TConstructorState,
  clearOrderModal,
  selectOrderError
} from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { getFeeds } from '../../services/slices/feedsSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector<boolean>(selectIsAuthenticated);
  const { bun, constructorIngredients } = useSelector<TConstructorState>(
    selectBurgerConstructor
  );
  const orderModalData = useSelector<TOrder | null>(selectOrderModalData);
  const orderRequest = useSelector<boolean>(selectOrderRequest);
  const error = useSelector<string | null>(selectOrderError);
  const constructorItems = {
    bun: bun,
    ingredients: constructorIngredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorIngredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(orderBurger(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(getFeeds());
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      error={error}
    />
  );
};
