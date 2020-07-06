<template>
  <div id="console-bar" v-bind:class="theme">
    <div class="header container">
      <h3>Console</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/** Gives an user interface that will allow texts output and flowdata monitoring. (NOT IMPLEMENTED YET) */
@Component
export default class ConsoleBar extends Vue {
  @Prop({ default: 'dark' }) public theme!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #console-bar {
    background-color: #c8c8c8;
    float: right;
    height: 100%;
    overflow: hidden;
    width: 460px;
  }
  #console-bar {
    margin-right: 0px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  #console-bar.hide{
    margin-right: -460px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  .header {
    background-color: #b8b8b8;
    height: 50px;
    width: 100%;
    padding-top: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }

  /* Dark side */
  .dark#console-bar {
    background-color: #202020;
  }
  .dark .header {
    background-color: #101010;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
