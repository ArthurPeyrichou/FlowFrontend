<template>
  <div class="console-bar">
    <div class="header container">
    <h3>Console</h3>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class ConsoleBar extends Vue {
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
    .console-bar {
      background-color: grey;
      float: right;
      height: 100%;
      width: 460px;
      overflow: hidden;
    }
</style>
