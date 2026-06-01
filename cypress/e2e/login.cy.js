import LoginPage from '../pages/loginPage';

describe('Login flow', () => {
  const login = new LoginPage();

  beforeEach(() => {
    login.visit();
  });

  it('logs in and navigates to the dashboard', () => {
    const email = Cypress.env('email');
    const password = Cypress.env('password');

    login.login(email, password);

    cy.location('pathname').should('eq', '/dashboard');
    cy.contains(/dashboard/i).should('be.visible');
  });

  it('logs out and returns to login page', () => {
    const email = Cypress.env('email');
    const password = Cypress.env('password');

    // Login first
    login.login(email, password);
    cy.location('pathname').should('eq', '/dashboard');

    // Then logout
    login.logout();
    cy.location('pathname').should('eq', '/login');
  });
});
