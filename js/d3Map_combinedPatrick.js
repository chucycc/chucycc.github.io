// JavaScript Document
<!-- D3 -->
    	 var margin = {top: 10, left: 10, bottom: 10, right: 10},
	     width = parseInt(d3.select('.d3').style('width')),
		 width = width - margin.left - margin.right,
	     mapRatio = .5,
		 height = width * mapRatio;

    var projection = d3.geo.albersUsa()
      .scale(1200)
      .translate([width / 2 + 100, height / 2]);

    var zoom = d3.behavior.zoom()
      .scaleExtent([1, 30])
      .on("zoom", zoomed);

    var path = d3.geo.path()
      .projection(projection)
      .pointRadius(1.8); /* hospital dot radius */

    var svg = d3.select("div.d3")
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
	var fo = svg.append('foreignObject') 
    .attr({
      'x': 50,
      'y': 50,
      'width': 800,
      'height': height,
      'class': 'fo-textbox'});
    var div = fo.append('xhtml:div')
      .append('div')
	  .style("height",100)
	  .style("width",300)
      .attr("class", "textbox");
	var divBar = fo.append('xhtml:div')
	  .append('div')
	  .style("height", 300)
	  .style("width", 300)
	  .attr("class","barObj");
    var divHS = fo.append('xhtml:div')
      .append('div')
	  .style("height", 80)
	  .style("width", 400)
      .attr("class", "textboxHS");
	

    var content = div.append("p");
	var contentHS = divHS.append("p");
	var svgHS = divBar.append("svg");

    queue()
    .defer(d3.json, "zip.json")
    .defer(d3.json, "hospital.json")
    .defer(d3.csv, "tmp.csv")
    .await(ready);

function ready(error, us, hs) {
    var zip = topojson.feature(us, us.objects.zip_codes_for_the_usa);
	/*color*/
	var medianIncome = {};
    for(var i in dataset) {
        var zipcode = dataset[i]['Zip'];
        var median = dataset[i]['Median'];
        medianIncome[zipcode] = median;
    }
	
	g.selectAll(".zip")
    .data(zip.features)
    .enter().append("path")
    .attr("class", "zip")
    .attr("data-zip", function(d) {return d.properties.zip; })
    .attr("data-state", function(d) {return d.properties.state; })
    .attr("data-name", function(d) {return d.properties.name;})
        .style("fill",function(d,index) {
            var zip  = d.properties.zip;
            var median = medianIncome[zip];
            console.log("median is " + median)
            console.log(d)
            if(median < 39328) {
                return "#1B4D3E"
            } else if(median < 52564 && median >39328) {
                return "#4C9141"
            } else if(median > 52564) {
                return "#679267"
            } else {
                return "grey"
            }})
    .attr("d", path)
    .on('mouseover', mouseover)
	.on('mouseout', mouseoutHS);
	

    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b;}))
      .attr("class", "state-boundary")
        .attr("d", path);

    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a === b && a.id !== 2 && a.id !== 15;}))
    .attr("class", "land-boundary")
    .attr("d", path);
	
	g.selectAll(".point")
	.data(topojson.feature(hs, hs.objects.tmp).features)
	.enter().append("path")
	.attr("class", "hospital")
	.style("fill", function(d,index) {
		if(dataset[index]['Efficiency'] > .005243) {
			return "yellow"
		} else {
			return "red"
		}})
	.attr("d", path)
	.on('mouseover', function(data, index) {
		mouseoverHS(dataset[index])
	})
	};
	

var dataset;
var obj_names;
d3.csv("tmp.csv", function(data){
	obj_names = Object.keys(data[0]).slice(5,15);
	data.forEach(function(row) {
   		row.variables = obj_names.map(function(name) { return {name: name, value: +row[name]}; });
	});
	dataset = data;
});
function zoomed() {
  	g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function mouseover(d,i) {
 	 content
 	 .html( "<h1>" + d.properties.name + ", " + d.properties.state + "</h1>" + "<p>Zip Code: <b>" + d.properties.zip + "</b><br>Median Annual Income:<h2>$" + dataset[i]['Median'] + "</h2></p>" );
}


function mouseoverHS(d, i) {
 	 contentHS /* Hospital infobox */
 	 .html(  "<h1>" + dataset[i]['Hospital Name'] + "</h1><p>Medicare Spending:</p><h2>" + dataset[i]['total Expenditures'] + "</h2><p>" + dataset[i]['Address'] + "</p>");
	 
		console.log(obj_names);
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
		
		x.domain(dataset[i].variables);
		y.domain([0, 100]);
	
		var barWidth = width / 10;
		var bar = svgHS.selectAll("g")
		   .data(dataset[i].variables)
		   .enter().append("g")
		   
		   .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
	
		bar.append("rect")
		   .attr("y", function(d) { 
			return y(d.value); })
		   .attr("height", function(d) { 
			return height - y(d.value); })
		   .attr("width", barWidth - 1);
	
		bar.append("text")
			
			.attr("x", barWidth / 2 -5)
			.attr("y", y(d.value))
			.attr("dy", ".3em")
			.text(function(d) { return d.value; })
			.attr("class","num");
}

/*function clicked(d) {
 	 contentHS
 	 .html("hospital data click");
}*/
function mouseoutHS() {
	svgHS.html("");
}

function reset() {
 	 content.html("");
	 contentHS.html("");
	 svgHS.html("");
}

