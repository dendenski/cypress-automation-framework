import LoginPage from "../../pages/loginPage";
import DashBoardPage from "../../pages/dashboardPage";
import "cypress-iframe";
import "cypress-real-events/support";

describe("CopyPaste flow", () => {
  const login = new LoginPage();
  const dashboard = new DashBoardPage();

  beforeEach(() => {
    login.visit();
  });

  it("logs in and navigates to the dashboard", () => {
    cy.wait(10000);
    cy.env(["email", "password", "firstName", "lastName"]).then(
      ({ email, password, firstName, lastName }) => {
        login.login(email, password);

        cy.wait(5000);

        cy.location("pathname").should("eq", "/dashboard");
        cy.contains(/dashboard/i).should("be.visible");
      },
    );
    cy.wait(5000);
    cy.get('[data-intercom-target="Documents"]').should("be.visible").click();
    cy.wait(5000);
    cy.get('svg path[d*="M12 8"]').parents("button").first().click();
    cy.wait(5000);
    cy.contains("button", "Edit", {
      timeout: 20000,
    })
      .should("be.visible")
      .click();

    cy.wait(5000);

    cy.contains("button", "Signature", {
      timeout: 20000,
    })
      .should("be.visible")
      .click();

    cy.wait(5000);

    cy.get("iframe")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .find("canvas")
      .should("exist")
      .should("be.visible");

    cy.contains("button", /click or drag and drop to add field/i).realClick();

    cy.wait(5000);
  });
});
