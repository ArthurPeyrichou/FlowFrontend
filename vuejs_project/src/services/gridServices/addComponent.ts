import * as d3 from 'd3'
import { lineFunction, getLineData } from '../gridServices/addLink'
import { FDComponent } from '../../models/FDComponent'
import { transfertData } from './transfertData'
import { SVG_GRID_SIZE, SVG_GRID_BORDER_WIDTH, TRANSFER_TYPE } from '../../config'
import { FDElement } from '@/models/FDElement'

/**
 * Create an animation for data transfer for each outputs of a component to his childrens.
 * @param id the component's id
 */
export function makeComponentTransferData (id: string): void {
  const links = document.getElementsByClassName('link-' + id)
  for (let i = 0; i < links.length; ++i) {
    const output = '#output-' + links[i].getAttribute('data-output')
    const intput = '#input-' + links[i].getAttribute('data-input')
    if (output.includes(id)) {
      transfertData(output, intput, TRANSFER_TYPE)
    }
  }
}

export function toggleComponentLoading (id: string): void {
  const icon = d3.select('#icon-' + id)
  const isLoading = icon.attr('class').includes('loading')

  icon.attr('class', isLoading ? icon.attr('class').replace(' loading', '') : icon.attr('class') + ' loading')
    .html('')

  icon.append('xhtml:body')
    .style('background-color', 'transparent')
    .html('<i class="fa fa-' + (isLoading ? icon.attr('data-icon') : 'spin fa-cog') + '" style="font:900 normal normal 24px \'Font Awesome 5 Free\'"></i>')
}

function getCompWidth (name: string, title: string): number {
  return 75 + Math.max(name.length, title.length, 10) * 8
}

const rectPlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return 10
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2)
}
const rectPlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompHeight
  }
  return y - (theCompHeight / 2)
}
const titlePlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}
const titlePlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - 8 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - 8 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y - 8
}
const typePlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}
const typePlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + 7 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE + 7 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y + 7
}
// io for input/output
const ioPlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 65
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 65 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 65
}
const ioPlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + 25 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE + 25 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y + 25
}
const iconPlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + 20
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE + 20 - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2) + 20
}
const iconPlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - 10 + (theCompHeight / 2)
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - 10 - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2)
  }
  return y - 10
}
const triggerPlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return 10 + (theCompWidth / 2)
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2)
  }
  return x
}
const triggerPlaceY = (y: number, theCompHeight: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH - 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - 10 - SVG_GRID_BORDER_WIDTH - theCompHeight
  }
  return y - 10 - (theCompHeight / 2)
}

const getTriggerTrianglePoints = (x: number, theCompWidth: number, y: number, theCompHeight: number) => {
  const xPos = triggerPlaceX(x, theCompWidth)
  const yPos = triggerPlaceY(y, theCompHeight)
  return (xPos - 10) + ',' + yPos + ' ' + (xPos + 10) + ',' + yPos + ' ' + xPos + ',' + (yPos + 20)
}
const inputCirclePlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - theCompWidth
  }
  return x - (theCompWidth / 2)
}
const inputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}
const outputCirclePlaceX = (x: number, theCompWidth: number) => {
  if (x < (SVG_GRID_BORDER_WIDTH + (theCompWidth / 2))) {
    return SVG_GRID_BORDER_WIDTH + theCompWidth
  } else if (x > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompWidth / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH
  }
  return x + (theCompWidth / 2)
}
const outputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => {
  if (y < (SVG_GRID_BORDER_WIDTH + (theCompHeight / 2))) {
    return SVG_GRID_BORDER_WIDTH + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  } else if (y > (SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2))) {
    return SVG_GRID_SIZE - SVG_GRID_BORDER_WIDTH - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
  }
  return y + (index * 20) - (count - 1) * 10
}

function updateComponentPosition (theCompId: string, x: null | number = null, y: null | number = null): void {
  const theCompWidth = Number.parseInt(d3.select('#rect-' + theCompId).attr('width'))
  const theCompHeight = Number.parseInt(d3.select('#rect-' + theCompId).attr('height'))
  const theCompInputCount = Number.parseInt(d3.select('#rect-' + theCompId).attr('data-input'))
  const theCompOutputCount = Number.parseInt(d3.select('#rect-' + theCompId).attr('data-output'))
  if (x === null) {
    x = Number.parseInt(d3.select('#rect-' + theCompId).attr('x')) + (theCompWidth / 2)
  }
  if (y === null) {
    y = Number.parseInt(d3.select('#rect-' + theCompId).attr('y')) + (theCompHeight / 2)
  }

  const svg: HTMLElement | null = document.getElementById('conception-grid-svg')
  if (svg?.lastElementChild?.getAttribute('id') !== 'comp-' + theCompId) {
    d3.select('#comp-' + theCompId).raise()
  }

  d3.select('#rect-' + theCompId)
    .attr('x', rectPlaceX(x, theCompWidth))
    .attr('y', rectPlaceY(y, theCompHeight))

  d3.select('#title-text-' + theCompId)
    .attr('x', titlePlaceX(x, theCompWidth))
    .attr('y', titlePlaceY(y, theCompHeight))

  d3.select('#type-text-' + theCompId)
    .attr('x', typePlaceX(x, theCompWidth))
    .attr('y', typePlaceY(y, theCompHeight))

  d3.select('#icon-' + theCompId)
    .attr('x', iconPlaceX(x, theCompWidth))
    .attr('y', iconPlaceY(y, theCompHeight))
    .style('transform-origin', (iconPlaceX(x, theCompWidth) + 12) + 'px ' + (iconPlaceY(y, theCompHeight) - 9) + 'px')

  d3.select('#io-' + theCompId)
    .attr('x', ioPlaceX(x, theCompWidth))
    .attr('y', ioPlaceY(y, theCompHeight))

  d3.select('#trigger-' + theCompId)
    .attr('points', getTriggerTrianglePoints(x, theCompWidth, y, theCompHeight))

  for (let i = 0; i < theCompInputCount; ++i) {
    d3.select('#input-' + i + '-' + theCompId)
      .attr('cx', inputCirclePlaceX(x, theCompWidth))
      .attr('cy', inputCirclePlaceY(y, theCompHeight, i, theCompInputCount))
  }

  for (let i = 0; i < theCompOutputCount; ++i) {
    d3.select('#output-' + i + '-' + theCompId)
      .attr('cx', outputCirclePlaceX(x, theCompWidth))
      .attr('cy', outputCirclePlaceY(y, theCompHeight, i, theCompOutputCount))
  }

  d3.selectAll('.link-' + theCompId).each(function () {
    const input = d3.select(this).attr('data-input')
    const output = d3.select(this).attr('data-output')
    const source: [number, number] =
                [Number.parseInt(d3.select('#output-' + output).attr('cx')),
                  Number.parseInt(d3.select('#output-' + output).attr('cy'))]
    const target: [number, number] =
                [Number.parseInt(d3.select('#input-' + input).attr('cx')),
                  Number.parseInt(d3.select('#input-' + input).attr('cy'))]

    d3.select(this)
      .datum(getLineData(source, target, false))
      .attr('d', lineFunction)
  })
}

export function setComponentName (theCompId: string, name: string, title: string): void {
  d3.select('#rect-' + theCompId).attr('width', getCompWidth(name, title))
  d3.select('#title-text-' + theCompId).text(name)
  updateComponentPosition(theCompId)
}

/**
 * Adds a new component into '#conception-grid-svg' and set his listeners.
 * @param mouse position of the cursor in the plan
 * @param fdCompToDrop the FDComponent to drop
 * @param registerComponent function who register the component in componentList of ConceptionGrid's Vue and return his unique id
 * @param openModal function call by clicking on the component
 */
export function addComponentIntoGrid (mouse: [number, number], fdCompToDrop: FDElement, openModal: Function): void {
  const x = mouse[0]
  const y = mouse[1]
  const inputCount = fdCompToDrop.getFDComponent().getInput()
  const outputCount = fdCompToDrop.getFDComponent().getOutput()
  const compHeight = Math.max(50 + (Math.max(inputCount, outputCount) - 1) * 15, 65)
  const compWidth = getCompWidth(fdCompToDrop.getName(), '')
  const g = d3.select('#conception-grid-svg')
    .append('g')
    .attr('class', 'component')
    .attr('id', 'comp-' + fdCompToDrop.getId())
    .attr('stroke-width', 1.5)
    .attr('style', 'cursor:pointer;')
    .attr('transform', d3.select('#conception-grid-svg').select('g').attr('transform'))

  g.append('rect')
    .attr('id', 'rect-' + fdCompToDrop.getId())
    .attr('class', 'fdcomp draggable')
    .attr('data-id', fdCompToDrop.getId())
    .attr('stroke', 'black')
    .attr('fill', fdCompToDrop.getColor())
    .attr('height', compHeight)
    .attr('width', compWidth)
    .attr('data-input', inputCount)
    .attr('data-output', outputCount)
    .attr('rx', 5)
    .attr('x', rectPlaceX(x, compWidth))
    .attr('y', rectPlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdCompToDrop)
    })

  g.append('text')
    .attr('id', 'title-text-' + fdCompToDrop.getId())
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', fdCompToDrop.getId())
    .attr('fill', 'black')
    .style('font-size', '14px')
    .html(fdCompToDrop.getName())
    .attr('x', titlePlaceX(x, compWidth))
    .attr('y', titlePlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdCompToDrop)
    })

  g.append('text')
    .attr('id', 'type-text-' + fdCompToDrop.getId())
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', fdCompToDrop.getId())
    .attr('fill', 'black')
    .style('font-size', '12px')
    .html(fdCompToDrop.getFDComponent().getTitle())
    .attr('x', typePlaceX(x, compWidth))
    .attr('y', typePlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdCompToDrop)
    })

  g.append('svg:foreignObject')
    .attr('id', 'icon-' + fdCompToDrop.getId())
    .attr('class', 'draggable unselectable-text icon')
    .attr('data-id', fdCompToDrop.getId())
    .attr('data-icon', fdCompToDrop.getFDComponent().getIcon())
    .attr('x', iconPlaceX(x, compWidth))
    .attr('y', iconPlaceY(y, compHeight))
    .attr('width', 24)
    .attr('height', 24)
    .on('click', function () {
      openModal(fdCompToDrop)
    })
    .append('xhtml:body')
    .style('background-color', 'transparent')
    .html('<i class="icon-fixed-width fa fa-' + fdCompToDrop.getFDComponent().getIcon() + '" style="font:900 normal normal 24px \'Font Awesome 5 Free\'"></i>')

  g.append('text')
    .attr('id', 'io-' + fdCompToDrop.getId())
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', fdCompToDrop.getId())
    .attr('fill', 'black')
    .style('font', '900 normal normal 12px \'Font Awesome 5 Free\'')
    .text('IO: 0B \uf061 0B')
    .attr('x', ioPlaceX(x, compWidth))
    .attr('y', ioPlaceY(y, compHeight))
    .on('click', () => {
      openModal(fdCompToDrop)
    })

  if (fdCompToDrop.getFDComponent().isClickable()) {
    g.append('polygon')
      .attr('id', 'trigger-' + fdCompToDrop.getId())
      .attr('class', 'draggable')
      .attr('points', getTriggerTrianglePoints(x, compWidth, y, compHeight))
      .attr('data-id', fdCompToDrop.getId())
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .on('click', () => {
        console.log('Component activated!')
        makeComponentTransferData(fdCompToDrop.getId())
      })
  }

  for (let i = 0; i < inputCount; ++i) {
    g.append('circle')
      .attr('id', 'input-' + i + '-' + fdCompToDrop.getId())
      .attr('class', 'input connector input-' + fdCompToDrop.getId())
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', fdCompToDrop.getId())
      .attr('cx', inputCirclePlaceX(x, compWidth))
      .attr('cy', inputCirclePlaceY(y, compHeight, i, inputCount))
  }
  for (let i = 0; i < outputCount; ++i) {
    g.append('circle')
      .attr('id', 'output-' + i + '-' + fdCompToDrop.getId())
      .attr('class', 'output connector output-' + fdCompToDrop.getId())
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', fdCompToDrop.getId())
      .attr('cx', outputCirclePlaceX(x, compWidth))
      .attr('cy', outputCirclePlaceY(y, compHeight, i, outputCount))
  }

  const dragCompHandler = d3.drag()
    .on('drag', function () {
      d3.select('#rect-' + d3.select(this).attr('data-id')).style('opacity', 0.5)
      updateComponentPosition(d3.select(this).attr('data-id'), Number.parseInt(d3.event.x), Number.parseInt(d3.event.y))
    })
    .on('end', function () {
      d3.selectAll('rect').style('opacity', 1)
    })

  dragCompHandler(d3.select('#conception-grid-svg').selectAll('.draggable'))
}
