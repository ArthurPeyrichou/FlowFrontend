// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.get('.tool-bar').get('.header').contains("Tool bar")
    cy.get('.conception-grid').get('.header').contains("Console")
    cy.get('.console-bar').get('.header').contains("Conception Grid")
  })
})
