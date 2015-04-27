var statemap_width = 600,
    statemap_height = 400;


var state_svg = d3.select("div.state-map")
	  .append("svg")
      .attr("width", statemap_width)
      .attr("height", statemap_height)
      .attr("class", "svg-state-map");

var state_projection = d3.geo.albersUsa()
    .scale(700)
    .translate([statemap_width / 2, statemap_height / 2]);

var state_path = d3.geo.path()
    .projection(state_projection);

var dmap_svg = d3.select("div.density-map")
    .append("svg")
      .attr("width", statemap_width)
      .attr("height", statemap_width);
var dmap_g = dmap_svg.append("g");

var csv;
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
      return "<span class=\"tooltip-text\"><strong>State: </strong></span>" + csv[d.oid].State + "<br><span class=\"tooltip-text\"><strong>Coefficient: </strong></span>" + dstring(csv[d.oid].coefficient);
    });
state_svg.call(tip);
    queue()
    .defer(d3.json, "us2.json")
    .defer(d3.csv, "Statecoefficients.csv")
    .await(regionmap);

function regionmap(error, us, sc){
  csv = sc;
    var region = [null, 3, 0, null, 1, 3, 0, null, 1, 4, 4, 4, 3, 3,
              null, 0, 1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 2, 2, 3, 2,
              1, 2, 1, 4, 4, 1, 4, 3, 2, 2, 3, 0, 4, null, 4, 3,
              2, 3, 3, 1, 4, 3, null, 0, 3, 2, 1 ];
  var name = ["pacific", "mountain", "midwest", "south", "northeast"];
  var move = [[-25, -15],[0, 0], [20, -10], [20, 15], [40, -10]];
  var darray = [[],[],[],[],[]];
  us = topojson.feature(us, us.objects.states).features;
  us = us.filter(function(d){
    return d.id > 0 && d.id < 57;
  });
  us.sort(function(a, b){return a.id-b.id});
  dmap_g.selectAll("path")
    .data(us)
    .enter().append("path")
    .attr("d", state_path)
    .attr("class", "region-map");

  us.forEach(function(d, i){
    d["oid"] = i;
    darray[region[d.id]].push(d);
  });
  darray.forEach(function(states, i){
    state_svg.append("g").attr("class", name[i])
    .selectAll("path")
    .data(states)
    .enter().append("path")
    .attr("d", state_path)
    .attr("class", "region-map")
    .attr("id", name[i])
    .attr("transform", function(d) {
      var index = region[d.id],
          x = move[index][0],
          y = move[index][1];

      return "translate(" + x + "," + y + ")";
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  });

  var r = 10;
  function movecircle(d) {
    d3.select(this)
      .attr("cx", Math.max(10+r, Math.min(300-r, d3.event.x)));
  }

  var dragbar = d3.behavior.drag()
    .on("drag", movecircle);

  var line = dmap_svg.append("line")
    .attr("x1", 10)
    .attr("y1", 30)
    .attr("x2", 300)
    .attr("y2", 30)
    .attr('stroke', "#ddd")
    .attr('stroke-width', "3px");;

  var circle = dmap_svg.append("circle")
    .attr("id", "handle")
    .attr("cx", 30)
    .attr("cy", 30)
    .attr("r", r)
    .attr("fill", "#92D400")
    .call(dragbar);

}

