<template>
  <div id="tool-bar">
    <div class="header">
      <b-navbar toggleable v-bind:type="configs.theme" class="setting-tool-navbar">
        <b-navbar-toggle target="toolbar-option-navbar-toggle-collapse">
          <template v-slot:default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        <div id="tool-options">
          <button v-if="shouldShowApplyButton" v-on:click="updateDataToBackend" :disabled="isUpdateClicked" id="send-update-button" type="button" class="btn btn-outline-success float-right">
            <div :style="'display:' + (isUpdateClicked ? 'initial' : 'none')">
              <i id="send-update-icon" class="fa fa-spin fa-cog" style="font:900 normal normal 24px 'Font Awesome 5 Free'"></i>
            </div>
            Update
          </button>
        </div>

        <b-collapse id="toolbar-option-navbar-toggle-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-on:click="openModal('component')"><i class="fa fa-plus"></i> Component</b-nav-item>
            <b-nav-item v-on:click="openModal('variable')"><i class="fa fa-plus"></i> Variables</b-nav-item>
            <b-nav-item v-on:click="openModal('import')"><i class="fa fa-file-import"></i> Import</b-nav-item>
            <b-nav-item v-on:click="openModal('export')"><i class="fa fa-file-export"></i> Export</b-nav-item>
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
    <VariableManagementModal ref="myVariableManagementModal" />
    <ImportDataModal ref="myImportDataModal" />
    <ExportDataModal ref="myExportDataModal" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VariableManagementModal from './VariableManagementModal.vue'
import ImportDataModal from './ImportDataModal.vue'
import ExportDataModal from './ExportDataModal.vue'
import AddCompModal from './AddCompModal.vue'
import { FDComponent } from '../../models/FDComponent'
import * as CONFIGS from '../../config'
import ConceptionGrid from '../conception/ConceptionGrid.vue'

/** Gives an user interface that allow components import, components drag and drop into conception grid, and components filtering. */
@Component({
  components: {
    AddCompModal,
    VariableManagementModal,
    ImportDataModal,
    ExportDataModal
  }
})
export default class ToolBar extends Vue {
  @Prop({
    default: {
      theme: CONFIGS.THEME,
      communicationType: CONFIGS.COMMUNICATION_TYPE
    }
  }) public configs!: { theme: string; communicationType: string }

  compList: any = {};
  compGroupsList: string[] = [];
  compSearchPattern = '';
  /** FlowData components list got from DesignBoard vue, got itself by the api.  */
  compBrutList: FDComponent[] = []
  public isUpdateClicked = false

  constructor () {
    super()
    this.filterList()
  }

  get shouldShowApplyButton (): boolean {
    return this.configs.communicationType === 'ON_APPLY'
  }

  /**
   * Called when a flowdata component is drag from the list.
   * Sets the selected component in event's dataTransfer in order to get it in the ConceptionFrid Vue.
   * @public
   */
  dragstart (FDComp: FDComponent, event: DragEvent): void {
    if (event.dataTransfer != null && event.dataTransfer !== undefined) {
      event.dataTransfer.setData('text', FDComp.toString())
    }
  }

  /**
   * Called each time a key is typed in the search bar to filter the list of components.
   * Takes FlowData components list, filters if there is a search pattern, groups them by type and finnaly sorts them
   * to have Common components on top and then by Sring.localeCompare().
   * @public
   */
  filterList (): void {
    if (this.compSearchPattern !== undefined) {
      this.compGroupsList = []
      this.compList = {}

      this.compBrutList.forEach(anFDComp => {
        if (anFDComp.getTitle().toLowerCase().includes(this.compSearchPattern.toLowerCase())) {
          if (!this.compGroupsList.includes(anFDComp.getGroup())) {
            this.compGroupsList.push(anFDComp.getGroup())
            this.compList[anFDComp.getGroup()] = new Array<FDComponent>()
          }
          this.compList[anFDComp.getGroup()].push(anFDComp)
        }
      })

      // We sort component's group in order to get 'Common' group on top and then in alphabetical order.
      this.compGroupsList.sort((a, b) => {
        if (a === 'Common') return -1
        else if (b === 'Common') return 1
        else return a.localeCompare(b)
      })
    }
  }

  /**
   * Used for search-bar's right icon.
   * @public
   * @returns true if no string is typed in the search-bar, false otherwise.
   */
  get isThereResearch (): boolean {
    this.filterList()
    return this.compSearchPattern === ''
  }

  /**
   * Called when the user select 'Add Component' in the setting-tool-navbar.
   * Opens modal from AddCompModal Vue.
   * @public
   */
  openModal (modal: 'component' | 'variable' | 'import' | 'export'): void {
    switch (modal) {
      case 'component':
        (this.$refs.myAddCompModal as AddCompModal).showModal()
        break
      case 'variable':
        (this.$refs.myVariableManagementModal as VariableManagementModal).showModal()
        break
      case 'import':
        (this.$refs.myImportDataModal as ImportDataModal).showModal()
        break
      case 'export':
        (this.$refs.myExportDataModal as ExportDataModal).showModal()
        break
    }
  }

  /**
   * Called when the user click on times-icons (cross symbol).
   * Clears the search-bar.
   * @public
   */
  resetSearch (): void {
    this.compSearchPattern = ''
  }

  /**
   * Call by DesignBoard to update the components list
   * @param compBrutList the new components list
   * @public
   */
  public setCompList (compBrutList: FDComponent[]): void {
    this.compBrutList = compBrutList
  }

  updateDataToBackend (): void {
    this.isUpdateClicked = true;
    (this.$parent.$children[1] as ConceptionGrid).updateDataToBackend()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ::-webkit-scrollbar {
    display: none;
  }
  #tool-bar {
    float: left;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    width: 215px;
    background-color: #c8c8c8;
  }
  #tool-bar {
    margin-left: 0px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  #tool-bar.hide{
    margin-left: -215px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  .header {
    min-height: 50px;
    width: 100%;
    background-color: #b8b8b8;
    display: contents;
  }
  .setting-tool-navbar {
    padding: inherit;
    font-size: 14px;
    background-color: #b8b8b8;
  }
  .navbar-toggler {
    border: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    outline: 0;
    background-color: transparent;
    height: 50px;
    width: 45px;
    border-radius: 0px;
    float: left;
  }
  #tool-options {
    height: 50px;
    width: 170px;
    float: right;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .board {
    width: 100%;
    text-align: left;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    overflow: auto;
    padding-bottom: 50px;
    direction: rtl;
  }
  .fdcomp-group-list {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
    cursor: grab;
    word-wrap:break-word;
    direction:ltr;
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
    border-radius: 5px;
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
    direction:ltr;
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
  #send-update-button {
    height: 100%;
    border-radius: 0px;
  }
  #send-update-button svg {
    margin-right: 5px;
  }

  /* Dark side */
  .dark #tool-bar {
    background-color: #202020;
  }
  .dark .header {
    background-color: #101010;
    color: white;
  }
  .dark .setting-tool-navbar {
    background-color: #101010;
  }
  .dark .navbar-toggler {
    color: gray;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark #tool-options {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .board {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .fdcomp-group-list {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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
