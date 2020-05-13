function vis1(data, div) {
  const margin = {top: 50, right: 100, bottom: 120, left: 160};

  const visWidth = 1250 - margin.left - margin.right;
  const visHeight = 950 - margin.top - margin.bottom;

  const svg = div.append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // add title

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px");
  
  const country_list = ["United States" ,
"Japan" ,
"Germany" ,
"United Kingdom" ,
"France" ,
"Netherlands" ,
"Sweden" ,
"Norway" ,
"Canada" ,
"Switzerland" ,
"Denmark" ,
"Belgium" ,
"Spain" ,
"Italy" ,
"Finland" ,
"Austria" ,
"Monaco" ,
"Liechtenstein" ,
"Iceland" ,
"Portugal" ,
"Australia" ,
"New Zealand" ,
"Slovenia" ,
"United Arab Emirates" ,
"Estonia" ,
"Latvia" ,
"Luxembourg" ,
"Greece" ,
"Lithuania" ,
"Qatar" ,
"Ireland" ,
"Slovak Republic" ,
"Cyprus" ,
"Czech Republic" ,
"Hungary" ,
"Saudi Arabia" ,
"Taiwan" ,
"Romania" ,
"Kuwait" ,
"Chile" ,
"South Africa" ,
"Korea" ,
"Poland" ,
"Colombia" ,
"Brazil" ,
"Thailand" ,
"India"]
  const myYears = [
"1973",
"1974",
"1975",
"1976",
"1977",
"1978",
"1979",
"1980",
"1981",
"1982",
"1983",
"1984",
"1985",
"1986",
"1987",
"1988",
"1989",
"1990",
"1991",
"1992",
"1993",
"1994",
"1995",
"1996",
"1997",
"1998",
"1999",
"2000",
"2001",
"2002",
"2003",
"2004",
"2005",
"2006",
"2007",
"2008",
"2009",
"2010",
"2011",
"2012",
"2013"]
  
  // create scales

  const x = d3.scalePoint()
      .domain(myYears)
      .range([0, visWidth])
      .padding(0.5);
  
  const y = d3.scalePoint()
      .domain(country_list)
      .range([0, visHeight])
      .padding(0.5);
  
  const oScale = d3.scalePow()
            .exponent(0.5)
            .domain([0 , 11399278504])
            .range([1, 0.85])
  
//   const maxRadius = 10;
//   const radius = d3.scaleSqrt()
//       .domain([0, 11399278504])
//       .range([0, maxRadius]);
  
  const maxRadius = 15;
  const radius = d3.scaleSqrt()
      .domain([0, 11399278504])
      .range([2, maxRadius]);
  
  // add legend
  
//   const legend = g.append("g")
//       .attr("transform", `translate(${visWidth + margin.right - 40}, 0)`)
//     .selectAll("g")
//     .data([100, 300, 500, 700])
//     .join("g")
//       .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
//   legend.append("circle")
//     .attr("r", d => radius(d))
//     .attr("fill", "steelblue");

//   legend.append("text")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 12)
//     .attr("dominant-baseline", "middle")
//     .attr("x", maxRadius + 5)
//     .text(d => d);
  const color = d3.schemeCategory10;
  const keys = ["received", "donated"];
  // create and add axes
  
  const xAxis = d3.axisBottom(x);
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("x", -65)
      .attr("y", visHeight / 2)
      .attr("fill", "black")
      .attr("dominant-baseline", "middle");
  
//   var arc = d3.arc()
// 			.innerRadius(0)
// 			.outerRadius(5);
			
//   var pie = d3.pie()
// 			.sort(null)
// 			.value(function(d) { return d; });
  
  // draw points
  
  const rows = g.selectAll(".row")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.year)}, ${y(d.country)})`).append("g").attr("class","pies");
    
// 	var pies = rows.selectAll(".pies")
// 		.data(function(d) {console.log(d.data2); return pie(d.data2.split(['-'])); }) // I'm unsure why I need the leading 0.
// 		.enter()
// 		.append('g')
// 		.attr('class','arc');
	
// 	pies.append("path")
// 	  .attr('d',arc)
//     .attr("fill",function(d,i){
//            return color[i];      
//       })
//     .attr("fill-opacity", 0.5)
  
//  rows.append("circle")
// 		.attr("r", 11)
//         .style("fill", "none");
  
 var pies = rows.selectAll(".pies")
		.data((d) => {
                let a = d3.pie().value((x) => x)([d.donated, d.received]);
                a.forEach((x, i) => {
                    if(i == 0) x["key"] = "donated";
                    else x["key"] = "received";
                    x["total"] = d.total;
                })
                return a;
            }) // I'm unsure why I need the leading 0.
		.enter()
		.append('g')
		.attr('class','arc');
  
rows.append("title")
      .text(d => `Country: ${d.country}
Year: ${d.year}
Donated: $${Math.round(d.donated/1000000)}M
Received: $${Math.round(d.received/1000000)}M`)
	
	pies.append("path")
	   .attr('d', (d,i) => {
                return d3.arc().innerRadius(0).outerRadius(radius(d.total))(d);
            })
	  .attr("fill",function(d,i){
	return color[i];      
	})
	.attr("fill-opacity", d => oScale(d.total)) 

const legend = g.append("g")
      .attr("transform", `translate(${visWidth + 20}, 0)`)
    .selectAll("g")
    .data([0, 2849820802, 5699640036, 8549459270, 11399278504])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.5 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "none")
    .attr("stroke", "#c4c4c4");

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => `$${Math.round(d * 0.000001)}M`);
	
var ordinal = d3.scaleOrdinal()
  .domain(["Donated", "Received"])
  .range(d3.schemeCategory10);


const g1 = svg.append("g")
      .attr("transform", `translate(${visWidth + 150},0)`)
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(ordinal.domain().slice().reverse())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

  g1.append("rect")
      .attr("x", -19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", ordinal);

  g1.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.35em")
      .text(d => d);
		
	
}
