<template>
  <div class="home">
    <ToolBar ref="myToolBar" :theme="theme"/>
    <ConceptionGrid ref="myConceptionGrid" :theme="theme"/>
    <ConsoleBar ref="myConsoleBar" :theme="theme"/>
  </div>
</template>

<script lang="ts">
import ToolBar from '@/components/tool/ToolBar.vue'
import ConceptionGrid from '@/components/conception/ConceptionGrid.vue'
import ConsoleBar from '@/components/console/ConsoleBar.vue'
import { FDComponent } from '../models/FDComponent'
import { FDElement } from '../models/FDElement'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { WEBSOCKET_URL, WEBSOCKET_PORT } from '../config'

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

  private connection: WebSocket | null = null

  constructor () {
    super()
    // This way we execute the code after the redering of the template
    this.$nextTick(() => {
      this.sendBlankDesignerData()
      console.log('Starting connection to WebSocket Server')

      const treatMessage = (data: any) => {
        switch (data.type) {
          case 'debug':
            console.log('Debug: ', data)
            break
          case 'designer':
            this.sendDesignerData(data)
            break
          case 'online':
            console.log('Count of client connected: ' + data.count)
            break
          case 'status':
            console.log('Message type "' + data.type + '".')
            console.log(data)
            break
          case 'traffic':
            (this.$refs.myConceptionGrid as ConceptionGrid).setTraffic(data.body)
            break
          default:
            console.error('Message type "' + data.type + '" not treated.')
            break
        }
      }

      const webSocketFactory = {
        connectionTries: 3,
        connect: function (url: string) {
          const ws = new WebSocket(url)
          ws.addEventListener('error', e => {
            // readyState === 3 is CLOSED
            if ((e.target as WebSocket).readyState === 3) {
              this.connectionTries--

              if (this.connectionTries > 0) {
                setTimeout(() => this.connect(url), 1000)
              } else {
                console.error('Maximum number of connection trials has been reached')
              }
            } else {
              console.error('Websocket error: ' + event?.target)
            }
          })
          ws.onopen = function () {
            console.log('Successfully connected to the echo websocket server...')
          }
          ws.onmessage = function (event) {
            console.log('Got a message!')
            treatMessage(JSON.parse(decodeURIComponent(event.data)))
          }
          return ws
        }
      }

      this.connection = webSocketFactory.connect(WEBSOCKET_URL + WEBSOCKET_PORT)
    })
  }

  sendBlankDesignerData (): void {
    (this.$refs.myToolBar as ToolBar).setCompList([new FDComponent('id0', 'FakeType1', 'FakeComp(1-1)', '#EFC467', 'autor', true, true, 'bug', '1.0', 'readme', true, '{}'),
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
   */
  sendDesignerData (data: any): void {
    const databaseCompList: FDComponent[] = []
    const map: Map<string, FDComponent> = new Map()
    data.database.forEach((el: any) => {
      const comp = new FDComponent(el.id, el.group, el.title, el.color, el.author, el.input, el.output, el.icon, el.version, el.readme, el.click, el.options)
      databaseCompList.push(comp)
      map.set(el.id, comp)
    });
    (this.$refs.myToolBar as ToolBar).setCompList(databaseCompList);
    (this.$refs.myConceptionGrid as ConceptionGrid).setTabs(data.tabs)

    const graphs: FDElement[] = []

    data.components.forEach((el: any) => {
      const comp = map.get(el.component)
      if (comp !== undefined) {
        graphs.push(new FDElement(el.id, comp, el.tab, el.name, el.color, el.x, el.y, el.notes, el.state, el.options, el.connections))
      }
    });
    (this.$refs.myConceptionGrid as ConceptionGrid).setGraphsElements(graphs)
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
