import * as d3 from 'd3'
import { getComponentWidth } from './getComponentWidth'
import { updateComponentPosition } from './updateComponentPosition'

/**
 * Set the input/output debit of the selected component
 * @param theCompId the id of the component
 * @param input the debit of data in entry
 * @param output the debit of data in exit
 */
export function setComponentIO (theCompId: string, input: string, output: string): void {
  d3.select('#io-' + theCompId).text('IO: ' + input + 'B \uf061 ' + output + 'B')
  const name = d3.select('#name-text-' + theCompId).html()
  const title = d3.select('#title-text-' + theCompId).html()
  d3.select('#rect-' + theCompId).attr('width', getComponentWidth(name, title, theCompId))
  updateComponentPosition(theCompId)
}
