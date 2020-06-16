<template>
  <div class="conception-grid">
    <div class="header container">
    <h3>Conception Grid</h3>
    </div>
    <div class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,1000,1000" @dragover.prevent v-on:drop="drop($event)">
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { FDComponent } from '../models/FDComponent';
import * as d3 from "d3";

@Component
export default class ConceptionGrid extends Vue {
  // eslint-disable-next-line to ignore the next line.
  private fdCompToDrop: any = undefined;

  constructor() {
    super();
    //Tthis way we execute the code after the redering of the template
    this.$nextTick( () => {this.initSvg();});
  }

  /**
   * Call when a flowdata component is drop inside the <svg>
   */
  public drop(event: DragEvent) {
      console.log("drop")
      if(event.dataTransfer != null && event.dataTransfer != undefined){
        this.fdCompToDrop = FDComponent.fromString(event.dataTransfer.getData("text"));
      }
  }

  private initSvg() {
    const addComp = (x: number, y: number) =>  {
      if(this.fdCompToDrop !== undefined) {
        d3.select("#conception-grid-svg")
          .append("g")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr("style", "cursor:pointer;")
          .append("circle")
          .attr("r", 5)
          .attr("fill", this.fdCompToDrop.getColor())
          .attr("cx", () => {
            if(x < 10){
              return 10;
            } else if(x > 990){
              return 990;
            }
            return x
          })
          .attr("cy", () => { 
            if(y < 10){
              return 10;
            } else if(y > 990){
              return 990;
            }
            return y
          });
          
        const dragHandler = d3.drag()
            .on("drag", function () {
                d3.select(this)
                    .attr("cx", () => {
                      if(d3.event.x < 10){
                        return 10;
                      } else if(d3.event.x > 990){
                        return 990;
                      }
                      return d3.event.x})
                    .attr("cy", () => { 
                      if(d3.event.y < 10){
                        return 10;
                      } else if(d3.event.y > 990){
                        return 990;
                      }
                      return d3.event.y})
            });

        dragHandler(d3.select("#conception-grid-svg").selectAll("circle"));
        this.fdCompToDrop = undefined;
      }
    };
    
    d3.select("#conception-grid-svg")
      .on("mousemove", function () {
        const target = d3.mouse(d3.event.currentTarget);
        addComp(target[0], target[1]);
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
    min-height: 1000px;
    height: 100%;
    min-width: 1000px;
    width: 100%;
  }
</style>
