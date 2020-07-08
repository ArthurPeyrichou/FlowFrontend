<template>
  <div class="home">
    <ToolBar :compBrutList="compBrutList" :theme="theme"/>
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

@Component({
  components: {
    ToolBar,
    ConceptionGrid,
    ConsoleBar
  }
})
export default class DesignBoard extends Vue {
  private compBrutList: Array<FDComponent> = [new FDComponent('id0', 'FakeType1', 'FakeComp(1-1)', '#EFC467', 'autor', true, true, '\uf188', '1.0', 'readme', true, '{}'),
    new FDComponent('id1', 'FakeType2', 'FakeComp(1-0)', '#D86571', 'autor', true, false, '\uf188', '1.0', 'readme', false, '{}'),
    new FDComponent('id2', 'FakeType1', 'FakeComp(2-2)', '#EFC467', 'autor', 2, 2, '\uf188', '1.0', 'readme', false, '{}'),
    new FDComponent('id3', 'FakeType2', 'FakeComp(1-3)', '#D86571', 'autor', true, 3, '\uf188', '1.0', 'readme', false, '{}'),
    new FDComponent('id4', 'FakeType1', 'FComp(2-1)', '#EFC467', 'autor', 2, true, '\uf188', '1.0', 'readme', false, '{}'),
    new FDComponent('id5', '', 'FakeCompLongName(0-2)', '#77C0F4', 'autor', false, 2, '\uf188', '1.0', 'readme', true, '{}')];

  // dark or light
  @Prop({ default: 'dark' }) public theme!: string;
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
