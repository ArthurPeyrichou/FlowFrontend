<template>
  <div class="conception-grid">
    <div class="header container">
    <h3>Conception Grid</h3>
    </div>
    <div class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,5000,5000" @dragover.prevent v-on:drop="drop($event)">
      </svg>
    </div>
    <b-button v-b-modal.modal-edit-component>Edit Component</b-button>

    <b-modal id="modal-edit-component">
      <template v-slot:modal-title>
        Settings:
      </template>
      <p class="my-4">Hello from modal!</p>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { FDComponent } from '../models/FDComponent';
import * as d3 from "d3";
import { addComponentIntoGrid } from "../services/gridServices/addComponent";
import { addLinkBeetweenTwoComponentsIntoGrid } from "../services/gridServices/addLink";

// register modal component
Vue.component("modal", {
  template: "#modal-template"
});

@Component
export default class ConceptionGrid extends Vue {
  // eslint-disable-next-line to ignore the next line.
  private fdCompToDrop: any = undefined;
  private componentList: Array<string> = [];
  //public currentComponent:any = undefined;

  constructor() {
    super();
    //Tthis way we execute the code after the redering of the template
    this.$nextTick( () => {this.initSvg();});
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
          let newId = this.makeId(10);
          while(this.componentList.includes(newId)){
            newId = this.makeId(10);
          }
          addComponentIntoGrid(this.fdCompToDrop, newId);
          addLinkBeetweenTwoComponentsIntoGrid();
          this.fdCompToDrop = undefined;
        }
    }

    d3.select("#conception-grid-svg")
      .on("mousemove", function () {
        actualize();
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
