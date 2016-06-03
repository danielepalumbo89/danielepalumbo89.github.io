---
layout: post
title:  "Testing d3 with Markdown - My Test"
date: 2016-06-03
---

D3.js embedding test with code built by myself

<style>

div.example {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.box {
  font: 10px sans-serif;
}

.box line,
.box rect,
.box circle {
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5px;
}

.box .center {
  stroke-dasharray: 3,3;
}

.box .outlier {
  fill: none;
  stroke: #ccc;
}

</style>
<body>
   <h1 class="title"> New Banning Orders by club between 2014-15 </h2>
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="http://bl.ocks.org/mbostock/raw/4061502/0a200ddf998aa75dfdb1ff32e16b680a15e5cb01/box.js"></script>

<script>
/* JavaScript starts here. */

/* Chart spaces dimensions, axes and their scales goes here. */

var margin = {top: 10, right: 60, bottom: 100, left: 150},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var chart = d3.box()
    .width(width)
    .height(height);

var x = d3.scale.linear()
    .range([0, width]);/* This changes space between bars. */

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

d3.csv("/dataibt.csv", type, function (error, csv) {
  var data = [];
  x.domain(d3.extent(data, function(d) {return d.value; })).nice();
  y.domain(data.map(function(d) {return d.name; }));

 var svg = d3.select("div#example").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "box")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.value)); })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.rangeBand());

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);  
});

function type(d) {
  d.value = +d.value;
  return d;
}

</script>

<div id="example"></div>
