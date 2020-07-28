import * as d3 from 'd3'
import * as linkCalculators from './linkCalculators'
import { TRANSFER_DURATION, TRANSFER_RADIUS, TRANSFER_FILL_COLOR, TRANSFER_STROKE_COLOR, DATA_LOADING_TYPE } from '../../../config'

/**
 * Generates an animation for data transfer between two components.
 * The animation make a circle on the existing link's path which start from the start (output) to the end (input) like a pearl on a string.
 * @param theOuputId
 * @param theInputId
 * @param tabId
 */
export function transfertDataWithCircle (theOuputId: string, theInputId: string, tabId: string): void {
  const theOuputCircle = d3.select(theOuputId)
  const theInputCircle = d3.select(theInputId)

  const theSvg = '#conception-grid-svg' + (DATA_LOADING_TYPE === 'ALL_AT_ONCE' ? '' : '-' + tabId)

  // Gets the link path and initialize the circle which represent the data transfer
  const path = d3.select('#link-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id'))
  const dataTransfertId = 'data-trans-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id')

  // Make the circle follow the path line from the output to the input
  function pathTween (path: any) {
    const length = path.node().getTotalLength()
    const r = d3.interpolate(0, length)
    return function (t: number) {
      const position = r(t)
      const point = path.node().getPointAtLength(position)
      if (position < length - 1) {
        d3.select('#' + dataTransfertId).attr('cx', point.x)
          .attr('cy', point.y)
      } else {
        d3.select('#' + dataTransfertId).remove()
      }
    }
  }

  d3.select(theSvg).append('circle')
    .attr('id', dataTransfertId)
    .attr('transform', d3.select(theSvg).select('g').attr('transform'))
    .attr('cx', theOuputCircle.attr('cx'))
    .attr('cy', theOuputCircle.attr('cy'))
    .attr('r', TRANSFER_RADIUS)
    .attr('fill', TRANSFER_FILL_COLOR)
    .attr('stroke', TRANSFER_STROKE_COLOR)
    .transition()
    .duration(TRANSFER_DURATION)
    .tween('pathTween', function () { return pathTween(path) })
}

/**
 * Generates an animation for data transfer between two components.
 * The animation make a path on the existing link's path which start from the start (output) to the end (input) like a loading bar.
 * @param theOuputId
 * @param theInputId
 * @param tabId
 */
export function transfertDataWithPath (theOuputId: string, theInputId: string, tabId: string): void {
  const theOuputCircle = d3.select(theOuputId)
  const theInputCircle = d3.select(theInputId)

  const theSvg = '#conception-grid-svg' + (DATA_LOADING_TYPE === 'ALL_AT_ONCE' ? '' : '-' + tabId)

  // Gets the link path and initialize the circle which represent the data transfer
  const path = d3.select('#link-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id'))
  const dataTransfertId = 'data-trans-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id')
  const source: [number, number] = [Number.parseInt(theOuputCircle.attr('cx')), Number.parseInt(theOuputCircle.attr('cy'))]

  // Make the circle follow the path line from the output to the input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function pathTween (path: any) {
    const length = path.node().getTotalLength()
    const r = d3.interpolate(0, length)
    const xy: Array<[number, number]> = []
    return function (t: number) {
      const position = r(t)
      const point = path.node().getPointAtLength(position)
      xy.push([point.x, point.y])
      if (position < length - 1) {
        d3.select('#' + dataTransfertId).datum(xy)
          .attr('d', linkCalculators.lineFunction)
      } else {
        d3.select('#' + dataTransfertId).remove()
      }
    }
  }

  d3.select(theSvg).append('path')
    .attr('id', dataTransfertId)
    .attr('transform', d3.select(theSvg).select('g').attr('transform'))
    .datum([source, source])
    .attr('d', linkCalculators.lineFunction)
    .attr('stroke', TRANSFER_FILL_COLOR)
    .attr('stroke-width', '3px')
    .attr('fill', 'none')
    .transition()
    .duration(TRANSFER_DURATION)
    .tween('pathTween', function () { return pathTween(path) })
}

/**
 * Generates an animation for data transfer between two components.
 * @param theOuputId
 * @param theInputId
 * @param typeOfTransfer
 * @param tabId
 */
export function transfertData (theOuputId: string, theInputId: string, typeOfTransfer: string, tabId: string): void {
  switch (typeOfTransfer.toUpperCase()) {
    case 'CIRCLE':
      transfertDataWithCircle(theOuputId, theInputId, tabId)
      break
    case 'PATH':
      transfertDataWithPath(theOuputId, theInputId, tabId)
      break
    default:
      transfertDataWithPath(theOuputId, theInputId, tabId)
      break
  }
}
