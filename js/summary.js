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

var summary2 = d3.select("div#sum2.article")
	.append("div")
	.attr("class", "state-map");
	


/*
var summary2 = d3.select("div#sum2.article")
	.append("div")
	.attr("class", "chart2")
	.style("width", width)
	.style("height", height)
*/
// Parallel Corrdinates //
