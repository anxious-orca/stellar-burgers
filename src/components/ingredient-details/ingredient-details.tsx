import { FC } from 'react';
import styles from './ingredient-details.module.css';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import {
  selectIngredientById,
  selectIngredientsIsLoading
} from '../../services/slices/burgerSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredientData = useSelector<TIngredient | undefined>(
    id ? selectIngredientById(id) : () => undefined
  );
  const isIngredientsLoading = useSelector<boolean>(selectIngredientsIsLoading);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <p className={`${styles.error} text text_type_main-default pb-6`}>
        Ингредиент не найден
      </p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
