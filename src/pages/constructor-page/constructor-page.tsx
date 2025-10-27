import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { selectIsLoading } from '../../services/slices/burgerSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector<boolean>(selectIsLoading);

  return (
    <main className={styles.containerMain}>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </>
      )}
    </main>
  );
};
