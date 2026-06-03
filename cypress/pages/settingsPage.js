class SettingsPage {
  visit() {
    cy.visit("/settings");
  }

  getDeleteAccountButton() {
    return cy.contains("button", "Delete account");
  }

  deleteAccount() {
    this.getDeleteAccountButton().should("not.be.disabled").click();
    cy.contains("button", /yes|confirm|logout|ok/i, { timeout: 5000 }).click();

    cy.get('input[placeholder*="DELETE"]').should("be.visible").type("DELETE");
    cy.contains("button", /Delete my account/i, { timeout: 5000 }).click();
    cy.location("pathname").should("include", "/account-deleted");
  }
}

export default SettingsPage;
