import * as d3 from 'd3'
import * as linkCalculators from './linkCalculators'
import { organizeCompAndLinksOverlay } from './organizeCompAndLinksOverlay'
import { transfertData } from './transfertData'
import { LINK_FILL_COLOR, ACTIVE_LINK_FILL_COLOR, TRANSFER_TYPE, DATA_LOADING_TYPE } from '../../../config'

/**
 * Selects all connectors of '#conception-grid-svg' and sets drag&drop listeners for links creation.
 * When a user select a component's input or output and make a drag and drop
 * Generates a link which start from the component's outlet and follow the user mouse
 * On drag end, creates a link for the graph if find an other component to link on mouse position
 * @param addAndRemoveLink function who register the link in component's links of ConceptionGrid's Vue
 * @param addTheLinkInTheSvg if true add the link in the svg grid, otherwise remove the g and the path of the animation
 * @param tabId the tab id
 */
export function createLinkIntoGrid (addAndRemoveLink: Function, addTheLinkInTheSvg: boolean, tabId: string): void {
  const theSvg = '#conception-grid-svg' + (DATA_LOADING_TYPE === 'ALL_AT_ONCE' ? '' : '-' + tabId)

  const dragLinkCompHandler = d3.drag()
    .on('drag', function () {
      // The data for our line
      const theSourceCompId: string = d3.select(this).attr('id').replace('output-', '').replace('input-', '')
      const isSourceInput: boolean = (d3.select(this).attr('id').indexOf('input') >= 0)

      const source: [number, number] = [Number.parseInt(d3.select(this).attr('cx')), Number.parseInt(d3.select(this).attr('cy'))]
      const target: [number, number] = [Number.parseInt(d3.event.x), Number.parseInt(d3.event.y)]

      // Look if a temp <g><path/></g> already exist
      if (document.getElementById('link-' + theSourceCompId) === null) {
        // The line SVG Path we draw
        const path = d3.select(theSvg).append('g')
          .attr('class', 'link ' + (isSourceInput ? 'input-' : 'output-') + theSourceCompId)
          .attr('transform', d3.select(theSvg).select('g').attr('transform'))
          .append('path')
          .attr('id', 'link-' + theSourceCompId)
          .datum(linkCalculators.getLineData(source, target, isSourceInput))
          .attr('d', linkCalculators.lineFunction)
          .attr('stroke', LINK_FILL_COLOR)
          .attr('stroke-width', '3px')
          .attr('fill', 'none')
          .style('cursor', 'pointer')
        path.on('mouseover', () => {
          path.attr('stroke-width', '5px')
        })
        path.on('mouseout', () => {
          path.attr('stroke-width', '3px')
        })
        path.on('click', () => {
          if (path.attr('stroke') === LINK_FILL_COLOR) {
            d3.selectAll('.link-path').attr('stroke', LINK_FILL_COLOR)
            path.attr('stroke', ACTIVE_LINK_FILL_COLOR)
          } else {
            d3.selectAll('.link-path').attr('stroke', LINK_FILL_COLOR)
            path.attr('stroke', LINK_FILL_COLOR)
          }
        })

        organizeCompAndLinksOverlay()
      } else { // If a temp <g><path/></g> already exist we just edit the line positions.
        d3.select('#link-' + theSourceCompId)
          .datum(linkCalculators.getLineData(source, target, isSourceInput))
          .attr('d', linkCalculators.lineFunction)
      }
    })
    .on('end', function () {
      const theSourceCirle = d3.select(this)
      const theSourceCirleCode = theSourceCirle.attr('data-index') + '-' + theSourceCirle.attr('data-id')
      const isSourceInput: boolean = (theSourceCirle.attr('id').indexOf('input') >= 0)
      // This object will contains all data necessary to concrete link creation.
      const outputInput: {output: {id: string; compId: string; circle: unknown; xy: [number, number]}; input: {id: string; compId: string; circle: unknown; xy: [number, number]}} = { output: { id: '', compId: '', circle: '', xy: [0, 0] }, input: { id: '', compId: '', circle: '', xy: [0, 0] } }

      outputInput[isSourceInput ? 'input' : 'output'] = {
        id: theSourceCirle.attr('data-index') + '-' + theSourceCirle.attr('data-id'),
        compId: theSourceCirle.attr('data-id'),
        circle: theSourceCirle,
        xy: [Number.parseInt(theSourceCirle.attr('cx')), Number.parseInt(theSourceCirle.attr('cy'))]
      }

      let isFounded = false
      d3.select(theSvg).selectAll('.connector')
        .each(function () {
          const theTargetCirle = d3.select(this)
          const targetXY: [number, number] = [Number.parseInt(theTargetCirle.attr('cx')), Number.parseInt(theTargetCirle.attr('cy'))]

          if (Math.abs(d3.event.x - targetXY[0]) <= 10 && Math.abs(d3.event.y - targetXY[1]) <= 10) {
            const isTargetInput: boolean = (theTargetCirle.attr('id').indexOf('input') >= 0)
            outputInput[isSourceInput ? 'output' : 'input'] = {
              id: theTargetCirle.attr('data-index') + '-' + theTargetCirle.attr('data-id'),
              compId: theTargetCirle.attr('data-id'),
              circle: theTargetCirle,
              xy: targetXY
            }

            // To be able to add a new link we need to be sure that :
            // - the target and the source is not the same component.
            // - the connections is beetween an input and an output connector.
            // - there is no any link who already exist between those two components.
            if (outputInput.output.compId !== outputInput.input.compId && isSourceInput !== isTargetInput &&
                    document.getElementById('link-' + outputInput.output.id + '-to-' + outputInput.input.id) === null) {
              addAndRemoveLink(outputInput.output.id, outputInput.input.id, true)
              isFounded = true
              const g = document.getElementById('link-' + theSourceCirleCode)?.parentElement
              if (g) {
                if (addTheLinkInTheSvg) {
                  g.setAttribute('class', 'link')
                  g.setAttribute('id', 'link-tempory')
                } else {
                  g.remove()
                }
              }
              if (addTheLinkInTheSvg) {
                d3.select('#link-' + theSourceCirleCode).attr('id', 'link-' + outputInput.output.id + '-to-' + outputInput.input.id)
                  .attr('class', 'link-path link-' + outputInput.output.compId + ' link-' + outputInput.input.compId)
                  .datum(linkCalculators.getLineData(outputInput.output.xy, outputInput.input.xy, false))
                  .attr('d', linkCalculators.lineFunction)
                  .attr('data-input', outputInput.input.id)
                  .attr('data-output', outputInput.output.id)
                  .attr('data-input-index', (isSourceInput ? theSourceCirle.attr('data-index') : theTargetCirle.attr('data-index')))
                  .attr('data-output-index', (isSourceInput ? theTargetCirle.attr('data-index') : theSourceCirle.attr('data-index')))
                  .on('dblclick', function () {
                    d3.select(this).remove()
                    addAndRemoveLink(outputInput.output.id, outputInput.input.id, false)
                  })

                transfertData('#output-' + outputInput.output.id, '#input-' + outputInput.input.id, TRANSFER_TYPE, tabId)
              }
            }
          }
        })
      if (!isFounded) {
        const g = document.getElementById('link-' + theSourceCirleCode)?.parentElement
        if (g) {
          g.remove()
        }
      }
    })

  dragLinkCompHandler(d3.select(theSvg).selectAll('.connector'))
}
