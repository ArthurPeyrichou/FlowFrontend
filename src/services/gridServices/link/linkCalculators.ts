import * as d3 from 'd3'

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
export function isCrossLine (source: [number, number], target: [number, number], isSourceInput: boolean): boolean {
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
