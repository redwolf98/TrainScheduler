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

var DEBUG = true;

function log(text){
    if(DEBUG) console.log(text);
}

  var database = firebase.database();
  
 function loadData(){
    database.ref().on("child_added", function(snapshot){
        //Add items to the train table
        var sv = snapshot.val();
        var trainName = $("<td>").html(sv.trainName);
        var destination = $("<td>").html(sv.destination);
        var frequency = $("<td>").html(sv.frequency);
        
        /**
         * find difference in minutes between first arrival time and current time (timedifference)
         * get modular of timeDifference to frequency plus 5 (for In Station) if between 
         */
        
        var minutesFromInitialDepart;
        var minutesSinceLastDeparture;
        var nextArrival = $("<td>")
        var minutesAway = $("<td>");

        if(moment(sv.firstTrainTime, "HH:mm").isBefore(moment())){
            log(moment(sv.firstTrainTime, "HH:mm").format("HH:mm A") + " is Before " + moment().format("HH:mm A"));
            minutesFromInitialDepart = moment().diff(moment(sv.firstTrainTime, "HH:mm"), "minutes");

            log("minutes FROm INitial Depart: " + minutesFromInitialDepart);
            log(minutesFromInitialDepart + " % " + (parseInt(sv.frequency)));
    
            minutesSinceLastDeparture =Math.abs(minutesFromInitialDepart % (parseInt(sv.frequency)));
            
            log("last arrival: " + (minutesSinceLastDeparture))            
            log("nextArrival:" + (parseInt(sv.frequency) - minutesSinceLastDeparture));
    
    
            nextArrival.html(moment().add({minutes:(parseInt(sv.frequency) - minutesSinceLastDeparture)}).format("hh:mm A"));
            
            
            
                minutesAway = $("<td>").addClass("minutesAway").html((parseInt(sv.frequency) - minutesSinceLastDeparture));
            
            


        }else{
            log(moment(sv.firstTrainTime, "HH:mm").format("HH:mm A") + " is After " + moment().format("hh:mm A"));
            minutesAway.html(Math.abs(moment(sv.firstTrainTime, "HH:mm").diff(moment(), "minutes")));

            nextArrival.html("Service Begins at " + moment(sv.firstTrainTime,"HH:mm").format("hh:mm A"));

        }

        
        var record = $("<tr>")
        
        record.append(trainName);
        record.append(destination);
        record.append(frequency);
        record.append(nextArrival);
        record.append(minutesAway)
        
        $("#trainRecords").append(record);

         // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
 }

  $(document).ready(loadData());

    $(document).ready(function(){
        $("#inputButton").on("click", function(event){
            event.preventDefault();
            var trainName = $("#input-TrainName").val().trim();
            var destination = $("#input-Destination").val().trim();
            var frequency = $("#input-Frequency").val().trim();
            var firstTrainTime = $("#input-FirstTrainTime").val().trim();


            database.ref().push({
                trainName:trainName,
                destination:destination,
                frequency:frequency,
                firstTrainTime:firstTrainTime
            });

        });
    });



    setInterval(function(){
                            $("#trainRecords").empty();
                            loadData();
                          }
                            ,1000
    );