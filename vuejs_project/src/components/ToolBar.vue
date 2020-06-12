<template>
  <div class="tool-bar">
    <div class="header container">
    <h3>Tool bar</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ToolBar extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    background-color: black;
    height: 50px;
    width: 100%;
    color: white;
    padding-top: 5px;
  }
  .tool-bar {
    background-color: grey;
    float: left;
    height: 100%;
    width: 215px;
    overflow: hidden;
  }
</style>
