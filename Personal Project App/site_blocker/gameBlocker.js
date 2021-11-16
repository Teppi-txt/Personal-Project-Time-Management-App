//?--------------------------------------------------------INITIATION----------------------------------------------------------------//
var games_timer = null

function editHTML(object, class_data, content) {
    object.classList.value = class_data //set object class data
    object.innerHTML = content //set object html content
}

function game_timer_setup(){
    var game_timer_input = document.getElementById("timeInputGames") //user input slot for time, gets time through //*timer_input.value
    console.log(game_timer_input.value)
    var time = game_timer_input.value; var end_time = Date.now() + time * 60000; //*calculates end time
    chrome.storage.local.set({'gameBlockTimer': end_time}, function() { game_timer_script()});
}

function run_confirm_alert(block_message) {
    var popup = confirm(`You are about to stop blocking ${block_message}. Continue?`)
    return popup
}

function game_timer_script(){
    var blockBtn = document.getElementById("gameBlock");
    var display = document.getElementById("gameTimerDisplay"); //* DISPLAY MODULE
    
    //NOTE: GETS TIME DIFFERENCE
    chrome.storage.local.get("gameBlockTimer", function(data) {
        //*recursive loop
        games_timer = setInterval(function() {
            var display_time = new Date(0); //!GENERATES NEW DATA USED IN THE DISPLAY
            display_time.setSeconds(Math.round(data.gameBlockTimer - Date.now())/1000) //CONVERT DATE TO SECS
            display.innerHTML = display_time.toISOString().substr(11, 8); //CONVERT DATE FORMAT TO TIME FORMAT

            //NOTE: LOGIC FOR TIMER = 0
            if (display_time <= 0 && data.gameBlockTimer){
                console.log("timer ended")
                chrome.storage.local.set({'gameBlockActive': false}, function() {
                    editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                    clearInterval(games_timer) //END TIMER
                    games_reset_input(display) //RESET TIMER UI
                });
            }
            }, 1000) //1 SECOND CALLBACK TIME
    });
}

function games_reset_input(display_obj){
    var game_input_html = 
    `<input style="width:100px;" type="text" placeholder="Enter time..." id="timeInputGames">
    <div class="ui basic label">mins</div>`

    display_obj.innerHTML = game_input_html
}

//?--------------------------------------------------------ONREADY----------------------------------------------------------------//

//test to see if toggle is active
chrome.storage.local.get("gameBlockActive", function(data) {
    var blockBtn = document.getElementById("gameBlock");
    var timer_input = document.getElementById("timeInputGames")
    
    if (data.gameBlockActive) {
        //note: red button
        //TODO: MAKE BUTTON ADJUST COLOR BASED ON gameBlockActive
        editHTML(blockBtn, "ui negative button", "Stop Timer")
        console.log("active1!!! UWUWUUAAA")

        chrome.storage.local.get("gameBlockTimer", function(data) {
            var display = document.getElementById("gameTimerDisplay"); //* DISPLAY MODULE

            //*gets the ongoing gameBlockTimer, and sets timer to that value
            var display_time = new Date(0); //!GENERATES NEW DATA USED IN THE DISPLAY
            display_time.setSeconds(Math.round(data.gameBlockTimer - Date.now())/1000) //CONVERT DATE TO SECS
            display.innerHTML = display_time.toISOString().substr(11, 8); //CONVERT DATE FORMAT TO TIME FORMAT
        })

        //SHOW TIMER ON LAUNCH
        game_timer_script()
    }
});


//?--------------------------------------------------------PROCESS----------------------------------------------------------------//


//event listener for "block" button for games
document.addEventListener("DOMContentLoaded", function() {

    //getting button
    var blockBtn = document.getElementById("gameBlock"); //*BUTTON TO START TIMER
    var timer_input = document.getElementById("timeInputGames"); //* INPUT BAR FOR TIME
    var display = document.getElementById("gameTimerDisplay"); //* DISPLAY MODULE

    blockBtn.addEventListener('click', function() {
        //set button toggle in chrome storage as true
        chrome.storage.local.get('gameBlockActive', function(data) {
            if (data.gameBlockActive) {
                if (run_confirm_alert("game-related sites")) { //*checks if user agrees to stop the program using an alert
                    chrome.storage.local.set({'gameBlockActive': false}, function() {
                        editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                        clearInterval(games_timer) //END TIMER
                        games_reset_input(display) //RESET TIMER UI
                    });
                }
            } else {
                chrome.storage.local.set({'gameBlockActive': true}, function() {
                    editHTML(blockBtn, "ui negative button", "Stop Timer") //CHANGE BUTTON TOGGLE STATE TO ACTIVE
                    editHTML(timer_input, "ui input", "heheh") //CHANGE TIMER UI
                    game_timer_setup() //START TIMER
                });
            }
        });

    }, false);
}, false);