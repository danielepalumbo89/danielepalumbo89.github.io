var margin = {top: 80, right: 80, bottom: 180, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 100,
    barPadding = 28; // Space between bars to call in the rect width

var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([1, width], .3);

var x1 = d3.scale.ordinal();
    
var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#ef3b2c", "#99000d"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var formatPercent = d3.format(".0%");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "</strong><span/>  <br/> <br/> <span style='color: #f7f7f7; background-color: #e6550d; padding-left: 3px; padding-right: 3px; padding-bottom: 3px; padding-top: 3px'>" + d.value * 100 + "% </span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function make_y_axis() {        
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(9)
}

svg.call(tip);

d3.csv("/js/chart5/data.csv", function(error, data) {
  if (error) throw error;

// Create categories to group (ps. use different names from the standards ed. date/value)

var categoryNames = d3.keys(data[0]).filter(function(key) { return key !== "date"; });
  data.forEach(function(d) {
    d.category = categoryNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

x0.domain(data.map(function(d) { return d.date; }));
  x1.domain(categoryNames).rangeRoundBands([1, x0.rangeBand()]);
  y.domain([0, 1]); // It's because the format is %, However the y.domain can be changed to show max value

  svg.append("g")         
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .style("stroke-width", 0) // this line allow to not have a balck short line and then the gridline
      .call(yAxis);

  var year = svg.selectAll(".year")
      .data(data)
    .enter().append("g")
      .attr("class", "year")
      .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });

    year.selectAll("rect")
      .data(function(d) { return d.category; })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", barPadding)                 // Space between bars create var barPadding in dimension
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

// Legend
var legend = svg.selectAll(".legend")
      .data(categoryNames.slice()) // use .reverse if another order
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-510," + i * 20 + ")"; });

  legend.append("circle")
      .attr("cx", width - 18)
      .attr("cy", 30)
      .attr("r", 8)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 30)
      .attr("y", 30)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
