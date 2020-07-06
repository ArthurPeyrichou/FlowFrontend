<template>
  <div class="home">
    <h3>This is a demo blank board.</h3>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BlankBoard extends Vue {
  // dark or light
  @Prop({ default: 'dark' }) public theme!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h3 {
    margin-top: 10%;
    margin-bottom: 10%;
    text-align: center;
  }
</style>
