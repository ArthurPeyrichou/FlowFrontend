import * as d3 from "d3";

/**
 * Construct a line with the 4 points : [ from, q1, q3, to]
 */
export const lineFunction = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; })
    .curve(d3.curveBasis);

/**
 * Return data for a curve line from to points in the svg (source and target)
 * @param source the start of the line
 * @param target the end of the line
 */
export function getLineData(source: [number, number], target: [number, number]): Array<[number, number]>  {
    const q1: [number, number]  = [source[0] + ((target[0] - source[0]) / 4), source[1]];
    const q3: [number, number]  = [source[0] + (((target[0] - source[0]) * 3) / 4), target[1]];

    return [ source, q1, q3, target];
}


export function addLinkBeetweenTwoComponentsIntoGrid() {
    const dragLinkCompHandler = d3.drag()
        .on("drag", function () {
            //The data for our line
            const theSourceCompId: string = d3.select(this).attr("id").replace('output-','').replace('input-','').replace('text-','');
            const isSourceInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);
            
            const source: [number, number] = 
                [Number.parseInt(d3.select(this).attr("cx") ? d3.select(this).attr("cx") : d3.select(this).attr("x")) + 10, //If <text> we need to readjust the position (+10)
                Number.parseInt(d3.select(this).attr("cy") ? d3.select(this).attr("cy") : d3.select(this).attr("y")) - 4]; //If <text> we need to readjust the position (-4)
            const target: [number, number] = [Number.parseInt(d3.event.x), Number.parseInt(d3.event.y)];

            if(document.getElementById("link-" + theSourceCompId) == null) {
                //The line SVG Path we draw
                d3.select("#conception-grid-svg").append("g").attr("class", "link " + (isSourceInput?'input-':'output-') + theSourceCompId).append("path")
                    .attr("id", "link-" + theSourceCompId)
                    .datum(getLineData(source,target))
                    .attr("d", lineFunction)
                    .attr("stroke", "grey")
                    .attr("stroke-width", "3px")
                    .attr("fill", "none");

                const svg: HTMLElement | null  = document.getElementById("conception-grid-svg");
                if(svg != null) {
                    if(svg.children != null){
                        for(let i=0; i < svg.children.length; ++i){
                            const theClass: string | null = svg.children[i].getAttribute("class") 
                            if(theClass != null && theClass.includes('link')){
                                svg.insertBefore(svg.children[i], svg.firstChild);
                            }
                        }
                    }
                }
            } else {
                d3.select("#link-" + theSourceCompId)
                .datum(getLineData(source,target))
                .attr("d", lineFunction);
            }
        })
        .on("end",function(){
            //The data for our line
            const theSourceCompId = d3.select(this).attr("id").replace('output-','').replace('input-','').replace('text-','');
            const isSourceInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);
            const source: [number, number] = 
                [Number.parseInt(d3.select(this).attr("cx") ? d3.select(this).attr("cx") : d3.select(this).attr("x")) + 10, //If <text> we need to readjust the position (+10)
                Number.parseInt(d3.select(this).attr("cy") ? d3.select(this).attr("cy") : d3.select(this).attr("y")) - 4]; //If <text> we need to readjust the position (-4)

            
            let isFounded = false;
            d3.select("#conception-grid-svg").selectAll(".component-outlet")
                .each(function() {
                    const target: [number, number] = 
                    [Number.parseInt(d3.select(this).attr("cx") ? d3.select(this).attr("cx") : d3.select(this).attr("x")) + 10, //If <text> we need to readjust the position (+10)
                    Number.parseInt(d3.select(this).attr("cy") ? d3.select(this).attr("cy") : d3.select(this).attr("y")) - 4]; //If <text> we need to readjust the position (-4)

                    if( Math.abs(d3.event.x - target[0]) <= 20 &&  Math.abs(d3.event.y - target[1]) <= 20) {
                        
                        const theTargetCompId = d3.select(this).attr("id").replace('output-','').replace('input-','').replace('text-','');
                        const isTargetInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);

                        //To be able to add a new link we need to be sure that :
                        // - the target and the source is not the same component.
                        // - the connections is beetween an input and an output connector.
                        // - there is no any link who already exist between those two components.
                        if(theTargetCompId != theSourceCompId && isSourceInput != isTargetInput
                                && document.getElementById("link-" + (isSourceInput? theSourceCompId + '-to-' + theTargetCompId:theTargetCompId + '-to-' + theSourceCompId)) == null){
                            
                            isFounded = true;
                            const target: [number, number] = 
                            [Number.parseInt(d3.select(this).attr("cx") ? d3.select(this).attr("cx") : d3.select(this).attr("x")) + 10, //If <text> we need to readjust the position (+10)
                            Number.parseInt(d3.select(this).attr("cy") ? d3.select(this).attr("cy") : d3.select(this).attr("y")) - 4]; //If <text> we need to readjust the position (-4)

                            document.getElementById("link-" + theSourceCompId)?.parentElement?.setAttribute("class", "link " + (isSourceInput?'input-' + theSourceCompId + ' output-' + theTargetCompId:'input-' + theTargetCompId + ' output-' + theSourceCompId))
                            d3.select("#link-" + theSourceCompId)
                                .attr("id", "link-" + (isSourceInput? theSourceCompId + '-to-' + theTargetCompId:theTargetCompId + '-to-' + theSourceCompId))
                                .attr("class", "link-" + theSourceCompId + ' link-' + theTargetCompId)
                                .datum(getLineData(source,target))
                                .attr("d", lineFunction)
                                .attr("data-input", (isSourceInput?theSourceCompId:theTargetCompId))
                                .attr("data-output", (isSourceInput?theTargetCompId:theSourceCompId));
                        }
                    }
                });  
            if(!isFounded){
                document.getElementById("link-" + theSourceCompId)?.parentElement?.remove();
            }
        })

    dragLinkCompHandler(d3.select("#conception-grid-svg").selectAll(".component-outlet"));
}