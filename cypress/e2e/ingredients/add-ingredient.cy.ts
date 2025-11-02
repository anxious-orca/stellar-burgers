import { apiUrl, selectors } from "../../support/constants";

describe('проверяем сборку бургера', () => {
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

  it('добавление ингредиента из списка в конструктор', () => {
    // Добавляем булку
    cy.get(selectors.ingredientCard)
      .contains('Краторная булка N-200i')
      .closest(selectors.ingredientCard)
      .find(selectors.addIngredientButton)
      .click();

    // Добавляем начинку
    cy.get(selectors.ingredientCard)
      .contains('Мясо бессмертных моллюсков Protostomia')
      .closest(selectors.ingredientCard)
      .find(selectors.addIngredientButton)
      .click();

    // Проверяем счетчик на булке
    cy.get(selectors.ingredientCard)
        .contains('Краторная булка N-200i')
        .closest(selectors.ingredientCard)
        .find(selectors.ingredientCounter)
        .should('have.text', '2');

    // Проверяем счетчик на игредиенте
    cy.get(selectors.ingredientCard)
        .contains('Мясо бессмертных моллюсков Protostomia')
        .closest(selectors.ingredientCard)
        .find(selectors.ingredientCounter)
        .should('have.text', '1');

    // Проверяем, что конструктор содержит добавленные ингредиенты
    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.get(selectors.bunContainerTop)
        .should('contain', 'Краторная булка N-200i');
      cy.get(selectors.ingredientContainer)
        .should('contain', 'Мясо бессмертных моллюсков Protostomia');
      cy.get(selectors.bunContainerBottom)
        .should('contain', 'Краторная булка N-200i');
    });
  });
});
