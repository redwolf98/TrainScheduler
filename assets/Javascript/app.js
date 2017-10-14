  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPE-J4GrO-hVIdfXT_HX79rvI-qpQuZ2k",
    authDomain: "trainschedule-e2a30.firebaseapp.com",
    databaseURL: "https://trainschedule-e2a30.firebaseio.com",
    projectId: "trainschedule-e2a30",
    storageBucket: "trainschedule-e2a30.appspot.com",
    messagingSenderId: "525652293031"
  };
  firebase.initializeApp(config);

var DEBUG = false;
var trains = [];

function log(text){
    if(DEBUG) console.log(text);
}

var database = firebase.database();
  
function grabData(){
    
    trains = [];

    database.ref().on("child_added", function(snapshot){
        //Add items to the train table
        
        var sv = snapshot.val();
        var train = {trainName:sv.trainName,
            destination:sv.destination,
            frequency:sv.frequency,
            firstTrainTime:sv.firstTrainTime};
        
        trains.push(train);

         // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
}

$(document).ready(function(){
                                grabData();
                                loadTrains();
                            });

$(document).ready(function(){
    $("#inputButton").on("click", function(event){
        event.preventDefault();
        var trainName = $("#input-TrainName").val().trim();
        var destination = $("#input-Destination").val().trim();
        var frequency = $("#input-Frequency").val().trim();
        var firstTrainTime = $("#input-FirstTrainTime").val().trim();

        var train = {trainName:trainName,
            destination:destination,
            frequency:frequency,
            firstTrainTime:firstTrainTime};

        database.ref().push(train);
        $("#form-addTrain")[0].reset();



    });
});

function loadSingleTrain(train){
    var trainName = $("<td>").html(train.trainName);
    var destination = $("<td>").html(train.destination);
    var frequency = $("<td>").html(train.frequency);
    
    /**
     * find difference in minutes between first arrival time and current time (timedifference)
     * get modular of timeDifference to frequency plus 5 (for In Station) if between 
     */
    
    var minutesFromInitialDepart;
    var minutesSinceLastDeparture;
    var nextArrival = $("<td>")
    var minutesAway = $("<td>");

    if(moment(train.firstTrainTime, "HH:mm").isBefore(moment())){
        log(moment(train.firstTrainTime, "HH:mm").format("HH:mm A") + " is Before " + moment().format("HH:mm A"));
        minutesFromInitialDepart = moment().diff(moment(train.firstTrainTime, "HH:mm"), "minutes");

        log("minutes FROm INitial Depart: " + minutesFromInitialDepart);
        log(minutesFromInitialDepart + " % " + (parseInt(train.frequency)));

        minutesSinceLastDeparture =Math.abs(minutesFromInitialDepart % (parseInt(train.frequency)));
        
        log("last arrival: " + (minutesSinceLastDeparture))            
        log("nextArrival:" + (parseInt(train.frequency) - minutesSinceLastDeparture));


        nextArrival.html(moment().add({minutes:(parseInt(train.frequency) - minutesSinceLastDeparture)}).format("hh:mm A"));
        
        
        
            minutesAway = $("<td>").addClass("minutesAway").html((parseInt(train.frequency) - minutesSinceLastDeparture));
        
        


    }else{
        log(moment(train.firstTrainTime, "HH:mm").format("HH:mm A") + " is After " + moment().format("hh:mm A"));
        minutesAway.html(Math.abs(moment(train.firstTrainTime, "HH:mm").diff(moment(), "minutes")));

        nextArrival.html("Service Begins at " + moment(train.firstTrainTime,"HH:mm").format("hh:mm A"));

    }

    
    var record = $("<tr>")
    
    record.append(trainName);
    record.append(destination);
    record.append(frequency);
    record.append(nextArrival);
    record.append(minutesAway)
    
    $("#trainRecords").append(record);
}

function loadTrains(){
    $("#trainRecords").empty();
    for(i=0;i<trains.length;i++){
        loadSingleTrain(trains[i]);
    }
}

setInterval(function(){
                        loadTrains();
                        }
                        ,1000
);