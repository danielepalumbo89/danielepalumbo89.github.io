---
layout: post
title:  "D3.js live version of a bar chart with tooltip and animation"
date: 2016-06-04
---

<h2>D3.js live version of a bar chart with tooltip and animation</h2> 
Given the complexity that the code may assume if overloaded with transitions and animations, I decided to keep the the visualisation simple so to show how fast it loads up on the page and also - building this static page - how perfectly fit in a really simple CMS.

The style adopted is very simple, however the colours has been taken from the IBT website.
<div>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="/js/chart1/stylesheet.css">
  <script src="//d3js.org/d3.v3.min.js"></script>
  <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
</head>
<body>
  <div>
    <h1>Total number of Banning Orders in Premier League 2014-15</h1>
    <label><input type="checkbox"> Sort values</label>
    <script type="text/javascript" src="/js/chart1/bar.js"></script>
  </div>
</body>
</div>

