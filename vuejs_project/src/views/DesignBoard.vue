<template>
  <div class="home">
    <ToolBar ref="myToolBar" :theme="theme"/>
    <ConceptionGrid ref="myConceptionGrid" :theme="theme" :sendMessageToBackend="sendMessageToBackend"/>
    <ConsoleBar ref="myConsoleBar" :theme="theme"/>
  </div>
</template>

<script lang="ts">
import ToolBar from '../components/tool/ToolBar.vue'
import ConceptionGrid from '../components/conception/ConceptionGrid.vue'
import ConsoleBar from '../components/console/ConsoleBar.vue'
import { FDComponent } from '../models/FDComponent'
import { FDElement } from '../models/FDElement'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { COMMUNICATION_TYPE } from '../config'

@Component({
  components: {
    ToolBar,
    ConceptionGrid,
    ConsoleBar
  }
})
export default class DesignBoard extends Vue {
  // dark or light
  @Prop({ default: 'dark' }) public theme!: string;

  private databaseElementList: Array<FDElement> = []
  private tabList: Array<{id: string; index: number; name: string; linker: string; icon: string}> = []
  private connection: WebSocket | null = null
  public shouldReload = 2 // Backend send designerdata twice in short time
  private backendUrl: string | undefined = process.env.VUE_APP_BACKEND_URL

  mounted () {
    this.$nextTick(function () {
      // If the node environment is test, we populate the toolbar of fake components for tests
      if (process.env.NODE_ENV === 'test' || !this.backendUrl) {
        this.sendBlankDesignerData()
      } else {
        this.connect(3, this.backendUrl)
      }
    })
  }

  /**
   * Connect to backend by WebSocket
   * And initialize listeners for communication
   * @param connectionTries the maximum number of connections we want tries before give up
   * @param url the backend url. Ex: ws://localhost:5001
   * @public
   */
  connect (connectionTries: number, url: string): void {
    const treatMessage = (data: any) => {
      switch (data.type) {
        case 'debug':
          this.sendMessage(data)
          break
        case 'designer':
          if (this.shouldReload > 0 || COMMUNICATION_TYPE === 'DIRECT') {
            this.sendDesignerData(data)
            --this.shouldReload
            // if too many time is spend (1.5s) before the next designer data, close the opportunnity to reload
            setTimeout( () => { this.shouldReload = 0 }, 1500)
          }
          break
        case 'error':
        case 'errors':
          console.error(data.type, data)
          break
        case 'online':
          console.log('Count of client connected: ' + data.count)
          break
        case 'status':
          console.log('Message type "' + data.type + '".')
          console.log(data)
          break
        case 'traffic':
          (this.$children[1] as ConceptionGrid).setTraffic(data.body)
          break
        default:
          console.warn('Message type "' + data.type + '" not treated.')
          break
      }
    }
    console.log('Starting connection to WebSocket Server...')
    this.connection = new WebSocket(url)
    this.connection.addEventListener('error', e => {
      // readyState === 3 is CLOSED
      if ((e.target as WebSocket).readyState === 3) {
        if (connectionTries > 0) {
          setTimeout(() => this.connect(connectionTries - 1, url), 1000)
        } else {
          console.error('Maximum number of connection trials has been reached')
        }
      } else {
        console.error('Websocket error: ' + event?.target)
      }
    })
    this.connection.onopen = function () {
      console.log('Successfully connected to the echo websocket server...')
    }
    this.connection.onmessage = function (event) {
      treatMessage(JSON.parse(decodeURIComponent(event.data)))
    }
  }

  /**
   * Sand fake data to toolbar in case of bakcend connection failed
   * @public
   */
  sendBlankDesignerData (): void {
    (this.$children[0] as ToolBar).setCompList([new FDComponent('id0', 'FakeType1', 'FakeComp(1-1)', '#EFC467', 'autor', true, true, 'bug', '1.0', 'readme', true, '{}'),
      new FDComponent('id1', 'FakeType2', 'FakeComp(1-0)', '#D86571', 'autor', true, false, 'bug', '1.0', 'readme', false, '{}'),
      new FDComponent('id2', 'FakeType1', 'FakeComp(2-2)', '#EFC467', 'autor', 2, 2, 'bug', '1.0', 'readme', false, '{}'),
      new FDComponent('id3', 'FakeType2', 'FakeComp(1-3)', '#D86571', 'autor', true, 3, 'bug', '1.0', 'readme', false, '{}'),
      new FDComponent('id4', 'FakeType1', 'FComp(2-1)', '#EFC467', 'autor', 2, true, 'bug', '1.0', 'readme', false, '{}'),
      new FDComponent('id5', '', 'FakeCompLongName(0-2)', '#77C0F4', 'autor', false, 2, 'bug', '1.0', 'readme', true, '{}')])
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
      const comp = new FDComponent(el.id, el.group, el.title, el.color, el.author, el.input, el.output, el.icon, el.version, el.readme, el.click, el.options)
      databaseCompList.push(comp)
      map.set(el.id, comp)
    });
    (this.$children[0] as ToolBar).setCompList(databaseCompList)
    this.tabList = data.tabs;
    (this.$children[1] as ConceptionGrid).setTabs(this.tabList)

    this.databaseElementList = []

    data.components.forEach((el: any) => {
      const comp = map.get(el.component)
      if (comp !== undefined) {
        this.databaseElementList.push(new FDElement(el.id, comp, el.tab, el.name, el.color, el.x, el.y, el.notes, el.state, el.options, el.connections))
      }
    });
    (this.$children[1] as ConceptionGrid).setGraphsElements(this.databaseElementList)
  }

  /**
   * Send message as a log into console bar
   * @param data
   * @public
   */
  sendMessage (data: any): void {
    const theElement: FDElement[] = this.databaseElementList.filter(el => el.getId() === data.id)
    if (theElement.length === 1) {
      const tab = this.tabList.filter(el => el.id === theElement[0].getTabId());
      (this.$children[2] as ConsoleBar).addLog((tab.length === 1 ? tab[0].name + ': ' : '') + theElement[0].getName(), data.body, theElement[0].getColor())
    } else {
      (this.$children[2] as ConsoleBar).addLog('Unknown', data.body, '#CF1D1D')
    }
  }

  /**
   * Call by a listener in addComponent.ts
   * Will send a message to backend for trigger clicked component
   * @param data
   * @public
   */
  sendMessageToBackend (data: Array<string>): void {
    if (this.connection !== null) {
      data.forEach(el => {
        if (this.connection !== null) {
          this.shouldReload = 2
          this.connection.send(el)
        }
      })
    } else {
      console.log('Data received but no connection to send the message found.')
    }
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
