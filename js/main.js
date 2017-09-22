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
 	electoralMap.resize();
 });

 var electoralMap;


 var EventHandler = {};
 electoralMap = new ElectoralMap("#map-vis",1,EventHandler);


 d3.graphScroll()
 .graph(d3.selectAll('#graph'))
 .container(d3.select('#container'))
 .sections(d3.selectAll('#sections > div'))
 .on('active', function(i){ console.log(i + 'th section active') })