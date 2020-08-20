import { FDComponent } from '../models/FDComponent'
import { FDElement } from '../models/FDElement'

/**
 * A body Object for backend update requests
 */
export class BackendRequestFactory {
    private removeElements: Array<{ type: 'rem'; id: string }> = []
    private addElements: Array<{ type: 'add'; com: { component: string; state: { text: ''; color: '' }; x: number; y: number; tab: string; connections: any; id: string; disabledio: { input: []; output: [] } } }> = []
    private updateElements: Array<{ target: string; type: 'options'; body: {comname: string; comcolor: string; comnotes: string} }> = []
    private mooveElements: Array<{ type: 'mov'; com: { id: string; x: number; y: number } }> = []

    private links: Array<{ type: 'conn'; id: string; conn: any}> = []

    private tabs: {type: 'tabs'; tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}>} = { type: 'tabs', tabs: [] }

    apply (): Array<string> {
      const msg = { type: 'apply', body: new Array<any>() }
      this.addElements.forEach(el => msg.body.push(el))
      this.mooveElements.forEach(el => msg.body.push(el))
      this.removeElements.forEach(el => msg.body.push(el))
      this.links.forEach(el => msg.body.push(el))
      msg.body.push(this.tabs)

      const requests: Array<string> = [JSON.stringify(msg)]
      this.updateElements.forEach(el => requests.push(JSON.stringify(el)))
      if (this.updateElements.length > 0) {
        requests.push(JSON.stringify({ type: 'apply', body: [] }))
      }
      this.reset()
      return requests
    }

    reset (): void {
      this.addElements = []
      this.updateElements = []
      this.mooveElements = []
      this.removeElements = []
      this.links = []
    }

    /**
     *
     * @param elementId
     */
    removeElementFromGrid (elementId: string): void {
      if (this.addElements.filter(el => el.com.id === elementId).length === 1) {
        this.addElements = this.addElements.filter(el => el.com.id !== elementId)
      } else {
        this.removeElements.push({ type: 'rem', id: elementId })
      }

      this.updateElements = this.updateElements.filter(el => el.target !== elementId)
      this.mooveElements = this.mooveElements.filter(el => el.com.id !== elementId)

      this.links = this.links.filter(el => {
        if (el.id === elementId) {
          return false
        }
        // el.conn.forEach((links, index) => el.conn.set(index, links.filter(link => link.id !== elementId)))
        for (const [key, value] of Object.entries(el.conn)) {
          el.conn[key] = (value as Array<{ index: number; id: string }>).filter(link => link.id !== elementId)
        }
        return true
      })
    }

    /**
     *
     * @param fdComponent
     * @param position
     * @param tabId
     * @param elementId
     */
    addElementIntoGrid (fdComponent: FDComponent, position: [number, number], tabId: string, elementId: string): void {
      this.addElements.push({ type: 'add', com: { component: fdComponent.getId(), state: { text: '', color: '' }, x: position[0], y: position[1], tab: tabId, connections: {}, id: elementId, disabledio: { input: [], output: [] } } })
    }

    /**
     *
     * @param fdElement
     */
    updateElementFromGrid (fdElement: FDElement): void {
      this.updateElements = this.updateElements.filter(el => el.target !== fdElement.getId())
      const theBody: any = { comname: fdElement.getName(), comcolor: fdElement.getColor(), comnotes: fdElement.getNotes() }
      for (const [key, value] of Object.entries(fdElement.getOptions())) {
        theBody[key] = value
      }
      this.updateElements.push({ target: fdElement.getId(), type: 'options', body: theBody })
    }

    /**
     *
     * @param elementId
     * @param posiiton
     */
    mooveElementFromGrid (elementId: string, posiiton: [number, number]): void {
      this.mooveElements = this.mooveElements.filter(el => el.com.id !== elementId)
      this.mooveElements.push({ type: 'mov', com: { id: elementId, x: posiiton[0], y: posiiton[1] } })
    }

    /**
     *
     * @param fdElement
     */
    setALink (fdElement: FDElement): void {
      let connections = '{'
      fdElement.getLinks().forEach((links, index) => {
        connections += '"' + index + '": ' + JSON.stringify(links) + ', '
      })
      connections += '}'
      const connectionsObject = JSON.parse(connections.replace(', }', ' }'))
      if (this.addElements.filter(el => el.com.id === fdElement.getId()).length === 1) {
        this.addElements.filter(el => el.com.id === fdElement.getId())[0].com.connections = connectionsObject
      } else {
        if (this.links.filter(el => el.id === fdElement.getId()).length === 1) {
          this.links.forEach(el => {
            if (el.id === fdElement.getId()) {
              el.conn = connectionsObject
            }
          })
        } else {
          this.links.push({ type: 'conn', id: fdElement.getId(), conn: connectionsObject })
        }
      }
    }

    /**
     *
     * @param tabs
     * @param elementToRemove
     */
    setTabs (tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}>, elementToRemove: FDElement[]): void {
      this.tabs.tabs = tabs
      elementToRemove.forEach(el => this.removeElementFromGrid(el.getId()))
    }

    static installComponent (fileName: string, fileBody: string): string {
      return JSON.stringify({ type: 'install', body: { state: 'component', filename: fileName, fileBody: fileBody } })
    }

    static installPublicFile (fileName: string, fileBody: string): string {
      return JSON.stringify({ type: 'install', body: { state: 'asset', filename: fileName, fileBody: fileBody } })
    }

    static registerUser (userName: string, userPassword: string): string {
      return JSON.stringify({ type: 'auth', body: { state: 'register', userName: userName, userPassword: userPassword } })
    }

    static loginUser (userName: string, userPassword: string): string {
      return JSON.stringify({ type: 'auth', body: { state: 'login', userName: userName, userPassword: userPassword } })
    }

    static setUserkey (userKey: string): string {
      return JSON.stringify({ type: 'auth', body: { state: 'key', key: userKey } })
    }

    static createGroup (groupName: string): string {
      return JSON.stringify({ type: 'group', body: { state: 'create', group: groupName } })
    }

    static joinGroup (groupName: string): string {
      return JSON.stringify({ type: 'group', body: { state: 'join', group: groupName } })
    }

    static leaveGroup (groupName: string): string {
      return JSON.stringify({ type: 'group', body: { state: 'leave', group: groupName } })
    }
}
