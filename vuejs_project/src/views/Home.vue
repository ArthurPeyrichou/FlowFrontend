<template>
  <div class="home" style="display: flex;">
    <ToolBar/>
    <ConceptionGrid/>
    <ConsoleBar/>
  </div>
</template>

<script>
// @ is an alias to /src
import ToolBar from '@/components/ToolBar.vue'
import ConceptionGrid from '@/components/ConceptionGrid.vue'
import ConsoleBar from '@/components/ConsoleBar.vue'

export default {
  name: 'Home',
  components: {
    ToolBar,
    ConceptionGrid,
    ConsoleBar
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

