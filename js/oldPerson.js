/*
 *  Person - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

OldPerson = function(_parentElement, _votePower, _rawPopulation, _race) {

    this.parentElement = _parentElement;
    this.votePower = _votePower;
    this.rawPopulation = _rawPopulation;
    this.race = _race;

    this.initVis();
};

OldPerson.prototype.initVis = function() {

    var vis = this;

    vis.formatValue = d3.format(",.0f");

    vis.imgWidth = 329;
    vis.imgHeight = 834;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
    vis.width = $(vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 150 - vis.margin.top - vis.margin.bottom;


    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.personHeight = 100;


    vis.tip = d3.tip().attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "There are " + vis.formatValue(vis.rawPopulation) + " " + vis.race + " Americans, but in a presidential election, <br>their votes count for " + vis.formatValue(vis.rawPopulation * vis.votePower) + " as compared to a one-person-one-vote system.";
        });

    vis.svg.call(vis.tip);

    vis.wrangleData();

};

OldPerson.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();

};

OldPerson.prototype.updateVis = function() {
    var vis = this;

    vis.bgImage = vis.svg
        .append("image")
        .attr("class", "bg-image")
        .attr("height", vis.personHeight)
        .attr("x", vis.width/2 - 50)
        .attr("y", vis.height/2 - vis.personHeight/2)
        .attr("xlink:href", "img/personfull.png")
        .attr("opacity",.5);


    vis.frImage = vis.svg
        .append("image")
        .attr("class", "fr-image")
        .attr("height", vis.personHeight * vis.votePower)
        .attr("x", vis.width/2)
        .attr("y", vis.height/2 - vis.personHeight/2 - (vis.personHeight * vis.votePower - vis.personHeight))
        .attr("xlink:href", "img/personfull.png")
        // .attr("opacity",1)
        .on('mouseover', vis.tip.show)
        .on('mouseout', vis.tip.hide);

};