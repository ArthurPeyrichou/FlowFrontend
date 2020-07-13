import * as d3 from 'd3'
import { lineFunction } from '../gridServices/addLink'
import { TRANSFER_DURATION, TRANSFER_RADIUS, TRANSFER_FILL_COLOR, TRANSFER_STROKE_COLOR } from '../../config'

/**
 * Generates an animation for data transfer between two components.
 * The animation make a circle on the existing link's path which start from the start (output) to the end (input) like a pearl on a string.
 * @param theOuputId
 * @param theInputId
 */
export function transfertDataWithCircle (theOuputId: string, theInputId: string): void {
  const theOuputCircle = d3.select(theOuputId)
  const theInputCircle = d3.select(theInputId)

  // Gets the link path and initialize the circle which represent the data transfer
  const path = d3.select('#link-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id'))
  const dataTransfertId = 'data-trans-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id')

  // Make the circle follow the path line from the output to the input
  // eslint-disable-next-line
    function pathTween(path: any) {
    const length = path.node().getTotalLength()
    const r = d3.interpolate(0, length)
    return function (t: number) {
      const position = r(t)
      const point = path.node().getPointAtLength(position)
      if (position < length - 1) {
        d3.select('#' + dataTransfertId).attr('cx', point.x)
          .attr('cy', point.y)
      } else {
                // eslint-disable-next-line no-unused-expressions
                document.getElementById(dataTransfertId)?.remove()
      }
    }
  }

  d3.select('#conception-grid-svg').append('circle')
    .attr('id', dataTransfertId)
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
 */
export function transfertDataWithPath (theOuputId: string, theInputId: string): void {
  const theOuputCircle = d3.select(theOuputId)
  const theInputCircle = d3.select(theInputId)

  // Gets the link path and initialize the circle which represent the data transfer
  const path = d3.select('#link-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id'))
  const dataTransfertId = 'data-trans-' + theOuputCircle.attr('data-index') + '-' + theOuputCircle.attr('data-id') + '-to-' + theInputCircle.attr('data-index') + '-' + theInputCircle.attr('data-id')
  const source: [number, number] = [Number.parseInt(theOuputCircle.attr('cx')), Number.parseInt(theOuputCircle.attr('cy'))]

  // Make the circle follow the path line from the output to the input
  // eslint-disable-next-line
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
          .attr('d', lineFunction)
      } else {
                // eslint-disable-next-line no-unused-expressions
                document.getElementById(dataTransfertId)?.remove()
      }
    }
  }

  d3.select('#conception-grid-svg').append('path')
    .attr('id', dataTransfertId)
    .datum([source, source])
    .attr('d', lineFunction)
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
 */
export function transfertData (theOuputId: string, theInputId: string, typeOfTransfer: string): void {
  switch (typeOfTransfer.toUpperCase()) {
    case 'CIRCLE':
      transfertDataWithCircle(theOuputId, theInputId)
      break
    case 'PATH':
      transfertDataWithPath(theOuputId, theInputId)
      break
    default:
      transfertDataWithPath(theOuputId, theInputId)
      break
  }
}
