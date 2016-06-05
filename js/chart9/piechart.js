var margin = {top: 50, right: 80, bottom: 50, left: 150},
    width = 636 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("data.csv", type, function(error, data) {
  if (error) throw error;
  
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");
  
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });
  
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.population + "%"; });
});

function type(d) {
  d.population = +d.population;
  return d;
}
