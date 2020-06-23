import * as d3 from "d3";

/**
 * Construct a line with the 4 points : [ from, q1, q3, to]
 */
export const lineFunction = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; })
    .curve(d3.curveBasis);


/**
 * When two component are aligned in y plan and there are linked 
 * We wannt to avoid a cross line (if the ouput component is more on the right and the input component more on the left)
 * @param source 
 * @param sourceRect 
 * @param targetRect 
 * @param target 
 */
function isCrossLine(source: [number, number], target: [number, number], isSourceInput: boolean): boolean {
    return (isSourceInput && (source[0] < target[0])) || (!isSourceInput && (source[0] > target[0]));
}

/**
 * Return data for a curve line from to points in the svg (source and target)
 * @param source the start of the line
 * @param target the end of the line
 */
export function getLineData(source: [number, number], target: [number, number], isSourceInput: boolean): Array<[number, number]>  {
    const isACrossLine = isCrossLine(source, target, isSourceInput);
    let q1: [number, number];
    let q3: [number, number];
    if(isACrossLine){
        q1 = [source[0] + ((source[0] - target[0]) / 4 * 1.5), source[1] - ((source[1] - target[1]) / 4 * 1.5 )];
        q3 = [target[0] - ((source[0] - target[0]) / 4 * 1.5), target[1] + ((source[1] - target[1]) / 4 * 1.5 )];    
    } else {
        q1 = [source[0] + ((target[0] - source[0]) / 4), source[1]];
        q3 = [source[0] + (((target[0] - source[0]) * 3) / 4), target[1]];
    }
    return [ source, q1, q3, target];
}

/**
 * Select all connectors of "#conception-grid-svg" and sets drag&drop listeners for links creation
 * @param registerLink function who register the link in component's links of ConceptionGrid's Vue and return his unique id
 */
export function addLinkBeetweenTwoComponentsIntoGrid(registerLink: Function) {
    const dragLinkCompHandler = d3.drag()
        .on("drag", function () {
            //The data for our line
            const theSourceCompId: string = d3.select(this).attr("id").replace('output-','').replace('input-','');
            const isSourceInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);
            
            const source: [number, number] = [Number.parseInt(d3.select(this).attr("cx")), Number.parseInt(d3.select(this).attr("cy"))];
            const target: [number, number] = [Number.parseInt(d3.event.x), Number.parseInt(d3.event.y)];

            //Look if a temp <g><path/></g> already exist
            if(document.getElementById("link-" + theSourceCompId) == null) {
                //The line SVG Path we draw
                const path = d3.select("#conception-grid-svg").append("g")
                    .attr("class", "link " + (isSourceInput?'input-':'output-') + theSourceCompId)       
                    .attr("transform",d3.select("#conception-grid-svg").select("g").attr("transform"))
                    .append("path")
                    .attr("id", "link-" + theSourceCompId)
                    .datum(getLineData(source,target, isSourceInput))
                    .attr("d", lineFunction)
                    .attr("stroke", "grey")
                    .attr("stroke-width", "3px")
                    .attr("fill", "none")
                    .style("cursor","pointer");
                path.on("mouseover", () => {
                    path.attr("stroke-width", "5px")
                })
                path.on("mouseout", () => {
                    path.attr("stroke-width", "3px")
                })
                path.on("click", () => {
                    d3.selectAll(".link-path").attr("stroke", "grey")
                    path.attr("stroke", "gold")
                });

                const svg: HTMLElement | null  = document.getElementById("conception-grid-svg");
                if(svg != null) {
                    if(svg.children != null){
                        for(let i=0; i < svg.children.length; ++i){
                            const theClass: string | null = svg.children[i].getAttribute("class") 
                            if(theClass != null && theClass.includes('link')){
                                svg.insertBefore(svg.children[i], svg.children[2]); //2 because 0 is defs and 1 is svggridbg
                            }
                        }
                    }
                }
            } else { //If a temp <g><path/></g> already exist we just edit the line positions.
                d3.select("#link-" + theSourceCompId)
                .datum(getLineData(source,target, isSourceInput))
                .attr("d", lineFunction);
            }
        })
        .on("end",function(){
            //The data for our line
            const theSourceCompId = d3.select(this).attr("id").replace('output-','').replace('input-','').replace('text-','');
            const isSourceInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);
            const theSourceCirle = d3.select('#' + d3.select(this).attr("id").replace('text-',''));
            const source: [number, number] = [Number.parseInt(theSourceCirle.attr("cx")), Number.parseInt(theSourceCirle.attr("cy"))];

            let isFounded = false;
            d3.select("#conception-grid-svg").selectAll(".connector")
                .each(function() {
                    const theTargetCirle = d3.select('#' + d3.select(this).attr("id").replace('text-',''));
                    const target: [number, number] = [Number.parseInt(theTargetCirle.attr("cx")), Number.parseInt(theTargetCirle.attr("cy"))];

                    if( Math.abs(d3.event.x - target[0]) <= 10 &&  Math.abs(d3.event.y - target[1]) <= 10) {
                        
                        const theTargetCompId = d3.select(this).attr("id").replace('output-','').replace('input-','').replace('text-','');
                        const isTargetInput: boolean = (d3.select(this).attr("id").indexOf('input') >= 0);

                        //To be able to add a new link we need to be sure that :
                        // - the target and the source is not the same component.
                        // - the connections is beetween an input and an output connector.
                        // - there is no any link who already exist between those two components.
                        if(theTargetCompId != theSourceCompId && isSourceInput != isTargetInput
                                && document.getElementById("link-" + (isSourceInput? theTargetCompId + '-to-' + theSourceCompId:theSourceCompId + '-to-' + theTargetCompId)) == null){
                            
                            const newId = registerLink((isSourceInput? theTargetCompId:theSourceCompId), (isSourceInput? theSourceCompId:theTargetCompId));
                            isFounded = true;
                            document.getElementById("link-" + theSourceCompId)?.parentElement?.setAttribute("class", "")
                            document.getElementById("link-" + theSourceCompId)?.parentElement?.setAttribute("id", "link-" + newId)
                            d3.select("#link-" + theSourceCompId)
                                .attr("id", "link-" + (isSourceInput? theTargetCompId + '-to-' + theSourceCompId:theSourceCompId + '-to-' + theTargetCompId))
                                .attr("class", "link-path link-" + theSourceCompId.split('-')[1] + ' link-' + theTargetCompId.split('-')[1] )
                                .datum(getLineData(source,target, isSourceInput))
                                .attr("d", lineFunction)
                                .attr("data-input", (isSourceInput?theSourceCompId:theTargetCompId))
                                .attr("data-output", (isSourceInput?theTargetCompId:theSourceCompId))
                                .attr("data-input-index", (isSourceInput?theSourceCirle.attr("data-index"):theTargetCirle.attr("data-index")))
                                .attr("data-output-index", (isSourceInput?theTargetCirle.attr("data-index"):theSourceCirle.attr("data-index")));
                        }
                    }
                    
                });  
            if(!isFounded){
                document.getElementById("link-" + theSourceCompId)?.parentElement?.remove();
            }
        })

    dragLinkCompHandler(d3.select("#conception-grid-svg").selectAll(".connector"));
}