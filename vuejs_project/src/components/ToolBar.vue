<template>
  <div class="tool-bar">
    <div class="header container">
      <h3>Tool bar</h3>
    </div>
    <div class="board">
      <div v-for="compGroup in compGroupsList" :key="compGroup" class="fdcomp-group-list">
        <p class="fdcomp-group-name">{{ compGroup }}</p>
        <ul class="list-group comp-list">
          <li v-for="FDComp in compList[compGroup]" :key="FDComp.getId()" class="list-group-item" draggable="true" v-on:dragstart="dragstart(FDComp, $event)">
            <i class="fa fa-circle" :style="'color:' + FDComp.getColor()"></i>
            {{ FDComp.getTitle() }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FDComponent } from '../models/FDComponent';

@Component
export default class ToolBar extends Vue {
  @Prop() private compBrutList!: FDComponent[];
   // eslint-disable-next-line
  compList: any = {};
  compGroupsList: string[] = [];

  constructor() {
    super();
    
    //We read each FlowData Components, populate the compGroupsList and store them by membership group.
    this.compBrutList.forEach(FDComp => {
      if(this.compGroupsList.indexOf(FDComp.getGroup()) < 0){
        this.compGroupsList.push(FDComp.getGroup())
        this.compList[FDComp.getGroup()] = new Array<FDComponent>();
      }
      this.compList[FDComp.getGroup()].push(FDComp);
    });
    //We sort component's group in order to get "Common" group on top and then in alphabetical order.
    this.compGroupsList.sort( (a, b) => {
      if(a == 'Common') return -1;
      else if(b == 'Common') return 1;
      else return a.localeCompare(b);
    });
  }

  /**
   * Call when a flowdata component is drag from the list
   */
  public dragstart(FDComp: FDComponent, event: DragEvent) {
      if(event.dataTransfer != null && event.dataTransfer != undefined)
        event.dataTransfer.setData("text", FDComp.toString());
  }
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
    background-color: #404040;
    float: left;
    height: 100%;
    width: 215px;
    overflow: hidden;
  }
  .board {
    width: 100%;
    text-align: left;
  }
  .fdcomp-group-list {
    border-bottom: 1px solid darkgrey;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .fdcomp-group-name {
    font-weight: bold;
    color: white;
  }
  .comp-list {
    font-size: small;
  }
  .comp-list li{
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
