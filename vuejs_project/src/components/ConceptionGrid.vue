<template>
  <div class="conception-grid">
    <div class="header container">
    <h3>Conception Grid</h3>
    </div>
    <div class="board">
      <svg id="conception-grid-svg" class="grid" viewBox="0,0,5000,5000" @dragover.prevent v-on:drop="drop($event)">
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
  private componentList: Array<string> = [];

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

  private makeId(length: number): string {
    let result= '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private initSvg() {
    const addComp = (x: number, y: number) =>  {
      if(this.fdCompToDrop !== undefined) {
        const compHeight = 60;
        const compWidth = 115 + this.fdCompToDrop.getTitle().length * 10;
        const svgGridBorder = 10;
        const svgMax = 5000;
        
        let newId = this.makeId(10);
        while(this.componentList.includes(newId)){
          newId = this.makeId(10);
        }

        const g = d3.select("#conception-grid-svg")
          .append("g")
          .attr("id", "comp-" + newId)
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr("style", "cursor:pointer;");
        
        g.append("rect")
          .attr("id", "rect-" + newId)
          .attr("fill", this.fdCompToDrop.getColor())
          .attr("height", compHeight)
          .attr("width", compWidth)
          .attr("rx",5)
          .attr("x", () => {
            if(x < (svgGridBorder + (compWidth / 2))){
              return 10;
            } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
              return svgMax - svgGridBorder - compWidth;
            }
            return x - (compWidth / 2);
          })
          .attr("y", () => { 
            if(y < (svgGridBorder + (compHeight / 2))){
              return svgGridBorder;
            } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
              return svgMax - svgGridBorder - compHeight;
            }
            return y - (compHeight / 2);
          });

        g.append("text")
          .attr("id", "title-text-" + newId)
          .attr("fill", "black")
          .html(this.fdCompToDrop.getTitle())
          .attr("x", () => {
            if(x < (svgGridBorder + (compWidth / 2))){
              return svgGridBorder + 95;
            } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
              return svgMax + 95 - svgGridBorder - compWidth;
            }
            return x - (compWidth / 2) + 95;
          })
          .attr("y", () => { 
            if(y < (svgGridBorder + (compHeight / 2))){
              return svgGridBorder - 5 + (compHeight / 2);
            } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
              return svgMax - 5 - svgGridBorder - (compHeight / 2);
            }
            return y - 5;
          });

        if(this.fdCompToDrop.getInput() > 0) {
          g.append("circle")
            .attr("id", "input-" + newId)
            .attr("r", 10)
            .attr("fill", "white")
            .attr("cx", () => {
              if(x < (svgGridBorder + (compWidth / 2))){
                return svgGridBorder;
              } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
                return svgMax - svgGridBorder - compWidth;
              }
              return x - (compWidth / 2);
            })
            .attr("cy", () => { 
              if(y < (svgGridBorder + (compHeight / 2))){
                return svgGridBorder + (compHeight / 2);
              } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
                return svgMax - svgGridBorder - (compHeight / 2);
              }
              return y;
            });

          g.append("text")
            .attr("id", "input-text-" + newId)
            .attr("fill", "black")
            .html(this.fdCompToDrop.getInput())
            .attr("x", () => {
              if(x < (svgGridBorder + (compWidth / 2))){
                return svgGridBorder - 5;
              } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
                return svgMax - 5 - svgGridBorder - compWidth;
              }
              return x - 5 - (compWidth / 2);
            })
            .attr("y", () => { 
              if(y < (svgGridBorder + (compHeight / 2))){
                return svgGridBorder + 5 + (compHeight / 2);
              } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
                return svgMax + 5 - svgGridBorder - (compHeight / 2);
              }
              return y + 5;
            });
        }
        if(this.fdCompToDrop.getOutput() > 0) {
          g.append("circle")
            .attr("id", "output-" + newId)
            .attr("r", 10)
            .attr("fill", "white")
            .attr("cx", () => {
              if(x < (svgGridBorder + (compWidth / 2))){
                return svgGridBorder + compWidth;
              } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
                return svgMax - svgGridBorder;
              }
              return x + (compWidth / 2);
            })
            .attr("cy", () => { 
              if(y < (svgGridBorder + (compHeight / 2))){
                return svgGridBorder + (compHeight / 2);
              } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
                return svgMax - svgGridBorder - (compHeight / 2);
              }
              return y;
            });

          g.append("text")
            .attr("id", "output-text-" + newId)
            .attr("fill", "black")
            .html(this.fdCompToDrop.getOutput())
            .attr("x", () => {
              if(x < (svgGridBorder + (compWidth / 2))){
                return svgGridBorder - 5 + compWidth;
              } else if(x > (svgMax - svgGridBorder - (compWidth / 2))){
                return svgMax - 5 - svgGridBorder;
              }
              return x - 5 + (compWidth / 2);
            })
            .attr("y", () => { 
              if(y < (svgGridBorder + (compHeight / 2))){
                return svgGridBorder + 5 + (compHeight / 2);
              } else if(y > (svgMax - svgGridBorder - (compHeight / 2))){
                return svgMax + 5 - svgGridBorder - (compHeight / 2);
              }
              return y + 5;
            });
        }
        
        const dragHandler = d3.drag()
            .on("drag", function () {
                const theCompWidth = Number.parseInt(d3.select(this).attr("width"));
                const theCompHeight = Number.parseInt(d3.select(this).attr("height"));
                d3.select(this)
                  .attr("x", () => {
                    if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                      return 10;
                    } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                      return svgMax - svgGridBorder - theCompWidth;
                    }
                    return d3.event.x - (theCompWidth / 2);
                  })
                  .attr("y", () => { 
                    if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                      return svgGridBorder;
                    } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                      return svgMax - svgGridBorder - theCompHeight;
                    }
                    return d3.event.y - (theCompHeight / 2);
                  });
                const theCompId = d3.select(this).attr("id").replace('rect-','');
                d3.select('#title-text-'+ theCompId)
                  .attr("x", () => {
                    if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                      return svgGridBorder + 95;
                    } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                      return svgMax + 95 - svgGridBorder - theCompWidth;
                    }
                    return d3.event.x - (theCompWidth / 2) + 95;
                  })
                  .attr("y", () => { 
                    if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                      return svgGridBorder - 5 + (theCompHeight / 2);
                    } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                      return svgMax - 5 - svgGridBorder - (theCompHeight / 2);
                    }
                    return d3.event.y - 5;
                  });
                d3.select('#input-'+ theCompId)
                  .attr("cx", () => {
                    if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                      return svgGridBorder;
                    } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                      return svgMax - svgGridBorder - theCompWidth;
                    }
                    return d3.event.x - (theCompWidth / 2);
                  })
                  .attr("cy", () => { 
                    if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                      return svgGridBorder + (theCompHeight / 2);
                    } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                      return svgMax - svgGridBorder - (theCompHeight / 2);
                    }
                    return d3.event.y;
                  });
                d3.select('#output-'+ theCompId)
                .attr("cx", () => {
                  if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                    return svgGridBorder + theCompWidth;
                  } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                    return svgMax - svgGridBorder;
                  }
                  return d3.event.x + (theCompWidth / 2);
                })
                .attr("cy", () => { 
                  if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                    return svgGridBorder + (theCompHeight / 2);
                  } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                    return svgMax - svgGridBorder - (theCompHeight / 2);
                  }
                  return d3.event.y;
                });

                d3.select('#input-text-'+ theCompId)
                  .attr("x", () => {
                    if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                      return svgGridBorder - 5;
                    } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                      return svgMax - 5 - svgGridBorder - theCompWidth;
                    }
                    return d3.event.x - 5 - (theCompWidth / 2);
                  })
                  .attr("y", () => { 
                    if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                      return svgGridBorder + 5 + (theCompHeight / 2);
                    } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                      return svgMax + 5 - svgGridBorder - (theCompHeight / 2);
                    }
                    return d3.event.y + 5;
                  });
                d3.select('#output-text-'+ theCompId)
                .attr("x", () => {
                  if(d3.event.x < (svgGridBorder + (theCompWidth / 2))){
                    return svgGridBorder - 5 + theCompWidth;
                  } else if(d3.event.x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                    return svgMax - 5 - svgGridBorder;
                  }
                  return d3.event.x - 5 + (theCompWidth / 2);
                })
                .attr("y", () => { 
                  if(d3.event.y < (svgGridBorder + (theCompHeight / 2))){
                    return svgGridBorder + 5 + (theCompHeight / 2);
                  } else if(d3.event.y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                    return svgMax + 5 - svgGridBorder - (theCompHeight / 2);
                  }
                  return d3.event.y + 5;
                });
            });

        dragHandler(d3.select("#conception-grid-svg").selectAll("rect"));
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
    min-height: 5000px;
    height: 100%;
    min-width: 5000px;
    width: 100%;
  }
</style>
