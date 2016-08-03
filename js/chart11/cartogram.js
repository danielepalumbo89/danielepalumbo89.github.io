<script id="grid" type="text/plain">
                                  ME
 AK                WI          VT NH
    WA ID MT ND MN IL MI    NY MA
    OR NV WY SD IA IN OH PA NJ CT RI
    CA UT CO NE MO KY WV VA MD DC DE
       AZ NM KS AR TN NC SC
             OK LA MS AL GA
    HI       TX             FL

</script>

var states = [],
    banstates = ["CA", "OR", "WA", "CT", "DC", "HI", "MD", "MA", "NJ", "NY", "MN", "IL", "MI", "NM", "ME", "VT", "RI", "DE", "NV", "CO", "IA", "OH", "WI", "NH", "FL", "PA", "NC"],
    regulatestates = ["VA", "ID", "MT", "ND", "SD", "NE", "UT", "KS", "AZ", "OK", "TX", "AK", "WY", "MO", "AR", "LA", "IN", "KY", "WV", "TN", "MS", "AL", "GA", "SC"];


var $graphic = $('svg');
var graphic_aspect_width = 16;
var graphic_aspect_height = 9;
var mobile_threshold = 500;
var pymChild = null;
var container_width = $(window).width()


function drawGraphic(container_width) {
if (container_width == undefined || isNaN(container_width)) {
        container_width = 640; //was 640
    }


    $graphic.empty();

    if (container_width < mobile_threshold) {
        graphic_aspect_height = 14;
    }


var margin = {top: 0, right: 0, bottom: 0, left: 0},
 width = container_width - margin.left - margin.right,
  height = Math.ceil((width * graphic_aspect_height) / graphic_aspect_width) - margin.top - margin.bottom;
    


d3.select("#grid").text().split("\n").forEach(function(line, i) {
  var re = /\w+/g, m;
  while (m = re.exec(line)) states.push({
    name: m[0],
    banned: banstates.indexOf(m[0]) >= 0,
    regulated: regulatestates.indexOf(m[0]) >= 0,
    x: m.index / 3,
    y: i
  });
});

var svg = d3.select("svg").style("width", width)
  .style("height", height);

var gridWidth = d3.max(states, function(d) { return d.x; }) + 1,
    gridHeight = d3.max(states, function(d) { return d.y; }) + 1


 

var cellSize = 40;
 if (container_width < mobile_threshold) {
        cellSize = 30;
    }


if (container_width < 400) {
        cellSize = 22;
    }


var state = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  .selectAll(".state")
    .data(states)
  .enter().append("g")
    .attr("class", function(d) { return "state" + 
      (d.regulated ? " state--reg" : "" || d.banned ? " state--banned" : "");

       })
    .attr("transform", function(d) { return "translate(" + (d.x - gridWidth / 2) * cellSize + "," + (d.y - gridHeight / 2) * cellSize + ")"; });

state.append("rect")
    .attr("x", -cellSize / 2)
    .attr("y", -cellSize / 2)
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1);

state.append("text")
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

  }

$(window).load(function() {
  
        

            pymChild = new pym.Child({ renderCallback: drawGraphic });
   
});

</script>
<script>

var margin = {top: 142, right: 100, bottom: 80, left:20},
    width = 980 ,
    height = 20 ;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.top + margin.bottom)
    .attr("height", height + margin.left + margin.right)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var values = [368.4, 171.6]

var colours = ['#2b8cbe', '#de2d26']

var data = []

var yOffset = 0

//Process the data

for(var i = 0; i < values.length; i++) {
    
    var datum = {
        
        value : values[i],
        colour : colours[i],
        x: 0,
        y: yOffset

    }
    
    yOffset += values[i]
    
    data.push(datum)
        
}

var bars = svg.selectAll('rect').data(data)

bars
    .enter()
    .append('rect')
    .attr({
        width : 30,
        height : function(d) {
            return d.value
        },
        y : function(d) {
            return d.y
        }
    })
    .attr("transform", "rotate(-90)")
    .style({
        fill : function(d) {
            return d.colour
        }
    })
 
    d3.selectAll("svg").append("svg:image")
      .attr("xlink:href", "https://s32.postimg.org/jy0e3b0o5/clinton_png.png")
      .attr("width", 150)
      .attr("height", 200)
      .attr('x', 10)
      .attr('y', -40)

    d3.selectAll("svg").append("svg:image")
      .attr("xlink:href", "https://s32.postimg.org/shjs1290l/trump_png.png")
      .attr("width", 150)
      .attr("height", 200)
      .attr('x', 410)
      .attr('y', -40);



    </script>

<div x="80" y="-40" class="explainer"><span class="percentage--hil">68.4%</span> Hillary Clinton <span style="margin-left: 17em;">Donald Trump <span class="percentage--tru">31.6%</span></div> 


 <script src="src/pym.js" type="text/javascript"></script>
