// JavaScript Document
<!-- D3 -->
    var margin = {top: 10, left: 10, bottom: 10, right: 10},
	    width = parseInt(d3.select('.d3-map').style('width')),
		  width = width - margin.left - margin.right,
	    mapRatio = .6,
		  height = width * mapRatio;

    var projection = d3.geo.mercator()
      .center([-95, 40])
      .scale(width*0.9)
      .rotate([,]);

/*    var projection = d3.geo.albersUsa()
      .scale(1200)
      .translate([width / 2 + 100, height / 2]);*/

/*    var color = d3.scale.threshold()
      .domain([20000,40000,60000,80000,100000,120000,160000,180000,200000])
      .range(["#F7FFB3", "#ECFC70", "#C4FC70", "#9AD345", "#7DAE35", "#5A8021", "#436115", "#30470C", "#233705", "#192804"]);
*/
	var color = d3.scale.log()
      .domain([20000, 200000])
      .range(["yellow", "green"]);

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 30])
      .on("zoom", zoomed);

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
    svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

    /*Zip infobox*/
/*	var fo = svg.append('foreignObject') 
    .attr({
      'x': 50,
      'y': 50,
      'width': 400,
      'height': height,
      'class': 'fo-textbox'});*/
    var div = bar
      .append('div')
	  .style("height",100)
	  .style("width","100%")
      .attr("class", "textbox");
	var divHSrank = bar
	  .append('div')
	  .style("height", 80)
	  .style("width", "100%")
	  .attr("class", "textboxHSR");
	var divBar = bar
	  .append('div')
	  .style("height", 300)
	  .style("width", "100%")
	  .attr("class","barObj");
    var divHS = bar
      .append('div')
	  .style("height", 80)
	  .style("width", "100%")
      .attr("class", "textboxHS");

    var content = div.append("p");
	var contentHS = divHS.append("p");
	var svgHS = divBar.append("svg");

    queue()
    .defer(d3.json, "zip.json")
    .defer(d3.csv, "data.csv")
    .await(ready);

function ready(error, us, hs) {
    var zip = topojson.feature(us, us.objects.tl_2014_us_zcta510);

	var obj_names = Object.keys(hs[0]).slice(7,17);
	hs.forEach(function(row) {
   		row.variables = obj_names.map(function(name) { return {name: name, value: +row[name]}; });
	});

// zip code region
    g.selectAll(".zip")
    .data(zip.features)
    .enter().append("path")
    .attr("class", "zip")
    .attr("d", path)
    .style("fill", function(d){
      return color(d.properties.income);})
    .on('mouseover', mouseover);

// state-boundary
    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b;}))
      .attr("class", "state-boundary")
        .attr("d", path);

// land-boundary
    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a === b && a.id !== 2 && a.id !== 15;}))
    .attr("class", "land-boundary")
    .attr("d", path);

// hospital dots
    var active = false;
    g.selectAll("circle")
     .data(hs)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
        return projection([d.lng, d.lat])[0];
     })
     .attr("cy", function(d) {
        return projection([d.lng, d.lat])[1];
     })
     .attr("r", 1.8)
     .attr("class", "hospital")
      .on('mouseover', mouseoverHS)
      .on('mouseout', mouseoutHS)
      .on('click', clicked);

    svg.append("text")
    .attr("x", width * 0.75)
    .attr("y", height * 0.1)
    .text("hello");

/*    var active = false;
	g.selectAll(".point")
		.data(topojson.feature(hs,hs.objects.tmp).features)
      .enter().append("path")
      .attr("class", "hospital")
      .attr("d", path)
      .on('mouseover', mouseoverHS)
      .on('mouseout', mouseoutHS)
      .on('click', clicked);*/
};

function zoomed() {
  	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function mouseover(d) {
 	 content
 	 .html("<p>Zip Code: <b>" + d.properties.zip + "</b><br>Median Annual Income:<h2>$" + d.properties.income + "</h2></p>");
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
	
		var barWidth = width / 10;
		var bar = svgHS.selectAll("g")
		   .data(d.variables)
		   .enter().append("g")
		   .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
		
		bar.append("rect")
		   .attr("y", function(d) { 
			return y(d.value); })
		   .attr("height", function(d) { 
			return height - y(d.value); })
		   .attr("width", barWidth - 1)
		  //Create the tooltip label
		  
		  /*bar.append("text")
			.attr("transform","rotate(-90)")
			.attr("x", barWidth / 2)
			.attr("y", function(d){return y(d) -3;})
			.attr("dy", ".7em")
			.style("text-anchor","middle")
			.text(function(d) { return d.value; })*/
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

