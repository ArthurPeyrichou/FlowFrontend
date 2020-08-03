import * as d3 from 'd3'
import { TRANSFER_SHOW_IO } from '@/config'

/**
 * Calculates the width of the component by his name, title and input/output length
 * @param name is the FDElement's name
 * @param title is the FDComponent title
 * @return the whidth of the component
 */
export function getComponentWidth (name: string, title: string, compId: undefined | string): number {
  let ioLength = 0
  if (compId !== undefined && TRANSFER_SHOW_IO) {
    ioLength = d3.select('#io-' + compId).text().length
  }
  return 75 + Math.max(name.length, title.length, (ioLength - 3), 10) * 8
}
