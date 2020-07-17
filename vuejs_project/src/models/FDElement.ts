import { FDComponent } from './FDComponent'
import { SVG_GRID_SIZE } from '../config'

/**
 * A Component
 */
export class FDElement {
    private id: string;
    private hisFDComponent: FDComponent;
    private tabId: string;
    private name: string;
    private color: string;
    private x: number;
    private y: number;
    private notes: string;
    private state: {};
    private options: {};
    private links: Map<number, Array<{index: number; id: string}>>;

    /**
     * @param id Can be a positive or null integer (True = 1 and False = 0). Negative value = 0.
     * @param aFDComponent Can be a positive or null integer (True = 1 and False = 0). Negative value = 0.
     * @param tabId Can be activated by click
     * @param color color visible in ui
     * @param x nummber shoulb be beetween 0 and SVG_GRID_SIZE.
     * @param y nummber shoulb be beetween 0 and SVG_GRID_SIZE.
     * @param notes JSON Object or string parsable into JSON Object.
     * @param state JSON Object or string parsable into JSON Object.
     * @param links JSON Object or string parsable into JSON Object.
     */
    constructor (id: string, aFDComponent: FDComponent, tabId: string, name: string, color: string, x: number | string, y: number | string, notes: string, state: any, options: any, links: Map<number, Array<{index: number; id: string}>>) {
      this.id = id
      this.hisFDComponent = aFDComponent
      this.tabId = tabId
      this.name = name
      this.color = color
      this.x = (typeof x === 'string') ? Number.parseInt(x) : x
      if (this.x < 0 || this.x > SVG_GRID_SIZE) {
        throw new Error("x attribut of Component '" + id + "' should be an integer in interval [0;" + SVG_GRID_SIZE + "]. Got '" + x + "'.")
      }
      this.y = (typeof y === 'string') ? Number.parseInt(y) : y
      if (this.y < 0 || this.y > SVG_GRID_SIZE) {
        throw new Error("y attribut of Component '" + id + "' should be an integer in interval [0;" + SVG_GRID_SIZE + "]. Got '" + y + "'.")
      }
      this.notes = notes
      this.state = state
      this.options = options
      this.links = links
    }

    getId (): string {
      return this.id
    }

    getFDComponent (): FDComponent {
      return this.hisFDComponent
    }

    getTabId (): string {
      return this.tabId
    }

    getName (): string {
      return this.name === '' ? this.hisFDComponent.getTitle() : this.name
    }

    getColor (): string {
      return this.color === '' ? this.hisFDComponent.getColor() : this.color
    }

    getX (): number {
      return this.x
    }

    getY (): number {
      return this.y
    }

    getNotes (): string {
      return this.notes
    }

    getOptions (): any {
      return this.options
    }

    getState (): any {
      return this.state
    }

    getLinks (): Map<number, Array<{index: number; id: string}>> {
      return this.links
    }

    setColor (color: string): void {
      this.color = color
    }

    setName (name: string): void {
      this.name = name
    }

    setX (x: number | string): void {
      this.x = (typeof x === 'string') ? Number.parseInt(x) : x
      if (this.x < 0 || this.x > SVG_GRID_SIZE) {
        throw new Error("Can't set x. x attribut of Component '" + this.id + "' should be an integer in interval [0;" + SVG_GRID_SIZE + "]. Got '" + x + "'.")
      }
    }

    setY (y: number | string): void {
      this.y = (typeof y === 'string') ? Number.parseInt(y) : y
      if (this.y < 0 || this.y > SVG_GRID_SIZE) {
        throw new Error("Can't set y. y attribut of Component '" + this.id + "' should be an integer in interval [0;" + SVG_GRID_SIZE + "]. Got '" + y + "'.")
      }
    }

    setPostion (x: number | string, y: number | string): void {
      this.setX(x)
      this.setY(y)
    }

    setLinks (links: Map<number, Array<{index: number; id: string}>>): void {
      this.links = links
    }

    addLink (index: number, link: {index: number; id: string}): void {
      let alreadyExist = false
      if (this.links.has(index)) {
            // eslint-disable-next-line
            this.links.get(index)?.forEach(el => alreadyExist = alreadyExist || (el.id === link.id && el.index === el.index))
            if (!alreadyExist) {
                // eslint-disable-next-line
                this.links.get(index)?.push(link)
            }
      } else {
        this.links.set(index, [link])
      }
    }

    removeLink (index: number, link: {index: number; id: string}): void {
      if (this.links.has(index)) {
        // eslint-disable-next-line
        const list: Array<{index: number; id: string}> | undefined = this.links.get(index)?.filter(el => !(el.id === link.id && el.index === el.index))
        this.links.set(index, (list === undefined ? [] : list))
      }
    }
}
