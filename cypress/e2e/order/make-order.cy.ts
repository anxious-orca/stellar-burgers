import { apiUrl } from "../../support/constants";

describe('проверяем оформление заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'mock-access-token-12345');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token-67890');

    cy.intercept('GET', `${apiUrl}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${apiUrl}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', `${apiUrl}/orders`, { 
      fixture: 'order.json'
    }).as('orderBurger');

    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });

    cy.wait('@getUser').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });
  });

  it('добавляем ингредиенты и делаем заказ', () => {
    // Добавляем булку
    cy.get('[data-cy="ingredient-card"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient-button"]')
      .click();

    // Добавляем начинку
    cy.get('[data-cy="ingredient-card"]')
      .contains('Мини-салат Экзо-Плантаго')
      .closest('[data-cy="ingredient-card"]')
      .find('[data-cy="add-ingredient-button"]')
      .click();
    
    // Оформляем заказ
    cy.get('[data-cy="burger-constructor"]')
      .find('[data-cy="make-order-button"]')
      .click();

    // Ждем ответа
    cy.wait('@orderBurger').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
        const orderNumber = interception.response?.body.order.number;

        // Проверяем что модальное окно открылось
        cy.get('[data-cy="modal"]').should('exist');

        // Проверяем что модальное окно правильное
        cy.get('[data-cy="modal"]')
          .contains('идентификатор заказа')

        // Проверяем что номер заказа верный
        cy.get('[data-cy="modal"]')
          .find('[data-cy="order-number-container"]')
          .should('contain', orderNumber);

        // Закрываем модальное окно
        cy.get('[data-cy="modal-close-button"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');

        // Проверям что конструктор бургера очистился
        cy.get('[data-cy="burger-constructor-bun-container-top"]').should('not.exist');
        cy.get('[data-cy="burger-constructor-ingredient-container"]').should('contain.text', 'Выберите начинку');
        cy.get('[data-cy="burger-constructor-bun-container-bottom"]').should('not.exist');
    });
  });
});
