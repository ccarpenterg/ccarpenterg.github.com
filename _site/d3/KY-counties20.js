
var width = 760,
    height = 350,
    legend_x = 85,
    legend_y = 95;
// AlbersUsa scale:5600, translate:-450, 250

var projection = d3.geo.mercator()
    .scale(29100)
    .translate([7310, 3500]);

var path = d3.geo.path()
    .projection(projection);

var threshold = d3.scale.threshold()
    .domain([20000, 65000])
    .range([1, 2, 3]);

window.threshold = threshold;

var legends = [
    {y: 245, tier: 'tier-3', legend: "65,000 people or more"},
    {y: 222, tier: 'tier-2', legend: "20,000 to 64,999 people"},
    {y: 199, tier: 'tier-1', legend: "Less than 20,000 people"}
]

window.legends = legends;

var q = queue()
    .defer(d3.json, "/geojson/KY.json")
    .defer(d3.json, "/geojson/KY-counties.json")
    .defer(d3.csv, "/csv/KY-counties-pop.csv")
    .await(ready);

function ready(error, state, counties, population) {

    window.error = error;
    window.state = state;
    window.counties = counties;
    window.population = population;
    if (error) throw error;

    var popById = {};
    window.popById = popById;

    population.forEach(function(d) { popById[d.id] = d.population; });

    var svg = d3.select("#KY-population").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("rect")
        .data(legends)
        .enter().append("rect")
        .attr("x", legend_x)
        .attr("y", function (d, i) { return (legend_y - (i * 23)); })
        .attr("height", 20)
        .attr("width", 20)
        .attr("class", function (d) { return d.tier + " legend"; });

    svg.selectAll("text")
        .data(legends)
        .enter().append("text")
        .attr("x", function (d) { return legend_x + 25; })
        .attr("y", function(d, i) { return legend_y - i*23 + 15; })
        .attr("class", "description")
        .text(function(d) { return d.legend; });

    svg.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(state.features)
        .enter().append("path")
        .attr("d", path);

    svg.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter().append("path")
        .attr("class", function(d) { return "tier-" + threshold(popById[parseInt(d.properties.STATE + d.properties.COUNTY)]); })
        .attr("d", path);

    window.svg = svg;
    }
