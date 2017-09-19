/**
 * Created by Daniel on 7/27/17.
 */
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x, y, ypos, ybot;

checkWinStat()

function checkWinStat() {
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    ypos = w.scrollY;
}

$( window ).resize(function() {
    updateVis();
});

var data;
var map_svg;
var map_svg_height = 200;

queue()
    .defer(d3.csv,"data/allcartogramdata.csv")
    .await(initVis);

function initVis(error, d){
    if(error) { console.log(error); }

    data = d;
    data.clintonvotes = +data.clintonvotes;
    data.clintonpercent = +data.clintonpercent;
    data.trumpvotes = +data.trumpvotes;
    data.trumppercent = +data.trumppercent;
    data.othervotes = +data.othervotes;
    data.otherpercent = +data.otherpercent;
    data.electoralvotes = +data.electoralvotes;
    data.electoralvotesfactor = +data.electoralvotesfactor;
    data.electoralpower = +data.electoralpower;

    map_svg = d3.select("#map-vis").append("svg")
        .attr("width", x)
        .attr("height", map_svg_height)
    ;




    updateVis();
}

function updateVis() {

    map_svg.attr("width",x);



}
