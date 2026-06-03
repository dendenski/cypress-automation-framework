import LoginPage from "../../pages/loginPage";
import SignupPage from "../../pages/signupPage";
import DashBoardPage from "../../pages/dashBoardPage";
import MailHelper from "../../utils/mailHelper";
import SettingsPage from "../../pages/settingsPage";

describe("Account life cycle", () => {
  const login = new LoginPage();
  const signup = new SignupPage();
  const dashboard = new DashBoardPage();
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
    MailHelper.createTempEmail().then((tempAccount) => {
      account = tempAccount;
    });
    firstName = `Test${letters}`;
    lastName = `User${letters}`;
    password = `Secure!Password${Cypress._.random(1000, 9999)}`;
  });

  it("should create login and delete an accountt", () => {
    login.visit();
    login.goToSignup();
    signup.signup(firstName, lastName, account.email, password);

    // fetch OTP from email and enter it
    MailHelper.waitForOtp(account.email, account.password, 30000).then(
      (otp) => {
        signup.enterOTP(otp);
      },
    );

    // skip verification and MFA steps
    signup.skipVerificationAndMFA();
    dashboard.openAccountMenu(firstName, lastName);
    dashboard.logout();

    // relogin to verify account was created successfully
    login.loginAndVerify(account.email, password);
    dashboard.openAccountMenu(firstName, lastName);
    dashboard.logout();

    // delete account
    login.loginAndVerify(account.email, password);
    dashboard.openAccountMenu(firstName, lastName);
    dashboard.settings();
    settings.deleteAccount();
  });

  // Clean up - delete the temporary email account after tests complete
  after(() => {
    if (account) {
      return MailHelper.deleteAccount(account.email, account.password);
    }
  });
});
