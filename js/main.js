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
    // electoralMap.resize();
  });

var electoralMap;


var EventHandler = {};




electoralMap = new ElectoralMap("#map-vis",1,EventHandler);

// var pinned = false;
$(EventHandler).bind("stateOver", function(event, state){
    // if (!pinned) {
        electoralMap.highlightState(state);
    // }
});
$(EventHandler).bind("stateOff", function(event){
    // if (!pinned) {
        electoralMap.highlightState(null);
    // }
});
// $(EventHandler).bind("press", function(event, state){
    // if (pinned) {
        // electoralMap.highlightState(null);
        // pinned = false;
    // } else {
        // electoralMap.highlightState(state);
        // pinned = true;
    // }
// });


d3.graphScroll()
.graph(d3.selectAll('#graph'))
.container(d3.select('#container'))
.sections(d3.selectAll('#sections > div'))
.on('active', function(i){ 
  electoralMap.updateInd(i);
  console.log(i + 'th section active');
})

d3.graphScroll()
.container(d3.select('.container-2'))
.graph(d3.selectAll('.container-2 #graph'))
.eventId('uniqueId1')
.sections(d3.selectAll('.container-2 #sections > div'))
.on('active', function(i){
  console.log(i + 'th section active') 
})