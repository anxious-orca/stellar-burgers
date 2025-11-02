import { ingredient1 } from './../../src/__mocks__/ingredients';
export const apiUrl = Cypress.env('BURGER_API_URL');

export const selectors = {
  ingredientCard: '[data-cy="ingredient-card"]',
  addIngredientButton: '[data-cy="add-ingredient-button"]',
  ingredientCounter: '[data-cy="ingredient-counter"]',
  burgerConstructor: '[data-cy="burger-constructor"]',
  bunContainerTop: '[data-cy="burger-constructor-bun-container-top"]',
  bunContainerBottom: '[data-cy="burger-constructor-bun-container-bottom"]',
  ingredientContainer: '[data-cy="burger-constructor-ingredient-container"]',
  ingredientImage: '[data-cy="ingredient-card-image"]',
  modal: '[data-cy="modal"]',
  modalCloseButton: '[data-cy="modal-close-button"]',
  makeOrderButton: '[data-cy="make-order-button"]',
  orderNumberContainer: '[data-cy="order-number-container"]'
};
