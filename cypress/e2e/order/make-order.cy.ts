import { apiUrl, selectors } from "../../support/constants";

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

    cy.visit('dashboard');

    cy.wait('@getIngredients').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });

    cy.wait('@getUser').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
    });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  it('добавляем ингредиенты и делаем заказ', () => {
    // Добавляем булку
    cy.get(selectors.ingredientCard)
      .contains('Краторная булка N-200i')
      .closest(selectors.ingredientCard)
      .find(selectors.addIngredientButton)
      .click();

    // Добавляем начинку
    cy.get(selectors.ingredientCard)
      .contains('Мини-салат Экзо-Плантаго')
      .closest(selectors.ingredientCard)
      .find(selectors.addIngredientButton)
      .click();
    
    // Оформляем заказ
    cy.get(selectors.burgerConstructor)
      .find(selectors.makeOrderButton)
      .click();

    // Ждем ответа
    cy.wait('@orderBurger').then((interception) => {
        expect(interception.response?.body).to.exist;
        cy.log('✅ Fixture loaded:', interception.response?.body);
        const orderNumber = interception.response?.body.order.number;

        // Проверяем что модальное окно открылось
        cy.get(selectors.modal).should('exist');

        // Проверяем что модальное окно правильное
        cy.get(selectors.modal)
          .contains('идентификатор заказа')

        // Проверяем что номер заказа верный
        cy.get(selectors.modal)
          .find(selectors.orderNumberContainer)
          .should('contain', orderNumber);

        // Закрываем модальное окно
        cy.get(selectors.modalCloseButton).click();
        cy.get(selectors.modal).should('not.exist');

        // Проверям что конструктор бургера очистился
        cy.get(selectors.bunContainerTop).should('not.exist');
        cy.get(selectors.ingredientContainer).should('contain.text', 'Выберите начинку');
        cy.get(selectors.bunContainerBottom).should('not.exist');
    });
  });
});
