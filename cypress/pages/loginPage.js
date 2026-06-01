class LoginPage {
  visit() {
    cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('#login-email');
  }

  getPasswordInput() {
    return cy.get('#login-password');
  }

  getLoginButton() {
    return cy.contains('button', 'Login');
  }

  login(email, password) {
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password, { log: false });
    this.getLoginButton().should('not.be.disabled').click();
  }

  getAccountMenu() {
    // Look for account menu - typically in top right, can be avatar, button, or link with user info
    // Try multiple selectors that commonly hold user account buttons
    return cy.get(
      'button[aria-label*="account"], ' +
      'button[aria-label*="profile"], ' +
      'button[aria-label*="user"], ' +
      '[role="button"][aria-label*="account"], ' +
      '[role="button"][aria-label*="profile"], ' +
      'header button:last-of-type, ' +
      'nav button:last-of-type, ' +
      '[class*="header"] button:last-of-type',
      { timeout: 10000 }
    ).first();
  }

  getLogoutButton() {
    // Look for logout option in dropdown/menu
    return cy.contains(/logout|sign out|exit/i).should('be.visible');
  }

  logout() {
    // Click account menu to reveal logout option
    this.getAccountMenu().click({ force: true });
    // Wait for menu to appear
    cy.wait(800);
    // Click logout
    this.getLogoutButton().click();
    // Handle confirmation popup
    // Look for confirm button in the dialog (Yes, Confirm, Logout, OK, etc.)
    cy.contains('button', /yes|confirm|logout|ok/i, { timeout: 5000 }).click();
  }

  isLoggedIn() {
    return cy.location('pathname').then(path => path !== '/login');
  }
}

export default LoginPage;
