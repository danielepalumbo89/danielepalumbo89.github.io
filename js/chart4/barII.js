var margin = {top: 80, right: 80, bottom: 180, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 100;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
      .orient("left")
      .ticks(8)
      .tickSubdivide(5).tickSize(-width, 1);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong><span style='color:#252525; background-color: #f7f7f7; padding-left: 3px; padding-right: 3px; padding-bottom: 3px; padding-top: 3px'>" + d.date + "</strong><span/>  <br/> <br/> <span style='color: #f7f7f7; background-color: #e6550d; padding-left: 3px; padding-right: 3px; padding-bottom: 3px; padding-top: 3px'>" + d.value1 + "</span>";
  })

// Define the div for the tooltip
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("/js/chart4/data.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-0)")
      .attr("y", 0.8)
      .attr("x", 0.8)
      .attr("dy", "0.8")
      .attr("dx", "0.8")
      .style("text-anchor", "end")
      .text("$160 bn");

  svg.selectAll(".bar")
      .data(data)      
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

        
});

function type(d) {
  d.value = +d.value;
  return d;
}
