import { apiUrl } from "../../support/constants";

describe('проверяем сборку бургера', () => {
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

  it('добавление ингредиента из списка в конструктор', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient-button"]')
      .click();

    // Добавляем начинку
    cy.get('[data-cy="ingredient-card"]')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient-button"]')
      .click();

    // Проверяем счетчик на булке
    cy.get('[data-cy="ingredient-card"]')
        .contains('Краторная булка N-200i')
        .closest('[data-cy="ingredient-card"]')
        .find('[data-cy="ingredient-counter"]')
        .should('have.text', '2');

    // Проверяем счетчик на игредиенте
    cy.get('[data-cy="ingredient-card"]')
        .contains('Мясо бессмертных моллюсков Protostomia')
        .closest('[data-cy="ingredient-card"]')
        .find('[data-cy="ingredient-counter"]')
        .should('have.text', '1');

    // Проверяем, что конструктор содержит добавленные ингредиенты
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.get('[data-cy="burger-constructor-bun-container-top"]')
        .should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy="burger-constructor-ingredient-container"]')
        .should('contain', 'Мясо бессмертных моллюсков Protostomia');
      cy.get('[data-cy="burger-constructor-bun-container-bottom"]')
        .should('contain', 'Краторная булка N-200i');
    });
  });
});
