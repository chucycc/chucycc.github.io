var statemap_width = 500,
    statemap_height = 300;


var state_svg = d3.select("div.state-map")
	  .append("svg")
      .attr("width", statemap_width)
      .attr("height", statemap_height);
var state_g = state_svg.append("g");

var state_projection = d3.geo.albersUsa()
    .scale(500)
    .translate([statemap_width / 2, statemap_height / 2]);

var state_path = d3.geo.path()
    .projection(state_projection);

d3.json("us2.json", function(error, us) {
	var region = [null, 3, 0, null, 1, 3, 0, null, 1, 4, 4, 4, 3, 3,
              null, 0, 1, 2, 2, 2, 2, 3, 3, 4, 4, 4, 2, 2, 3, 2,
              1, 2, 1, 4, 4, 1, 4, 3, 2, 2, 3, 0, 4, null, 4, 3,
              2, 3, 3, 1, 4, 3, null, 0, 3, 2, 1 ];

	var move = [[-25, -15],[0, 0], [20, -10], [20, 15], [40, -10]];

    var statebound = state_g.selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", state_path)
      .attr("class", "state-boundary")
      .attr("transform", function(d) {
      	if (d.id > 0 && d.id < 57){
        	var index = region[d.id],
        		x = move[index][0],
        		y = move[index][1];

        	return "translate(" + x + "," + y + ")";
    	}
      });

});