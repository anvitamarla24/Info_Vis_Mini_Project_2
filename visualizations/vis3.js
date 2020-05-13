function vis3(data, geoJSON, div) {

 const legendMargin = 50
 const margin = ({top: 10, bottom: 10, left: 10, right: 10})
 const width = 200;
 const height = 280;
 const path = d3.geoPath()
      .projection(d3.geoEqualEarth()
      .fitSize([width, height], geoJSON))
 
 const colors = ['#feedde','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#8c2d04'];
 const extent = d3.extent(data, d => d.received);
 const color = d3.scaleQuantize(extent, d3.schemeReds[5])
 //d3.scaleSequential()
   //   .domain(extent)
    //  .interpolator(d3.interpolateOrRd);
	  
	  
  
function func_nestedArrestMap(weather){
  const result = d3.nest()
      .key(d => d.year)
      .key(d => d.country)
      .map(weather)
  
  return result
}

 const nestedArrestMap = func_nestedArrestMap(data);
  
 const nestedArrestYears = d3.nest()
      .key(d => d.year).sortKeys(d3.ascending)
      .key(d => d.country)
      .entries(data.sort(function(a,b) { return +a.year - +b.year }));
	  
	  
 const svg = div.selectAll("svg")
      .data(nestedArrestYears.filter(d => +d.key > 1972))
    .enter().append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  svg.append("text")
      .attr("dx", width-160)
      .style("text-anchor", "end")
      .style("font", "14px 'Benton Gothic', sans-serif")
      .text(d => d.key)


  svg.selectAll(".divisions")
      .data(geoJSON.features)
    .enter().append("path")
      .style("stroke", "#000")
      .style("stroke-width", 0)
      .attr("d", path)
      .style("fill", function(d) {	
		  console.log('Method B: Parent data: ', d3.select(this.parentNode.__data__))
          const nestedMatch = nestedArrestMap["$" + this.parentNode.__data__.key]["$" + d.properties.NAME]
            if(nestedMatch) {
            const arrestIndex = nestedMatch[0].received
          return color(arrestIndex);
        }
        return '#eeeeee'
      })
	  
	  
 const x = d3.scaleLinear()
      .domain(d3.extent(color.domain()))
      .rangeRound([0, width - legendMargin]);
	  
const g1 = svg.append("g")
       .attr("transform", `translate(${legendMargin / 2},${600 + 50})`);

  g1.selectAll("rect")
    .data(color.range().map(d => color.invertExtent(d)))
    .join("rect")
      .attr("height", 8)
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("fill", d => color(d[0]));

  g1.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Amount Received");

  g1.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(d3.format("$.0s"))
      .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
    .select(".domain")
      .remove();
	  
}
