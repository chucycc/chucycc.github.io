// Summary menu and charts
var HaveCircle = false;

function toggle(target){
  var artz = document.getElementsByClassName('article');
  var targ = document.getElementById(target);  
  var isVis = targ.style.display=='block';
    console.log(targ.id);
  // hide all
  for(var i=0;i<artz.length;i++){
     artz[i].style.display = 'none';
  }
  // toggle current

  targ.style.display = isVis?'none':'block';

  // to show Parallel Corrdinates
  if (targ.id === "sum4") {
    update_para();
  }
  if (targ.id === "sum6") {
	 update_matrix();
  }

  if (targ.id === "sum2" && !HaveCircle){
    update_region();
  }
  return false;
}

// Summary layout

var summary1 = d3.select("div#sum1.article")
  .append("div")
  .attr("class", "density-map");

var summary2 = d3.select("div#sum2.article")
  .append("div")
  .attr("class", "state-map");

function update_region(){
    var circlecolor = d3.scale.linear()
      .domain([-1, 1])
      .range(["orange", "#92D400"]);
    var data = [-0.20, 0.10, 0.35, -0.11, 0.57];
    var circlescale = d3.scale.linear()
                      .domain(data)
                      .range([10, 30]);
    HaveCircle = true;
    var g = d3.select("g.pacific");
    var bbox = g.node().getBBox();
    g.append("circle")
      .attr("class", "region-circle")
      .attr("r", circlescale(Math.abs(data[0])))
      .attr("cx", bbox.x + bbox.width/3)
      .attr("cy", bbox.y + bbox.height/2)
      .style("fill",function(d) { return circlecolor(data[0]); });
    g.append("text")
      .attr("x", bbox.x + bbox.width/3)
      .attr("y", bbox.y + bbox.height/2-10)
      .attr("text-anchor", "middle")
      .attr("class", "region-name")
      .text("Pacific");
    g.append("text")
      .attr("x", bbox.x + bbox.width/3)
      .attr("y", bbox.y + bbox.height/2+10)
      .attr("text-anchor", "middle")
      .attr("class", "region-percent")
      .text(dstring(data[0]));

    g = d3.select("g.mountain");
    bbox = g.node().getBBox();
    g.append("circle")
      .attr("class", "region-circle")
      .attr("r", circlescale(Math.abs(data[1])))
      .attr("cx", bbox.x + bbox.width/2)
      .attr("cy", bbox.y + bbox.height/2)
      .style("fill",function(d) { return circlecolor(data[1]); });
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2-10)
      .attr("text-anchor", "middle")
      .attr("class", "region-name")
      .text("Mountain");
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2+10)
      .attr("text-anchor", "middle")
      .attr("class", "region-percent")
      .text(dstring(data[1]));

    g = d3.select("g.midwest");
    bbox = g.node().getBBox();
    g.append("circle")
      .attr("class", "region-circle")
      .attr("r", circlescale(Math.abs(data[2])))
      .attr("cx", bbox.x + bbox.width/2)
      .attr("cy", bbox.y + bbox.height/2)
      .style("fill",function(d) { return circlecolor(data[2]); });
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2-10)
      .attr("text-anchor", "middle")
      .attr("class", "region-name")
      .text("Midwest");
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2+10)
      .attr("text-anchor", "middle")
      .attr("class", "region-percent")
      .text(dstring(data[2]));

    g = d3.select("g.south");
    bbox = g.node().getBBox();
    g.append("circle")
      .attr("class", "region-circle")
      .attr("r", circlescale(Math.abs(data[3])))
      .attr("cx", bbox.x + bbox.width/2)
      .attr("cy", bbox.y + bbox.height/2)
      .style("fill",function(d) { return circlecolor(data[3]); });
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2-10)
      .attr("text-anchor", "middle")
      .attr("class", "region-name")
      .text("South");
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2+10)
      .attr("text-anchor", "middle")
      .attr("class", "region-percent")
      .text(dstring(data[3]));

    g = d3.select("g.northeast");
    bbox = g.node().getBBox();
    g.append("circle")
      .attr("class", "region-circle")
      .attr("r", circlescale(Math.abs(data[4])))
      .attr("cx", bbox.x + bbox.width/2)
      .attr("cy", bbox.y + bbox.height/2)
      .style("fill",function(d) { return circlecolor(data[4]); });
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2-10)
      .attr("text-anchor", "middle")
      .attr("class", "region-name")
      .text("Northeast");
    g.append("text")
      .attr("x", bbox.x + bbox.width/2)
      .attr("y", bbox.y + bbox.height/2+10)
      .attr("text-anchor", "middle")
      .attr("class", "region-percent")
      .text(dstring(data[4]));

}

function dstring(d){
  if (d > 0) {
    return "+" + Math.round(+d*100) + "%";
  }
  return Math.round(+d*100) + "%";
}

function update_para() {
  d3.select("#example").html("");
  d3.select("#grid").html("");
  var chosen = document.getElementById("selectedState");
  var selectedState = chosen.value;
  var blue_to_brown = d3.scale.linear()
  .domain([0, 50])
  .range(["orange","#92D400"])/*"#92D400"*/
  .interpolate(d3.interpolateLab);

  var color = function(d) { return blue_to_brown(d['Hospital Performance']); };

  var parcoords = d3.parcoords()("#example")
    .color(color)
    .alpha(0.4);
  
// load csv file and create the chart
  d3.csv('paraCo.csv', function(data) {
  if (selectedState ==='R') { 
    d3.shuffle(data);
    data = data.filter(function(row, i) {
      return i < 100;
    })
  }
  else {
    data = data.filter(function(row) {
      return row['State'] == selectedState;
    })
  }
  parcoords
    .data(data)
    .hideAxis(["name"])
  .hideAxis(["ZIP Code"])
  .hideAxis(["State"])
    .render()
    .brushMode("1D-axes"); // enable brushing

  // create data table, row hover highlighting
  var grid = d3.divgrid();
  d3.select("#grid")
    .datum(data.slice(0,10))
    .call(grid)
    .selectAll(".gridrow")
    .on({
      "mouseover": function(d) { parcoords.highlight([d]) },
      "mouseout": parcoords.unhighlight
    });

  // update data table on brush event
  parcoords.on("brush", function(d) {
    d3.select("#grid")
      .datum(d.slice(0,10))
      .call(grid)
      .selectAll(".gridrow")
      .on({
        "mouseover": function(d) { parcoords.highlight([d]) },
        "mouseout": parcoords.unhighlight
        });
    });
    });
}

// Scatter Plot Matrix

function update_matrix() {
  d3.select("#matrix").html("");
  var chosen = document.getElementById("selectedState");
  var selectedState = chosen.value;
  
var width = 600,
    size = 150,
    padding = 19.5;

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var matrixColor = d3.scale.ordinal()
  .domain(["high", "medium", "low"])
  .range(["#92D400", "#eaf400" , "#dfe2a5"]);


d3.csv("plotMatrix.csv", function(error, data) {
	if (selectedState ==='R') { 
    d3.shuffle(data);
    data = data.filter(function(row, i) {
      return i < 100;
    })
  }
  else {
    data = data.filter(function(row) {
      return row['State'] == selectedState;
    })
  }
  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return d !== "spending" && d !== "State"; }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var brush = d3.svg.brush()
      .x(x)
      .y(y)
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

  var svg = d3.select("#matrix").append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  svg.selectAll(".x.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axis")
      .style("stroke", "grey")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .style("stroke", "grey")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
  	  .attr("class","diagonalLabel")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .style("fill","none")
        .style("stroke","#aaa")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 3)
        .style("fill", function(d) { return matrixColor(d.spending); });
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.clear());
      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = brush.extent();
    svg.selectAll("circle").classed("hidden", function(d) {
      return e[0][0] > d[p.x] || d[p.x] > e[1][0]
          || e[0][1] > d[p.y] || d[p.y] > e[1][1];
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

  d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
});

}