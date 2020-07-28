import * as d3 from 'd3'
import { getComponentWidth } from './getComponentWidth'
import { updateComponentPosition } from './updateComponentPosition'
import * as positionCal from './componentPositionCalculators'
import { FDElement } from '@/models/FDElement'
import { DATA_LOADING_TYPE, TRANSFER_SHOW_IO } from '../../../config'

/**
 * Adds a new component into '#conception-grid-svg' and set his listeners.
 * @param mouse position of the cursor in the plan
 * @param fdElementToDrop the FDComponent to drop
 * @param registerComponent function who register the component in componentList of ConceptionGrid's Vue and return his unique id
 * @param openModal function call by clicking on the component
 * @param onComponentClick will apply change to the backend, then activate the component
 * @param onComponentMoove will notice changes to the BackendRequestFactory
 */
export function addComponentIntoGrid (mouse: [number, number], fdElementToDrop: FDElement, openModal: Function, onComponentClick: Function, onComponentMoove: Function): void {
  const x = mouse[0]
  const y = mouse[1]
  const inputCount = fdElementToDrop.getFDComponent().getInput()
  const outputCount = fdElementToDrop.getFDComponent().getOutput()
  const compHeight = Math.max(50 + (Math.max(inputCount, outputCount) - 1) * 15, TRANSFER_SHOW_IO ? 65 : 45)
  const compWidth = getComponentWidth(fdElementToDrop.getName(), '', undefined)
  const theSvg = '#conception-grid-svg' + (DATA_LOADING_TYPE === 'ALL_AT_ONCE' ? '' : '-' + fdElementToDrop.getTabId())
  const g = d3.select(theSvg)
    .append('g')
    .attr('class', 'component')
    .attr('id', 'comp-' + fdElementToDrop.getId())
    .attr('stroke-width', 1.5)
    .attr('style', 'cursor:pointer;')
    .attr('transform', d3.select('.svg-grid').attr('transform'))

  g.append('rect')
    .attr('id', 'rect-' + fdElementToDrop.getId())
    .attr('class', 'fdcomp draggable')
    .attr('data-id', fdElementToDrop.getId())
    .attr('data-tab-id', fdElementToDrop.getTabId())
    .attr('stroke', 'black')
    .attr('fill', fdElementToDrop.getColor())
    .attr('height', compHeight)
    .attr('width', compWidth)
    .attr('data-input', inputCount)
    .attr('data-output', outputCount)
    .attr('rx', 5)
    .attr('x', positionCal.rectPlaceX(x, compWidth))
    .attr('y', positionCal.rectPlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdElementToDrop)
    })

  g.append('text')
    .attr('id', 'name-text-' + fdElementToDrop.getId())
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', fdElementToDrop.getId())
    .attr('fill', 'black')
    .style('font-size', '14px')
    .html(fdElementToDrop.getName())
    .attr('x', positionCal.namePlaceX(x, compWidth))
    .attr('y', positionCal.namePlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdElementToDrop)
    })

  g.append('text')
    .attr('id', 'title-text-' + fdElementToDrop.getId())
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', fdElementToDrop.getId())
    .attr('fill', 'black')
    .style('font-size', '12px')
    .html(fdElementToDrop.getFDComponent().getTitle())
    .attr('x', positionCal.titlePlaceX(x, compWidth))
    .attr('y', positionCal.titlePlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdElementToDrop)
    })

  g.append('svg:foreignObject')
    .attr('id', 'icon-' + fdElementToDrop.getId())
    .attr('class', 'draggable unselectable-text icon')
    .attr('data-id', fdElementToDrop.getId())
    .attr('data-icon', fdElementToDrop.getFDComponent().getIcon())
    .attr('x', positionCal.iconPlaceX(x, compWidth))
    .attr('y', positionCal.iconPlaceY(y, compHeight))
    .attr('width', 24)
    .attr('height', 24)
    .on('click', function () {
      openModal(fdElementToDrop)
    })
    .append('xhtml:body')
    .style('background-color', 'transparent')
    .html('<i class="icon-fixed-width fa fa-' + fdElementToDrop.getFDComponent().getIcon() + '" style="font:900 normal normal 24px \'Font Awesome 5 Free\'"></i>')

  if (TRANSFER_SHOW_IO) {
    g.append('text')
      .attr('id', 'io-' + fdElementToDrop.getId())
      .attr('class', 'draggable unselectable-text')
      .attr('data-id', fdElementToDrop.getId())
      .attr('fill', 'black')
      .style('font', '900 normal normal 12px \'Font Awesome 5 Free\'')
      .text('IO: 0B \uf061 0B')
      .attr('x', positionCal.ioPlaceX(x, compWidth))
      .attr('y', positionCal.ioPlaceY(y, compHeight))
      .on('click', () => {
        openModal(fdElementToDrop)
      })
  }

  if (fdElementToDrop.getFDComponent().isClickable()) {
    g.append('polygon')
      .attr('id', 'trigger-' + fdElementToDrop.getId())
      .attr('points', positionCal.getTriggerTrianglePoints(x, compWidth, y, compHeight))
      .attr('data-id', fdElementToDrop.getId())
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .on('click', () => {
        onComponentClick(fdElementToDrop.getId())
      })
  }

  for (let i = 0; i < inputCount; ++i) {
    g.append('circle')
      .attr('id', 'input-' + i + '-' + fdElementToDrop.getId())
      .attr('class', 'input connector input-' + fdElementToDrop.getId())
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', fdElementToDrop.getId())
      .attr('cx', positionCal.inputCirclePlaceX(x, compWidth))
      .attr('cy', positionCal.inputCirclePlaceY(y, compHeight, i, inputCount))
  }
  for (let i = 0; i < outputCount; ++i) {
    g.append('circle')
      .attr('id', 'output-' + i + '-' + fdElementToDrop.getId())
      .attr('class', 'output connector output-' + fdElementToDrop.getId())
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', fdElementToDrop.getId())
      .attr('cx', positionCal.outputCirclePlaceX(x, compWidth))
      .attr('cy', positionCal.outputCirclePlaceY(y, compHeight, i, outputCount))
  }

  const dragCompHandler = d3.drag()
    .on('drag', function () {
      d3.select('#rect-' + d3.select(this).attr('data-id')).style('opacity', 0.5)
      updateComponentPosition(d3.select(this).attr('data-id'), Number.parseInt(d3.event.x), Number.parseInt(d3.event.y))
    })
    .on('end', function () {
      d3.selectAll('rect').style('opacity', 1)
      onComponentMoove(d3.select(this).attr('data-id'), Number.parseInt(d3.event.x), Number.parseInt(d3.event.y))
    })

  dragCompHandler(d3.select(theSvg).selectAll('.draggable'))
}
