var ui = {
    timerDisplay: $("#timer_wb"),
    status: $("#status_wb"),
    settings_menu: $("#settings_popup"),
    dimmer: $("#dimmer")
}

var status_colors = {
    work : "green",
    shortBreak : "blue",
    longBreak : "purple"
}

var menuBtns = {
    stop: $("#stop_wb"),
    active_bool: $("#active_wb"),
    skip: $("#skip_wb"),
    settings: $("#settings_wb")
}

var modalBtns = {
    close: $("#close_modal"),
    save_settings: $("save_settings"),
    suggested_settings: $("suggested_settings")
}

var input = {
    workTime: 0.1 * 60, //Note: 52 minutes converted to date.now() format, add user input here
    shortBreakTime: 0.2 * 60,
    longBreakTime: 30 * 60000
}

var html_snippets = {
    play_button: `<i class="video play big icon"></i>`,
    pause_button: `<i class="pause circle big icon"></i>`,
    modal_loading: ``
}

function onLoad(params) {
    menuBtns.active_bool.click()
    menuBtns.stop.click()
    menuBtns.skip.click()

    modalBtns.close.click()
    modalBtns.save_settings.click()
    modalBtns.suggested_settings.click()

    refreshStage()
    updateTimerUI()

    chrome.storage.local.get(["remainingTimeAtPause", "active", "endTime"], function(data) {
        //NOTE: CHANGES VALUE OF TIMER ON LOAD
        if (!data.active && typeof data.remainingTimeAtPause !== "undefined") {
            ui.timerDisplay.html(secondsToTime(data.remainingTimeAtPause/1000)) //converts remainingTime to seconds, then to time format
        } else if (data.active){
            ui.timerDisplay.html(secondsToTime((data.endTime - Date.now())/1000)) //if timer still active, set timer based on endTime
        }
        
        //NOTE: CHANGES VALUE OF CENTER BUTTON DEPENDING ON WHETHER PAUSED OR PLAYING
        if (typeof data.active == "undefined") {
            chrome.storage.local.set({'active': false});
        } else if (!data.active) {
            menuBtns.active_bool.html(html_snippets.play_button)
        }
    })
}

function secondsToTime(seconds) {
    var seconds = Math.round(seconds)
    var parsed_minutes = Math.floor(seconds/60);
    var parsed_seconds = seconds - (parsed_minutes * 60);

    if (parsed_minutes < 10) {parsed_minutes = "0"+parsed_minutes;}
    if (parsed_seconds < 10) {parsed_seconds = "0"+parsed_seconds;}
    return `${parsed_minutes}:${parsed_seconds}`;
}

function getNextStage(stage) {
    switch (stage) {
        case "work":
            return "shortBreak"
            break;
    
        case "shortBreak":
            return "work"
            break;
    
        default:
            break;
}}

//!ON LOAD
onLoad()

//when clearTodoButton is pressed, runs .empty() on todoList which deletes it's children
menuBtns.active_bool.click(function (event) {onPlayPauseButton()})
menuBtns.stop.click(function (event) {onStopButton()})
menuBtns.skip.click(function (event) {onSkipButton()})
menuBtns.settings.click(function (event) {onSettingsButton()})
modalBtns.close.click(function (event) {onCloseModalButton()})

function timer(duration) {
    //NOTE: GETS TIME DIFFERENCE
    //*SETS INITIAL remainingTime
    var endTime = Date.now() + duration * 1000
    chrome.storage.local.set({'endTime': endTime}, function() {
        console.log(`Timer started for ${duration}`)
    });
}

function updateTimerUI(params) {
    timer_loop = setInterval(function() {
        //if statement checks whether timer has ended
        chrome.storage.local.get(["endTime", "active", "currentStage"], function(data) {
            if (data.endTime > Date.now() - 1500 && data.active) { //add in timer end check
                //!WHEN TIMER IS STILL ACTIVE
                //set timer display to remaining time
                var display_time = secondsToTime((data.endTime - Date.now())/1000) //sets remaining seconds into time format
                ui.timerDisplay.html(display_time)

                //updates stage using global var currentStage
                console.log(`${display_time} seconds remaining for ${data.currentStage} phase`)

                //!UPDATE STATUS BAR
                refreshStage()
            }
        });
    }, 1000) //1 SECOND CALLBACK TIME
}

function setStatus(stage) {
    var status_values = {
        //!ORDER: STATUS COLOR, STATUS ICON, STATUS MESSAGE
        'work': ["green", "book", "Currently working."],
        'shortBreak': ["blue", "headphones", "Currently on break."],
        'paused': ["purple", "star outline", "Currently away."]
    }
 
    var values = status_values[stage]

    if (ui.status.attr("class") !== `ui large ${values[0]} label`) {
        ui.status.attr("class", `ui large ${values[0]} label`) //sets status bar to desired status
        ui.status.html(`<i class="${values[1]} icon"></i> ${values[2]}`)
        console.log("changed status bar to: " + values)
    }
}

function updateStage() {
    chrome.storage.local.get(["active", "currentStage"], function(data) {
        if (data.active || typeof data.active == "undefined") {
            setStatus(getNextStage(data.currentStage)) //sets status to the next stage according to data.currentStage
        } else {
            setStatus("paused")
        }
        
    })
}

function refreshStage(){
    chrome.storage.local.get("currentStage", function(data) {
        setStatus(data.currentStage) //changes stage from paused to active
    })
}

function onPlayPauseButton() {
    chrome.storage.local.get("active", function(data) {
        switch (data.active) {
            case false: //activates when button "play"
                console.log("woah it worked")
                menuBtns.active_bool.html(html_snippets.pause_button)
                chrome.storage.local.get("remainingTimeAtPause", function (data) {
                    if (typeof data.remainingTimeAtPause !== "undefined") { //if the value of remainingTime exists, ie. timer has been started
                        timer(Math.floor(data.remainingTimeAtPause/1000))
                    } else { //else statement is first ever initial press
                        timer(input.workTime)
                        chrome.storage.local.set({'currentStage': "work"});
                    }
                })

                chrome.storage.local.set({'active': true});
                break;
            
            case true: //actives when button "stop"
                menuBtns.active_bool.html(html_snippets.play_button)
                chrome.storage.local.set({'active': false});
                //setStatus("paused") //changes stage from active to paused

                chrome.storage.local.get("endTime", function(data) {
                    chrome.storage.local.set({'remainingTimeAtPause': Math.ceil((data.endTime - Date.now())/1000) * 1000}) //sets difference between date.now and end time at pause
                    console.log(`remainingTime set ${Math.ceil((data.endTime - Date.now())/1000) * 1000}`)
                    //remainingTimeAtPause is used to set endTime when user resumes
                })
                break;
        
            default:
                break;
        }
    })
}

function onStopButton() {
    //variables that must be reset
    /* 1. currentStage --> work
       2. remainingTimeAtPause --> undefined
       3. reset all UI */

    chrome.storage.local.set({'currentStage': "work"});
    chrome.storage.local.set({'active': false})
    chrome.storage.local.set({'remainingTimeAtPause' : input.workTime * 1000});
    chrome.storage.local.set({'endTime' : undefined})

    //TODO: reset UI
    setStatus("work")
    chrome.storage.local.get("remainingTimeAtPause", function(data) {
        console.log(data.remainingTimeAtPause)
        ui.timerDisplay.html(secondsToTime(data.remainingTimeAtPause/1000)) //converts remainingTime to seconds, then to time format
    })

    menuBtns.active_bool.html(html_snippets.play_button)
}

function onSkipButton() {
    chrome.storage.local.get(['currentStage'], function(data) {
        var nextStage = getNextStage(data.currentStage)
        console.log(nextStage)

        chrome.storage.local.set({'currentStage': nextStage})
        chrome.storage.local.set({'active': false})
        chrome.storage.local.set({'remainingTimeAtPause': input[nextStage + "Time"] * 1000}); //converts user input (secs) to ms
        chrome.storage.local.set({'endTime' : undefined})

        //TODO: reset UI
        setStatus(nextStage)

        chrome.storage.local.get("remainingTimeAtPause", function(data) {
            console.log(data.remainingTimeAtPause)
            ui.timerDisplay.html(secondsToTime(data.remainingTimeAtPause/1000)) //converts remainingTime to seconds, then to time format
        })

        menuBtns.active_bool.html(html_snippets.play_button)
    })
}

function onSettingsButton(params) {
    ui.settings_menu.addClass("active")
    ui.dimmer.addClass("active")
}

function onCloseModalButton(params) {
    ui.settings_menu.removeClass("active")
    ui.dimmer.removeClass("active")
}

function onSaveSettingsButton(params) {
    /* code to save modal values to inputs.times */
    // NOTE: GOES HERE 

}

function onSuggestedSettingsButton(params) {
    //SET INPUT VALUES TO OUR SUGGESTED VALUES: 52 MIN BREAK, 17 MIN BREAK
}