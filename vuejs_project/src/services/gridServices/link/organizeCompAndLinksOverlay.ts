/**
 * Moove links to the top and components to the bottom of the svg childrens list
 * Make link under component in UI
 */
export function organizeCompAndLinksOverlay (): void {
  const svg: HTMLCollectionOf<Element> = document.getElementsByClassName('conception-grid-svg')
  for (let j = 0; j < svg.length; ++j) {
    if (svg[j]) {
      for (let i = 0; i < svg[j].children.length; ++i) {
        const theClass: string | null = svg[j].children[i].getAttribute('class')
        if (theClass !== null && theClass.includes('link')) {
          svg[j].insertBefore(svg[j].children[i], svg[j].children[2]) // 2 because 0 is defs and 1 is svggridbg
        }
      }
    }
  }
}
