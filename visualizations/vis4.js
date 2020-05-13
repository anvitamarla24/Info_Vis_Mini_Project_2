function vis4(data, geoJSON, div) {
	
  const legendMargin = 50
  const height = 600
  const width = 900
 
  const extent = d3.extent(data, d => d.received);
  const colorScale = d3.scaleQuantize(extent, d3.schemeReds[5])
  
  const medianAskingMap = d3.nest()
      .key(d => d.year)
      .key(d => d.country)
      .map(data);
  
  const years = d3.nest()
      .key(d => d.year).sortKeys(d3.ascending)
      .key(d => d.country)
      .entries(data);
  
  const newcountry_list = ["United States" ,
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
  
  function func_mergedData(data) {
  let merged = [];
  //loop through countries topojson and add population/corona cases
  for (var i = 0; i < geoJSON.features.length; i++) {
    let country = geoJSON.features[i];
    // countries topojson data as main object
    let obj = Object.assign({}, geoJSON.features[i]);
    //add population
    // for (var c = 0; c < populationData.length; c++) {
    //   if (populationData[c].name == country.properties.name) {
    //     obj.properties.population = populationData[c].population;
    //   }
    // }
    //add corona
    for (var g = 0; g < data.length; g++) {
      if (obj.properties.name == data[g]["country"]) {
        if (!obj.properties.corona) {
          obj.properties.corona = data[g];
        } else {
          // sum each province
          for (var key in data[g]) {
            if (!isNaN(key[0])) {
              obj.properties.corona[key] =
                parseInt(obj.properties.corona[key]) +
                parseInt(data[g][key]);
            }
          }
        }
      }
    }
    if (!obj.properties.corona) {
      obj.properties.corona = null;
    }
    merged.push(obj);
  }
  return merged;
}
  
  const mergedData = func_mergedData(data)

  const path = d3.geoPath()
      .projection(d3.geoEqualEarth()
      .fitSize([width, height], geoJSON))
  
 const svg = div.selectAll("svg")
      .data(years.filter(d => +d.key > 2012))
    .enter().append("svg")
      .attr("width", width)
      .attr("height", height + 100);
	   
  
  // svg.append("g")
  //     .attr("transform", `translate(${legendMargin / 2},${height + 50})`)
  //     .call(legend);

  svg.selectAll(".back")
    .data(geoJSON.features)
    .join('path')
      .attr('class', 'border')
      .attr('d', path)
      .attr('fill', '#dcdcdc')
      .attr('stroke', 'white');
  
  svg.selectAll(".nyc")
      .data(geoJSON.features.filter(d => newcountry_list.includes(d.properties.NAME)))
      .join("path")
      .attr("d", path)
      .attr("class", "nyc")
      .style("fill", 
        //console.log('Method B: Parent data: ', d3.select(this.parentNode.__data__))
        function(d) {
          const nestedMatch = medianAskingMap["$" + this.parentNode.__data__.key]["$" + d.properties.NAME]
            if(nestedMatch) {
            const arrestIndex = nestedMatch[0].received
          return colorScale(arrestIndex);
        }
        return '#dcdcdc'
      })
      .style("stroke", "white")
      .style("stroke-width", .25)
  
  const dateDisplay = svg.append("text")
      .attr("x", 5)
      .attr("y", 30)
      .style("font", "24px sans-serif")
      .text(myYears)
        
  const dates = myYears
  dates.shift()
  let counter = 0;      
  d3.interval(() => {
    
    dateDisplay.text(dates[counter])
    
    // console.log(dates)
    const medMap = medianAskingMap["$" + dates[counter]];
     svg.selectAll(".nyc")
      .style("fill", d => {
        const val = medMap["$" + d.properties.NAME]
        if(val == undefined) {
          return "#dcdcdc"
        } else {
          return colorScale(val[0].received)
        }
      })
    
    if(counter == dates.length - 1) {
      counter = 0;
    } else {
      counter +=1 
    }
    
  }, 1000) 

 const x = d3.scaleLinear()
      .domain(d3.extent(colorScale.domain()))
      .rangeRound([0, width - legendMargin]);
	  
const g1 = svg.append("g")
       .attr("transform", `translate(${legendMargin / 2},${height + 50})`);

  g1.selectAll("rect")
    .data(colorScale.range().map(d => colorScale.invertExtent(d)))
    .join("rect")
      .attr("height", 8)
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("fill", d => colorScale(d[0]));

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
      .tickValues(colorScale.range().slice(1).map(d => colorScale.invertExtent(d)[0])))
    .select(".domain")
      .remove();

  
}
