var margin = {top: 20, right: 20, bottom: 200, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong> <span style='color: #252525; background-color: #ffffff; padding-left: 3px; padding-right: 3px; padding-bottom: 3px; padding-top: 3px'>" + "Orders: " + d.frequency + "</strong> </span>";

  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("/js/chart1/dataibt.csv", function(error, data) {
data.forEach(function(d) {
    d.frequency = +d.frequency;  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", -10)
            .attr("dy", -2)
            .attr("transform", function(d) {return "rotate(-90)" });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate")
      .attr("y", 6)
      .attr("dy", "5")
      .attr("x", 1)
      .attr("dx", "80")
      .style("text-anchor", "middle")
      .text("Banning orders");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency) - .5 ; })
      .attr("width", x.rangeBand())
      .transition()
      .duration(300)
      .delay(function (d,i){ return i / data.length * 1000;}) 
      .attr("height", function(d) { return height - y(d.frequency); })
      .attr("y", function(d) { return y(d.frequency) - .5; });

  svg.selectAll(".bar")      
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      
});
