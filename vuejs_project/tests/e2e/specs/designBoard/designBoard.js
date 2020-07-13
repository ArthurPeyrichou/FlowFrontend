// https://docs.cypress.io/api/introduction/api.html

const TIMELAPS = 100

describe('Bar hide and show tests', () => {
  it('Hide and show tool bar', function () {
    cy.visit('/')

    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '0px'))
    cy.get('.home > #conception-grid > .header > .reduce-button').first().click()
    cy.wait(TIMELAPS)
    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '-215px'))
    cy.get('.home > #conception-grid > .header > .reduce-button').first().click()
    cy.wait(TIMELAPS)
    expect(cy.get('#tool-bar').should('have.css', 'margin-left', '0px'))
  })

  it('Hide and show console bar', function () {
    cy.visit('/')

    expect(cy.get('#console-bar').should('have.css', 'margin-right', '0px'))
    cy.get('.home > #conception-grid > .header > .reduce-button-right').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#console-bar').should('have.css', 'margin-right', '-460px'))
    cy.get('.home > #conception-grid > .header > .reduce-button-right').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#console-bar').should('have.css', 'margin-right', '0px'))
  })

  it('Switch to another board', function () {
    cy.visit('/')

    cy.get('#tool-bar')
    cy.get('#conception-grid')
    cy.get('#console-bar')
    cy.get('body > #app > .nav > .nav-item:nth-child(2) > .nav-link').click()
    cy.wait(TIMELAPS)
    cy.get('.home h3').contains('This is a demo blank board.')
    cy.get('body > #app > .nav > .nav-item:nth-child(1) > .nav-link').click()
    cy.wait(TIMELAPS)
    cy.get('#tool-bar')
    cy.get('#conception-grid')
    cy.get('#console-bar')
  })
})
