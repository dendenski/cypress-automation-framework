import HomePage from '../pages/homePage';

describe('Example Cypress smoke test', () => {
  const home = new HomePage();

  beforeEach(() => {
    home.visit();
  });

  it('verifies the page loads and contains the expected title', () => {
    home.getHeading().should('contain.text', 'Kitchen Sink');
  });

  it('uses fixture data to search the page', () => {
    cy.fixture('example.json').then((data) => {
      home.search(data.searchTerm);
      home.getSearchResults().should('contain.text', data.searchTerm);
    });
  });
});
