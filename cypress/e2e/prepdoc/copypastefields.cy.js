import LoginPage from "../../pages/loginPage";
import DashBoardPage from "../../pages/dashboardPage";

describe("Login flow", () => {
  const login = new LoginPage();
  const dashboard = new DashBoardPage();

  beforeEach(() => {
    login.visit();
  });

  it("logs in and navigates to the dashboard", () => {
    cy.env(["email", "password", "firstName", "lastName"]).then(
      ({ email, password, firstName, lastName }) => {
        login.login(email, password);

        cy.location("pathname").should("eq", "/dashboard");
        cy.contains(/dashboard/i).should("be.visible");

        // click on prepare document button
        cy.contains("button", /Prepare document/i)
          .should("be.visible")
          .click();

        cy.get('input[type="file"]').selectFile(
          "cypress/fixtures/Builder Contract Agreement.pdf",
          { force: true },
        );

        cy.contains("Builder Contract Agreement.pdf", {
          timeout: 20000,
        }).should("be.visible");

        cy.contains("button", /Include me/i).click();

        cy.contains(/Advanced settings/i).click();

        cy.get('input[aria-label="QR Code Signing Enabled"]').should(
          "be.checked",
        );

        cy.contains("button", "Prepare document").should("be.visible").click();

        cy.contains("button", "Signature", {
          timeout: 20000,
        })
          .should("be.visible")
          .click();
      },
    );

    cy.wait(5000); // Wait for the signature field to be added

    cy.contains(/click or drag and drop to add field/i, {
      timeout: 20000,
    })
      .should("be.visible")
      .click({ force: true });

    cy.get('iframe[src*="webviewer"]', { timeout: 20000 }).then(($iframe) => {
      const $body = $iframe.contents().find("body");
      const $target = $body.find("#pageWidgetContainer1");

      cy.wrap($target).should("exist").click(150, 150, { force: true });

      cy.wrap($body).trigger("keydown", {
        key: "c",
        ctrlKey: true,
        metaKey: true,
        force: true,
      });
      cy.wrap($body).trigger("keydown", {
        key: "v",
        ctrlKey: true,
        metaKey: true,
        force: true,
      });

      cy.wrap($target).should("exist");
    });
  });
});
