/*
 Thanks to http://bl.ocks.org/mbostock/4055908
 */

/*
 *  ElectoralMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _eventHandler    -- Event handler
 */

 ElectoralMap = function(_parentElement, _currInd, _eventHandler) {

  this.parentElement = _parentElement;
  this.currInd = _currInd;
  this.eventHandler = _eventHandler;


  this.fin_json;
  this.fin_data = [];
  this.scale_factor = ["none", "electoralvotesfactor","electoralpower"];

  this.initVis();
};

ElectoralMap.prototype.initVis = function() {

  var vis = this;

  vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
  vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  vis.height = 600 - vis.margin.top - vis.margin.bottom;


  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width", vis.width + vis.margin.left + vis.margin.right)
  .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
  .append("g")
  .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  d3.queue()
  .defer(d3.json, 'data/us-states.json')
  .defer(d3.csv, 'data/allcartogramdata.csv')
  .await(function(error, json, data) {
    vis.wrangleData(json, data);
  });

};

ElectoralMap.prototype.wrangleData = function(json, data) {
  var vis = this;

  data.forEach(function(d) {
    data.clintonvotes = +data.clintonvotes;
    data.clintonpercent = +data.clintonpercent;
    data.trumpvotes = +data.trumpvotes;
    data.trumppercent = +data.trumppercent;
    data.othervotes = +data.othervotes;
    data.otherpercent = +data.otherpercent;
    data.electoralvotes = +data.electoralvotes;
    data.electoralvotesfactor = +data.electoralvotesfactor;
    data.electoralpower = +data.electoralpower;
    data.electoralpower = 5;
  });
  data.forEach(function(d,index) {
    vis.fin_data[d.state] = d;
  });

  vis.fin_json = json;

  // console.log(vis.fin_json);
  // console.log(vis.fin_data);

  vis.createVis();

};

ElectoralMap.prototype.createVis = function() {
  var vis = this;

  vis.projection = d3.geoAlbersUsa()
  .translate([vis.width/2, vis.height/2])
  .scale([vis.width*.8]);

  vis.updateVis();
};

ElectoralMap.prototype.updateVis = function() {
  var vis = this;

  var x, y;

  vis.path = d3.geoPath()
  .projection(vis.projection);

  vis.svg.selectAll(".bg-map")
  .data(vis.fin_json.features)
  .enter().append("path")
  .attr("class", "bg-map")
  .attr("d", vis.path)
  .attr("stroke","black")
  .attr("fill-opacity",0)
  .attr("fill","lightgray");

  vis.svg.selectAll(".state")
  .data(vis.fin_json.features)
  .enter().append("path")
  .attr("class", "state")
  .attr("d", vis.path)
  .attr("transform", function(d) {
    var centroid = vis.path.centroid(d),
    x = centroid[0],
    y = centroid[1];
    return "translate(" + x + "," + y + ")"
    + "scale(" + vis.setScale(d.properties.name) + ")"
    + "translate(" + -x + "," + -y + ")";
  })
  .attr("fill",function(d) {vis.setColor(d.properties.name);})
  .attr("opacity",.3)
  .attr("stroke","black");
}

ElectoralMap.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
  vis.svg.attr("width",vis.width);
  vis.projection.scale([vis.width*.8]);


}

ElectoralMap.prototype.rescale = function(ind) {
  var vis = this;

  vis.currInd = ind;
  vis.updateVis();
}

ElectoralMap.prototype.setColor = function(state) {
  var vis = this;

  if (vis.currInd = 0) {
    return "gray";
  } else if (vis.currInd = 1) {
    console.log("here");
    if (vis.fin_data[state].winparty == "R") { return "red" }
      else { return "blue" };
  } else {
    return "gray";
  }
}

ElectoralMap.prototype.setScale = function(state) {
  var vis = this;

  if (vis.currInd = 0) {
    return 1;
  } else if (vis.currInd = 1) {
    return vis.fin_data[state].electoralpower;
  } else {
    return 1;
  }
}

// ElectoralMap.prototype.updateVis = function() {
//   var vis = this;

//   vis.projection = d3.geo.albersUsa()
//   .translate([vis.width / 2, vis.height / 2])
//   .scale([800]);

//   vis.path = d3.geo.path()
//   .projection(vis.projection);

//   var x,y;

//   vis.svg.selectAll(".state")
//   .data(vis.json.features)
//   .enter().append("path")
//   .attr("class", "state")
//   .attr("d", vis.path)
//   .attr("transform", function(d,index) {
//     var centroid = vis.path.centroid(d),
//     x = centroid[0],
//     y = centroid[1];
//     return "translate(" + x + "," + y + ")"
//     + "scale(" + d.properties.ElectoralToPopRatio + ")"
//     + "translate(" + -x + "," + -y + ")";
//   })
//   .attr("fill",function(d) {
//     if (d.properties["2016Vote"] == "Rep") { return "red" }
//       else { return "blue" };
//   })
//   .attr("stroke","black")
//   .attr("opacity",.3);

//   vis.svg.selectAll(".bg-map")
//   .data(vis.json.features)
//   .enter().append("path")
//   .attr("class", "bg-map")
//   .attr("d", vis.path)
//   .attr("stroke","black")
//   .attr("fill-opacity",0)
//   .attr("fill","lightgray")
//   .on("mouseover",function(d) {
//     $(vis.eventHandler).trigger("stateOver", d.properties.name);
//   })
//   .on("mouseout",function(d) {
//     $(vis.eventHandler).trigger("stateOff");
//   })
//   .on("click",function(d) {
//     $(vis.eventHandler).trigger("press", d.properties.name);
//   });

// };



// ElectoralMap.prototype.highlightState = function(state) {
//   var vis = this;

//   if (state) {
//     vis.svg.selectAll(".state")
//     .data(vis.json.features).transition().duration(80)
//     .style("opacity",function(d) {
//       if(d.properties.name == state) {

//         vis.stateVote
//         .text(function(){
//           return "Each vote in " + state + " counts for " + d.properties.ElectoralToPopRatio + " votes";
//         })
//         .attr("opacity",1);

//         return 1;
//       } else {
//         return .1
//       }
//     });

//     vis.stateName
//     .text(function(){
//       return state;
//     })
//     .attr("opacity",1);
//     vis.stateVote2
//     .attr("opacity",1);
//   } else {
//     vis.svg.selectAll(".state")
//     .data(vis.json.features).transition().duration(80)
//     .style("opacity", function(d) {
//       return .3;
//     });

//     vis.stateName
//     .attr("opacity",0);
//     vis.stateVote2
//     .attr("opacity",0);
//     vis.stateVote
//     .attr("opacity",0);
//   }
// };