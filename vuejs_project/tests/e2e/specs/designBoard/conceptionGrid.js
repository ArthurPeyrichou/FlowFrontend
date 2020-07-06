// https://docs.cypress.io/api/introduction/api.html

const TIMELAPS = 10

function dragDropIntoSvg (source, target, xDestInsvg, yDestInsvg) {
  cy.get(source)
  cy.get(target)
  const dataTransfer = new DataTransfer()

  cy.get(source).trigger('pointerdown', { which: 1, button: 0, force: true })
    .trigger('mousedown', { which: 1, button: 0, force: true })
    .trigger('dragstart', { dataTransfer, force: true })

  cy.get(target).trigger('dragover', { dataTransfer, force: true })
  cy.wait(TIMELAPS)

  cy.get(target).trigger('drop', { dataTransfer, force: true }).then(() => {
    cy.get(target).trigger('mouseup', { which: 1, button: 0, force: true }).then(() => {
      cy.get(target).trigger('pointerup', { which: 1, button: 0, force: true }).then(() => {
        cy.get(target).trigger('mousemove', { x: xDestInsvg, y: yDestInsvg, force: true, view: window })
      })
    })
  })
  cy.wait(TIMELAPS)
}

function dragDropD3 (source, target) {
  cy.get(source)
  cy.get(target)

  cy.window().then((win) => {
    const dataTransfer = new DataTransfer()
    cy.get(source).first().trigger('mousemove', { view: win })
    cy.get(source).first().trigger('pointerdown', { which: 1, button: 0, view: win })
      .trigger('mousedown', { which: 1, button: 0, view: win })
      .trigger('dragstart', { dataTransfer, view: win })

    cy.get(target).last().trigger('mousemove', { view: win })

    cy.get(target).last().trigger('dragover', { dataTransfer, view: win })
    cy.wait(TIMELAPS)

    cy.get(target).last().trigger('drop', { dataTransfer, view: win }).then(() => {
      cy.get(target).last().trigger('mouseup', { which: 1, button: 0, view: win }).then(() => {
        cy.get(target).last().trigger('pointerup', { which: 1, button: 0, view: win })
      })
    })
  })
  cy.wait(TIMELAPS)
}

function giveSpace () {
  expect(cy.get('#console-bar').should('have.css', 'margin-right', '0px'))
  cy.get('.home > .conception-grid > .header > .reduce-button-right').click()
  cy.wait(TIMELAPS)
}

describe('Grid conception tests', () => {
  it('Drag and drop a component into conception grid', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 100, 100)
    cy.get('.fdcomp').should('have.length', 1)
  })

  it('Moove a component in the corners of conception grid', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    let id = null
    cy.get('.fdcomp').first().should('have.attr', 'id').then((theId) => {
      id = theId.replace('rect-', '')

      cy.window().then((win) => {
        const dataTransfer = new DataTransfer()
        cy.get('#rect-' + id).trigger('mousemove', { view: win })
        cy.get('#rect-' + id).trigger('pointerdown', { which: 1, button: 0, view: win })
          .trigger('mousedown', { which: 1, button: 0, view: win })
          .trigger('dragstart', { dataTransfer, view: win })

        cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topLeft', force: true, view: win })
        cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
        cy.wait(TIMELAPS)

        cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
          cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
          })
        })

        cy.get('#title-text-' + id).trigger('mousemove', { view: win })
        cy.get('#title-text-' + id).trigger('pointerdown', { which: 1, button: 0, view: win })
          .trigger('mousedown', { which: 1, button: 0, view: win })
          .trigger('dragstart', { dataTransfer, view: win })

        cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topRight', force: true, view: win })
        cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
        cy.wait(TIMELAPS)

        cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
          cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
          })
        })

        cy.get('#type-text-' + id).trigger('mousemove', { view: win })
        cy.get('#type-text-' + id).trigger('pointerdown', { which: 1, button: 0, view: win })
          .trigger('mousedown', { which: 1, button: 0, view: win })
          .trigger('dragstart', { dataTransfer, view: win })

        cy.get('#svg-grid-bg').trigger('mousemove', { position: 'bottomLeft', force: true, view: win })
        cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
        cy.wait(TIMELAPS)

        cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
          cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
          })
        })

        cy.get('#type-text-' + id).trigger('mousemove', { view: win })

        cy.get('.fdcomp').should('have.length', 1)
      })
    })
  })

  it('When moove a component, it go to the top of conception grid offset', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()

      let componentId1 = null
      cy.get('.fdcomp').first().should('have.attr', 'id').then((theId) => {
        componentId1 = theId.replace('rect-', '')

        cy.get('#rect-' + componentId1).trigger('mousemove', { view: win })
        cy.get('#rect-' + componentId1).trigger('pointerdown', { which: 1, button: 0, view: win })
          .trigger('mousedown', { which: 1, button: 0, view: win })
          .trigger('dragstart', { dataTransfer, view: win })

        cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topRight', force: true, view: win })
        cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
        cy.wait(TIMELAPS)

        cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
          cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
          })
        })

        cy.get('.fdcomp').should('have.length', 1)
        dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
        cy.get('.fdcomp').should('have.length', 2)

        let componentId2 = null
        cy.get('.fdcomp').first().should('have.attr', 'id').then((theId) => {
          componentId2 = theId.replace('rect-', '')

          cy.get('#rect-' + componentId2).trigger('mousemove', { view: win })
          cy.get('#rect-' + componentId2).trigger('pointerdown', { which: 1, button: 0, view: win })
            .trigger('mousedown', { which: 1, button: 0, view: win })
            .trigger('dragstart', { dataTransfer, view: win })

          cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topLeft', force: true, view: win })
          cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
          cy.wait(TIMELAPS)

          cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
              cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
            })
          })

          cy.get('.fdcomp').first().should('have.attr', 'id').then(() => {
            cy.get('.fdcomp').should('have.length', 2)
          })
        })
      })
    })
  })

  it('A component can\'t link his output to his input', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('.link-path').should('have.length', 0)
    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 0)
  })

  it('Link two components in the conception grid and select it', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 150)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 450, 300)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()
      cy.get('circle.input').first().trigger('mousemove', { view: win })
      cy.get('circle.input').first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topLeft', force: true, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.output').last().trigger('mousemove', { view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.output').last().trigger('dragover', { dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.output').last().trigger('drop', { dataTransfer, view: win }).then(() => {
        cy.get('circle.output').last().trigger('mouseup', { which: 1, button: 0, view: win }).then(() => {
          cy.get('circle.output').last().trigger('pointerup', { which: 1, button: 0, view: win })
        })
      })
    })

    cy.get('.link-path').should('have.length', 1)

    expect(cy.get('.link-path').should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').click()
    expect(cy.get('.link-path').should('have.attr', 'stroke', 'gold'))
    cy.get('.link-path').click()
    expect(cy.get('.link-path').should('have.attr', 'stroke', 'grey'))
  })

  it('Link two components in the conception grid and select triggerable component', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(2) > .list-group > .list-group-item', '#svg-grid-bg', 150, 150)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 450, 300)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()
      cy.get('circle.output').first().trigger('mousemove', { view: win })
      cy.get('circle.output').first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topLeft', force: true, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.input').last().trigger('mousemove', { view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.input').last().trigger('dragover', { dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('circle.input').last().trigger('drop', { dataTransfer, view: win }).then(() => {
        cy.get('circle.input').last().trigger('mouseup', { which: 1, button: 0, view: win }).then(() => {
          cy.get('circle.input').last().trigger('pointerup', { which: 1, button: 0, view: win })
        })
      })
    })
    cy.wait(Math.min(TIMELAPS, 200))
    cy.get('.link-path').should('have.length', 1)

    let componentId1 = null
    cy.get('.fdcomp').first().should('have.attr', 'id').then((theId) => {
      componentId1 = theId.replace('rect-', '')

      cy.get('#trigger-' + componentId1).click()
      cy.wait(Math.min(TIMELAPS, 200))
    })
  })

  it('Cancel a link beetween two components', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 150)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 450, 300)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()
      cy.get('circle.input').first().trigger('mousemove', { view: win })
      cy.get('circle.input').first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topLeft', force: true, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('#svg-grid-bg').trigger('dragover', { position: 'topLeft', force: true, dataTransfer, view: win })
      cy.wait(Math.min(TIMELAPS, 200))

      cy.get('#svg-grid-bg').trigger('drop', { position: 'topLeft', force: true, dataTransfer, view: win }).then(() => {
        cy.get('#svg-grid-bg').trigger('mouseup', { position: 'topLeft', force: true, which: 1, button: 0, view: win }).then(() => {
          cy.get('#svg-grid-bg').trigger('pointerup', { position: 'topLeft', force: true, which: 1, button: 0, view: win })
        })
      })
    })
    cy.get('.link-path').should('have.length', 0)
  })

  it('Link two components in the conception grid in cross', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 200, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 150, 250)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)

    expect(cy.get('.link-path').should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').click()
    expect(cy.get('.link-path').should('have.attr', 'stroke', 'gold'))
  })

  it('On mooving linked component, the link follow', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 150, 250)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)

    expect(cy.get('.link-path').should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').click()
    expect(cy.get('.link-path').should('have.attr', 'stroke', 'gold'))

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()

      let componentId1 = null
      cy.get('.fdcomp').first().should('have.attr', 'id').then((theId) => {
        componentId1 = theId.replace('rect-', '')

        cy.get('#rect-' + componentId1).trigger('mousemove', { view: win })
        cy.get('#rect-' + componentId1).trigger('pointerdown', { which: 1, button: 0, view: win })
          .trigger('mousedown', { which: 1, button: 0, view: win })
          .trigger('dragstart', { dataTransfer, view: win })

        cy.get('#svg-grid-bg').trigger('mousemove', { position: 'topRight', force: true, view: win })
        cy.get('#svg-grid-bg').trigger('dragover', { dataTransfer, view: win, force: true })
        cy.wait(TIMELAPS)

        cy.get('#svg-grid-bg').trigger('drop', { dataTransfer, view: win, force: true }).then(() => {
          cy.get('#svg-grid-bg').trigger('mouseup', { which: 1, button: 0, view: win, force: true }).then(() => {
            cy.get('#svg-grid-bg').trigger('pointerup', { which: 1, button: 0, view: win, force: true })
          })
        })
        cy.wait(TIMELAPS)
      })
    })
  })

  it('Two components can\'t have the same link twice', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 150, 250)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)
  })

  it('Link three components in the conception grid from same output and select it', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 150, 200)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(2)', '#svg-grid-bg', 150, 400)
    cy.get('.fdcomp').should('have.length', 3)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 2)

    expect(cy.get('.link-path').first().should('have.attr', 'stroke', 'grey'))
    expect(cy.get('.link-path').last().should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').first().click()

    expect(cy.get('.link-path').first().should('have.attr', 'stroke', 'gold'))
    expect(cy.get('.link-path').last().should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').last().click()

    expect(cy.get('.link-path').first().should('have.attr', 'stroke', 'grey'))
    expect(cy.get('.link-path').last().should('have.attr', 'stroke', 'gold'))
  })

  it('On component or component\'s text click, open setting modal', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    let id = null
    cy.get('.fdcomp').should('have.attr', 'id').then((theId) => {
      id = theId.replace('rect-', '')

      cy.get('#rect-' + id).click()
      cy.wait(TIMELAPS)
      cy.get('.modal-title').contains('Settings: ')

      cy.get('#setting-modal-close').click()
      cy.wait(TIMELAPS)

      cy.get('#title-text-' + id).click()
      cy.wait(TIMELAPS)
      cy.get('.modal-title').contains('Settings: ')

      cy.get('#setting-modal-close').click()
      cy.wait(TIMELAPS)

      cy.get('#type-text-' + id).click()
      cy.wait(TIMELAPS)
      cy.get('.modal-title').contains('Settings: ')

      cy.get('#setting-modal-close').click()
      cy.wait(TIMELAPS)
    })
  })

  it('On component or component\'s icon click, open setting modal', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    let id = null
    cy.get('.fdcomp').should('have.attr', 'id').then((theId) => {
      id = theId.replace('rect-', '')

      cy.get('#rect-' + id).click()
      cy.wait(TIMELAPS)
      cy.get('.modal-title').contains('Settings: ')

      cy.get('#setting-modal-close').click()
      cy.wait(TIMELAPS)

      cy.get('#icon-' + id).click()
      cy.wait(TIMELAPS)
      cy.get('.modal-title').contains('Settings: ')

      cy.get('#setting-modal-close').click()
      cy.wait(TIMELAPS)
    })
  })

  it('Delete component in settting modal', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('.fdcomp').click()
    cy.wait(TIMELAPS)
    cy.get('.modal-title').contains('Settings: ')

    cy.get('#setting-modal-delete').click()
    cy.wait(TIMELAPS)
    cy.get('.fdcomp').should('have.length', 0)
  })

  it('Link three components in the conception grid, then delete a component with link in output and input', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 150)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 250, 300)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3('circle.output', 'circle.input')
    cy.get('.link-path').should('have.length', 1)

    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 350, 450)
    cy.get('.fdcomp').should('have.length', 3)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()
      cy.get('circle.output').last().trigger('mousemove', { view: win })
      cy.get('circle.output').last().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })

      cy.get('circle.input').first().trigger('mousemove', { view: win })

      cy.get('circle.input').first().trigger('dragover', { dataTransfer, view: win })
      cy.wait(TIMELAPS)

      cy.get('circle.input').first().trigger('drop', { dataTransfer, view: win }).then(() => {
        cy.get('circle.input').first().trigger('mouseup', { which: 1, button: 0, view: win }).then(() => {
          cy.get('circle.input').first().trigger('pointerup', { which: 1, button: 0, view: win })
        })
      })
    })
    cy.wait(TIMELAPS)
    cy.get('.link-path').should('have.length', 2)

    cy.get('.fdcomp').first().click()
    cy.wait(TIMELAPS)
    cy.get('.modal-title').contains('Settings: ')

    cy.get('#setting-modal-delete').click()
    cy.wait(TIMELAPS)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)
  })

  it('Zoom in test', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.1)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.2)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.3)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.4)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.5)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.6)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.7)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.8)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.9)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(2.0)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(2.0)')
  })

  it('Zoom out test', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.9)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.8)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.7)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.6)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.5)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.4)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.3)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.2)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.1)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.1)')
  })

  it('Zoom reset test', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('#tool-bar > .board > .fdcomp-group-list:nth-child(3) > .list-group > .list-group-item:nth-child(1)', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.9)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.8)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.7)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.6)')
    cy.get('#zoom-out-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.5)')

    cy.get('#reset-zoom-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')

    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.1)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.2)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.3)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.4)')
    cy.get('#zoom-in-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.5)')

    cy.get('#reset-zoom-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')

    cy.get('#reset-zoom-btn').click()
    cy.wait(TIMELAPS)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')
  })

  it('Can moove in conception grid by grabbing it', function () {
    cy.visit('/')
    giveSpace()

    cy.get('#conception-board')
    const dataTransfer = new DataTransfer()

    cy.get('#conception-board').trigger('pointerdown', { x: 400, y: 400, which: 1, button: 0, force: true })
      .trigger('mousedown', { x: 400, y: 400, which: 1, button: 0, force: true })
      .trigger('dragstart', { x: 400, y: 400, dataTransfer, force: true })

    cy.get('#conception-board').trigger('mousemove', { x: 150, y: 150, force: true, view: window })
    cy.get('#conception-board').trigger('dragover', { x: 150, y: 150, dataTransfer, force: true })
    cy.wait(TIMELAPS)

    cy.get('#conception-board').trigger('drop', { x: 150, y: 150, dataTransfer, force: true }).then(() => {
      cy.get('#conception-board').trigger('mouseup', { x: 150, y: 150, which: 1, button: 0, force: true }).then(() => {
        cy.get('#conception-board').trigger('pointerup', { x: 150, y: 150, which: 1, button: 0, force: true }).then(() => {
          cy.get('#conception-board').trigger('mousemove', { x: 150, y: 150, force: true, view: window })
        })
      })
    })
    cy.wait(TIMELAPS)
  })

  it('Handle drop in conception of items that should not be drop', function () {
    cy.visit('/')
    giveSpace()

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg('.header-content > h3', '#svg-grid-bg', 150, 100)
    cy.get('.fdcomp').should('have.length', 0)
  })
})
