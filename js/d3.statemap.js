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

var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
      return "<strong>Frequency:</strong>";
    });
state_svg.call(tip);
d3.json("us2.json", function(error, us) {
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
  dmap_g.selectAll("path")
    .data(us)
    .enter().append("path")
    .attr("d", state_path)
    .attr("class", "region-map");

  us.forEach(function(d){
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

});
