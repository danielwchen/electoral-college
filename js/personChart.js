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
  this.fin_datavr;
  this.text_labels = ["Baseline", "White", "Black/Afr. American", "Hispanic/Latino", "Asian"]
  this.opacities = [[1,0,0,0,0],
  [1,1,0,0,0],
  [1,1,1,0,0],
  [1,1,1,1,0],
  [1,1,1,1,1]];
  this.colors = ["gray","lightblue","lightblue","lightblue","lightblue"]
  this.colorsvr = ["gray","lightblue","lightblue","lightblue","lightblue"]
  this.positions;

  this.bottomoffset = 120;

  this.opacity_index = [0,1,2,3,4,4,4,4,4,4,4,4,4,4]

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
  .attr("height", vis.height);

  d3.queue()
  .defer(d3.csv, "data/votingpowerbyrace.csv")
  .defer(d3.csv, "data/votingratebyrace.csv")
  .await(function(error, data, datavr) {
    vis.wrangleData(data, datavr);
  });

};

PersonChart.prototype.wrangleData = function(data, datavr) {
  var vis = this;

  vis.fin_data = data;
  vis.fin_datavr = datavr;

  vis.createVis();

};

PersonChart.prototype.createVis = function() {
  var vis = this;

  vis.tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .style('z-index', '999999999')
  .html(function(d) { return "Voting power per person: " + (d.votingpower * 100) + "%"; });
  vis.svg.call(vis.tip);


  vis.tipvr = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .style('z-index', '999999999')
  .html(function(d) { return "Voting rate: " + d.rate + "%"; });
  vis.svg.call(vis.tipvr);

  vis.peoplevr = vis.svg.selectAll(".peoplebarvr")
  .data(vis.fin_datavr)
  .enter().append("path")
  .attr("class", "peoplebarvr")
  .attr("d", function(d, i) {
    return vis.getPersonPath (vis.getPosition(i)+25, vis.height - vis.bottomoffset, d.votingrate);
  })
  .attr("opacity", 0)
  .attr("fill", function(d, i) {
    return vis.getColorVR(i);
  })
  .attr("stroke", "black")
  .attr("stroke-width","3")
  .on('mouseover', function(d,i) {
    if (vis.getOpacityVR(i) == 0) {}
    else {
      vis.tipvr.show(d);}
  })
  .on('mouseout', vis.tipvr.hide);

  vis.top_line = vis.svg.append("line")
  .style("stroke", "black")
  .style("stroke-dasharray", ("5, 5"))
  .attr("stroke-width", 3)
  .attr("x1", vis.positions[0] - 50)  
  .attr("x2", vis.positions[vis.positions.length - 1] + 50)  
  .attr("y1", vis.height - vis.bottomoffset - 132)
  .attr("y2", vis.height - vis.bottomoffset - 132);

  vis.people = vis.svg.selectAll(".peoplebar")
  .data(vis.fin_data)
  .enter().append("path")
  .attr("class", "peoplebar")
  .attr("d", function(d, i) {
    return vis.getPersonPath (vis.getPosition(i), vis.height - vis.bottomoffset, d.votingpower);
  })
  .attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  })
  .attr("fill", function(d, i) {
    return vis.getColor(i);
  })
  .attr("stroke", "black")
  .attr("stroke-width","3")
  .on('mouseover', function(d,i) {
    if (vis.getOpacity(i) == 0) {}
      else {vis.tip.show(d)}
    })
  .on('mouseout', vis.tip.hide);

  vis.bot_line = vis.svg.append("line")
  .style("stroke", "black")
  .style("stroke-width", 3)
  .attr("x1", vis.positions[0] - 50)  
  .attr("x2", vis.positions[vis.positions.length - 1] + 50)  
  .attr("y1", vis.height - vis.bottomoffset)
  .attr("y2", vis.height - vis.bottomoffset);

  vis.labels = vis.svg.selectAll(".textlabels")
  .data(vis.fin_data)
  .enter().append("text")
  .attr("class", "textlabels")
  .text(function(d,i) {
    return vis.text_labels[i];
  })
  .attr("transform", function(d,i) {
    return "translate(" + (vis.positions[i]-5) + "," + (vis.height - vis.bottomoffset + 15) + ")rotate(30)";
  })
  .attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  });

};

PersonChart.prototype.updateVis = function() {
  var vis = this;

  vis.people.transition().duration(200)
  .attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  });

  vis.labels
  .transition().duration(200)
  .attr("opacity", function(d, i) {
    return vis.getOpacity(i);
  });

  vis.peoplevr.transition().duration(200)
  .attr("opacity", function(d,i) {
    return vis.getOpacityVR(i);
  });

}

PersonChart.prototype.resize = function() {
  var vis = this;

  vis.width = $(vis.parentElement).width();
  vis.svg.attr("width",vis.width);

  var z = vis.width/6;

  vis.positions = [z, z*2, z*3, z*4, z*5];


  vis.peoplevr
  .attr("d", function(d, i) {
    return vis.getPersonPath (vis.getPosition(i)+25, vis.height - vis.bottomoffset, d.votingrate);
  });

  vis.people
  .attr("d", function(d, i) {
    return vis.getPersonPath (vis.getPosition(i), vis.height - vis.bottomoffset, d.votingpower);
  });

  vis.top_line
  .attr("x1", vis.positions[0] - 50)   
  .attr("x2", vis.positions[vis.positions.length - 1] + 50);


  vis.bot_line
  .attr("x1", vis.positions[0] - 50)  
  .attr("x2", vis.positions[vis.positions.length - 1] + 50);

  vis.labels
  .attr("transform", function(d,i) {
    return "translate(" + (vis.positions[i]-5) + "," + (vis.height - vis.bottomoffset + 15) + ")rotate(30)";
  });

  vis.updateVis;

}

PersonChart.prototype.getOpacity = function(num) {
  var vis = this;

  if (vis.opacities[vis.opacity_index[vis.currInd]][num] == 1) {
    return 1;
  } else {
    return 0;
  }
}

PersonChart.prototype.getOpacityVR = function(num) {
  var vis = this;

  if (vis.currInd >=6) {
    return .5;
  } else {
    return 0;
  }
}

PersonChart.prototype.getPosition = function(num) {
  var vis = this;

  return vis.positions[num];
}

PersonChart.prototype.getColor = function(num) {
  var vis = this;

  return vis.colors[num];
}

PersonChart.prototype.getColorVR = function(num) {
  var vis = this;

  return vis.colorsvr[num];
}

// x, y define the bottom center point, p is the percent value
PersonChart.prototype.getPersonPath = function(x, y, p) {
  var vis = this;

  var w = 50;
  var h = (132 * p  - 32 - 100) / 2;

  return "M" + x + "," + y 
  + "h-12v" + (-50 - h) 
  + "h-8v" + (-50 - h) 
  + "h17a16,16 0 1,1 6,0 h17v" + (50 + h) 
  + "h-8v" + (50 + h) 
  + "z";
}

PersonChart.prototype.updateInd = function(ind) {
  var vis = this;

  vis.currInd = ind;

  vis.updateVis();
  
}