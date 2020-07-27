import * as d3 from 'd3'

/**
 * Toggles the component's icon on a cog that turns or go back to the component's icon
 * @param id is the FDElement's name
 * @param isLoading if true replace the component's icon by a cog that turns. Otherwise return to the component's icon
 */
export function setComponentBeingProcessed (id: string, isLoading: boolean): void {
  const icon = d3.select('#icon-' + id)

  icon.attr('class', isLoading ? icon.attr('class') + ' loading' : icon.attr('class').replace(' loading', ''))
    .html('')

  icon.append('xhtml:body')
    .style('background-color', 'transparent')
    .html('<i class="fa fa-' + (isLoading ? 'spin fa-cog' : icon.attr('data-icon')) + '" style="font:900 normal normal 24px \'Font Awesome 5 Free\'"></i>')
}
