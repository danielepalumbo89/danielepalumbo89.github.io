var margin = {top: 50, right: 20, bottom: 35, left: 50},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    padding = 1;

var parseDate = d3.time.format("%d-%b-%y").parse,
    formatDate = d3.time.format("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks( d3.time.months, 1);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });

var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");



// function for the y grid lines
function make_y_axis() {
  return d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10)
}

// Get the data
d3.csv("/js/chart7/data.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([16, d3.max(data, function(d) { return d.close; })]);

    // Add the filled area
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Draw the y Grid lines
    svg.append("g")            
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // Add the valueline path.
svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

 // Add line and tooltip

 // append the circle at the intersection               // **********
                var lineSvg = svg.append("g"); 

                var focus = svg.append("g") 
                    .style("display", "none");

                // append the x line
                focus.append("line")
                    .attr("class", "x")
                    .style("stroke", "grey")
                    .style("stroke-width", 3)
                    .style("stroke-dasharray", "3,3")
                    .style("opacity", 1)
                    .attr("y1", 5)
                    .attr("y2", height);

                // append the y line
                focus.append("line")
                    .attr("class", "y")
                    .style("stroke", "none")
                    .style("stroke-dasharray", "3,3")
                    .style("opacity", 0.5)
                    .attr("x1", width)
                    .attr("x2", width);

                // append the circle at the intersection
                focus.append("circle")
                    .attr("class", "y")
                    .style("fill", "white")
                    .style("stroke", "#a50f15")
                    .style("stroke-width", 3)
                    .attr("r", 5);

    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")

        .style("background", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("fill", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
    
    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    focus.select("circle.y")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")");

    focus.select("text.y1")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")")
        .text(d.close);

    focus.select("text.y2")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")")
        .text(d.close);

    focus.select("text.y3")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")")
        .text(formatDate(d.date));

    focus.select("text.y4")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")")
        .text(formatDate(d.date));

    focus.select(".x")
        .attr("transform",
              "translate(" + x(d.date) + "," +
                             y(d.close) + ")")
                   .attr("y2", height - y(d.close));

    focus.select(".y")
        .attr("transform",
              "translate(" + width * -1 + "," +
                             y(d.close) + ")")
                   .attr("x2", width + width);
  }
                                                    // **********          


    // Add the text label for the X axis
    svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height+margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    

});
