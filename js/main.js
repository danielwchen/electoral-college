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
    checkWinStat();
});


var EventHandler = {};
electoralMap = new ElectoralMap("#map-vis",EventHandler);