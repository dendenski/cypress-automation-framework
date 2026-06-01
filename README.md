# Cypress Automation Framework

A Cypress-based end-to-end automation framework for web application testing.

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

The default base URL is loaded from `cypress/config/test.json` when the environment is not specified.

### Environments

This framework supports four environments:
- `test`
- `staging`
- `dev`
- `production`

Base URLs are stored in the `cypress/config/` folder as JSON files:
- `cypress/config/test.json`
- `cypress/config/staging.json`
- `cypress/config/dev.json`
- `cypress/config/production.json`

The selected environment is loaded automatically from `CYPRESS_ENV` or from the CLI `--env` argument.

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

### Run Tests by Environment
```bash
npm run cy:run:test
npm run cy:run:staging
npm run cy:run:dev
npm run cy:run:production
```

### Run Tests in a Specific Browser
```bash
npm run cy:run -- --browser chrome
npm run cy:run -- --browser firefox
npm run cy:run -- --browser edge
```

## Folder Structure

```
cypress/
├── e2e/          # End-to-end test specs
├── pages/        # Page objects and reusable page methods
├── fixtures/     # Static test data and JSON fixtures
├── support/      # Global Cypress setup and custom commands
├── plugins/      # Cypress plugin configuration and hooks
├── videos/       # Recorded test videos (generated automatically)
├── screenshots/  # Failure screenshots (generated automatically)
└── reports/      # Test reports and generated artifacts

cypress/config/     # Environment-specific baseUrl configuration files
```

## Viewport Configuration

Default viewport: **1440 x 900 pixels**

To change viewport size, edit `cypress.config.js`:
```javascript
viewportWidth: 1920,
viewportHeight: 1080
```

## CI/CD Integration

For automated testing in CI/CD pipelines:

```bash
npm run cy:run -- --headless --browser chrome
```

Capture test results:
- Videos: `cypress/videos/`
- Screenshots: `cypress/screenshots/`
- Reports: Integrate with tools like Mochawesome for detailed reports

