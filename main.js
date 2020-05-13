// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/mini2_data2.csv', d3.autoType),
  d3.csv('data/aiddata-countries-only - aiddata-countries-only.csv', d3.autoType),
  d3.csv('data/data2.csv', d3.autoType),
  d3.json('data/countries.json'),
]).then(([data, aiddata, data2, geoJSON]) => {
  vis1(data, d3.select('#vis1'));
  vis2(aiddata, d3.select('#vis2'))
  vis3(data2, geoJSON, d3.select('#vis3'));
  vis4(data2, geoJSON, d3.select('#vis4'));
});
