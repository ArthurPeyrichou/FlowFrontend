<template>
  <div id="conception-grid" v-bind:class="theme">
    <div class="header">
      <div class="reduce-button" v-on:click="toggleBar('tool')">
        <b-icon v-if="isToolBarHide" icon="chevron-bar-left"></b-icon>
        <b-icon v-else icon="chevron-bar-right"></b-icon>
      </div>
      <div class="header-content">
        <b-nav tabs class="navbar-menu">
          <b-nav-item v-for="tab in tabs" :key="tab.id" :active="tab.id === currentTab" v-on:click="selectTab(tab.id)">{{tab.name}}</b-nav-item>
          <b-nav-item id="new-tab-button" v-on:click="openTabSettingModal()"><i class="fa fa-plus"></i> Tab</b-nav-item>
          <TabSettingModal ref="myTabSettingModal" :addNewTab="addNewTab" />
        </b-nav>
      </div>
      <div class="reduce-button reduce-button-right" v-on:click="toggleBar('console')">
        <b-icon v-if="isConsoleBarHide" icon="chevron-bar-right"></b-icon>
        <b-icon v-else icon="chevron-bar-left"></b-icon>
      </div>
    </div>
    <div id="conception-board" class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,5000,5000" @dragover.prevent v-on:drop="drop($event)">
        <defs>
          <pattern patternUnits="userSpaceOnUse" id="svg-grid" x="0" y="0" width="150" height="150">
            <image width="150" height="150" v-bind="{'xlink:href' : require('@/assets/conception-grid-' + theme + '.png')}"/>
          </pattern>
        </defs>
        <g class="svg-grid">
          <rect id="svg-grid-bg" x="0" y="0" width="5000" height="5000" fill="url(#svg-grid)"></rect>
        </g>
      </svg>
      <div id="zoom-tools">
        <button id="zoom-in-btn" title="Zoom in" data-exec="#designer.zoomin" v-on:click="zoomInSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-search-plus"></i>
        </button>
        <button id="reset-zoom-btn" title="Reset zoom" data-exec="#designer.zoomreset" v-on:click="zoomResetSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-balance-scale"></i>
        </button>
        <button id="zoom-out-btn" title="Zoom out" data-exec="#designer.zoomout" v-on:click="zoomOutSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-search-minus"></i>
        </button>
      </div>
    </div>
    <CompSettingModal ref="myCompSettingModal" :deleteTheComp="deleteTheComp" :updateCurrentComponent="updateCurrentComponent" />
  </div>
</template>

<script lang="ts">
import * as d3 from 'd3'
import CompSettingModal from '../conception/CompSettingModal.vue'
import TabSettingModal from '../conception/TabSettingModal.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { FDComponent } from '../../models/FDComponent'
import { BackendRequestFactory } from '../../models/BackendRequestFactory'
import { addComponentIntoGrid } from '../../services/gridServices/component/addComponentIntoGrid'
import { setComponentName } from '../../services/gridServices/component/setComponentName'
import { setComponentIO } from '../../services/gridServices/component/setComponentIO'
import { setComponentBeingProcessed } from '../../services/gridServices/component/setComponentBeingProcessed'
import { createLinkIntoGrid } from '../../services/gridServices/link/createLinkIntoGrid'
import { addLinkIntoGrid } from '../../services/gridServices/link/addLinkIntoGrid'

import { transfertData } from '../../services/gridServices/link/transfertData'
import { SVG_MIN_SCALE, SVG_MAX_SCALE, SVG_SCALE_STEP, TRANSFER_TYPE, COMMUNICATION_TYPE } from '../../config'
import { FDElement } from '../../models/FDElement'
import { BaseType, ContainerElement } from 'd3'

/** Gives an user interface that allow diagrams conception. Components displacements, connections, etc. */
@Component({
  components: {
    CompSettingModal,
    TabSettingModal
  }
})
export default class ConceptionGrid extends Vue {
  @Prop({ default: 'dark' }) theme!: string
  @Prop({ default: (data: string) => { console.log('Data:' + data) } }) sendMessageToBackend!: Function

  fdCompToDrop: FDComponent | undefined = undefined
  graphs: Map<string, Array<FDElement>> = new Map<string, Array<FDElement>>()
  idList: Array<string> = []
  tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}> = []
  currentTab = ''
  svgScale = 1
  hideToolBar = false
  hideConsoleBar = false
  backendRequestFactory = new BackendRequestFactory()
  isConnectedToBackEnd = process.env.NODE_ENV !== 'test'

  constructor () {
    super()
    // This way we execute the code after the redering of the template
    this.$nextTick(() => { this.initSvg() })
  }

  /**
   * Called by createLinkIntoGrid() when a link is added into grid.
   * @public
   * @param outputCompId the component source. Ex: '0-4561283'
   * @param inputCompId the component target. Ex: '1-5986157'
   */
  addAndRemoveLink (outputId: string, inputId: string, shouldAdd: boolean): void {
    const output = outputId.split('-')
    const input = inputId.split('-')
    const graph = this.graphs.get(this.currentTab)
    if (graph) {
      const fdElement = graph.filter(el => el.getId() === output[1])[0]
      if (fdElement) {
        if (shouldAdd) {
          fdElement.addLink(Number.parseInt(output[0]), { index: Number.parseInt(input[0]), id: input[1] })
        } else {
          fdElement.removeLink(Number.parseInt(output[0]), { index: Number.parseInt(input[0]), id: input[1] })
        }
        this.backendRequestFactory.setALink(fdElement)
        if (COMMUNICATION_TYPE === 'DIRECT') {
          this.sendMessageToBackend(this.backendRequestFactory.apply())
        }
      }
    }
  }

  /**
   * Create a new tab and go into it
   * @public
   */
  addNewTab (aName: string) {
    let newId = this.makeId(13)
    while (this.idList.includes(newId)) {
      newId = this.makeId(13)
    }
    this.tabs.push({ id: newId, index: this.tabs.length, name: aName, linker: aName.toLowerCase(), icon: 'fa-object-ungroup' })
    this.graphs.set(newId, [])
    this.selectTab(newId)
    this.backendRequestFactory.setTabs(this.tabs, [])
    if (COMMUNICATION_TYPE === 'DIRECT') {
      this.sendMessageToBackend(this.backendRequestFactory.apply())
    }
  }

  /**
   * Remove a new tab
   * On tab removing, remove all elements inside
   * If the tab list is empty create a new tab with name 'Main' and go into it
   * @public
   */
  removeTab (tabId: string) {
    this.tabs = this.tabs.filter(el => el.id !== tabId)
    const elements = this.graphs.get(tabId)
    this.backendRequestFactory.setTabs(this.tabs, (elements || []))
    if (COMMUNICATION_TYPE === 'ON_APPLY' || !this.isConnectedToBackEnd) {
      this.graphs.delete(tabId)
      if (this.tabs.length > 0) {
        if (this.currentTab === tabId) {
          this.selectTab(this.tabs[0].id)
        }
      } else {
        this.addNewTab('Main')
      }
    } else if (COMMUNICATION_TYPE === 'DIRECT') {
      this.sendMessageToBackend(this.backendRequestFactory.apply())
    }
  }

  /**
   * Called by CompSettingModal, delete the component and all links related from the Array and the screen.
   * @public
   * @param fdComp the component to delete
   */
  deleteTheComp (fdElementId: string): void {
    this.backendRequestFactory.removeElementFromGrid(fdElementId)
    if (COMMUNICATION_TYPE === 'ON_APPLY' || !this.isConnectedToBackEnd) {
      const elements = this.graphs.get(this.currentTab)
      this.graphs.set(this.currentTab, elements ? elements.filter(fdEl => {
        if (fdEl.getId() !== fdElementId) {
          fdEl.getLinks().forEach((connections, index) => {
            fdEl.getLinks().set(index, connections.filter(connection => connection.id === fdElementId))
          })
          return true
        }
        return false
      }) : [])
      d3.select('#comp-' + fdElementId).remove()
      const htmlColl = document.getElementsByClassName('link-' + fdElementId)
      while (htmlColl.length > 0) {
        const el = htmlColl[0].parentElement
        if (el) {
          el.remove()
        }
      }
    } else if (COMMUNICATION_TYPE === 'DIRECT') {
      this.sendMessageToBackend(this.backendRequestFactory.apply())
    }
  }

  /**
   * Called when a flowdata component is drop inside the #conception-grid-svg.
   * @public
   */
  drop (event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer != null && event.dataTransfer !== undefined) {
      try {
        this.fdCompToDrop = FDComponent.fromString(event.dataTransfer.getData('text'))
      } catch (error) {
        /**
         * Can be call if a already dropped component is moove in svg.
         * Or if we try to link two component and cancel.
         * Or drag and drop an element which should not be dropped here
         */
      }
    }
  }

  /**
   * Initializes d3 event's Observable.
   * Allows Components and links creation.
   * Drag&Drop of components in order to move them.
   * @public
   */
  initSvg (): void {
    const actualize = (mouse: [number, number]) => {
      if (this.fdCompToDrop !== undefined) {
        let newId = this.makeId(13)
        while (this.idList.includes(newId)) {
          newId = this.makeId(13)
        }
        this.idList.push(newId)

        this.backendRequestFactory.addElementIntoGrid(this.fdCompToDrop, mouse, this.currentTab, newId)
        if (COMMUNICATION_TYPE === 'ON_APPLY' || !this.isConnectedToBackEnd) {
          const newElement = new FDElement(newId, this.fdCompToDrop, this.currentTab, '', '', mouse[0], mouse[1], '', { text: '', color: '' }, {}, new Map())
          const elements = this.graphs.get(this.currentTab)
          if (elements) {
            elements.push(newElement)
          }
          addComponentIntoGrid(mouse, newElement, this.openComponentSettingModal, this.onComponentClick, this.onComponentMoove)
          createLinkIntoGrid(this.addAndRemoveLink, !this.isConnectedToBackEnd || COMMUNICATION_TYPE === 'ON_APPLY')
        } else if (COMMUNICATION_TYPE === 'DIRECT') {
          this.sendMessageToBackend(this.backendRequestFactory.apply())
        }
        this.fdCompToDrop = undefined
      }
    }

    d3.select('#svg-grid-bg').on('mousemove', function (this: BaseType) {
      actualize(d3.mouse(this as ContainerElement))
    })

    // This part allows the conception grid positioning by drag and drop
    const svgBoard = document.getElementById('conception-board')
    if (svgBoard !== null) {
      let isDown = false
      let startX: number
      let scrollLeft: number
      let startY: number
      let scrollTop: number
      svgBoard.addEventListener('mousedown', (e) => {
        isDown = true
        svgBoard.classList.add('active')
        startX = e.pageX - svgBoard.offsetLeft
        scrollLeft = svgBoard.scrollLeft
        startY = e.pageY - svgBoard.offsetTop
        scrollTop = svgBoard.scrollTop
      })
      svgBoard.addEventListener('mouseleave', () => {
        isDown = false
        svgBoard.classList.remove('active')
      })
      svgBoard.addEventListener('mouseup', () => {
        isDown = false
        svgBoard.classList.remove('active')
      })
      svgBoard.addEventListener('mousemove', (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - svgBoard.offsetLeft
        const walkX = (x - startX) * 2 // scroll faster
        svgBoard.scrollLeft = scrollLeft - walkX
        const y = e.pageY - svgBoard.offsetTop
        const walkY = (y - startY) * 2 // scroll faster
        svgBoard.scrollTop = scrollTop - walkY
      })
    }
  }

  /**
   * Used for show/hide the console-bar.
   * @public
   * @returns true if the console-bar should by hide, false otherwise.
   */
  get isConsoleBarHide (): boolean {
    return this.hideConsoleBar
  }

  /**
   * Used for show/hide the tool-bar.
   * @public
   * @returns true if the tool-bar should by hide, false otherwise.
   */
  get isToolBarHide (): boolean {
    return this.hideToolBar
  }

  /**
   * Make a random string.
   * @public
   * @param length the length wish
   * @returns a random string
   */
  makeId (length: number): string {
    let result = ''
    const characters = '0123456789'
    for (let i = 0; i < length; ++i) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  /**
   * Called by addComponentIntoGrid() when a comp triggerable is activated.
   * @param fdElementId
   */
  onComponentClick (fdElementId: string): void {
    this.sendMessageToBackend(this.backendRequestFactory.apply())
    this.sendMessageToBackend([JSON.stringify({ target: fdElementId, event: 'click' })])
  }

  /**
   * Called by addComponentIntoGrid() when a comp is mooved at the end of the drag and drop
   * @param fdElementId
   * @param x the new x position
   * @param y the new y position
   */
  onComponentMoove (fdElementId: string, x: number, y: number): void {
    this.backendRequestFactory.mooveElementFromGrid(fdElementId, [x, y])
    if (COMMUNICATION_TYPE === 'DIRECT') {
      this.sendMessageToBackend(this.backendRequestFactory.apply())
    }
  }

  /**
   * Called by addComponentIntoGrid() when a comp is clicked.
   * @public
   * @param compId the id of the component
   */
  openComponentSettingModal (element: FDElement): void {
    (this.$refs.myCompSettingModal as CompSettingModal).showModal(element)
  }

  /**
   * Called by add new tab navbar item.
   * @public
   */
  openTabSettingModal (): void {
    (this.$refs.myTabSettingModal as TabSettingModal).showModal()
  }

  /**
   * Remove all components and links from the svg conception grid
   * Then for each elements in the targeted graph
   * Add the componenent and all his links into the svg
   * @public
   */
  populateSvg (): void {
    d3.selectAll('.component').remove()
    d3.selectAll('.link').remove()
    const graph = this.graphs.get(this.currentTab)
    if (graph) {
      graph.forEach(el => {
        addComponentIntoGrid([el.getX(), el.getY()], el, this.openComponentSettingModal, this.onComponentClick, this.onComponentMoove)
      })
      graph.forEach(component => {
        if (component.getLinks().size !== 0) {
          component.getLinks().forEach((links, index) => {
            if (index !== 99) {
              links.forEach(link => addLinkIntoGrid(component.getId(), index, link, this.addAndRemoveLink))
            }
          })
        }
      })
    }
    createLinkIntoGrid(this.addAndRemoveLink, !this.isConnectedToBackEnd || COMMUNICATION_TYPE === 'ON_APPLY')
  }

  /**
   * Select a tab in the header
   * @public
   * @param tabId the tab's id
   */
  selectTab (tabId: string) {
    if (this.currentTab !== tabId) {
      this.currentTab = tabId
      this.populateSvg()
    }
  }

  /**
   * Load graphs elements list into the conception grid
   * @public
   * @param elementList a list of elements
   */
  setGraphsElements (elementList: FDElement[]) {
    this.graphs = new Map<string, Array<FDElement>>()
    elementList.forEach(el => {
      this.idList.push(el.getId())
      if (this.graphs.has(el.getTabId())) {
        const graph = this.graphs.get(el.getTabId())
        if (graph) {
          graph.push(el)
        }
      } else {
        this.graphs.set(el.getTabId(), [el])
      }
    })
    this.populateSvg()
  }

  /**
   * Set the tab list in conception grid header
   * @public
   * @param tabs the tab list: {id: string; index: number; name: string; linker: string; icon: string}
   */
  setTabs (tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}>) {
    this.tabs = tabs.sort((a, b) => a.index - b.index)
    this.backendRequestFactory.setTabs(this.tabs, [])
    if (this.tabs.length > 0) {
      if (this.currentTab === '') {
        this.currentTab = this.tabs[0].id
      }
    } else {
      this.addNewTab('Main')
    }
  }

  /**
   * Set all input and output debit in elements into the svg conception grid
   * @param traffic { elementId: {ci: number, co: number, duration: number, input: number, ni: number, no: number, no0: number, output: number, pending: number}, etc}
   * @public
   */
  setTraffic (traffic: any): void {
    const graph = this.graphs.get(this.currentTab)
    if (graph) {
      graph.forEach(el => {
        if (traffic[el.getId()]) {
          if (el.getFDComponent().getOutput() > 0) {
            if (traffic[el.getId()].output === 0) {
              setComponentBeingProcessed(el.getId(), true)
            } else {
              setComponentBeingProcessed(el.getId(), false)
            }
          }
          setComponentIO(el.getId(), traffic[el.getId()].input, traffic[el.getId()].output)
          el.getLinks().forEach((links, index) => {
            links.forEach(link => {
              // Need to be removed in next versions of backend, 99 represent the debug output (which will not exist like that anymore)
              if (index !== 99) {
                transfertData('#output-' + index + '-' + el.getId(), '#input-' + link.index + '-' + link.id, TRANSFER_TYPE)
              }
            })
          })
        }
      })
    }
  }

  /**
   * Toggles bar visibility, use for console-bar and tool-bar.
   * @public
   * @param barName the id's prefix of the bar's div
   */
  toggleBar (barName: string): void {
    const element: HTMLElement | null = document.getElementById(barName + '-bar')
    if (element) {
      const isHide = element.className.includes(' hide')
      if (isHide) {
        element.className = element.className.replace(' hide', '')
      } else {
        element.className += ' hide'
      }
      switch (barName) {
        case 'tool':
          this.hideToolBar = isHide
          break
        case 'console':
          this.hideConsoleBar = isHide
          break
      }
    }
  }

  /**
   * Update current FDElement in the graph
   */
  updateCurrentComponent (fdElement: FDElement, name: string, color: string): void {
    if (name !== '') {
      fdElement.setName(name)
      fdElement.setColor(color)
      this.backendRequestFactory.updateElementFromGrid(fdElement)
      if (COMMUNICATION_TYPE === 'ON_APPLY' || !this.isConnectedToBackEnd) {
        d3.select('#rect-' + fdElement.getId()).attr('fill', color)
        setComponentName(fdElement.getId(), name, fdElement.getFDComponent().getTitle())
      } else if (COMMUNICATION_TYPE === 'DIRECT') {
        this.sendMessageToBackend(this.backendRequestFactory.apply())
      }
    }
  }

  /**
   * Send all the modification made to the backend
   */
  updateDataToBackend (): void {
    const response = this.backendRequestFactory.apply()
    console.log(response)
    this.sendMessageToBackend(response)
  }

  /**
   * Increases the zoom of the conception grid.
   * @public
   */
  public zoomInSvg (): void {
    if (this.svgScale < SVG_MAX_SCALE) {
      this.svgScale += SVG_SCALE_STEP
      d3.select('#conception-grid-svg').selectAll('g').attr('transform', 'scale(' + this.svgScale.toFixed(1) + ')')
    }
  }

  /**
   * Reduces the zoom of the conception grid.
   * @public
   */
  zoomOutSvg (): void {
    if (this.svgScale > SVG_MIN_SCALE + SVG_SCALE_STEP) {
      this.svgScale -= SVG_SCALE_STEP
      d3.select('#conception-grid-svg').selectAll('g').attr('transform', 'scale(' + this.svgScale.toFixed(1) + ')')
    }
  }

  /**
   * Resets the zoom of the conception grid.
   * @public
   */
  zoomResetSvg (): void {
    if (this.svgScale !== 1) {
      this.svgScale = 1
      d3.select('#conception-grid-svg').selectAll('g').attr('transform', 'scale(' + this.svgScale.toFixed(1) + ')')
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  #conception-grid {
    background-color: #c8c8c8;
    height: 100%;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
    padding-bottom: 50px;
  }
  .header {
    background-color: #b8b8b8;
    height: 50px;
    width: 100%;
    max-width: 100%;
    display: flex;
  }
  .header-content {
    width: 100%;
    padding-left: 35px;
    padding-right: 35px;
    min-height: 50px;
  }
  .reduce-button {
    position: absolute;
    top: 0;
    height: 50px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: gray;
    width: 25px;
    padding-top: 10px;
    background-color: #c8c8c8;
    cursor: pointer;
  }
  .reduce-button-right {
    right: 0;
  }
  .board {
    overflow: scroll;
    height: 100%;
    cursor: move;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
  .board.active {
    cursor: grabbing;
  }
  .grid {
    min-height: 5000px;
    height: 100%;
    min-width: 5000px;
    width: 100%;
  }
  #zoom-tools {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  #zoom-tools button {
    width: 30px;
    height: 30px;
    padding: initial;
    margin-left: 1px;
    margin-right: 1px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .navbar-menu {
    background-color: #b8b8b8;
  }
  .navbar-menu .nav-item .active {
    background-color: #c8c8c8 !important;
    border-color:  rgba(0, 0, 0, 0.3) !important;
  }
  .navbar-menu .nav-item a {
    color: #2c3e50 !important;
  }
  .nav-tabs {
    border-bottom: none;
  }

  /* Dark side */
  #conception-grid.dark {
    background-color: #202020;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .header {
    background-color: #101010;
    color: white;
  }
  .dark .board {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .reduce-button {
    background-color: #303030;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .navbar-menu {
    background-color: #101010 !important;
    color: #c8c8c8;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item .active {
    background-color: #202020 !important;
    color: white !important;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a:hover {
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a {
    color: white !important;
  }
</style>
