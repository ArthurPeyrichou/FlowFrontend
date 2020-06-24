// https://docs.cypress.io/api/introduction/api.html

function dragDropIntoSvg(source, target, xDestInsvg, yDestInsvg) {
  cy.get(source)
  cy.get(target)
  const dataTransfer = new DataTransfer()

  cy.get(source).trigger('pointerdown', { which: 1, button: 0, force: true})
    .trigger('mousedown', { which: 1, button: 0, force: true})
    .trigger('dragstart', { dataTransfer, force: true})

  cy.get(target).trigger("dragover", {dataTransfer, force: true})
  cy.wait(10)

  cy.get(target).trigger('drop', { dataTransfer, force: true}).then(() => {
    cy.get(target).trigger('mouseup', { which: 1, button: 0, force: true}).then(() => {  
      cy.get(target).trigger('pointerup', { which: 1, button: 0, force: true}).then(() => { 
        cy.get(target).trigger('mousemove', { x:xDestInsvg, y:yDestInsvg, force: true, view:window})
      }) 
    }) 
  })
  cy.wait(10)
}

function dragDropD3(source, target) {
  cy.get(source)
  cy.get(target)

  cy.window().then((win) => {
    const dataTransfer = new DataTransfer()
    cy.get(source).first().trigger('mousemove', {view: win})
    cy.get(source).first().trigger('pointerdown', { which: 1, button: 0, view: win })
      .trigger('mousedown', { which: 1, button: 0, view: win })
      .trigger('dragstart', { dataTransfer, view: win })
    
    cy.get(target).last().trigger('mousemove', {view: win})

    cy.get(target).last().trigger("dragover", {dataTransfer, view: win})
    cy.wait(10)

    cy.get(target).last().trigger('drop', { dataTransfer, view: win}).then(() => { 
      cy.get(target).last().trigger('mouseup', { which: 1, button: 0, view: win}).then(() => {     
        cy.get(target).last().trigger('pointerup', { which: 1, button: 0, view: win})  
        }) 
    })
  })
  cy.wait(10)
}

describe('Grid conception tests', () => {

  it('Drag and drop a component into conception grid', function() {
    cy.visit('/')
    
    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 100, 100)
    cy.get('.fdcomp').should('have.length', 1)
  })

  it('Moove a component in the corners of conception grid', function() {
    cy.visit('/')
    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.window().then((win) => {
      const dataTransfer = new DataTransfer()
      cy.get(".fdcomp").first().trigger('mousemove', {view: win})
      cy.get(".fdcomp").first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      
      cy.get("#svg-grid-bg").trigger('mousemove', {position: "topLeft", force: true, view: win})
      cy.get("#svg-grid-bg").trigger("dragover", {dataTransfer, view: win, force: true})
      cy.wait(10)
  
      cy.get("#svg-grid-bg").trigger('drop', { dataTransfer, view: win, force: true}).then(() => { 
        cy.get("#svg-grid-bg").trigger('mouseup', { which: 1, button: 0, view: win, force: true}).then(() => {     
          cy.get("#svg-grid-bg").trigger('pointerup', { which: 1, button: 0, view: win, force: true})  
          }) 
      })

      cy.get(".fdcomp").first().trigger('mousemove', {view: win})
      cy.get(".fdcomp").first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      
      cy.get("#svg-grid-bg").trigger('mousemove', {position: "topRight", force: true, view: win})
      cy.get("#svg-grid-bg").trigger("dragover", {dataTransfer, view: win, force: true})
      cy.wait(10)
  
      cy.get("#svg-grid-bg").trigger('drop', { dataTransfer, view: win, force: true}).then(() => { 
        cy.get("#svg-grid-bg").trigger('mouseup', { which: 1, button: 0, view: win, force: true}).then(() => {     
          cy.get("#svg-grid-bg").trigger('pointerup', { which: 1, button: 0, view: win, force: true})  
          }) 
      })

      cy.get(".fdcomp").first().trigger('mousemove', {view: win})
      cy.get(".fdcomp").first().trigger('pointerdown', { which: 1, button: 0, view: win })
        .trigger('mousedown', { which: 1, button: 0, view: win })
        .trigger('dragstart', { dataTransfer, view: win })
      
      cy.get("#svg-grid-bg").trigger('mousemove', {position: "bottomLeft", force: true, view: win})
      cy.get("#svg-grid-bg").trigger("dragover", {dataTransfer, view: win, force: true})
      cy.wait(10)
  
      cy.get("#svg-grid-bg").trigger('drop', { dataTransfer, view: win, force: true}).then(() => { 
        cy.get("#svg-grid-bg").trigger('mouseup', { which: 1, button: 0, view: win, force: true}).then(() => {     
          cy.get("#svg-grid-bg").trigger('pointerup', { which: 1, button: 0, view: win, force: true})  
          }) 
      })

      cy.get(".fdcomp").first().trigger('mousemove', {view: win})
    })
    cy.get('.fdcomp').should('have.length', 1)
  })

  it('A component can\'t link his output to his input', function() {
    cy.visit('/')
    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('.link-path').should('have.length', 0)
    dragDropD3("circle.output", "circle.input")
    cy.get('.link-path').should('have.length', 0)
  })

  it('Link two components in the conception grid and select it', function() {
    cy.visit('/')
    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(2)", "#svg-grid-bg", 150, 250)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3("circle.output", "circle.input")
    cy.get('.link-path').should('have.length', 1)

    expect(cy.get('.link-path').should('have.attr', 'stroke', 'grey'))
    cy.get('.link-path').click()
    expect(cy.get('.link-path').should('have.attr', 'stroke', 'gold'))
  })

  it('Two components can\'t have the same link twice', function() {
    cy.visit('/')
    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(2)", "#svg-grid-bg", 150, 250)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3("circle.output", "circle.input")
    cy.get('.link-path').should('have.length', 1)

    dragDropD3("circle.output", "circle.input")
    cy.get('.link-path').should('have.length', 1)
  })

  it('Link three components in the conception grid from same output and select it', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(2)", "#svg-grid-bg", 150, 200)
    cy.get('.fdcomp').should('have.length', 2)
    cy.get('.link-path').should('have.length', 0)

    dragDropD3("circle.output", "circle.input")
    cy.get('.link-path').should('have.length', 1)

    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(2)", "#svg-grid-bg", 150, 400)
    cy.get('.fdcomp').should('have.length', 3)

    dragDropD3("circle.output", "circle.input")
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

  it('On component click, open setting modal', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('.fdcomp').click();
    cy.wait(10)
    cy.get(".modal-title").contains("Settings: ")
  })

  it('Delete component in settting modal', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('.fdcomp').click();
    cy.wait(10)
    cy.get(".modal-title").contains("Settings: ")
    
    cy.get('#setting-modal-delete').click();
    cy.wait(10)
    cy.get('.fdcomp').should('have.length', 0)
  })

  it('Zoom in test', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.1)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.2)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.3)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.4)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.5)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.6)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.7)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.8)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.9)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(2.0)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(2.0)')
  })

  it('Zoom out test', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.9)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.8)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.7)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.6)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.5)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.4)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.3)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.2)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.1)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.1)')
  })

  it('Zoom reset test', function() {
    cy.visit('/')

    cy.get('.fdcomp').should('have.length', 0)
    dragDropIntoSvg(".fdcomp-group-list:nth-child(2) .list-group-item:nth-child(1)", "#svg-grid-bg", 150, 100)
    cy.get('.fdcomp').should('have.length', 1)

    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.9)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.8)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.7)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.6)')
    cy.get('#zoom-out-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(0.5)')

    cy.get('#reset-zoom-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')

    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.1)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.2)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.3)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.4)')
    cy.get('#zoom-in-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.5)')

    cy.get('#reset-zoom-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')

    cy.get('#reset-zoom-btn').click();
    cy.wait(10)
    cy.get('g').last().should('have.attr', 'transform', 'scale(1.0)')
  })

})