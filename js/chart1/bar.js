var margin = {top: 20, right: 20, bottom: 200, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

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
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, 140]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
            .style("text-anchor", "start")
            .attr("y", 0)
            .attr("x", 10)
            .attr("dy", ".35em")
            .attr("transform", function(d) {return "rotate(-270)" });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Banning orders");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });

      svg.selectAll(".bar")      
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 5000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(1500),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay)
      .selectAll("text")
          .attr("y", 0)
          .attr("x", 10)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");
  }
});
