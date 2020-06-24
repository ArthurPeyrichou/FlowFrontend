<template>
  <div v-bind:class="'tool-bar ' + theme">
    <div class="header">
      <b-navbar toggleable v-bind:type="theme" class="setting-tool-navbar">
        
        <b-navbar-toggle target="navbar-toggle-collapse">
          <template v-slot:default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        
        <div id="tool-options">
        </div>

        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#"><i class="fa fa-plus"></i> Component</b-nav-item>
            <b-nav-item href="#" disabled>Settings</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

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
    @Prop({default: []}) private compBrutList!: FDComponent[];
    @Prop({default: "dark"}) public theme!: string;
    // eslint-disable-next-line
    compList: Record<string, any> = {};
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
  .tool-bar {
    float: left;
    height: 100%;
    width: 215px;
    overflow: hidden;
    background-color: #c8c8c8;
  }
  .header {
    min-height: 50px;
    width: 100%;
    background-color: #b8b8b8;
  }
  .setting-tool-navbar {
    padding: inherit;
    font-size: 14px;
  }
  .navbar-toggler {
    border: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.1);;
    outline: 0;
    background-color: transparent;
    height: 50px;
    width: 45px;
    border-radius: 0px;
  }
  #tool-options {
    height: 50px;
    width: 170px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);;
  }
  .board {
    width: 100%;
    text-align: left;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
  .fdcomp-group-list {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    cursor: grab;
  }
  .fdcomp-group-name {
    font-weight: bold;
    font-size: 14px;
  }
  .comp-list li{
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 12px;
    background-color: #e8e8e8;
  }

  /* Dark side */
  .dark.tool-bar {
    background-color: #202020;
  }
  .dark .header {
    background-color: #101010;
    color: white;
  }
  .dark .navbar-toggler {
    color: gray;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark #tool-options {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .board {
    width: 100%;
    text-align: left;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .fdcomp-group-list {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .fdcomp-group-name {
    color: #e8e8e8;
  }
  .dark .comp-list li{
    background-color: #404040;
    color: #c8c8c8;
  }
</style>
