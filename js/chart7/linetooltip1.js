var margin = {top: 50, right: 20, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    padding = 1;

var parseDate = d3.time.format("%d-%b-%y").parse,
    formatDate = d3.time.format("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks( d3.time.months, 1);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

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
d3.csv("/js/chart7/data1.csv", function(error, data) {
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

                  // append the rectangle to capture mouse   
                  svg.append("path") // this is the black vertical line to follow mouse
                      .attr("class","mouseLine")  
                      .style("stroke","grey")
                      .style("stroke-width", "1px")
                      .style("opacity", "0");

                  svg.append("rect")                                     
                      .attr("width", width)                             
                      .attr("height", height)                            
                      .style("fill", "none")                            
                      .style("pointer-events", "all")                   
                      .on('mouseout', function(){ // on mouse out hide line
                  d3.select(".mouseLine")
                    .style("opacity", "0");
                })
                .on('mouseover', function(){ // on mouse in show line
                  d3.select(".mouseLine")
                    .style("opacity", "1")
                    .style("stroke-dasharray", "5")
                    .style("stroke-width", "3px");
                })
                .on('mousemove', function() { // mouse moving over canvas
                  d3.select(".mouseLine")
                  .attr("d", function(){
                    yRange = y.range(); // range of y axis
                    var xCoor = d3.mouse(this)[0]; // mouse position in x
                    var xDate = x.invert(xCoor); // date corresponding to mouse x 

                    return "M"+ xCoor +"," + yRange[0] + "L" + xCoor + "," + yRange[1]; // position vertical line
                    });
              });


    // Add the text label for the X axis
    svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height+margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    // Add the title
    svg.append("text")
        .attr("x", (width / 52))     
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Down the Table");

});
