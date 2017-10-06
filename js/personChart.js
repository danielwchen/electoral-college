/*
 *  PersonChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

 PersonChart = function(_parentElement, _currInd, _eventHandler) {

  this.parentElement = _parentElement;
  this.currInd = _currInd;
  this.eventHandler = _eventHandler;

  this.fin_data;
  this.opacities;
  this.positions;

  this.initVis();
};

PersonChart.prototype.initVis = function() {

  var vis = this;

  vis.width = $(vis.parentElement).width();
  vis.height = 400;

  var z = vis.width/6;

  vis.positions = [z, z*2, z*3, z*4, z*5];

  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width)
  .attr("height", vis.height)
  .attr("fill", "gray");

  d3.queue()
  .defer(d3.csv, "data/votingpowerbyrace.csv")
  .defer(d3.csv, "data/opacities.csv")
  .await(function(error, data, opacities) {
    vis.wrangleData(data);
  });

};

PersonChart.prototype.wrangleData = function(data, opacities) {
  var vis = this;

  console.log(data);
  console.log(opacities);
  vis.fin_data = data;
  vis.opacities = opacities;

  vis.createVis();

};

PersonChart.prototype.createVis = function() {
  var vis = this;

  vis.svg.append("text")
  .text("normalized to relative ratios")
  .attr("x", 100)
  .attr("y", 100);

  vis.people = vis.svg.selectAll(".peoplebar")
  .data(vis.fin_data)
  .enter().append("path")
  .attr("class", "peoplebar")
  .attr("d", function(d, i) {
    return vis.getPersonPath (vis.getPosition(i), vis.height - 100, d.votingpower);
  })
  .attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  })
  .attr("fill", "red")
  .attr("stroke", "black")
  .attr("stroke-width","1");

};

PersonChart.prototype.updateVis = function() {
  var vis = this;

  vis.people.attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  });

}

PersonChart.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width();
  vis.svg.attr("width",vis.width);

  var z = vis.width/6;

  vis.positions = [z, z*2, z*3, z*4, z*5];

  vis.updateVis;

}

PersonChart.prototype.getOpacity = function(ind) {
  var vis = this;

  return 1;
}

PersonChart.prototype.getPosition = function(num) {
  var vis = this;

  return vis.positions[num];
}


// x, y define the bottom center point, p is the percent value
PersonChart.prototype.getPersonPath = function(x, y, p) {
  var vis = this;

  var h = (132 * p  - 32 - 100) / 2;

  return "M" + x + "," + y 
  + "h-15v" + (-50 - h) 
  + "h-10v" + (-50 - h) 
  + "h22a16,16 0 1,1 6,0 h22v" + (50 + h) 
  + "h-10v" + (50 + h) 
  + "z";
}