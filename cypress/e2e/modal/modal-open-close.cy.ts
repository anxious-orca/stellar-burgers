import { apiUrl, selectors } from "../../support/constants";

describe('проверяем модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('dashboard');

    cy.wait('@getIngredients').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });
  });

  it('открытие и закрытие модального окна', () => {
    // Открываем модально окно
    cy.get(selectors.ingredientCard)
      .contains('Краторная булка N-200i')
      .closest(selectors.ingredientCard)
      .find(selectors.ingredientImage)
      .click();

    // Проверяем что модальное окно открылось
    cy.get(selectors.modal).should('exist');

    // Проверяем что модальное окно правильное
    cy.get(selectors.modal)
      .contains('Краторная булка N-200i')

    // Закрываем модальное окно
    cy.get(selectors.modalCloseButton).click();

    // Проверяем что модальное окно закрылось
    cy.get(selectors.modal).should('not.exist');
  });
});
