<template>
  <div class="home">
    <ToolBar ref="myToolBar" :configs="configs"/>
    <ConceptionGrid ref="myConceptionGrid" :configs="configs" :sendMessageToBackend="sendMessageToBackend"/>
    <ConsoleBar ref="myConsoleBar" :configs="configs"/>
  </div>
</template>

<script lang="ts">
import ToolBar from '../components/tool/ToolBar.vue'
import ConceptionGrid from '../components/conception/ConceptionGrid.vue'
import ConsoleBar from '../components/console/ConsoleBar.vue'
import { FDComponent } from '../models/FDComponent'
import { FDElement } from '../models/FDElement'
import { Component, Vue, Prop } from 'vue-property-decorator'
import App from '../App.vue'

@Component({
  components: {
    ToolBar,
    ConceptionGrid,
    ConsoleBar
  }
})
export default class DesignBoard extends Vue {
  @Prop({ default: null }) public configs!: null | {theme: string; svgGridSize: number; svgGridBorderSize: number; svgMinScale: number; svgMaxScale: number;
      svgScaleStep: number; linkFillColor: string; activeLinkFillColor: string; transferDuration: number; transferRadius: number;
      transferFillColor: string; transferStrokeColor: string; transferType: string; transferBytesPrecision: number; transferShowIO: boolean;
      outputFontSize: number; communicationType: string; dataLoadingType: string;};

  private databaseElementList: Array<FDElement> = []
  public tabList: Array<{id: string; index: number; name: string; linker: string; icon: string}> = []

  /**
   * Import new graphs elements into the designboard
   * @public
   * @param elementList a list of elements
   */
  importDataBaseElements (elementList: FDElement[]): void {
    elementList.forEach(el => {
      if (this.databaseElementList.filter(dataEl => dataEl.getId() === el.getTabId()).length === 0) {
        this.databaseElementList.push(el)
      }
    })
  }

  updateDataBaseElements (element: FDElement, add = true): void {
    if (add) {
      this.databaseElementList.push(element)
    } else {
      this.databaseElementList = this.databaseElementList.filter(el => el.getId() !== element.getId())
    }
  }

  /**
   * Import new tabs into the designboard
   * @public
   * @param tabsList a list of tabs
   */
  importTabs (tabsList: Array<{id: string; index: number; name: string; linker: string; icon: string}>): void {
    tabsList.forEach(tab => {
      if (this.tabList.filter(dataTab => dataTab.id === tab.id).length === 0) {
        this.tabList.push(tab)
      }
    })
  }

  /**
   * Sand fake data to toolbar in case of bakcend connection failed
   * @public
   */
  sendBlankDesignerData (): void {
    (this.$children[0] as ToolBar).setCompList([new FDComponent('id0', 'FakeType1', 'FakeComp(1-1)', '#EFC467', 'autor', true, true, 'bug', '1.0', 'readme', true, '{}', '{}'),
      new FDComponent('id1', 'FakeType2', 'FakeComp(1-0)', '#D86571', 'autor', true, false, 'bug', '1.0', 'readme', false, '{}', '{}'),
      new FDComponent('id2', 'FakeType1', 'FakeComp(2-2)', '#EFC467', 'autor', 2, 2, 'bug', '1.0', 'readme', false, '{}', '{}'),
      new FDComponent('id3', 'FakeType2', 'FakeComp(1-3)', '#D86571', 'autor', true, 3, 'bug', '1.0', 'readme', false, '{}', '{}'),
      new FDComponent('id4', 'FakeType1', 'FComp(2-1)', '#EFC467', 'autor', 2, true, 'bug', '1.0', 'readme', false, '{}', '{}'),
      new FDComponent('id5', '', 'FakeCompLongName(0-2)', '#77C0F4', 'autor', false, 2, 'bug', '1.0', 'readme', true, '{}', '{}')])
  }

  /**
   * Send components from database to toolbar
   * Send tabs to conception grid
   * And send all graphs element to conception grid
   * @param data
   * @public
   */
  sendDesignerData (data: any): void {
    const databaseCompList: FDComponent[] = []
    const map: Map<string, FDComponent> = new Map()
    data.database.forEach((el: any) => {
      const comp = new FDComponent(el.id, el.group, el.title, el.color, el.author, el.input, el.output, el.icon, el.version, el.readme, el.click, el.options, el.details)
      databaseCompList.push(comp)
      map.set(el.id, comp)
    });
    (this.$children[0] as ToolBar).setCompList(databaseCompList)
    if (data.tabs) {
      this.tabList = data.tabs
    }
    (this.$children[1] as ConceptionGrid).setTabs(this.tabList)

    this.databaseElementList = []

    if (data.components) {
      data.components.forEach((el: any) => {
        const comp = map.get(el.component)
        if (comp !== undefined) {
          this.databaseElementList.push(new FDElement(el.id, comp, el.tab, el.name, el.color, el.x, el.y, el.notes, el.state, el.options, el.connections))
        }
      })
    }
    (this.$children[1] as ConceptionGrid).setGraphsElements(this.databaseElementList)
  }

  /**
   * Send message as a log into console bar
   * @param data
   * @public
   */
  sendMessageToConsole (data: any): void {
    const theElement: FDElement[] = this.databaseElementList.filter(el => el.getId() === data.id)
    if (theElement.length === 1) {
      const tab = this.tabList.filter(el => el.id === theElement[0].getTabId());
      (this.$children[2] as ConsoleBar).addLog(data.type, (tab.length === 1 ? tab[0].name + ': ' : '') + theElement[0].getName(), data.id, data.body, theElement[0].getColor())
    } else {
      (this.$children[2] as ConsoleBar).addLog(data.type, 'Unknown', '', data.body, '#CF1D1D')
    }
  }

  /**
   * Call by a listener in addComponent.ts
   * Will send a message to backend for trigger clicked component
   * @param data
   * @public
   */
  sendMessageToBackend (data: Array<string>): void {
    (this.$parent as App).sendMessageToBackend(data)
  }
}
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .home {
      display: flex;
      height: 100%;
      width: 100%;
      position: absolute;
      margin: auto;
      overflow: hidden;
    }
</style>
