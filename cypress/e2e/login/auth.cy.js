import LoginPage from "../../pages/loginPage";
import DashBoardPage from "../../pages/dashBoardPage";
import SettingsPage from "../../pages/settingsPage";

describe("Login flow", () => {
  const login = new LoginPage();
  const dashboard = new DashBoardPage();
  const settings = new SettingsPage();

  beforeEach(() => {
    login.visit();
  });

  it("logs in and navigates to the dashboard", () => {
    cy.env(["email", "password"]).then(({ email, password }) => {
      login.login(email, password);

      cy.location("pathname").should("eq", "/dashboard");
      cy.contains(/dashboard/i).should("be.visible");
    });
  });

  it("logs out and returns to login page", () => {
    cy.env(["email", "password"]).then(({ email, password }) => {
      // Login first
      login.login(email, password);
      cy.location("pathname").should("eq", "/dashboard");

      // Then logout
      dashboard.logout();
      cy.location("pathname").should("eq", "/login");
    });
  });

  it("logs in and navigates to settings", () => {
    cy.env(["email", "password"]).then(({ email, password }) => {
      // Login first
      login.login(email, password);
      cy.location("pathname").should("eq", "/dashboard");

      // Then go to settings
      dashboard.settings();
      cy.location("pathname").should("include", "/settings");
    });
  });
});
