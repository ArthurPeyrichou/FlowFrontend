import * as d3 from 'd3'
import * as linkCalculators from './linkCalculators'
import { organizeCompAndLinksOverlay } from './organizeCompAndLinksOverlay'
import { LINK_FILL_COLOR, ACTIVE_LINK_FILL_COLOR } from '../../../config'

/**
 * Creates a link in the svg graph
 * @param outputId the source component id
 * @param outputIndex the source component output index
 * @param link the target component (id and input index)
 * @param addAndRemoveLink function who add or remove the link from the graph, called on double-click for removing the link
 */
export function addLinkIntoGrid (outputId: string, outputIndex: number, link: {index: number; id: string}, addAndRemoveLink: Function): void {
  const outputCircle = d3.select('#output-' + outputIndex + '-' + outputId)
  const inputCircle = d3.select('#input-' + link.index + '-' + link.id)

  const outputXY: [number, number] = [Number.parseInt(outputCircle.attr('cx')), Number.parseInt(outputCircle.attr('cy'))]
  const inputXY: [number, number] = [Number.parseInt(inputCircle.attr('cx')), Number.parseInt(inputCircle.attr('cy'))]

  const path = d3.select('#conception-grid-svg').append('g')
    .attr('class', 'link')
    .attr('transform', d3.select('#conception-grid-svg').select('g').attr('transform'))
    .append('path')
    .attr('id', 'link-' + outputIndex + '-' + outputId + '-to-' + link.index + '-' + link.id)
    .attr('class', 'link-path link-' + outputId + ' link-' + link.id)
    .datum(linkCalculators.getLineData(outputXY, inputXY, false))
    .attr('d', linkCalculators.lineFunction)
    .attr('data-input', link.index + '-' + link.id)
    .attr('data-output', outputIndex + '-' + outputId)
    .attr('data-input-index', outputIndex)
    .attr('data-output-index', link.index)
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
  path.on('dblclick', () => {
    addAndRemoveLink(outputIndex + '-' + outputId, link.index + '-' + link.id, false)
  })
  organizeCompAndLinksOverlay()
}
