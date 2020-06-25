<template>
  <div v-bind:class="'conception-grid ' + theme">
    <div class="header">
      <div class="reduce-button" v-on:click="toggleBar('tool')">
        <b-icon v-if="isToolBarHide" icon="chevron-bar-left"></b-icon>
        <b-icon v-else icon="chevron-bar-right"></b-icon>
      </div>
      <div class="header-content">
        <h3>Conception Grid</h3>
      </div>
      <div class="reduce-button reduce-button-right" v-on:click="toggleBar('console')">
        <b-icon v-if="isConsoleBarHide" icon="chevron-bar-right"></b-icon>
        <b-icon v-else icon="chevron-bar-left"></b-icon>
      </div>
    </div>
    <div id="conception-board" class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,5000,5000" @dragover.prevent v-on:drop="drop($event)">
        <defs>
          <pattern patternUnits="userSpaceOnUse" id="svg-grid" x="0" y="0" width="150" height="150">
            <image width="150" height="150" v-bind="{'xlink:href' : require('@/assets/conception-grid-' + theme + '.png')}"/>
          </pattern>
        </defs>
        <g class="svg-grid">
          <rect id="svg-grid-bg" x="0" y="0" width="5000" height="5000" fill="url(#svg-grid)"></rect>
        </g>
      </svg>
      <div id="zoom-tools">
        <button id="zoom-in-btn" title="Zoom in" data-exec="#designer.zoomin" v-on:click="zoomInSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-search-plus"></i>
        </button>
        <button id="reset-zoom-btn" title="Reset zoom" data-exec="#designer.zoomreset" v-on:click="zoomResetSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-balance-scale"></i>
        </button>
        <button id="zoom-out-btn" title="Zoom out" data-exec="#designer.zoomout" v-on:click="zoomOutSvg" class="btn btn-light btn-outline-dark">
          <i class="fa fa-search-minus"></i>
        </button>
      </div>
    </div>
    <CompSettingModal ref="myCompSettingModal" :fdComponent="currentFDComp" :deleteTheComp="deleteTheComp" />
  </div>
</template>

<script lang="ts">
  import * as d3 from "d3";
  import CompSettingModal from '@/components/conception/CompSettingModal.vue'
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FDComponent } from '../../models/FDComponent';
  import { addComponentIntoGrid } from "../../services/gridServices/addComponent";
  import { addLinkBeetweenTwoComponentsIntoGrid } from "../../services/gridServices/addLink";

  @Component({
    components: {
      CompSettingModal
    }
  })
  export default class ConceptionGrid extends Vue {
    @Prop({default: "dark"}) public theme!: string;
    private fdCompToDrop: FDComponent | undefined = undefined;
    private currentFDComp: {component: FDComponent; compId: string; links: Array<{linkId: string; compId: string; fromOutput: string; toInput: string}>};
    private componentList: Array<{component: FDComponent; compId: string; links: Array<{linkId: string; compId: string; fromOutput: string; toInput: string}>}> = [];
    private idList: Array<string> = [];
    private svgScale = 1;

    private hideToolBar = false;
    private hideConsoleBar = false;

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
        if(event.dataTransfer != null && event.dataTransfer != undefined) { 
          try {
            this.fdCompToDrop = FDComponent.fromString(event.dataTransfer.getData("text"));
          } catch(error) {
            //Can be call if a already dropped component is moove in svg. 
            //Or if we try to link two component and cancel. 
            //Or drag and drop an element which should not be dropped here
            //console.log(error)
          }
        }
    }

    /**
     * Make a random string
     * @param lenght the lenght wish
     * @return a random string
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
      const actualize = (mouse: [number, number]) => {
        if(this.fdCompToDrop != undefined) {
          addComponentIntoGrid(mouse, this.fdCompToDrop, this.registerComponent, this.openSettingModal);
          addLinkBeetweenTwoComponentsIntoGrid(this.registerLink);
          this.fdCompToDrop = undefined;
        }
      }

      d3.select("#svg-grid-bg").on("mousemove", function () {
         // eslint-disable-next-line
        actualize(d3.mouse(this as any));
      })

      //This part allows the conception grid positioning by drag and drop
      const svgBoard = document.getElementById('conception-board');
      if(svgBoard != null){
        let isDown = false;
        let startX: number;
        let scrollLeft: number;
        let startY: number;
        let scrollTop: number;
        svgBoard.addEventListener('mousedown', (e) => {
          isDown = true;
          svgBoard.classList.add('active');
          startX = e.pageX - svgBoard.offsetLeft;
          scrollLeft = svgBoard.scrollLeft;
          startY = e.pageY - svgBoard.offsetTop;
          scrollTop = svgBoard.scrollTop;
        });
        svgBoard.addEventListener('mouseleave', () => {
          isDown = false;
          svgBoard.classList.remove('active');
        });
        svgBoard.addEventListener('mouseup', () => {
          isDown = false;
          svgBoard.classList.remove('active');
        });
        svgBoard.addEventListener('mousemove', (e) => {
          if(!isDown) return;
          e.preventDefault();
          const x = e.pageX - svgBoard.offsetLeft;
          const walkX = (x - startX) * 2; //scroll faster
          svgBoard.scrollLeft = scrollLeft - walkX;
          const y = e.pageY - svgBoard.offsetTop;
          const walkY = (y - startY) * 2; //scroll faster
          svgBoard.scrollTop = scrollTop - walkY;
        });
      }
    }

    public zoomInSvg(){
      if(this.svgScale < 2) {
        this.svgScale += 0.1;
        d3.select("#conception-grid-svg").selectAll("g").attr("transform", "scale(" + this.svgScale.toFixed(1) + ")")
      }
    }

    public zoomResetSvg(){
      if(this.svgScale != 1) {
        this.svgScale = 1;
        d3.select("#conception-grid-svg").selectAll("g").attr("transform", "scale(" + this.svgScale.toFixed(1) + ")")
      }
    }

    public zoomOutSvg(){
      if(this.svgScale > 0.2) {
        this.svgScale -= 0.1;
        d3.select("#conception-grid-svg").selectAll("g").attr("transform", "scale(" + this.svgScale.toFixed(1) + ")")
      }
    }

    /**
     * Call by addComponentIntoGrid() when a comp is drop into grid.
     * @param comp the flowdata component to add in svg
     * @return a new string identifiant generate with makeId()
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
     * @param outputCompId the component source
     * @param inputCompId the component target
     * @return a new string identifiant generate with makeId()
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
     * @param compId the id of the component 
     */
    public openSettingModal(compId: string) {
      this.currentFDComp = this.componentList.filter(el => el.compId == compId)[0];
      this.$children[0].$bvModal.show("modal-edit-component")
    }

    /**
     * Call by CompSettingModal, delete the component and all links related from the Array and the screen.
     * @param fdComp the component to delete
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

    /**
     * Toggle bar visibility, use for console-bar and tool-bar
     * @param barName the id's prefix of the bar's div
     */
    public toggleBar(barName: string) {
      const element: HTMLElement | null = document.getElementById(barName + "-bar");
      if(element != null) {
        const isHide = element.className.includes(' hide');
        if(isHide){
          element.className = element.className.replace(" hide", '');
        } else {
          element.className += " hide";
        }
        switch(barName){
          case "tool":
            this.hideToolBar = isHide;
            break;
          case "console":
            this.hideConsoleBar = isHide;
        }
      }
    }

    get isToolBarHide(){
      return this.hideToolBar;
    }

    get isConsoleBarHide() {
      return this.hideConsoleBar;
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .conception-grid {
    background-color: #c8c8c8;
    height: 100%;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
    padding-bottom: 50px;
  }
  .header {
    background-color: #b8b8b8;
    height: 50px;
    width: 100%;
    max-width: 100%;
    display: flex;
  }
  .header-content {
    width: inherit;
  }
  .reduce-button {
    height: 50px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: gray;
    width: 25px;
    padding-top: 10px;
    background-color: #c8c8c8;
    margin-right: 10px;
    cursor: pointer;
  }
  .reduce-button-right {
    float: right;
    margin-right: 0px;
    margin-left: 10px;
  }
  .board {
    overflow: scroll;
    height: 100%;
    cursor: move;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
  .board.active {
    cursor: grabbing;
  }
  .grid {
    min-height: 5000px;
    height: 100%;
    min-width: 5000px;
    width: 100%;
  }
  #zoom-tools {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  #zoom-tools button {
    width: 30px;
    height: 30px;
    padding: initial;
    margin-left: 1px;
    margin-right: 1px;
  }

  /* Dark side */
  .dark.conception-grid {
    background-color: #202020;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .header {
    background-color: #101010;
    color: white;
  }
  .dark .board {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .reduce-button {
    background-color: #303030;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
