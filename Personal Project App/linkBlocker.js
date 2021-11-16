//?--------------------------------------------------------INITIATION----------------------------------------------------------------//
var link_timer = null

function editHTML(object, class_data, content) {
    object.classList.value = class_data //set object class data
    object.innerHTML = content //set object html content
}

function link_timer_setup(){
    var link_timer_input = document.getElementById("timeInputLink") //user input slot for time, gets time through //*timer_input.value
    var link_input = document.getElementById("linkInput") //user input for blocked link
    var time = link_timer_input.value; var end_time = Date.now() + time * 60000; //*calculates end time
    chrome.storage.local.set({'blockedLink': link_input.value}, function() {console.log("blocked" + link_input.value)});
    chrome.storage.local.set({'linkBlockTimer': end_time}, function() { link_timer_script()});
}

function link_timer_script(){
    var blockBtn = document.getElementById("linkBlock");
    var display = document.getElementById("linkTimerDisplay"); //* DISPLAY MODULE
    
    //!GETS TIME DIFFERENCE
    chrome.storage.local.get("linkBlockTimer", function(data) {
        //*recursive loop
        link_timer = setInterval(function() {
            var display_time = new Date(0); //!GENERAtES NEW DATA USED IN THE DISPLAY
            display_time.setSeconds(Math.round(data.linkBlockTimer - Date.now())/1000) //CONVERT DATE TO SECS
            display.innerHTML = display_time.toISOString().substr(11, 8); //CONVERT DATE FORMAT TO TIME FORMAT

            //!LOGIC FOR TIMER = 0
            if (display_time <= 0){
                console.log("timer ended")
                chrome.storage.local.set({'linkBlockActive': false}, function() {
                    editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                    clearInterval(link_timer) //END TIMER
                    reset_input(display) //RESET TIMER UI
                });
            }
            }, 1000) //1 SECOND CALLBACK TIME
    });
}

function reset_input(display_obj){
    var input_html = 
    `<div class="ui right small labeled input" id="linkTimerDisplay">
        <input style="width:100px;" type="text" placeholder="Enter time..." id="timeInputLink">
        <div class="ui basic label">mins</div>
    </div>`

    display_obj.innerHTML = input_html
}

//?--------------------------------------------------------ONREADY----------------------------------------------------------------//

//test to see if toggle is active
chrome.storage.local.get("linkBlockActive", function(data) {
    var blockBtn = document.getElementById("linkBlock");
    
    if (data.linkBlockActive) {
        //!red button
        //TODO: MAKE BUTTON ADJUST COLOR BASED ON linkBlockActive
        editHTML(blockBtn, "ui negative button", "Stop Timer")
        console.log("active1!!! UWUWUUAAA")

        //!SHOW TIMER ON LAUNCH
        link_timer_script()
    }
});


//?--------------------------------------------------------PROCESS----------------------------------------------------------------//


//event listener for "block" button for linkss
document.addEventListener("DOMContentLoaded", function() {

    //getting button
    var blockBtn = document.getElementById("linkBlock"); //*BUTTON TO START TIMER
    var timer_input = document.getElementById("timeInputLink"); //* INPUT BAR FOR TIME
    var display = document.getElementById("linkTimerDisplay"); //* DISPLAY MODULE

    blockBtn.addEventListener('click', function() {
        //set button toggle in chrome storage as true

        chrome.storage.local.get('linkBlockActive', function(data) {
            if (data.linkBlockActive) {
                chrome.storage.local.set({'linkBlockActive': false}, function() {
                    editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                    clearInterval(link_timer) //END TIMER
                    reset_input(display) //RESET TIMER UI
                });
            } else {
                chrome.storage.local.set({'linkBlockActive': true}, function() {
                    editHTML(blockBtn, "ui negative button", "Stop Timer") //CHANGE BUTTON TOGGLE STATE TO ACTIVE
                    editHTML(timer_input, "ui input", "heheh") //CHANGE TIMER UI
                    link_timer_setup() //START TIMER
                });
            }

            //!log output of blocking status
            console.log(" Blocking Status: " + data.linkBlockActive)
        });

    }, false);
}, false);