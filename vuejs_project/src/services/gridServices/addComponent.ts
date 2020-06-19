import * as d3 from "d3";
import { lineFunction, getLineData } from "../gridServices/addLink";
import { FDComponent } from '../../models/FDComponent';

export function addComponentIntoGrid(fdCompToDrop: FDComponent | undefined, registerComponent: Function, openModal: Function) {
    if(fdCompToDrop !== undefined) {
        const x = d3.mouse(d3.event.currentTarget)[0];
        const y = d3.mouse(d3.event.currentTarget)[1];
        const inputCount = fdCompToDrop.getInput();
        const outputCount = fdCompToDrop.getOutput();
        const compHeight = 25 + Math.max(inputCount, outputCount) * 15;
        const compWidth = 75 + fdCompToDrop.getTitle().length * 9;
        const svgGridBorder = 10;
        const svgMax = 5000;
        const newId = registerComponent(fdCompToDrop);
        
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
        const inputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => {
            if(y < (svgGridBorder + (theCompHeight / 2))){
                return svgGridBorder + (theCompHeight / 2) + (index * 20) - (count-1) * 10;
            } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                return svgMax - svgGridBorder - (theCompHeight / 2) + (index * 20) - (count-1) * 10;
            }
            return y + (index * 20) - (count-1) * 10;
        }
        const outputCirclePlaceX = (x: number, theCompWidth: number) => {
            if(x < (svgGridBorder + (theCompWidth / 2))){
                return svgGridBorder + theCompWidth;
            } else if(x > (svgMax - svgGridBorder - (theCompWidth / 2))){
                return svgMax - svgGridBorder;
            }
            return x + (theCompWidth / 2);
        }
        const outputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => { 
            if(y < (svgGridBorder + (theCompHeight / 2))){
                return svgGridBorder + (theCompHeight / 2) + (index * 20) - (count-1) * 10;
            } else if(y > (svgMax - svgGridBorder - (theCompHeight / 2))){
                return svgMax - svgGridBorder - (theCompHeight / 2) + (index * 20) - (count-1) * 10;
            }
            return y + (index * 20) - (count-1) * 10;
        }
        
        g.append("rect")
            .attr("id", "rect-" + newId)
            .attr("class", "draggable")
            .attr("stroke", "black")
            .attr("fill", fdCompToDrop.getColor())
            .attr("height", compHeight)
            .attr("width", compWidth)
            .attr("data-input", inputCount)
            .attr("data-output", outputCount)
            .attr("rx",5)
            .attr("x", rectPlaceX(x, compWidth))
            .attr("y", rectPlaceY(y, compHeight))
            .on("click", () => {
                openModal(newId);
            });

        g.append("text")
            .attr("id", "title-text-" + newId)
            .attr("class", "draggable unselectable-text")
            .attr("fill", "black")
            .style("font-size", "14px")
            .html(fdCompToDrop.getTitle())
            .attr("x", titlePlaceX(x, compWidth))
            .attr("y", titlePlaceY(y, compHeight))
            .on("click", () => {
                openModal(newId);
            });
        
        g.append("text")
            .attr("id", "type-text-" + newId)
            .attr("class", "draggable unselectable-text")
            .attr("fill", "black")
            .style("font-size", "12px")
            .html(fdCompToDrop.getTitle())
            .attr("x", typePlaceX(x, compWidth))
            .attr("y", typePlaceY(y, compHeight))
            .on("click", () => {
                openModal(newId);
            });

        for(let i =0; i < inputCount; ++i) {
            g.append("circle")
                .attr("id", "input-" + i + "-" + newId)
                .attr("class", "component-outlet connector input-" + newId)
                .attr("r", 7)
                .attr("stroke", "black")
                .attr("fill", "white")
                .attr("data-index", i)
                .attr("cx", inputCirclePlaceX(x, compWidth))
                .attr("cy", inputCirclePlaceY(y, compHeight, i, inputCount));
        }
        for(let i =0; i < outputCount; ++i) {
            g.append("circle")
                .attr("id", "output-" + i + "-" + newId)
                .attr("class", "component-outlet connector output-" + newId)
                .attr("r", 7)
                .attr("stroke", "black")
                .attr("fill", "white")
                .attr("data-index", i)
                .attr("cx", outputCirclePlaceX(x, compWidth))
                .attr("cy", outputCirclePlaceY(y, compHeight, i, outputCount));
        }
        
        
        const dragCompHandler = d3.drag()
            .on("drag", function () {
                const theCompId = d3.select(this).attr("id").replace('rect-','').replace('title-text-','').replace('type-text-','');
                const theCompWidth = Number.parseInt(d3.select("#rect-" + theCompId).attr("width"));
                const theCompHeight = Number.parseInt(d3.select("#rect-" + theCompId).attr("height"));
                const theCompInputCount = Number.parseInt(d3.select("#rect-" + theCompId).attr("data-input"));
                const theCompOutputCount = Number.parseInt(d3.select("#rect-" + theCompId).attr("data-output"));

                const svg: HTMLElement | null  = document.getElementById("conception-grid-svg");
                if(svg?.lastElementChild?.getAttribute("id") != "comp-" + theCompId){
                    d3.select('#comp-' + theCompId).raise(); 
                }

                d3.select("#rect-" + theCompId)
                    .style("opacity", 0.5)
                    .attr("x", rectPlaceX(d3.event.x, theCompWidth))
                    .attr("y", rectPlaceY(d3.event.y, theCompHeight));


                d3.select('#title-text-'+ theCompId)
                    .attr("x", titlePlaceX(d3.event.x, theCompWidth))
                    .attr("y", titlePlaceY(d3.event.y, theCompHeight));

                d3.select('#type-text-'+ theCompId)
                    .attr("x", typePlaceX(d3.event.x, theCompWidth))
                    .attr("y", typePlaceY(d3.event.y, theCompHeight));

                for(let i =0; i < theCompInputCount; ++i) {
                    d3.select('#input-'+ i + "-" + theCompId)
                        .attr("cx", inputCirclePlaceX(d3.event.x, theCompWidth))
                        .attr("cy", inputCirclePlaceY(d3.event.y, theCompHeight, i, theCompInputCount));
                }

                for(let i =0; i < theCompOutputCount; ++i) {
                    d3.select('#output-'+ i + "-" + theCompId)
                        .attr("cx", outputCirclePlaceX(d3.event.x, theCompWidth))
                        .attr("cy", outputCirclePlaceY(d3.event.y, theCompHeight, i, theCompOutputCount));
                }

                
                d3.selectAll('.link-' + theCompId).each(function() {
                    const input = d3.select(this).attr("data-input");
                    const output = d3.select(this).attr("data-output");
                    const source: [number, number] = 
                        [Number.parseInt(d3.select('#output-' + output).attr("cx")) , 
                        Number.parseInt(d3.select('#output-' + output).attr("cy")) ]; 
                    const target: [number, number] = 
                        [Number.parseInt(d3.select('#input-' + input).attr("cx")) , 
                        Number.parseInt(d3.select('#input-' + input).attr("cy")) ]; 

                    d3.select(this)
                        .datum(getLineData(source,target))
                        .attr("d", lineFunction)
                });
                
                
            })
            .on("end",function(){
                d3.selectAll("rect").style("opacity", 1)
            });

        dragCompHandler(d3.select("#conception-grid-svg").selectAll(".draggable"));
    }
  }