<template>
  <div class="conception-grid">
    <div class="header container">
    <h3>Conception Grid</h3>
    </div>
    <div class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,5000,5000" @dragover.prevent v-on:drop="drop($event)">
      </svg>
    </div>
    <CompSettingModal ref="myCompSettingModal" :fdComponent="currentFDComp" :deleteTheComp="deleteTheComp" />
  </div>
</template>

<script lang="ts">
import CompSettingModal from '@/components/CompSettingModal.vue'
import { Component, Vue } from 'vue-property-decorator';
import { FDComponent } from '../models/FDComponent';
import * as d3 from "d3";
import { addComponentIntoGrid } from "../services/gridServices/addComponent";
import { addLinkBeetweenTwoComponentsIntoGrid } from "../services/gridServices/addLink";

@Component({
  components: {
    CompSettingModal
  }
})
export default class ConceptionGrid extends Vue {
  private fdCompToDrop: FDComponent | undefined = undefined;
  private currentFDComp: {component: FDComponent; compId: string; links: Array<{linkId: string; compId: string; fromOutput: string; toInput: string}>};
  private componentList: Array<{component: FDComponent; compId: string; links: Array<{linkId: string; compId: string; fromOutput: string; toInput: string}>}> = [];
  private idList: Array<string> = [];

  //public currentComponent:any = undefined;

  constructor() {
    super();
    //Tthis way we execute the code after the redering of the template
    this.$nextTick( () => {this.initSvg();});
    this.currentFDComp = {component: FDComponent.prototype, compId: "", links: []};
  }

  /**
   * Call when a flowdata component is drop inside the <svg>
   */
  public drop(event: DragEvent) {
      if(event.dataTransfer != null && event.dataTransfer != undefined){
        this.fdCompToDrop = FDComponent.fromString(event.dataTransfer.getData("text"));
      }
  }

  /**
   * Make a random string
   * @param lenght the lenght of the returned string
   */
  private makeId(length: number): string {
    let result= '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; ++i) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Initialize d3 event's Observable
   * Allow Components and links creation
   * Drag&Drop of components in order to move them
   */
  private initSvg() {
    const actualize = () => {
        if(this.fdCompToDrop != undefined) {
          addComponentIntoGrid(this.fdCompToDrop, this.registerComponent, this.openSettingModal);
          addLinkBeetweenTwoComponentsIntoGrid(this.registerLink);
          this.fdCompToDrop = undefined;
        }
    }

    d3.select("#conception-grid-svg")
      .on("mousemove", function () {
        actualize();
      });
  }

  /**
   * Call by addComponentIntoGrid() when a comp is drop into grid.
   */
  public registerComponent(comp: FDComponent): string {
    let newId = this.makeId(10);
    while(this.idList.includes(newId)){
      newId = this.makeId(10);
    }
    this.componentList.push({component: comp, compId: newId, links: []});
    return newId;
  }
  /**
   * Call by addLinkBeetweenTwoComponentsIntoGrid() when a link is added into grid.
   */
  public registerLink(outputCompId: string, inputCompId: string) {
    let newId = this.makeId(10);
    const outputComp = outputCompId.split('-');
    const inputComp = inputCompId.split('-');
    while(this.idList.includes(newId)){
      newId = this.makeId(10);
    }
    this.componentList.forEach( el => {
      if(el.compId == outputComp[1]) {
        el.links.push({linkId: newId, compId: inputComp[1], fromOutput: outputComp[0], toInput: inputComp[0]});
      }
    });
    return newId;
  }
  /**
   * Call by addComponentIntoGrid() when a comp is clicked.
   */
  public openSettingModal(compId: string) {
    this.currentFDComp = this.componentList.filter(el => el.compId == compId)[0];
    this.$children[0].$bvModal.show("modal-edit-component")
  }

  /**
   * Call by CompSettingModal, delete the component and all links related from the Array and the screen.
   */
  public deleteTheComp(fdComp: {component: FDComponent; compId: string; links: Array<{linkId: string; compId: string; fromOutput: string; toInput: string}>}) {
    this.componentList.forEach( el => {
      el.links = el.links.filter(el => {
        if(el.compId != fdComp.compId) {
          return true;
        } else {
          document.getElementById("link-" + el.linkId)?.remove();
          return false;
        }
      });
    });
    this.componentList = this.componentList.filter(el => {
      if(el.compId != fdComp.compId) {
          return true;
        } else {
          el.links.forEach( el => document.getElementById("link-" + el.linkId)?.remove());
          document.getElementById("comp-" + fdComp.compId)?.remove();
          return false;
        }
    });
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
    min-height: 5000px;
    height: 100%;
    min-width: 5000px;
    width: 100%;
  }
</style>
