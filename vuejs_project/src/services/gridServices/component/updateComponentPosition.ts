import * as d3 from 'd3'
import * as linkCalculators from '../link/linkCalculators'
import * as positionCal from './componentPositionCalculators'
import { DATA_LOADING_TYPE } from '../../../config'

/**
 * Change the position of the component
 * Is also used when we change the component's name for recalculing some elements positions (give null x and null y)
 * @param theCompId
 * @param x position of the component
 * @param y position of the component
 */
export function updateComponentPosition (theCompId: string, x: null | number = null, y: null | number = null): void {
  const rect = d3.select('#rect-' + theCompId)
  const theCompWidth = Number.parseInt(rect.attr('width'))
  const theCompHeight = Number.parseInt(rect.attr('height'))
  const theCompInputCount = Number.parseInt(rect.attr('data-input'))
  const theCompOutputCount = Number.parseInt(rect.attr('data-output'))
  if (x === null) {
    x = Number.parseInt(rect.attr('x')) + (theCompWidth / 2)
  }
  if (y === null) {
    y = Number.parseInt(rect.attr('y')) + (theCompHeight / 2)
  }

  const svg: HTMLElement | null = document.getElementById('conception-grid-svg' + ((DATA_LOADING_TYPE === 'ALL_AT_ONCE' ? '' : '-' + rect.attr('data-tab-id'))))
  if (svg?.lastElementChild?.getAttribute('id') !== 'comp-' + theCompId) {
    d3.select('#comp-' + theCompId).raise()
  }

  rect.attr('x', positionCal.rectPlaceX(x, theCompWidth))
    .attr('y', positionCal.rectPlaceY(y, theCompHeight))

  d3.select('#name-text-' + theCompId)
    .attr('x', positionCal.namePlaceX(x, theCompWidth))
    .attr('y', positionCal.namePlaceY(y, theCompHeight))

  d3.select('#title-text-' + theCompId)
    .attr('x', positionCal.titlePlaceX(x, theCompWidth))
    .attr('y', positionCal.titlePlaceY(y, theCompHeight))

  d3.select('#icon-' + theCompId)
    .attr('x', positionCal.iconPlaceX(x, theCompWidth))
    .attr('y', positionCal.iconPlaceY(y, theCompHeight))
    .style('transform-origin', (positionCal.iconPlaceX(x, theCompWidth) + 12) + 'px ' + (positionCal.iconPlaceY(y, theCompHeight) - 9) + 'px')

  d3.select('#io-' + theCompId)
    .attr('x', positionCal.ioPlaceX(x, theCompWidth))
    .attr('y', positionCal.ioPlaceY(y, theCompHeight))

  d3.select('#trigger-' + theCompId)
    .attr('points', positionCal.getTriggerTrianglePoints(x, theCompWidth, y, theCompHeight))

  for (let i = 0; i < theCompInputCount; ++i) {
    d3.select('#input-' + i + '-' + theCompId)
      .attr('cx', positionCal.inputCirclePlaceX(x, theCompWidth))
      .attr('cy', positionCal.inputCirclePlaceY(y, theCompHeight, i, theCompInputCount))
  }

  for (let i = 0; i < theCompOutputCount; ++i) {
    d3.select('#output-' + i + '-' + theCompId)
      .attr('cx', positionCal.outputCirclePlaceX(x, theCompWidth))
      .attr('cy', positionCal.outputCirclePlaceY(y, theCompHeight, i, theCompOutputCount))
  }

  d3.selectAll('.link-' + theCompId).each(function () {
    const input = d3.select('#input-' + d3.select(this).attr('data-input'))
    const output = d3.select('#output-' + d3.select(this).attr('data-output'))
    const source: [number, number] =
                  [Number.parseInt(output.attr('cx')),
                    Number.parseInt(output.attr('cy'))]
    const target: [number, number] =
                  [Number.parseInt(input.attr('cx')),
                    Number.parseInt(input.attr('cy'))]

    d3.select(this)
      .datum(linkCalculators.getLineData(source, target, false))
      .attr('d', linkCalculators.lineFunction)
  })
}
