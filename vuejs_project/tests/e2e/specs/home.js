// https://docs.cypress.io/api/introduction/api.html

const TIMELAPS = 10;

describe('Bar hide/show tests', () => {

  it('Hide/show tool bar', function() {
    cy.visit('/')
    
    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '0px'))
    cy.get('.home > .conception-grid > .header > .reduce-button').first().click()
    cy.wait(TIMELAPS)
    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '-215px'))
    cy.get('.home > .conception-grid > .header > .reduce-button').first().click()
    cy.wait(TIMELAPS)
    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '0px'))
  })

  it('Hide/show console bar', function() {
    cy.visit('/')
    
    expect(cy.get('#console-bar').should('have.css', 'margin-right', '0px'))
    cy.get('.home > .conception-grid > .header > .reduce-button-right').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#console-bar').should('have.css', 'margin-right', '-460px'))
    cy.get('.home > .conception-grid > .header > .reduce-button-right').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#console-bar').should('have.css', 'margin-right', '0px'))
  })

})