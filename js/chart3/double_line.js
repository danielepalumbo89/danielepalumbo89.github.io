var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    padding = 1;

var parseDate = d3.time.format("%Y%m%d").parse;
var commasFormatter = d3.format(",.0f")

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#1c9099", "#08306b"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(4)
    .tickPadding(7) // distance between labels and the actual x axis
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d) { return "$" + commasFormatter(d); })
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

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

d3.csv("/js/chart3/data.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

var category = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, price: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([10, 60
  ]);

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
      .style("stroke-width", 0)
      .call(yAxis)
    
var cat = svg.selectAll(".cat")
      .data(category)
    .enter().append("g")
      .attr("class", "cat");

  cat.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .style("stroke-width", 2.8);

  cat.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 10]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.price) + ")"; })
      .attr("x", 25)
      .attr("dy", "1em")
      .text(function(d) { return d.name; });

      // Tooltip and line over the lines (!!!)
                var mouseG = svg.append("g")
                      .attr("class", "mouse-over-effects");

                    mouseG.append("path") // this is the black vertical line to follow mouse
                      .attr("class", "mouse-line")
                      .style("stroke", "lightgrey")
                      .style("stroke-dasharray", 3)
                      .style("stroke-width", "3px")
                      .style("opacity", "0");
                      
                    var lines = document.getElementsByClassName('line');

                    var mousePerLine = mouseG.selectAll('.mouse-per-line')
                      .data(category)
                      .enter()
                      .append("g")
                      .attr("class", "mouse-per-line");

                    mousePerLine.append("circle")
                      .attr("r", 7)
                      .style("stroke", function(d) {
                        return color(d.name);
                      }) 
                      .style("fill", "white")
                      .style("stroke-width", "4px")
                      .style("opacity", "0");

                    mousePerLine.append("text")
                      .attr("transform", "translate(10,3)");

                    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                      .attr('width', width) // can't catch mouse events on a g element
                      .attr('height', height)
                      .attr('fill', 'none')
                      .attr('pointer-events', 'all')
                      .on('mouseout', function() { // on mouse out hide line, circles and text
                        d3.select(".mouse-line")
                          .style("opacity", "0");
                        d3.selectAll(".mouse-per-line circle")
                          .style("opacity", "0");
                        d3.selectAll(".mouse-per-line text")
                          .style("opacity", "0")
                          .style("stroke", 0.1);
                      })
                      .on('mouseover', function() { // on mouse in show line, circles and text
                        d3.select(".mouse-line")
                          .style("opacity", "1");
                        d3.selectAll(".mouse-per-line circle")
                          .style("opacity", "1");
                        d3.selectAll(".mouse-per-line text")
                          .style("opacity", "1");
                      })
                      .on('mousemove', function() { // mouse moving over canvas
                        var mouse = d3.mouse(this);
                        d3.select(".mouse-line")
                          .attr("d", function() {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                          });

                        d3.selectAll(".mouse-per-line")
                          .attr("transform", function(d, i) {
                            console.log(width/mouse[0])
                            var xDate = x.invert(mouse[0]),
                                bisect = d3.bisector(function(d) { return d.date; }).right;
                                idx = bisect(d.values, xDate);
                            
                            var beginning = 0,
                                end = lines[i].getTotalLength(),
                                target = null;

                            while (true){
                              target = Math.floor((beginning + end) / 2);
                              pos = lines[i].getPointAtLength(target);
                              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                  break;
                              }
                              if (pos.x > mouse[0])      end = target;
                              else if (pos.x < mouse[0]) beginning = target;
                              else break; //position found
                            }
                            
                            d3.select(this).select('text')
                              .text(y.invert(pos.y).toFixed(2));
                              
                            return "translate(" + mouse[0] + "," + pos.y +")";
                          });
                        });
                    });
