/*
 Thanks to http://bl.ocks.org/mbostock/4055908
 */

/*
 *  ElectoralMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all data for the map
 *  @param _eventHandler    -- Event handler
 */

ElectoralMap = function(_parentElement, _data, _eventHandler) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;

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

    d3.json("data/us-states.json", function(json) {
        vis.json = json;
        vis.wrangleData();
    });

    vis.stateName = vis.svg.append("text")
        .text("United States")
        .attr("opacity",0)
        .style("font-weight","bold")
        .style("font-size","30")
        .attr("text-anchor","middle")
        .attr("x",vis.width*2/3)
        .attr("y",80);

    vis.stateVote = vis.svg.append("text")
        .text("Each voter gets 3 votes")
        .style("font-weight","bold")
        .attr("opacity",0)
        .style("font-size","15")
        .attr("text-anchor","middle")
        .attr("x",vis.width*4/7)
        .attr("y",500);

    vis.stateVote2 = vis.svg.append("text")
        .text("when compared to a fair one-person-one-vote system.")
        .style("font-weight","bold")
        .attr("opacity",0)
        .style("font-size","15")
        .attr("text-anchor","middle")
        .attr("x",vis.width*4/7)
        .attr("y",525);


};

ElectoralMap.prototype.wrangleData = function() {
    var vis = this;


    for (var j = 0; j < vis.json.features.length; j++) {
        if (vis.data[vis.json.features[j].properties.name]){
            vis.json.features[j].properties.ElectoralToPopRatio = vis.data[vis.json.features[j].properties.name].ElectoralToPopRatio;
            vis.json.features[j].properties["2016Vote"] = vis.data[vis.json.features[j].properties.name]["2016Vote"];
            vis.json.features[j].properties["PercentElectoralVotes"] = vis.data[vis.json.features[j].properties.name]["PercentElectoralVotes"];

        }
    }

    vis.updateVis();

};

ElectoralMap.prototype.updateVis = function() {
    var vis = this;

    vis.projection = d3.geo.albersUsa()
        .translate([vis.width / 2, vis.height / 2])
        .scale([800]);

    vis.path = d3.geo.path()
        .projection(vis.projection);

    var x,y;

    vis.svg.selectAll(".state")
        .data(vis.json.features)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", vis.path)
        .attr("transform", function(d,index) {
            var centroid = vis.path.centroid(d),
                x = centroid[0],
                y = centroid[1];
            return "translate(" + x + "," + y + ")"
                + "scale(" + d.properties.ElectoralToPopRatio + ")"
                + "translate(" + -x + "," + -y + ")";
        })
        .attr("fill",function(d) {
            if (d.properties["2016Vote"] == "Rep") { return "red" }
            else { return "blue" };
        })
        .attr("stroke","black")
        .attr("opacity",.3);

    vis.tip = d3.tip()
                .html("test");

    vis.svg.selectAll(".bg-map")
        .data(vis.json.features)
        .enter().append("path")
        .attr("class", "bg-map")
        .attr("d", vis.path)
        .attr("stroke","black")
        .attr("fill-opacity",0)
        .attr("fill","lightgray")
        .on("mouseover",function(d) {
            console.log("test");
            vis.tip.show(d);
            $(vis.eventHandler).trigger("stateOver", d.properties.name);
        })
        .on("mouseout",function(d) {
            $(vis.eventHandler).trigger("stateOff");
        })
        .on("click",function(d) {
            $(vis.eventHandler).trigger("press", d.properties.name);
        });

};



ElectoralMap.prototype.highlightState = function(state) {
    var vis = this;

    if (state) {
        vis.svg.selectAll(".state")
            .data(vis.json.features).transition().duration(80)
            .style("opacity",function(d) {
                if(d.properties.name == state) {

                    vis.stateVote
                        .text(function(){
                            return "Each vote in " + state + " counts for " + d.properties.ElectoralToPopRatio + " votes";
                        })
                        .attr("opacity",1);

                    return 1;
                } else {
                    return .1
                }
            });

        vis.stateName
            .text(function(){
                return state;
            })
            .attr("opacity",1);
        vis.stateVote2
            .attr("opacity",1);
    } else {
        vis.svg.selectAll(".state")
            .data(vis.json.features).transition().duration(80)
            .style("opacity", function(d) {
                return .3;
            });

        vis.stateName
            .attr("opacity",0);
        vis.stateVote2
            .attr("opacity",0);
        vis.stateVote
            .attr("opacity",0);
    }
};