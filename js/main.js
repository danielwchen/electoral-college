// document.getElementById("state-hover").style.visibility = 'hidden';
// document.getElementById("congress-hover").style.visibility = 'hidden';
// document.getElementById("tableline").style.visibility = 'hidden';

var electoralMap;
var dataCSV = {};

var dateFormatter = d3.time.format("%d-%b-%Y");

loadData();

function loadData() {

    queue()
        .defer(d3.csv, "data/TestStateValues.csv")
    //     .defer(d3.csv, "data/electoral/congressFINAL.csv")
        .await(function(error, CSV) {
            CSV.forEach(function(d) {
                d.Population = +d.Population;
                d.PercentTotalPopulation = +d.PercentTotalPopulation;
                d.ElectoralVotes = +d.ElectoralVotes;
                d.PercentElectoralVotes = +d.PercentElectoralVotes;
                d.ElectoralToPopRatio = +d.ElectoralToPopRatio;
            });

            CSV.forEach(function(d,index) {
                dataCSV[d.Location] = d;
            });

    //         totalCSV.forEach(function(d,index) {
    //             stateTotalData[d.State] = d;
    //         });
    //
    //         CSV.forEach(function(d,index) {
    //             offData[d.Name] = d;
    //         });

    //         senData = senCSV;
    //         repData = repCSV;

            // dataCSV = CSV;
            createVis();
        });
}


function createVis() {

    var EventHandler = {};
    electoralMap = new ElectoralMap("#ElectoralMap",dataCSV,EventHandler);

    var statePinned = false;
    // var repPinned = false;
    var pinned = false;
    //
    $(EventHandler).bind("stateOver", function(event, state){
        if (!pinned) {
            electoralMap.highlightState(state);
    //         congressVis.highlightState(state);
    //         updateStateTable(state);
    //         document.getElementById("tableline").style.visibility = 'visible';
        }
    });
    $(EventHandler).bind("stateOff", function(event){
        if (!pinned) {
            electoralMap.highlightState(null);
    //         congressVis.highlightState(null);
    //         document.getElementById("state-hover").style.visibility = 'hidden';
    //         document.getElementById("tableline").style.visibility = 'hidden';
        }
    //
    });
    $(EventHandler).bind("press", function(event, state){
        if (pinned) {
            electoralMap.highlightState(null);
    //         congressVis.highlightState(null);
            statePinned = false;
    //         repPinned = false;
            pinned = false;
        } else {
            electoralMap.highlightState(state);
    //         congressVis.highlightState(state);
            statePinned = true;
    //         repPinned = false;
            pinned = true;
    //         updateStateTable(state)
    //         document.getElementById("tableline").style.visibility = 'visible';
        }
    });
    // $(EventHandler).bind("repOver", function(event, rep){
    //     if (repPinned) {
    //
    //     } else {
    //         updateCongressTable(rep);
    //         document.getElementById("tableline").style.visibility = 'visible';
    //     }
    //
    //     if (pinned) {
    //
    //     } else {
    //         updateCongressTable(rep);
    //         electoralMap.highlightState(offData[rep].State);
    //         congressVis.highlightRep(rep);
    //         updateStateTable(offData[rep].State);
    //         document.getElementById("tableline").style.visibility = 'visible';
    //     }
    // });
    // $(EventHandler).bind("repOff", function(event){
    //     if (pinned) {
    //
    //     } else {
    //         electoralMap.highlightState(null);
    //         congressVis.highlightRep(null);
    //         document.getElementById("congress-hover").style.visibility = 'hidden';
    //         document.getElementById("state-hover").style.visibility = 'hidden';
    //         document.getElementById("tableline").style.visibility = 'hidden';
    //     }
    // });
    // $(EventHandler).bind("repPress", function(event, rep){
    //
    //     if (pinned) {
    //         electoralMap.highlightState(null);
    //         congressVis.highlightRep(null);
    //         statePinned = false;
    //         repPinned = false;
    //         pinned = false;
    //     } else {
    //         electoralMap.highlightState(offData[rep].State);
    //         congressVis.highlightRep(rep);
    //         repPinned = true;
    //         statePinned = false;
    //         pinned = true;
    //         updateStateTable(offData[rep].State);
    //         updateCongressTable(rep);
    //         document.getElementById("tableline").style.visibility = 'visible';
    //     }
    //
    // });
}