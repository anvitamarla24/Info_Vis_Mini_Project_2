function vis2(aiddata, div) {
  const margin = {top: 20, right: 20, bottom: 10, left: 150};

  const visWidth = 1000 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

  const svg = div.append('svg')
      .attr('width', screen.width)
      .attr('height', visHeight + 3*margin.top + 6*margin.bottom);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const yMax = 1;
  const yFormat = '.0%';
  const yLabel = '% Donated';
  
  const top_ten_purposes = [
            "Social_welfare_services", 
            "RESCHEDULING_AND_REFINANCING",
            "Import_support_capital_goods",
            "Telecommunications", 
            "Mineral_Metal_prospection_and_exploration", 
            "Power_generation_renewable_sources",
            "Rail_transport", 
            "Power_generation_non_renewable_sources",
            "Air_transport",
            "Industrial_development"];
   
  const data2 = aiddata.filter(d => d.coalesced_purpose_name != "Sectors not specified");
  
  function func_data_top10(data2){  
  // const data_ = data.filter(d => d.purpose != "Sectors not specified");
  const cleanedData = data2.map(currentElement => ({
  'country': currentElement.recipient,
  'received': currentElement.commitment_amount_usd_constant,
  'purpose': currentElement.coalesced_purpose_name,
  'year': currentElement.year
}));

  const numPurpose = d3.rollup(cleanedData, v => d3.sum(v, d => d.received), d => d.purpose);
  
  const purposeCount = Array.from(numPurpose, ([purpose, total]) => ({purpose, total}));

    return purposeCount.sort((a, b) => d3.descending(a.total, b.total)).slice(0, 10) 

}
  const data_top10 = func_data_top10(data2);
  const top_purposes = data_top10.map(d => d.purpose);

const cleanedData = data2.map(currentElement => ({
  'country': currentElement.recipient,
  'received': currentElement.commitment_amount_usd_constant,
  'purpose': currentElement.coalesced_purpose_name,
  'year': currentElement.year
}));

  const filteredData = cleanedData.filter(d => top_purposes.includes(d.purpose));
  const filteredData2 = filteredData
.map(d => {
              if (d.purpose === 'Air transport') {
                d.purpose = 'Air_transport'
              }
  
              if (d.purpose === 'Rail transport') {
                d.purpose = 'Rail_transport'
              }
              
              if (d.purpose === 'Industrial development') {
                d.purpose = 'Industrial_development'
              }
  
              if (d.purpose === 'Power generation/non-renewable sources') {
                d.purpose = 'Power_generation_non_renewable_sources'
              }
  
              if (d.purpose === 'RESCHEDULING AND REFINANCING') {
                d.purpose = 'RESCHEDULING_AND_REFINANCING'
              }
  
              if (d.purpose === 'Import support (capital goods)') {
                d.purpose = 'Import_support_capital_goods'
              }
  
              if (d.purpose === 'Social/ welfare services') {
                d.purpose = 'Social_welfare_services'
              }
  
              if (d.purpose === 'Power generation/renewable sources') {
                d.purpose = 'Power_generation_renewable_sources'
              }
  
              if (d.purpose === 'Mineral/Metal prospection and exploration') {
                d.purpose = 'Mineral_Metal_prospection_and_exploration'
              }
  
              return d;
            })


 function func_finalData(filteredData2){
 const  result = d3.rollup(filteredData2,
          counterPurpose => d3.sum(counterPurpose, c => c.received),
         // first group by cuisine type
         d => d.year,
          // then group by grade
         d => d.purpose)

 return Array.from(result, ([cuisine, grade]) => {
    grade.set('year', cuisine);
    grade.set('total', d3.sum(grade.values()));
    return Object.fromEntries(grade)
   });
}
  
  const finalData = func_finalData(filteredData2);
  const finalDataByYears = finalData.sort(function(a,b) { return +a.year - +b.year });
  const stackedExpand = d3.stack()
    .keys(top_ten_purposes)
    .value(function(d,key){
    if (d.hasOwnProperty(key))
      return d[key]
    return 0;
    })
    .offset(d3.stackOffsetExpand)
(finalDataByYears)
  
  const color = d3.scaleOrdinal()
    .domain(top_ten_purposes)
    .range(d3.schemeCategory10);

  const extent = [new Date(1973, 12), new Date(2013, 12)]
  const x = d3.scaleTime()
      .domain(extent)
      .range([0, visWidth]);
  
  const y = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([visHeight, 0]);
  
  const area = d3.area()
      .x(d => x(new Date(d.data.year, 12)))
      .y1(d => y(d[1]))
      .y0(d => y(d[0])).curve(d3.curveBasis);
  
  const xAxis = d3.axisBottom(x);
  
  const yAxis = d3.axisLeft(y).tickFormat(d3.format(yFormat))
  
  g.append('g')
      .attr('transform', `translate(0,${visHeight})`)
      .call(xAxis)
      .call(g => g.selectAll('.domain').remove());
  
  g.append('g')
      .call(yAxis)
      .call(g => g.selectAll('.domain').remove())
    .append('text')
      .attr('fill', 'black')
      .attr('x', -40)
      .attr('y', visHeight / 2)
      .text(yLabel);
  
  const series = g.selectAll('.series')
    .data(stackedExpand)
    .join('g')
      .attr('fill', d => color(d.key))
      .attr('class', 'series')
    .append('path')
      .datum(d => d)
      .attr('d', area)
	.append("title")
      .text(({key}) => key);
	  
var ordinal = d3.scaleOrdinal()
    .domain(top_ten_purposes)
    .range(d3.schemeCategory10);


const g1 = svg.append("g");


	  
g1.selectAll("legend-rect")
            .data(stackedExpand)
            .enter()
            .append("rect")
            .attr("x", 1000)
            .attr("y", (d, i) => 100 + (10 -i)*(20 + 5))
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", (d) => color(d.key));

g1.selectAll("legend-labels")
            .data(stackedExpand)
            .enter()
            .append("text")
            .attr("x",1025)
            .attr("y", (d, i) => 115 + (10 -i)*25)
            .text((d) => d.key)
            .attr("text-anchor", "left")
            .style("alignment", "baseline");
	  
}