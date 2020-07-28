import * as d3 from 'd3'
import { getComponentWidth } from './getComponentWidth'
import { updateComponentPosition } from './updateComponentPosition'
import { TRANSFER_BYTES_PRECISION } from '../../../config'

/**
 * Set the input/output debit of the selected component
 * @param theCompId the id of the component
 * @param input the debit of data in entry
 * @param output the debit of data in exit
 */
export function setComponentIO (theCompId: string, input: string, output: string): void {
  d3.select('#io-' + theCompId).text('IO: ' + byteRefactoring(input) + ' \uf061 ' + byteRefactoring(output))
  const name = d3.select('#name-text-' + theCompId).html()
  const title = d3.select('#title-text-' + theCompId).html()
  d3.select('#rect-' + theCompId).attr('width', getComponentWidth(name, title, theCompId))
  updateComponentPosition(theCompId)
}

/**
 * Give the size of bytes
 * @param bytes 
 */
function byteRefactoring (bytes: string): string {
  const num = Number.parseInt(bytes)
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (num === 0) return '0B'
  const i = Number.parseInt(Math.floor(Math.log(num) / Math.log(2048)).toString())
  return (num / Math.pow(1024, i)).toFixed(TRANSFER_BYTES_PRECISION) + sizes[i]
}