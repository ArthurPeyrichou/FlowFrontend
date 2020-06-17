<template>
  <div class="home" style="display: flex;">
    <ToolBar :compBrutList="compBrutList"/>
    <ConceptionGrid/>
    <ConsoleBar/>
  </div>
</template>

<script>
// @ is an alias to /src
import ToolBar from '@/components/ToolBar.vue'
import ConceptionGrid from '@/components/ConceptionGrid.vue'
import ConsoleBar from '@/components/ConsoleBar.vue'
import { FDComponent } from '../models/FDComponent';

export default {
  name: 'Home',
  components: {
    ToolBar,
    ConceptionGrid,
    ConsoleBar
  },
  data() {
    return {
      compBrutList: [new FDComponent("id0","FakeType1","FakeComp1", '#FFD800','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id1","FakeType2","FakeComp2", '#FF0000','autor',true,false,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id2","FakeType1","FakeComp3", '#FFD800','autor',2,2,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id3","FakeType2","FakeComp4", '#FF0000','autor',true,3,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id4","FakeType1","FComp5", '#FFD800','autor',2,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id5","","FakeCompWithLongName", '#0094FF','autor',false,2,'icon','1.0','readme',false,'{}')]
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
  }
</style>

