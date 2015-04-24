// Summary menu and charts

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
    var chosen = document.getElementById("selectedState");
    var selectedState = chosen.options[chosen.selectedIndex].value;
    var blue_to_brown = d3.scale.linear()
      .domain([0, 50])
      .range(["orange", "#92D400"])
      .interpolate(d3.interpolateLab);

    var par_color = function(d) { return blue_to_brown(d['Hospital Performance']); };

    var parcoords = d3.parcoords()("#example")
      .color(par_color)
      .alpha(0.4);
  
  // load csv file and create the chart
    d3.csv('paraCo.csv', function(data) {
    data = data.filter(function(row) {
      return row['State'] == selectedState;
    })
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
      .selectAll(".row")
      .on({
        "mouseover": function(d) { parcoords.highlight([d]) },
        "mouseout": parcoords.unhighlight
      });
    parcoords.on("brush", function(d) {
      d3.select("#grid")
        .datum(d.slice(0,10))
        .call(grid)
        .selectAll(".row")
        .on({
          "mouseover": function(d) { parcoords.highlight([d]) },
          "mouseout": parcoords.unhighlight
        });
    });
    });
  }
  return false;
}

// Summary layout

var summary2 = d3.select("div#sum2.article")
	.append("div")
	.attr("class", "state-map");

// Text scroll down
function smallscroll(target) {
  $('html,body,div').animate({ scrollTop: $(target+'1').offset().top }, 'slow');
  return false;
}
