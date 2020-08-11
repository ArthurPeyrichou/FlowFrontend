// https://docs.cypress.io/api/introduction/api.html

const TIMELAPS = 100

describe('Authentification modal tests', () => {
  it('Register test', function () {
    cy.visit('/')

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(1) > .dropdown-item').click()
    cy.get('#register-modal-close').click()

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(1) > .dropdown-item').click()

    cy.get('#register-name-input').type('fa')
    cy.get('#register-password-input').type('12345')
    cy.get('#register-password2-input').type('12345')
    cy.get('#register-modal-submit').click()

    cy.get('.invalid-feedback').eq(0).contains('Name with length [3;30] is required. Current 2.')
    cy.get('.invalid-feedback').eq(1).contains('Password with length [8;30] is required. Current 5.')

    cy.get('#register-name-input').click()
    cy.get('#register-name-input').clear().type('aFakeLongNameaFakeLongNameaFakeLongName')
    cy.get('#register-password-input').click()
    cy.get('#register-password-input').clear().type('1234567890123456789012345678901')
    cy.get('#register-password2-input').click()
    cy.get('#register-password2-input').clear().type('1234567890123456789012345678901')
    cy.get('#register-modal-submit').click()

    cy.get('.invalid-feedback').eq(0).contains('Name with length [3;30] is required. Current 39.')
    cy.get('.invalid-feedback').eq(1).contains('Password with length [8;30] is required. Current 31.')

    cy.get('#register-name-input').click()
    cy.get('#register-name-input').clear().type('aFakeName')
    cy.get('#register-password-input').click()
    cy.get('#register-password-input').clear().type('123456789')
    cy.get('#register-password2-input').click()
    cy.get('#register-password2-input').clear().type('987654321')
    cy.get('#register-modal-submit').click()

    cy.get('.invalid-feedback').eq(2).contains('Password confirmation failed. Passwords are not similar.')

    cy.get('#register-name-input').click()
    cy.get('#register-name-input').clear().type('aFakeName')
    cy.get('#register-password-input').click()
    cy.get('#register-password-input').clear().type('123456789')
    cy.get('#register-password2-input').click()
    cy.get('#register-password2-input').clear().type('123456789')
    cy.get('#register-modal-submit').click()
  })

  it('Login test', function () {
    cy.visit('/')

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(2) > .dropdown-item').click()
    cy.get('#login-modal-close').click()

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(2) > .dropdown-item').click()

    cy.get('#login-name-input').type('fa')
    cy.get('#login-password-input').type('12345')
    cy.get('#login-modal-submit').click()
  })

  it('Group management test', function () {
    cy.visit('/')

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(3) > .dropdown-item').click()
    cy.get('#group-management-modal-close').click()

    cy.get('#app > .header > #auth-menu > #auth-menu__BV_toggle_').click()
    cy.get('.header > #auth-menu > .dropdown-menu > li:nth-child(3) > .dropdown-item').click()
  })
})
