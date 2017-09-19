var electoralMap;

var white;
var black;
var hispanic;
var asian;

var dataCSV = {};

var dateFormatter = d3.time.format("%d-%b-%Y");

loadData();

function loadData() {

    queue()
        .defer(d3.csv, "data/TestStateValues.csv")
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
            createVis();
        });
}


function createVis() {

    var EventHandler = {};
    electoralMap = new ElectoralMap("#ElectoralMap",dataCSV,EventHandler);

    var statePinned = false;
    var pinned = false;
    //
    $(EventHandler).bind("stateOver", function(event, state){
        if (!pinned) {
            electoralMap.highlightState(state);
        }
    });
    $(EventHandler).bind("stateOff", function(event){
        if (!pinned) {
            electoralMap.highlightState(null);
        }
    //
    });
    $(EventHandler).bind("press", function(event, state){
        if (pinned) {
            electoralMap.highlightState(null);
            statePinned = false;
            pinned = false;
        } else {
            electoralMap.highlightState(state);
            statePinned = true;
            pinned = true;
        }
    });

    white = new Person("#white-picture",1.034, 151141962,"White");
    black = new Person("#black-picture",1.004, 29732845,"Black");
    hispanic = new Person("#hisp-picture",.92, 44599268,"Hispanic");
    asian = new Person("#asian-picture",.88, 14866423,"Asian");
}
