class DashboardPage {
  visit() {
    cy.visit("/dashboard");
  }

  openAccountMenu(firstName, lastName) {
    const name =
      firstName && lastName ? `${firstName} ${lastName}` : "test user";

    return cy
      .contains("p", name, { timeout: 10000 })
      .closest("button")
      .should("be.visible", { timeout: 10000 })
      .click();
  }

  getLogoutButton() {
    // Look for logout option in dropdown/menu
    return cy.contains(/logout|sign out|exit/i).should("be.visible");
  }

  getSettingsButton() {
    // Look for settings option in dropdown/menu
    return cy.contains(/settings|preferences/i).should("be.visible");
  }

  logout() {
    this.getLogoutButton().should("be.visible").click();
    cy.contains("button", /yes|confirm|logout|ok/i, { timeout: 5000 }).click();
    cy.location("pathname").should("eq", "/login");
  }

  settings() {
    this.getSettingsButton().should("be.visible").click();
    cy.location("pathname").should("include", "/settings");
  }

  isLoggedIn() {
    return cy.location("pathname").then((path) => path !== "/login");
  }
}

export default DashboardPage;
