class SignupPage {
  visit() {
    // Directly navigate to the signer registration route used by the app
    cy.visit("/register/signer");
  }

  getOptionalInput(selector) {
    return cy.document().then((doc) => {
      const element = doc.querySelector(selector);
      return element ? cy.wrap(element) : null;
    });
  }
  getFirstNameInput() {
    return cy.get('input[id="register-firstName"]', { timeout: 10000 });
  }

  getLastNameInput() {
    return cy.get('input[id="register-lastName"]', { timeout: 10000 });
  }

  getEmailInput() {
    return cy.get(
      'input[placeholder*="Email"], input[type="email"], input[name*="email"], #signup-email',
      { timeout: 10000 },
    );
  }

  getPasswordInput() {
    return cy.get(
      'input[name="password"], input[placeholder*="Password"], input[type="password"], #signup-password',
      { timeout: 10000 },
    );
  }

  getConfirmPasswordInput() {
    return cy.get(
      'input[name="confirmPassword"], input[name="password-confirm"], input[placeholder*="Confirm"], input[id*="confirm-password"]',
      { timeout: 5000 },
    );
  }

  getSignupButton() {
    return cy.contains("button", /Sign up for free|register|create account/i);
  }

  enterOTP(otp) {
    expect(otp).to.match(/^[0-9]{6}$/);

    otp.split("").forEach((digit, index) => {
      cy.get('input[aria-label^="Please enter OTP character"]')
        .eq(index)
        .type(digit);
    });
  }

  getSkipForNowButton() {
    return cy.contains("Skip for now", { timeout: 30000 });
  }

  signup(firstName, lastName, email, password) {
    this.getFirstNameInput().clear().type(firstName);
    this.getLastNameInput().clear().type(lastName);
    this.getEmailInput().clear().type(email);
    this.getPasswordInput().clear().type(password, { log: false });
    cy.get('input[name="agreed"]').check();

    this.getSignupButton().should("not.be.disabled").click();
  }

  skipVerificationAndMFA() {
    Cypress._.times(3, () => {
      this
        .getSkipForNowButton()
        .should("be.visible")
        .and("not.be.disabled")
        .click();

      cy.contains("button", /skip and verify later/i, { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("button", /skip and verify later/i, {
        timeout: 10000,
      }).should("not.exist");
    });
  }

  getErrorMessage() {
    return cy.get(
      '[class*="error"], [class*="message"], .alert-danger, .error-text',
    );
  }

  getSuccessMessage() {
    return cy.get('[class*="success"], .alert-success, .success-text');
  }
}

export default SignupPage;