class HomePage {
  visit() {
    cy.visit('/');
  }

  getHeading() {
    return cy.get('h1');
  }

  search(value) {
    cy.get('.search-input').type(`${value}{enter}`);
  }

  getSearchResults() {
    return cy.get('.search-results');
  }
}

export default HomePage;
