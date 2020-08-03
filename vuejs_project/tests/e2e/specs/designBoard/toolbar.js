// https://docs.cypress.io/api/introduction/api.html

const TIMELAPS = 10

describe('Tool bar tests', () => {
  it('Header navbar show/hide', function () {
    cy.visit('/')

    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))
    cy.get('#tool-bar > .header > .navbar > .navbar-toggler > .bi-chevron-bar-down').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse show'))
    cy.get('#tool-bar > .header > .navbar > .navbar-toggler > .bi-chevron-bar-up').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))
  })

  it('Open add-component-modal', function () {
    cy.visit('/')

    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))

    cy.get('#tool-bar > .header > .navbar > .navbar-toggler > .bi-chevron-bar-down').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse show'))

    cy.get('.navbar > #toolbar-option-navbar-toggle-collapse > .navbar-nav > .nav-item:nth-child(1) > .nav-link').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))
    expect(cy.get('#modal-add-component').should('have.attr', 'class', 'modal fade show'))

    cy.get('.modal-dialog > #modal-add-component___BV_modal_content_ > #modal-add-component___BV_modal_footer_ > .w-100 > #setting-modal-close').click()
    cy.wait(TIMELAPS)
  })

  it('Can\'t validate add-component-modal without file', function () {
    cy.visit('/')

    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))

    cy.get('#tool-bar > .header > .navbar > .navbar-toggler > .bi-chevron-bar-down').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse show'))

    cy.get('.navbar > #toolbar-option-navbar-toggle-collapse > .navbar-nav > .nav-item:nth-child(1) > .nav-link').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#toolbar-option-navbar-toggle-collapse').should('have.attr', 'class', 'navbar-collapse collapse'))
    expect(cy.get('#modal-add-component').should('have.attr', 'class', 'modal fade show'))
    expect(cy.get('#modal-add-component .invalid-feedback').should('have.attr', 'class', 'invalid-feedback'))

    cy.get('.modal-dialog > #modal-add-component___BV_modal_content_ > #modal-add-component___BV_modal_footer_ > .w-100 > #setting-modal-update').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#modal-add-component').should('have.attr', 'class', 'modal fade show'))
    expect(cy.get('#modal-add-component .invalid-feedback').should('have.attr', 'class', 'invalid-feedback d-block'))

    cy.get('.modal-dialog > #modal-add-component___BV_modal_content_ > #modal-add-component___BV_modal_footer_ > .w-100 > #setting-modal-update').click()
    cy.wait(TIMELAPS)
    expect(cy.get('#modal-add-component').should('have.attr', 'class', 'modal fade show'))
    expect(cy.get('#modal-add-component .invalid-feedback').should('have.attr', 'class', 'invalid-feedback d-block'))

    cy.get('.modal-dialog > #modal-add-component___BV_modal_content_ > #modal-add-component___BV_modal_footer_ > .w-100 > #setting-modal-close').click()
  })

  it('Filter component list with search bar', function () {
    cy.visit('/')

    cy.get('.fdcomp-group-list').should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 1)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(2).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').click()
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('1')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('-')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 1)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('0')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 1)
    cy.get('.fdcomp-group-list').children().eq(1).children().should('have.length', 1)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('aze')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 0)
  })

  it('Reset component list filtering', function () {
    cy.visit('/')

    cy.get('.fdcomp-group-list').should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 1)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(2).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').click()
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('1')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('-')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 2)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 1)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 2)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-text > input').type('0')
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 1)
    cy.get('.fdcomp-group-list').children().eq(1).children().should('have.length', 1)
    cy.get('#tool-bar > .board > .search-component-box > .search-component-box-control > .fa-times').click()
    cy.wait(TIMELAPS)

    cy.get('.fdcomp-group-list').should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(0).children().eq(1).children().should('have.length', 1)
    cy.get('.fdcomp-group-list').eq(1).children().eq(1).children().should('have.length', 3)
    cy.get('.fdcomp-group-list').eq(2).children().eq(1).children().should('have.length', 2)
  })
})
