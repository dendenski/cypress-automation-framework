const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

function getEnvironment() {
  if (process.env.CYPRESS_ENV) {
    return process.env.CYPRESS_ENV;
  }

  const envArg = process.argv.find((arg) => arg.startsWith('--env'));
  if (envArg) {
    const match = envArg.match(/env=([^,]+)/);
    if (match) {
      return match[1];
    }
  }

  return 'test';
}

function loadConfig(env) {
  const configPath = path.resolve(__dirname, 'cypress', 'config', `${env}.json`);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Environment config not found: ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

const environment = getEnvironment();
const environmentConfig = loadConfig(environment);
const dayjs = require('dayjs')

const timestamp = dayjs().format('YYYYMMDD-HHmm')

module.exports = defineConfig({
  allowCypressEnv: false,
  video: true,
  e2e: {
    baseUrl: environmentConfig.baseUrl,
    viewportWidth: 1440,
    viewportHeight: 900,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      timestamp: false,
      reportFilename: 'cypress-e2e-' + environment + '-report-' + timestamp,
      html: true,
      json: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      charts: true
    },
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config);
      return config;
    },
  },
});
