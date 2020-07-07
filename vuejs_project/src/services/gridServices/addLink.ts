import * as d3 from 'd3'
import { transfertData } from '../gridServices/transfertData'
import { LINK_FILL_COLOR, ACTIVE_LINK_FILL_COLOR, TRANSFER_TYPE } from '../../config'

/**
 * Constructs a line with the 4 points : [ from, q1, q3, to]
 */
export const lineFunction = d3.line()
  .x(function (d) { return d[0] })
  .y(function (d) { return d[1] })
  .curve(d3.curveBasis)

/**
 * Used when two component are aligned in y plan and there are linked.
 * We want to avoid a cross line (if the output component is more on the right and the input component more on the left).
 * @param source
 * @param sourceRect
 * @param targetRect
 * @param target
 */
function isCrossLine (source: [number, number], target: [number, number], isSourceInput: boolean): boolean {
  return (isSourceInput && (source[0] < target[0])) || (!isSourceInput && (source[0] > target[0]))
}

/**
 * Return data for a curve line from to points in the svg (source and target)
 * @param source the start of the line
 * @param target the end of the line
 * @returns an array of 2DPoints for line draw
 */
export function getLineData (source: [number, number], target: [number, number], isSourceInput: boolean): Array<[number, number]> {
  const isACrossLine = isCrossLine(source, target, isSourceInput)
  let q1: [number, number]
  let q3: [number, number]
  if (isACrossLine) {
    q1 = [source[0] + ((source[0] - target[0]) / 4 * 1.5), source[1] - ((source[1] - target[1]) / 4 * 1.5)]
    q3 = [target[0] - ((source[0] - target[0]) / 4 * 1.5), target[1] + ((source[1] - target[1]) / 4 * 1.5)]
  } else {
    q1 = [source[0] + ((target[0] - source[0]) / 4), source[1]]
    q3 = [source[0] + (((target[0] - source[0]) * 3) / 4), target[1]]
  }
  return [source, q1, q3, target]
}

/**
 * Selects all connectors of '#conception-grid-svg' and sets drag&drop listeners for links creation.
 * @param registerLink function who register the link in component's links of ConceptionGrid's Vue and return his unique id
 */
export function addLinkBeetweenTwoComponentsIntoGrid (registerLink: Function): void{
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
        const path = d3.select('#conception-grid-svg').append('g')
          .attr('class', 'link ' + (isSourceInput ? 'input-' : 'output-') + theSourceCompId)
          .attr('transform', d3.select('#conception-grid-svg').select('g').attr('transform'))
          .append('path')
          .attr('id', 'link-' + theSourceCompId)
          .datum(getLineData(source, target, isSourceInput))
          .attr('d', lineFunction)
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

        // eslint-disable-next-line
                const svg: HTMLElement  = document.getElementById('conception-grid-svg')!
        for (let i = 0; i < svg.children.length; ++i) {
          const theClass: string | null = svg.children[i].getAttribute('class')
          if (theClass !== null && theClass.includes('link')) {
            svg.insertBefore(svg.children[i], svg.children[2]) // 2 because 0 is defs and 1 is svggridbg
          }
        }
      } else { // If a temp <g><path/></g> already exist we just edit the line positions.
        d3.select('#link-' + theSourceCompId)
          .datum(getLineData(source, target, isSourceInput))
          .attr('d', lineFunction)
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
      d3.select('#conception-grid-svg').selectAll('.connector')
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
              const newId = registerLink(outputInput.output.id, outputInput.input.id)
              isFounded = true
                // eslint-disable-next-line no-unused-expressions
                document.getElementById('link-' + theSourceCirleCode)?.parentElement?.setAttribute('class', '')
                // eslint-disable-next-line no-unused-expressions
                document.getElementById('link-' + theSourceCirleCode)?.parentElement?.setAttribute('id', 'link-' + newId)
                d3.select('#link-' + theSourceCirleCode).attr('id', 'link-' + outputInput.output.id + '-to-' + outputInput.input.id)
                  .attr('class', 'link-path link-' + outputInput.output.compId + ' link-' + outputInput.input.compId)
                  .datum(getLineData(outputInput.output.xy, outputInput.input.xy, false))
                  .attr('d', lineFunction)
                  .attr('data-input', outputInput.input.id)
                  .attr('data-output', outputInput.output.id)
                  .attr('data-input-index', (isSourceInput ? theSourceCirle.attr('data-index') : theTargetCirle.attr('data-index')))
                  .attr('data-output-index', (isSourceInput ? theTargetCirle.attr('data-index') : theSourceCirle.attr('data-index')))

                transfertData('#output-' + outputInput.output.id, '#input-' + outputInput.input.id, TRANSFER_TYPE)
            }
          }
        })
      if (!isFounded) {
            // eslint-disable-next-line no-unused-expressions
            document.getElementById('link-' + theSourceCirleCode)?.parentElement?.remove()
      }
    })

  dragLinkCompHandler(d3.select('#conception-grid-svg').selectAll('.connector'))
}
