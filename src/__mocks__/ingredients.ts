import { TConstructorIngredient } from '@utils-types';

export const bun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'bun1'
};

export const ingredient1: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093f',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  id: '1'
};

export const ingredient2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0949',
  name: 'Мини-салат Экзо-Плантаго',
  type: 'main',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 6,
  price: 4400,
  image: 'https://code.s3.yandex.net/react/code/salad.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/salad-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/salad-large.png',
  id: '2'
};

export const ingredient3: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: '3'
};

export const ingredients: TConstructorIngredient[] = [ingredient1, ingredient2, ingredient3];
export const burgerParts: TConstructorIngredient[] = [bun, ingredient1, ingredient2, ingredient3];