import * as d3 from "d3";
import { FDComponent } from '../../models/FDComponent';

export function addComponentIntoGrid(fdCompToDrop: FDComponent | undefined, newId: string) {
    if(fdCompToDrop !== undefined) {
      const x = d3.mouse(d3.event.currentTarget)[0];
      const y = d3.mouse(d3.event.currentTarget)[1];
      const compHeight = 40;
      const compWidth = 75 + fdCompToDrop.getTitle().length * 9;
      const svgGridBorder = 10;
      const svgMax = 5000;
      
      const g = d3.select("#conception-grid-svg")
        .append("g")
        .attr("id", "comp-" + newId)
        .attr("stroke-width", 1.5)
        .attr("style", "cursor:pointer;");
  
      const rectPlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return 10;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax - svgGridBorder - theCompWidth;
        }
        return x - (theCompWidth / 2);
      }
      const rectPlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder;
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax - svgGridBorder - theCompHeight;
        }
        return y - (theCompHeight / 2);
      }
      const titlePlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder + 65;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax + 65 - svgGridBorder - theCompWidth;
        }
        return x - (theCompWidth / 2) + 65;
      }
      const titlePlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder - 3 + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax - 3 - svgGridBorder - (theCompHeight / 2);
        }
        return y - 3;
      }
      const typePlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder + 65;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax + 65 - svgGridBorder - theCompWidth;
        }
        return x - (theCompWidth / 2) + 65;
      }
      const typePlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder + 13 + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax + 13 - svgGridBorder - (theCompHeight / 2);
        }
        return y + 13;
      }
      const inputCirclePlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax - svgGridBorder - theCompWidth;
        }
        return x - (theCompWidth / 2);
      }
      const inputCirclePlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax - svgGridBorder - (theCompHeight / 2);
        }
        return y;
      }
      const inputTextPlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder - 5;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax - 5 - svgGridBorder - theCompWidth;
        }
        return x - 5 - (theCompWidth / 2);
      }
      const inputTextPlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder + 4 + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax + 4 - svgGridBorder - (theCompHeight / 2);
        }
        return y + 4;
      }
      const outputCirclePlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder + theCompWidth;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax - svgGridBorder;
        }
        return x + (theCompWidth / 2);
      }
      const outputCirclePlaceY = (y: number, theCompHeight: number) => { 
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax - svgGridBorder - (theCompHeight / 2);
        }
        return y;
      }
      const outputTextPlaceX = (x: number, theCompWidth: number) => {
        if(x < (svgGridBorder + (theCompWidth / 2))){
          return svgGridBorder - 4 + theCompWidth;
        } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
          return svgMax - 4 - svgGridBorder;
        }
        return x - 4 + (theCompWidth / 2);
      }
      const outputTextPlaceY = (y: number, theCompHeight: number) => {
        if(y < (svgGridBorder + (theCompHeight / 2))){
          return svgGridBorder + 5 + (theCompHeight / 2);
        } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
          return svgMax + 5 - svgGridBorder - (theCompHeight / 2);
        }
        return y + 5;
      }
      
      g.append("rect")
        .attr("id", "rect-" + newId)
        .attr("stroke", "black")
        .attr("fill", fdCompToDrop.getColor())
        .attr("height", compHeight)
        .attr("width", compWidth)
        .attr("rx",5)
        .attr("x", rectPlaceX(x, compWidth))
        .attr("y", rectPlaceY(y, compHeight))
        .on("click", () => {
          //this.$bvModal.show("modal-edit-component") 
        });
  
      g.append("text")
        .attr("id", "title-text-" + newId)
        .attr("fill", "black")
        .style("font-size", "14px")
        .html(fdCompToDrop.getTitle())
        .attr("x", titlePlaceX(x, compWidth))
        .attr("y", titlePlaceY(y, compHeight))
        .on("click", () => {
          //this.$bvModal.show("modal-edit-component") 
        });
      
      g.append("text")
        .attr("id", "type-text-" + newId)
        .attr("fill", "black")
        .style("font-size", "12px")
        .html(fdCompToDrop.getTitle())
        .attr("x", typePlaceX(x, compWidth))
        .attr("y", typePlaceY(y, compHeight))
        .on("click", () => {
          //this.$bvModal.show("modal-edit-component") 
        });
  
      if(fdCompToDrop.getInput() > 0) {
        g.append("circle")
          .attr("id", "input-" + newId)
          .attr("class", "component-outlet connector")
          .attr("r", 10)
          .attr("stroke", "black")
          .attr("fill", "white")
          .attr("cx", inputCirclePlaceX(x, compWidth))
          .attr("cy", inputCirclePlaceY(y, compHeight));
  
        g.append("text")
          .attr("id", "input-text-" + newId)
          .attr("class", "component-outlet")
          .attr("fill", "black")
          .style("font-size", "14px")
          .html(fdCompToDrop.getInput().toString())
          .attr("x", inputTextPlaceX(x, compWidth))
          .attr("y", inputTextPlaceY(y, compHeight));
      }
      if(fdCompToDrop.getOutput() > 0) {
        g.append("circle")
          .attr("id", "output-" + newId)
          .attr("class", "component-outlet connector")
          .attr("r", 10)
          .attr("stroke", "black")
          .attr("fill", "white")
          .attr("cx", outputCirclePlaceX(x, compWidth))
          .attr("cy", outputCirclePlaceY(y, compHeight));
  
        g.append("text")
          .attr("id", "output-text-" + newId)
          .attr("class", "component-outlet")
          .attr("fill", "black")
          .style("font-size", "14px")
          .html(fdCompToDrop.getOutput().toString())
          .attr("x", outputTextPlaceX(x, compWidth))
          .attr("y", outputTextPlaceY(y, compHeight));
      }
      
      const dragCompHandler = d3.drag()
          .on("start",function(){
            //With this code we re-order components in order to make the draged component above the others.
            const theCompId = d3.select(this).attr("id").replace('rect-','');
            const svg: HTMLElement | null  = document.getElementById("conception-grid-svg");
            if(svg != null) {
              if(svg.children != null){
                for(let i=0; i < svg.children.length; ++i){
                  if(svg.children[i].getAttribute("class") != 'link' && svg.children[i].getAttribute("id") != 'comp-' + theCompId){
                    svg.insertBefore(svg.children[i], document.getElementById('comp-' + theCompId));
                  }
                }
              }
            }
          })
          .on("drag", function () {
              const theCompWidth = Number.parseInt(d3.select(this).attr("width"));
              const theCompHeight = Number.parseInt(d3.select(this).attr("height"));
              d3.select(this)
                .style("opacity", 0.5)
                .attr("x", rectPlaceX(d3.event.x, theCompWidth))
                .attr("y", rectPlaceY(d3.event.y, theCompHeight));
  
              const theCompId = d3.select(this).attr("id").replace('rect-','');
  
              d3.select('#title-text-'+ theCompId)
                .attr("x", titlePlaceX(d3.event.x, theCompWidth))
                .attr("y", titlePlaceY(d3.event.y, theCompHeight));
  
              d3.select('#type-text-'+ theCompId)
                .attr("x", typePlaceX(d3.event.x, theCompWidth))
                .attr("y", typePlaceY(d3.event.y, theCompHeight));
  
              d3.select('#input-'+ theCompId)
                .attr("cx", inputCirclePlaceX(d3.event.x, theCompWidth))
                .attr("cy", inputCirclePlaceY(d3.event.y, theCompHeight));
  
              d3.select('#output-'+ theCompId)
                .attr("cx", outputCirclePlaceX(d3.event.x, theCompWidth))
                .attr("cy", outputCirclePlaceY(d3.event.y, theCompHeight));
  
              d3.select('#input-text-'+ theCompId)
                .attr("x", inputTextPlaceX(d3.event.x, theCompWidth))
                .attr("y", inputTextPlaceY(d3.event.y, theCompHeight));
  
              d3.select('#output-text-'+ theCompId)
                .attr("x", outputTextPlaceX(d3.event.x, theCompWidth))
                .attr("y", outputTextPlaceY(d3.event.y, theCompHeight));
          })
          .on("end",function(){
            d3.select(this).style("opacity", 1)
          });
  
      dragCompHandler(d3.select("#conception-grid-svg").selectAll("rect"));
    }
  }