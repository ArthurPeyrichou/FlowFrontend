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
            <b-nav-item v-on:click="openAddCompModal()"><i class="fa fa-plus"></i> Component</b-nav-item>
            <b-nav-item href="#" disabled>Settings</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

    </div>
    <div class="board">
      <div class="search-component-box">
        <div class="search-component-box-text">
          <input type="text" placeholder="Search components ..." v-model="compSearchPattern">
        </div>
        <div class="search-component-box-control" v-bind:hidden="!isThereResearch">
          <span class="fa fa-search"></span>
        </div>
        <div class="search-component-box-control" v-bind:hidden="isThereResearch" v-on:click="resetSearch">
          <span class="fa fa-times"></span>
        </div>
      </div>
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
    
    <AddCompModal ref="myAddCompModal" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import AddCompModal from '@/components/tool/AddCompModal.vue'
  import { FDComponent } from '../../models/FDComponent';

 @Component({
    components: {
      AddCompModal
    }
  })
  export default class ToolBar extends Vue {
    @Prop({default: []}) private compBrutList!: FDComponent[];
    @Prop({default: "dark"}) public theme!: string;
    // eslint-disable-next-line
    public compList: Record<string, any> = {};
    public compGroupsList: string[] = [];
    public compSearchPattern = "";

    constructor() {
      super();
      this.filterList()
    }

    get isThereResearch() {
      this.filterList();
      return this.compSearchPattern == '';
    }

    public filterList() {
      if(this.compSearchPattern != undefined) {
        this.compGroupsList = [];
        this.compList = {};

        this.compBrutList.forEach(anFDComp => {
          if(anFDComp.getTitle().toLowerCase().includes(this.compSearchPattern.toLowerCase())){
            if(!this.compGroupsList.includes(anFDComp.getGroup())){
              this.compGroupsList.push(anFDComp.getGroup())
              this.compList[anFDComp.getGroup()] = new Array<FDComponent>();
            }
            this.compList[anFDComp.getGroup()].push(anFDComp);
          }
        });

        //We sort component's group in order to get "Common" group on top and then in alphabetical order.
        this.compGroupsList.sort( (a, b) => {
          if(a == 'Common') return -1;
          else if(b == 'Common') return 1;
          else return a.localeCompare(b);
        });
      }
    }

    /**
     * Call when a flowdata component is drag from the list
     */
    public dragstart(FDComp: FDComponent, event: DragEvent) {
        if(event.dataTransfer != null && event.dataTransfer != undefined)
          event.dataTransfer.setData("text", FDComp.toString());
    }
    
    public openAddCompModal() {
      this.$children[0].$bvModal.show("modal-add-component")
    }

    public resetSearch() {
      this.compSearchPattern = "";
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
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    outline: 0;
    background-color: transparent;
    height: 50px;
    width: 45px;
    border-radius: 0px;
  }
  #tool-options {
    height: 50px;
    width: 170px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  .search-component-box {
    background-color: #e8e8e8;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 15px;
    margin-right: 15px;
    border-radius: 2px;
    position: relative;
    display: table;
  }
  .search-component-box-text {
    padding: 5px 2px 0 5px;
  }
  .search-component-box-text input {
    color: gray;
    background-color: #e8e8e8;
    border: 0;
    outline: 0;
    width: 100%;
    vertical-align: top;
    line-height: 14px;
    font-size: 14px;
  }
  .search-component-box-control {
    vertical-align: middle;
    display: table-cell;
    text-align: center;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    color: gray;
    width: 26px;
    font-size: 12px;
  }
  .search-component-box-control .fa-times {
    color: red;
    cursor: pointer;
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
  .dark .search-component-box {
    background-color: #303030;
    border: 1px solid #404040;
  }
  .dark .search-component-box-text input {
    color: gray;
    background-color: #303030;
  }
  .dark .search-component-box-control {
    border-left: 1px solid #404040;
    color: gray;
  }
</style>
