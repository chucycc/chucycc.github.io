// JavaScript Document
<!-- D3 -->
    var margin = {top: 10, left: 10, bottom: 10, right: 10},
	    width = parseInt(d3.select('.d3-map').style('width')),
		  width = width - margin.left - margin.right,
	    mapRatio = .6,
		  height = width * mapRatio;

    var projection = d3.geo.mercator()
      .center([-95, 38])
      .scale(width*0.9)
      .rotate([,]);

	var color = d3.scale.log()
      .domain([20000, 200000])
      .range(["yellow", "green"]);

	var X = d3.scale.linear()
      .domain([0,width])
	  .range([0,width])
	var Y = d3.scale.linear()
      .domain([0,height])
      .range([0,height]);


    var path = d3.geo.path()
      .projection(projection)
 //     .pointRadius(1.8); /* hospital dot radius */
 	var bar = d3.select("div.d3-bar")
 	.style("height", height);

    var svg = d3.select("div.d3-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "land-glow");

    var rect = svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on('mouseover', reset);

    var g = svg.append("g")


    /*Zip infobox*/
    var div = bar
      .append('div')
	  .style("height",100)
      .attr("class", "textbox");
	var divHSrank = bar
	  .append('div')
	  .style("height", 80)
	  .style("width", "100%")
	  .attr("class", "textboxHSR");
	var divBar = bar
	  .append('div')
	  .style("height", 200)
	  .style("width", 220)
	  .attr("class","barObj");
    var divHS = bar
      .append('div')
	  .style("height", 80)
	  .style("width", "100%")
	  .style("overflow", "visible")
      .attr("class", "textboxHS");

    var content = div.append("p");
	var contentHS = divHS.append("p");
	var svgHS = divBar.append("svg");

    queue()
    .defer(d3.json, "zip.json")
    .defer(d3.csv, "data.csv")
    .defer(d3.csv, "markhs.csv")
    .await(ready);


function ready(error, us, hs, ms) {

  var zoom = d3.behavior.zoom()
      .x(X)
      .y(Y)
      .scaleExtent([1, 25])
      .on("zoom", zoomed);

  var zip = topojson.feature(us, us.objects.tl_2014_us_zcta510);

	var obj_names = Object.keys(hs[0]).slice(7,17);
	hs.forEach(function(row) {
   		row.variables = obj_names.map(function(name) { return {name: name, value: +row[name]}; });
	});

// zip code region
    var zipregion = g.selectAll(".zip")
    .data(zip.features)
    .enter().append("path")
    .attr("class", "zip")
    .attr("d", path)
    .style("fill", function(d){
      return color(d.properties.income);})
    .on('mouseover', mouseover);

// state-boundary
    var statebound = g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b;}))
      .attr("class", "state-boundary")
        .attr("d", path);

// land-boundary
    var landbound = g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a === b && a.id !== 2 && a.id !== 15;}))
    .attr("class", "land-boundary")
    .attr("d", path);

// hospital dots
    var active = false;
    var circle = g.selectAll("circle")
     .data(hs)
     .enter()
     .append("circle")
     .attr("r", 1.8)
     .attr("transform", transform)
     .attr("class", "hospital")
      .on('mouseover', mouseoverHS)
      .on('mouseout', mouseoutHS)
      .on('click', clicked);
/*
    var mark = g.selectAll(".mark")
      .data(ms)
      .enter().append("image")
      .attr("class", "mark")
      .attr("width", 32)
      .attr("height", 32)
      .attr("xlink:href",'map-marker.png')
      .attr("transform", transform);
*/
    var cc = ["high spending, low quality"];
    var mark2 = g.selectAll(".mark")
      .data(ms)
      .enter().append("circle")
      .attr("class", "mkhs")
      .attr("r", 30)
      .attr("transform", transform);
    var text1 = g.selectAll(".marktext1")
      .data(ms)
      .enter().append("text")
      .attr("class", "marktext1")
      .attr("transform", transform2)
      .text(function(d){return d.text1;});
    var text2 = g.selectAll(".marktext2")
      .data(ms)
      .enter().append("text")
      .attr("class", "marktext2")
      .attr("transform", transform3)
      .text(function(d){return d.text2;});

    svg.append("text")
    .attr("x", width * 0.75)
    .attr("y", height * 0.1)
    /*.text("hello");*/

    svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

    function zoomed() {
	  statebound.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  	landbound.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  	zipregion.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  	mark2.attr("transform", transform);
    circle.attr("transform", transform);
    text1.attr("transform", transform2);
    text2.attr("transform", transform3)
  	if (d3.event.scale > 5) {
  		circle.attr("r", 3.6);
  	}
  	else {
  		circle.attr("r", 1.8);
  	};
	}
  function transform(d) {
  	  return "translate(" + X(projection([d.lng, d.lat])[0]) + "," + Y(projection([d.lng, d.lat])[1]) + ")";
	}
  function transform2(d) {
      return "translate(" + (X(projection([d.lng, d.lat])[0])-70) + "," + (Y(projection([d.lng, d.lat])[1])-60) + ")";
  }
  function transform3(d) {
      return "translate(" + (X(projection([d.lng, d.lat])[0])-70) + "," + (Y(projection([d.lng, d.lat])[1])-40) + ")";
  }
};



function mouseover(d) {
 	 content
 	 .html("<p>Zip Code: <b>" + d.properties.zip + "</b><h1>Median Annual Income:</h1><h2>$" + d.properties.income + "</h2></p>");
}

function mouseoverHS(d, i) {
	active = false;
 	 contentHS /* Hospital infobox */
 	 .html(  "<h1>" + d.Hospital_Name + "</h1><p>Medicare Spending:</p><h2>" + d.Expenditures + "</h2><p>" + d.Address + "</p>");

		/* Hospital quality bar charts */
		var width = 200,
		    height = 200;
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);
		
		svgHS
		.attr("width", width)
		.attr("height", height);
		
		x.domain(d.variables);
		y.domain([0, 150]);
	
		var barWidth = width / 10 - 1;
		var bar = svgHS.selectAll("g")
		   .data(d.variables)
		   .enter().append("g")
		   .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
		
		bar.append("rect")
		   .attr("y", function(d) { 
			return y(d.value); })
		   .attr("height", function(d) { 
			return height - y(d.value); })
		   .attr("width", barWidth - 2)
		   .attr("fill", function(d) {
    			return "rgb(" + (d.value*10 - 850) + ", " + (d.value * 10 -800) + ",0)";
			});
		//bar chart tooltip numbers
		bar.append("text")
		   .attr("id","QuanNum")
		   .attr("x", function(d, i) {
				return (barWidth*0.25 - 5) * i + (barWidth*0.5 -1);
		   })
		   .attr("y", function(d) {
				return y(d.value) - 3;
		   })
		   .text(function(d) {
				return d.value;
		   })
		   .style("text-anchor","middle")
		/* bar chart tooltip labels
		bar.append("text")
			.attr("x", function(d, i) {
				return (barWidth*0.25 - 5) * i + (barWidth*0.5 -1);
		   })
		   .attr("y", function(d) {
				return y(d.value) - 6;
		   })
		   .text(function(d) {
				return d.variables;
		   })
		   .style("text-anchor","middle") */
}

function clicked(d,i) {
	active = true;
}
function mouseoutHS() {
	if (active === true) return;
	contentHS.html("");
	svgHS.html("");
}

function reset() {
 	 content.html("");
	 /*svgHS.html("");*/
}

