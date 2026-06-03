class LoginPage {
  visit() {
    cy.visit("/login");
  }

  getSignupButton() {
    return cy.contains(/sign up for free|register|create account/i).first();
  }

  goToSignup() {
    this.getSignupButton().click();
  }

  getEmailInput() {
    return cy.get("#login-email");
  }

  getPasswordInput() {
    return cy.get("#login-password");
  }

  getLoginButton() {
    return cy.contains("button", "Login");
  }

  login(email, password) {
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password, { log: false });
    this.getLoginButton().should("not.be.disabled").click();
  }

  verifyDashboard() {
    cy.location('pathname').should('eq', '/dashboard');
    cy.contains(/dashboard/i).should('be.visible');
  }

  loginAndVerify(email, password) {
    this.visit();
    this.login(email, password);
    this.verifyDashboard();
  }

  isLoggedIn() {
    return cy.location("pathname").then((path) => path !== "/login");
  }
}

export default LoginPage;
