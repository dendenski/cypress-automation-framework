Cypress.Commands.add('login', (username, password) => {
  cy.get('#username').type(username);
  cy.get('#password').type(password, { log: false });
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('navigateTo', (path) => {
  cy.visit(path);
});
