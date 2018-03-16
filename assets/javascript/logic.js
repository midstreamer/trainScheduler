$(function () {
    // Initialize Firebase with the apiKey from Firebase 
    var config = {
        apiKey: "AIzaSyDFb1qnZAnSvPsZrbmO5aROCux48SkqNC8",
        authDomain: "train-schedule-b726f.firebaseapp.com",
        databaseURL: "https://train-schedule-b726f.firebaseio.com",
        projectId: "train-schedule-b726f",
        storageBucket: "train-schedule-b726f.appspot.com",
        messagingSenderId: "584367972470"
    };

    firebase.initializeApp(config); //Everything in the above code is from Firebase database app

    var trainData = firebase.database(); //assigns the value of the firebase.database function to the trainData variable

    $("#newTrain").click(function () { //when the submit btton is clicked it assigns the value of the data input by the user in the form to the new variables below.
        var trainName = $("#trainName-input").val().trim();
        var destination = $("#destination-input").val().trim();
        var startTime = moment($("#startTime-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var frequency = $("#frequency-input").val();



        var newTrain = { //this takes the individual variables from above and assigns them to the single newTrain variable so we can push this data into the new train data.
            name: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency
        }

        trainData.ref().push(newTrain); //this pushes the new newTrain data that was added by the user in the form into trainData.ref 

        $("#trainName-input").val("");
        $("#destination-input").val("");
        $("#startTime-input").val("");
        $("#frequency-input").val("");
    })

    trainData.ref().on("child_added", function (snapshot) { //when a new child is added this will take a snapshot of the data 
        var trainName = snapshot.val().name;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;
        var startTime = snapshot.val().startTime;

        var remainder = moment().diff(moment.unix(startTime), "minutes") % frequency; //this takes the current time and converts it unix then return the remainder of it and the frequency.
        var minutes = frequency - remainder; //returns the difference between the frequency and the remainder 
        var arrival = moment().add(minutes, "m").format("hh:mm A"); //this adds the formating for the arrival variable 

        console.log("trainName", trainName);
        console.log("Start Time: ", startTime);
        console.log("Remainder: ", remainder);
        console.log("Minutes: ", minutes);
        console.log("Arrival: ", arrival);

        //append the train data to the html

        $("#schedule").append( //this appends the data to the html table for display 
            "<tr><td>"+trainName+"</td><td>"+destination+"</td><td>"+frequency+"</td><td>"+arrival+"</td><td>"+minutes+"</td>")
    })
   
    $("#add").click(function () { // this creates a '+' to open the form to add a train and "x" to close the form
        if ($("#newTrainSchedule").attr("data-status") === "hide") {
            $("#newTrainSchedule").attr("data-status", "show").css({ "visibility": "visible", "height": "480px" });
            $("#symbol").removeClass("fa fa-plus").addClass("fa fa-close");
        } else {
            $("#newTrainSchedule").attr("data-status", "hide").css({ "visibility": "hidden", "height": "0px" });
            $("#symbol").removeClass("fa fa-close").addClass("fa fa-plus");
        }
    });

    function currentTime() { // creates a time showing the current time 
        var sec = 1;
        time = moment().format("HH:mm:ss");
        searchTime = moment().format("HH:mm");
        $("#currentTime").html(time);

        t = setTimeout(function () {
            currentTime();
        }, sec * 1000);
    }
    currentTime();
});