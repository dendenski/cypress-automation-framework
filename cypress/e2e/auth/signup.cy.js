import LoginPage from "../../pages/loginPage";
import SignupPage from "../../pages/signupPage";
import DashboardPage from "../../pages/dashboardPage";
import MailHelper from "../../utils/mailHelper";
import SettingsPage from "../../pages/settingsPage";

describe("Signup flow", () => {
  const login = new LoginPage();
  const signup = new SignupPage();
  const dashboard = new DashboardPage();
  const settings = new SettingsPage();
  const letters = Cypress._.sampleSize("abcdefghijklmnopqrstuvwxyz", 6).join(
    "",
  );

  let account;
  let firstName;
  let lastName;
  let password;

  // Create a temporary email account before tests run
  before(() => {
    firstName = `Test${letters}`;
    lastName = `User${letters}`;
    password = `Secure!Password${Cypress._.random(1000, 9999)}`;

    return MailHelper.createTempEmail().then((tempAccount) => {
      account = tempAccount;
    });
  });

  it("should create login, verify and delete an account", () => {
    login.visit();
    login.goToSignup();
    signup.signup(firstName, lastName, account.email, password);

    // fetch OTP from email and enter it
    MailHelper.waitForOtp(account.email, account.password, 30000)
      .then((otp) => {
        signup.enterOTP(otp);
      })
      .then(() => {
        signup.skipVerificationAndMFA();

        dashboard.openAccountMenu(firstName, lastName);
        dashboard.logout();

        login.loginAndVerify(account.email, password);
        dashboard.openAccountMenu(firstName, lastName);
        dashboard.logout();

        login.loginAndVerify(account.email, password);
        dashboard.openAccountMenu(firstName, lastName);
        dashboard.settings();
        settings.deleteAccount();
      });
  });

  // Clean up - delete the temporary email account after tests complete
  after(() => {
    if (account) {
      return MailHelper.deleteAccount(account.email, account.password);
    }
  });
});
