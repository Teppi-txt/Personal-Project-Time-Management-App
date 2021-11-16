var input = {
    workTime: 0.1 * 60, //Note: 52 minutes converted to date.now() format, add user input here
    shortBreakTime: 0.2 * 60,
    longBreakTime: 30 * 60000
}

var margin = 500 //margin in ms for transition

function timer(duration) {
    //NOTE: GETS TIME DIFFERENCE
    //*SETS INITIAL remainingTime
    var endTime = Date.now() + duration * 1000
    chrome.storage.local.set({'endTime': endTime}, function() {});
}

setInterval(function() {    
    chrome.storage.local.get(["endTime", "currentStage", "active"], function(data) {
        if (data.endTime < Date.now() && data.active) { //add in timer end check
            switch (data.currentStage) {
                case "work":
                    chrome.storage.local.set({'currentStage': "shortBreak"}, function() {
                        timer(input.shortBreakTime) //repeats timer loop\
                        console.log(`Timer started for ${input.shortBreakTime}: shortBreak`)
                    });
                    break;
            
                case "shortBreak":
                    chrome.storage.local.set({'currentStage': "work"}, function() {
                        timer(input.workTime) //repeats timer loop
                        console.log(`Timer started for ${input.work}: work`)
                    });
                    break;
            
                default:
                    break;
            }
        }
    });
}, 500) //1 SECOND CALLBACK TIME
