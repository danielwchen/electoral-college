/*
 *  PersonChart - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

 PersonChart = function(_parentElement, _currInd, _eventHandler) {

  this.parentElement = _parentElement;
  this.currInd = _currInd;
  this.eventHandler = _eventHandler;

  this.fin_data = [];



  this.initVis();
};

PersonChart.prototype.initVis = function() {

  var vis = this;

  // vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
  // vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  // vis.height = 600 - vis.margin.top - vis.margin.bottom;
  vis.width = $(vis.parentElement).width();
  vis.height = 400;

  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width)
  .attr("height", vis.height)
  .attr("fill", "gray");

  d3.queue()
  .defer(d3.csv, 'data/votingpowerbyrace.csv')
  .await(function(error, data) {
    vis.wrangleData(data);
  });

};

PersonChart.prototype.wrangleData = function(data) {
  var vis = this;

  console.log(data);
  vis.fin_data = data;

  vis.createVis();

};

PersonChart.prototype.createVis = function() {
  var vis = this;

  vis.svg.append("text")
  .text("normalized to relative ratios")

  vis.updateVis();
};

PersonChart.prototype.updateVis = function() {
  var vis = this;

}

PersonChart.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  vis.svg.attr("width",vis.width);

}

PersonChart.prototype.setOpacity = function(ind) {
  var vis = this;

  

}

      // function drawpeople() {
      //   var svg = d3.select("#vis").append("svg")
      //     .attr("width", 400)
      //     .attr("height", 400);


      //   svg.append("path")
      //     // .attr("d", 'M 200 200 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 h -30 v -50 h -10 z')
      //     // .attr("d", 'M 200 200 h -15 v -50 h -10 v -50 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 z')
      //     .attr("d", personpath (200, 200, 1.3))
      //     .attr("fill", "gray")
      //     .attr("stroke", "black")
      //     .attr("stroke-width","3")
      //     .style("stroke-dasharray", ("10, 10"));


      //   svg.append("path")
      //     // .attr("d", 'M 200 200 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 h -30 v -50 h -10 z')
      //     // .attr("d", 'M 200 200 h -15 v -50 h -10 v -50 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 z')
      //     .attr("d", personpath (100, 200, 1))
      //     .attr("fill", "pink")
      //     .attr("stroke", "red")
      //     .attr("stroke-width","3");


      //   svg.append("path")
      //     // .attr("d", 'M 200 200 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 h -30 v -50 h -10 z')
      //     // .attr("d", 'M 200 200 h -15 v -50 h -10 v -50 h 22 a 16,16 0 1,1 6,0 h 22 v 50 h -10 v 50 z')
      //     .attr("d", personpath (300, 200, .92))
      //     .attr("fill", "lightblue")
      //     .attr("stroke", "blue")
      //     .attr("stroke-width","3");

      //   // x, y define the bottom center point, p is the percent value
      //   function personpath (x, y, p) {
      //     var h = (132 * p  - 32 - 100) / 2;
      //     return "M" + x + "," + y 
      //     + "h-15v" + (-50 - h) 
      //     + "h-10v" + (-50 - h) 
      //     + "h22a16,16 0 1,1 6,0 h22v" + (50 + h) 
      //     + "h-10v" + (50 + h) 
      //     + "z";
      //   }
      // }