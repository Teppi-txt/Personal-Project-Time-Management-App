//?--------------------------------------------------------INITIATION----------------------------------------------------------------//
var link_timer = null

function editHTML(object, class_data, content) {
    object.classList.value = class_data //set object class data
    object.innerHTML = content //set object html content
}

function link_timer_setup(){
    var link_timer_input = document.getElementById("timeInputLink") //user input slot for time, gets time through //*timer_input.value
    var blockedLinks = [document.getElementById('linkInput0').value, document.getElementById('linkInput1').value, document.getElementById('linkInput2').value]
    var time = link_timer_input.value; var end_time = Date.now() + time * 60000; //*calculates end time
    chrome.storage.local.set({'blockedLinks': blockedLinks}, function() {console.log("blocked" + blockedLinks)});
    chrome.storage.local.set({'linkBlockTimer': end_time}, function() { link_timer_script()});
}

function run_confirm_alert(block_message) {
    var popup = confirm(`You are about to stop blocking ${block_message}. Continue?`)
    return popup
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
                    link_reset_input(display) //RESET TIMER UI
                });
            }
            }, 1000) //1 SECOND CALLBACK TIME
    });
}

function link_reset_input(display_obj){
    var input_html = 
        `<input style="width:100px;" type="text" placeholder="Enter time..." id="timeInputLink">
        <div class="ui basic label">mins</div>`

    display_obj.innerHTML = input_html
}

//?--------------------------------------------------------ONREADY----------------------------------------------------------------//

//test to see if toggle is active
chrome.storage.local.get("linkBlockActive", function(data) {
    var blockBtn = document.getElementById("linkBlock"); //*BUTTON TO START TIMER
    
    if (data.linkBlockActive) {
        //!red button
        //TODO: MAKE BUTTON ADJUST COLOR BASED ON linkBlockActive
        editHTML(blockBtn, "ui negative button", "Stop Timer")

        //!SHOW TIMER ON LAUNCH
        link_timer_script()

        //gets submitted link data
        chrome.storage.local.get("blockedLinks", function(data) {
            //replaces blank fields with submitted data
            for (let i = 0; i < data.blockedLinks.length; i++) {
                var input = $('#linkInput' + i)
                input.val(data.blockedLinks[i])
            }
        })

        chrome.storage.local.get("linkBlockTimer", function(data) {
            var display = document.getElementById("linkTimerDisplay"); //* DISPLAY MODULE

            //*gets the ongoing linkBlockTimer, and sets timer to that value
            var display_time = new Date(0); //!GENERATES NEW DATA USED IN THE DISPLAY
            display_time.setSeconds(Math.round(data.linkBlockTimer - Date.now())/1000) //CONVERT DATE TO SECS
            display.innerHTML = display_time.toISOString().substr(11, 8); //CONVERT DATE FORMAT TO TIME FORMAT
        })
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
                if (run_confirm_alert("specific sites")) { //*checks if user agrees to stop the program using an alert
                    chrome.storage.local.set({'linkBlockActive': false}, function() {
                        editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                        clearInterval(link_timer) //END TIMER
                        link_reset_input(display) //RESET TIMER UI
                    });
                }
            } else {
                chrome.storage.local.set({'linkBlockActive': true}, function() {
                    editHTML(blockBtn, "ui negative button", "Stop Timer") //CHANGE BUTTON TOGGLE STATE TO ACTIVE
                    editHTML(timer_input, "ui input", "heheh") //CHANGE TIMER UI
                    link_timer_setup() //START TIMER
                });
            }
        });
    }, false);
}, false);