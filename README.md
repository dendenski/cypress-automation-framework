# Cypress Automation Framework

A Cypress-based end-to-end testing framework for automating login and logout workflows.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cypress-automation-framework
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

Create a `cypress.env.json` file in the project root with your test credentials:

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Note:** `cypress.env.json` is ignored by Git for security purposes. Never commit credentials.

### Base URL

The default base URL is set to `https://sign-test.twala.io` in `cypress.config.js`. Update this if testing against a different environment.

## Running Tests

### Open Cypress UI (Interactive Mode)
```bash
npm run cy:open
```

This opens the Cypress Test Runner where you can:
- View all test files
- Run tests individually
- Debug tests in real-time
- Watch test execution

### Run All Tests (Headless Mode)
```bash
npm run cy:run
```

Runs all tests without the UI and outputs results to the terminal.

### Run Specific Test File
```bash
npm run cy:run -- --spec cypress/e2e/login.cy.js
```

### Run Tests in a Specific Browser
```bash
npm run cy:run -- --browser chrome
npm run cy:run -- --browser firefox
npm run cy:run -- --browser edge
```

## Project Structure

```
cypress/
├── e2e/                    # End-to-end test specs
│   └── login.cy.js        # Login and logout tests
├── pages/                  # Page Object Models
│   └── loginPage.js       # Login page object with methods
├── fixtures/              # Test data (JSON files)
├── support/               # Cypress support files
│   ├── e2e.js            # Global setup/config
│   └── commands.js       # Custom Cypress commands
├── plugins/              # Cypress plugins
├── videos/               # Test execution recordings (auto-generated)
├── screenshots/          # Test failure screenshots (auto-generated)
└── reports/              # Test reports

cypress.config.js          # Cypress configuration
cypress.env.json          # Environment variables (not in Git)
package.json              # Project dependencies
```

## Test Files

### Login Tests (`cypress/e2e/login.cy.js`)

**Test 1: Login Flow**
- Navigates to login page
- Enters email and password from `cypress.env.json`
- Verifies navigation to dashboard

**Test 2: Logout Flow**
- Logs in with valid credentials
- Clicks account menu in upper right corner
- Clicks logout option
- Confirms logout in popup dialog
- Verifies redirect back to login page

## Page Objects

### LoginPage (`cypress/pages/loginPage.js`)

**Methods:**
- `visit()` - Navigate to login page
- `getEmailInput()` - Get email input field
- `getPasswordInput()` - Get password input field
- `getLoginButton()` - Get login button
- `login(email, password)` - Perform login action
- `getAccountMenu()` - Get account menu button
- `logout()` - Perform logout action with confirmation
- `isLoggedIn()` - Check if user is logged in

## Viewport Configuration

Default viewport: **1440 x 900 pixels**

To change viewport size, edit `cypress.config.js`:
```javascript
viewportWidth: 1920,
viewportHeight: 1080
```

## Troubleshooting

### Tests fail with "element not found"
- Open Cypress UI with `npm run cy:open`
- Use the browser tools to inspect page elements
- Update selectors in page objects as needed

### Credentials not being read
- Ensure `cypress.env.json` exists in project root
- Verify email and password fields are correctly set
- Never commit this file to Git

### Logout test fails
- Confirm the account menu is clickable
- Verify the logout button text in the dropdown
- Update `getLogoutButton()` selector if button text differs

### Tests time out
- Increase timeout in `cypress.config.js`: `defaultCommandTimeout: 10000`
- Check network/page load times
- Verify base URL is correct and accessible

## Best Practices

1. **Keep credentials out of version control** - Always use `cypress.env.json` for sensitive data
2. **Use Page Objects** - Maintain selectors in page objects for easier maintenance
3. **Use descriptive test names** - Make it clear what each test does
4. **Add waits strategically** - Wait for elements/navigation, not arbitrary time
5. **Review test results** - Check videos/screenshots of failed tests

## CI/CD Integration

For automated testing in CI/CD pipelines:

```bash
npm run cy:run -- --headless --browser chrome
```

Capture test results:
- Videos: `cypress/videos/`
- Screenshots: `cypress/screenshots/`
- Reports: Integrate with tools like Mochawesome for detailed reports

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Page Object Model Pattern](https://docs.cypress.io/guides/testing-strategies/page-object-model)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

## Support

For issues or questions about the framework, refer to Cypress documentation or check test execution logs in the Cypress UI.
