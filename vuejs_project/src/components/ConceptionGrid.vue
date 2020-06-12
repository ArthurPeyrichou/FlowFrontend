<template>
  <div class="conception-grid">
    <div class="header container">
    <h3>Conception Grid</h3>
    </div>
    <div class="board">
      <svg class="grid">
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ConceptionGrid extends Vue {
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
  .conception-grid {
    background-color: black;
    height: 100%;
    border-left: 1px solid darkgrey;
    border-right: 1px solid darkgrey;
    overflow: hidden;
    position: relative;
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
    padding-bottom: 50px;
  }
  .board {
    overflow: scroll;
    height: 100%;
  }
  .grid {
    background-image: url("../assets/conceptiongrid.png");
    background-repeat: repeat;
    min-height: 1000px;
    height: 100%;
    min-width: 1000px;
    width: 100%;
  }
</style>
