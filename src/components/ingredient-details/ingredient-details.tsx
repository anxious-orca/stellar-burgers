import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import {
  selectIngredientById,
  selectIsLoading
} from '../../services/slices/burgerSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector<TIngredient | undefined>(
    id ? selectIngredientById(id) : () => undefined
  );
  const isIngredientsLoading = useSelector<boolean>(selectIsLoading);

  if (!ingredientData || isIngredientsLoading) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
