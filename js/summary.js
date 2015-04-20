// Summary menu and charts

function toggle(target){
  var artz = document.getElementsByClassName('article');
  var targ = document.getElementById(target);  
  var isVis = targ.style.display=='block';
    
  // hide all
  for(var i=0;i<artz.length;i++){
     artz[i].style.display = 'none';
  }
  // toggle current
  targ.style.display = isVis?'none':'block';
    
  return false;
}

// Summary layout
var margin = {top: 10, left: 10, bottom: 10, right: 10},
	height = 500,
	width = 500;

var summary1 = d3.select("sum1")
 	.append("div")
	.attr("class", "parcoords")
	.attr("id", "example")
	.style("height", height)
	.style("width", width)
	.append("div")
	.attr("id","grid");

var summary2 = d3.select("div#sum2.article")
	.append("div")
	.attr("class", "chart2")
	.style("width", width)
	.style("height", height)

// Parallel Corrdinates //
