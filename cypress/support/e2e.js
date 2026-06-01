import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore uncaught exceptions from the application under test
  return false;
});
