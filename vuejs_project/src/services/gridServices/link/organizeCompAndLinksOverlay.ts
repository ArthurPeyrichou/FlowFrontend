/**
 * Moove links to the top and components to the bottom of the svg childrens list
 * Make link under component in UI
 */
export function organizeCompAndLinksOverlay (): void {
  const svg: HTMLElement | null = document.getElementById('conception-grid-svg')
  if (svg) {
    for (let i = 0; i < svg.children.length; ++i) {
      const theClass: string | null = svg.children[i].getAttribute('class')
      if (theClass !== null && theClass.includes('link')) {
        svg.insertBefore(svg.children[i], svg.children[2]) // 2 because 0 is defs and 1 is svggridbg
      }
    }
  }
}
