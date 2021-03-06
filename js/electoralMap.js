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

  // ["none", "electoralvotesfactor","electoralpower"]
  this.section_scale = [0,0,0,0,0,0,0,0,2,2,2,2]


  // ["none", "2016votes", "votemethod", "bigstates", "elevenstates", "fourstates", "votemethodr", "wyoming", "california"]
  this.color_scale   = [1,1,3,6,2,4,5,0,7,8,1,1]

  this.initVis();
};

ElectoralMap.prototype.initVis = function() {

  var vis = this;

  vis.width = $(vis.parentElement).width();
  // vis.height = $(vis.parentElement).height();
  vis.height = 500;


  vis.svg = d3.select(vis.parentElement).append("svg")
  .attr("width",vis.width)
  .attr("height",vis.height);

  d3.queue()
  .defer(d3.json, 'data/us-states.json')
  .defer(d3.csv, 'data/allcartogramdata.csv')
  .await(function(error, json, data) {
    vis.wrangleData(json, data);
  });

};

ElectoralMap.prototype.wrangleData = function(json, data) {
  var vis = this;

  data.forEach(function(d,index) {
    vis.fin_data[d.state] = d;
  });

  vis.fin_json = json;


  vis.createVis();

};

ElectoralMap.prototype.createVis = function() {
  var vis = this;

  vis.projection = d3.geoAlbersUsa()
  .translate([vis.width/2, vis.height/2])
  .scale([vis.width]);

  vis.path = d3.geoPath()
  .projection(vis.projection);

  var x, y;

  vis.map = vis.svg.selectAll(".state")
  .data(vis.fin_json.features)
  .enter().append("path")
  .attr("class", "state")
  .attr("d", vis.path)
  .attr("stroke","black");

  vis.bg_map = vis.svg.selectAll(".bg-map")
  .data(vis.fin_json.features)
  .enter().append("path")
  .attr("class", "bg-map")
  .attr("d", vis.path)
  .attr("stroke","black")
  .attr("fill-opacity",0)
  .attr("fill","lightgray")
  .on("mouseover",function(d) {
    $(vis.eventHandler).trigger("stateOver", d.properties.name);
  })
  .on("mouseout",function(d) {
    $(vis.eventHandler).trigger("stateOff");
  })
  ;

};

ElectoralMap.prototype.updateVis = function() {
  var vis = this;

  var x, y;



  vis.bg_map
  .transition().duration(500)
  .attr("d", vis.path)
  .attr("stroke-width", function(d) {
    return vis.getStroke(d.properties.name);
  })
  ;

  vis.map
  .transition().duration(500)
  .attr("d", vis.path)
  .attr("transform", function(d) {
    var centroid = vis.path.centroid(d),
    x = centroid[0],
    y = centroid[1];
    return "translate(" + x + "," + y + ")"
    + "scale(" + vis.getScale(d.properties.name) + ")"
    + "translate(" + -x + "," + -y + ")";
  })
  .attr("opacity", vis.getOpacity())
  .attr("fill", function(d) {return vis.getColor(d.properties.name);})
  // .attr("stroke-width", function(d) {
  //   return vis.getStroke(d.properties.name);
  // })
  ;



}

ElectoralMap.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width();
  // vis.height = $(vis.parentElement).height();
  vis.svg.attr("width",vis.width);

  vis.projection = d3.geoAlbersUsa()
  .translate([vis.width/2, vis.height/2])
  .scale([vis.width]);

  vis.path = d3.geoPath()
  .projection(vis.projection);


  vis.updateVis();
}

ElectoralMap.prototype.rescale = function(ind) {
  var vis = this;

  vis.currInd = ind;
  vis.updateVis();
}

// ["none", "2016votes", "votemethod", "bigstates", "elevenstates", "fourstates"]
ElectoralMap.prototype.getColor = function(state) {
  var vis = this;

  if (vis.color_scale[vis.currInd] == 0) {
    return "gray";

  } else if (vis.color_scale[vis.currInd] == 2) {
    if (vis.fin_data[state].votingmethod == "CD") { return "green"; }
    else { return "orange"; }
  
  } else if (vis.color_scale[vis.currInd] == 3) {
    if (vis.fin_data[state].bigstate == "Y") { return "green"; }
    else if (vis.fin_data[state].smallstate == "Y") {return "orange"; }
    else { return "gray"; }

  } else if (vis.color_scale[vis.currInd] == 4) {
    if (vis.fin_data[state].topeleven == "Y") { return "orange"; }
    else { return "gray"; }

  } else if (vis.color_scale[vis.currInd] == 5) {
    if (vis.fin_data[state].topfour == "Y") { return "green"; }
    else if (vis.fin_data[state].topeleven == "Y") {return "orange"; }
    else { return "gray"; }

  } else if (vis.color_scale[vis.currInd] == 6) {
    if (vis.fin_data[state].votingmethod == "WTA") { return "orange"; }
    else { return "gray"; }

  } else if (vis.color_scale[vis.currInd] == 7) {
    if (state == "Wyoming") { return "orange"; }
    else { return "gray"; }

  } else if (vis.color_scale[vis.currInd] == 8) {
    if (state == "Wyoming") { return "orange"; }
    else if (state == "California") { return "green"; }
    else { return "gray"; }

  } else {
    if (vis.fin_data[state].winparty == "R") { return "red"; }
    else { return "blue"; }
  }
}

// ["none", "2016votes", "votemethod", "bigstates", "elevenstates", "fourstates"]
ElectoralMap.prototype.getStroke = function(state) {
  var vis = this;

  if (vis.color_scale[vis.currInd] == 2) {
    if (vis.fin_data[state].votingmethod == "CD") { return 3/vis.getScale(state); }
    else { return 1/vis.getScale(state); }
  
  } else if (vis.color_scale[vis.currInd] == 3) {
    if (vis.fin_data[state].bigstate == "Y") { return 3/vis.getScale(state); }
    else if (vis.fin_data[state].smallstate == "Y") {return 3/vis.getScale(state); }
    else { return 1/vis.getScale(state); }

  } else if (vis.color_scale[vis.currInd] == 4) {
    if (vis.fin_data[state].topeleven == "Y") { return 3/vis.getScale(state); }
    else { return 1/vis.getScale(state); }

  } else if (vis.color_scale[vis.currInd] == 5) {
    if (vis.fin_data[state].topfour == "Y") { return 3/vis.getScale(state); }
    else { return 1/vis.getScale(state); }

  } else if (vis.color_scale[vis.currInd] == 6) {
    if (vis.fin_data[state].votingmethod == "WTA") { return 3/vis.getScale(state); }
    else { return 1/vis.getScale(state); }
  
  } else {
    return 1/vis.getScale(state);
  }
}

// ["none", "electoralvotesfactor","electoralpower"]
ElectoralMap.prototype.getScale = function(state) {
  var vis = this;

  if (vis.section_scale[vis.currInd] == 1) {
    // return vis.fin_data[state].electoralvotesfactor;
    return 1;
  } else if (vis.section_scale[vis.currInd] == 2) {
    return vis.fin_data[state].electoralpower;
  } else {
    return 1;
  }
}

// ["none", "electoralvotesfactor","electoralpower"]
ElectoralMap.prototype.getOpacity = function() {
  var vis = this;

  if (vis.section_scale[vis.currInd] == 1) {
    return 0.5;
  } else if (vis.section_scale[vis.currInd] == 2) {
    return 0.5;
  } else {
    return 0.5;
  }
}


ElectoralMap.prototype.updateInd = function(ind) {
  var vis = this;

  vis.currInd = ind;

  vis.updateVis();
}

ElectoralMap.prototype.highlightState = function(state) {
  var vis = this;

  if (state) {
    vis.map.transition().duration(80)
    .style("opacity",function(d) {
      if(d.properties.name == state) {
        return .9;
      } else {
        return .2;
      }
    });
  } else {
    vis.map.transition().duration(80)
    .style("opacity", vis.getOpacity());
  }
};