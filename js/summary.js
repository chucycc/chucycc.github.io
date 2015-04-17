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
	width = 800;

var summary1 = d3.select("div#sum1.article")
 	.append("chart1")
	.style("height", height)
	.attr("width", width)
	.attr("background-color", black);

var summary2 = d3.select("div#sum2.article")
	.append("chart2")
	.attr("width", width)
	.attr("height", height)

