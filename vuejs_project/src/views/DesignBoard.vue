<template>
  <div class="home">
    <ToolBar :theme="theme"/>
    <ConceptionGrid :theme="theme"/>
    <ConsoleBar :theme="theme"/>
  </div>
</template>

<script lang="ts">
import ToolBar from '@/components/tool/ToolBar.vue'
import ConceptionGrid from '@/components/conception/ConceptionGrid.vue'
import ConsoleBar from '@/components/console/ConsoleBar.vue'
import { FDComponent } from '../models/FDComponent'
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
  private data = null

  constructor () {
    super()
    console.log('Starting connection to WebSocket Server')

    // eslint-disable-next-line
    const setData = (data: any) => {
      if (data.type === 'designer') {
        this.data = data
        const compBrutList: FDComponent[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.database.forEach((el: any) => {
          compBrutList.push(new FDComponent(el.id, el.group, el.title, el.color, el.author, el.input, el.output, el.icon, el.version, el.readme, el.click, el.options))
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.$children[0] as any).setCompList(compBrutList)
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
              setTimeout(() => this.connect(url), 5000)
            } else {
              setData([new FDComponent('id0', 'FakeType1', 'FakeComp(1-1)', '#EFC467', 'autor', true, true, '\uf188', '1.0', 'readme', true, '{}'),
                new FDComponent('id1', 'FakeType2', 'FakeComp(1-0)', '#D86571', 'autor', true, false, '\uf188', '1.0', 'readme', false, '{}'),
                new FDComponent('id2', 'FakeType1', 'FakeComp(2-2)', '#EFC467', 'autor', 2, 2, '\uf188', '1.0', 'readme', false, '{}'),
                new FDComponent('id3', 'FakeType2', 'FakeComp(1-3)', '#D86571', 'autor', true, 3, '\uf188', '1.0', 'readme', false, '{}'),
                new FDComponent('id4', 'FakeType1', 'FComp(2-1)', '#EFC467', 'autor', 2, true, '\uf188', '1.0', 'readme', false, '{}'),
                new FDComponent('id5', '', 'FakeCompLongName(0-2)', '#77C0F4', 'autor', false, 2, '\uf188', '1.0', 'readme', true, '{}')])
              throw new Error('Maximum number of connection trials has been reached')
            }
          }
        })
        ws.onopen = function () {
          console.log('Successfully connected to the echo websocket server...')
        }
        ws.onmessage = function (event) {
          console.log('Got a message!')
          try {
            setData(JSON.parse(decodeURIComponent(event.data)))
          } catch (error) {

          }
        }
        return ws
      }
    }
    this.connection = webSocketFactory.connect(WEBSOCKET_URL + WEBSOCKET_PORT)
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
