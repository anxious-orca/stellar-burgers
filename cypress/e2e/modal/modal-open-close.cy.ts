import { apiUrl } from "../../support/constants";

describe('проверяем модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });
  });

  it('открытие и закрытие модального окна', () => {
    // Открываем модально окно
    cy.get('[data-cy="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="ingredient-card-image"]')
      .click();

    // Проверяем что модальное окно открылось
    cy.get('[data-cy="modal"]').should('exist');

    // Проверяем что модальное окно правильное
    cy.get('[data-cy="modal"]')
      .contains('Краторная булка N-200i')

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close-button"]').click();

    // Проверяем что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
