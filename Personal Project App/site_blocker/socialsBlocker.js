//?--------------------------------------------------------INITIATION----------------------------------------------------------------//
var socials_timer = null

function editHTML(object, class_data, content) {
    object.classList.value = class_data //set object class data
    object.innerHTML = content //set object html content
}

function timer_setup(){
    var timer_input = document.getElementById("timeInputSocials") //user input slot for time, gets time through //*timer_input.value
    console.log(timer_input)
    var time = timer_input.value; var end_time = Date.now() + time * 60000; //*calculates end time
    chrome.storage.local.set({'socialBlockTimer': end_time}, function() { timer_script()});
}

function timer_script(){
    var blockBtn = document.getElementById("socialMediaBlock");
    var display = document.getElementById("socialsTimerDisplay"); //* DISPLAY MODULE
    
    //NOTE: GETS TIME DIFFERENCE
    chrome.storage.local.get("socialBlockTimer", function(data) {
        //*recursive loop
        socials_timer = setInterval(function() {
            var display_time = new Date(0); //!GENERATES NEW DATA USED IN THE DISPLAY
            display_time.setSeconds(Math.round(data.socialBlockTimer - Date.now())/1000) //CONVERT DATE TO SECS
            display.innerHTML = display_time.toISOString().substr(11, 8); //CONVERT DATE FORMAT TO TIME FORMAT

            //NOTE: LOGIC FOR TIMER = 0
            if (display_time <= 0 && data.socialBlockTimer){
                console.log("timer ended")
                chrome.storage.local.set({'socialBlockActive': false}, function() {
                    editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                    clearInterval(socials_timer) //END TIMER
                    socials_reset_input(display) //RESET TIMER UI
                });
            }
            }, 1000) //1 SECOND CALLBACK TIME
    });
}

function socials_reset_input(display_obj){
    var social_input_html = 
    `<input style="width:100px;" type="text" placeholder="Enter time..." id="timeInputSocials">
    <div class="ui basic label">mins</div>`

    display_obj.innerHTML = social_input_html
}

//?--------------------------------------------------------ONREADY----------------------------------------------------------------//

//test to see if toggle is active
chrome.storage.local.get("socialBlockActive", function(data) {
    var blockBtn = document.getElementById("socialMediaBlock");
    var timer_input = document.getElementById("timeInputSocials")
    
    if (data.socialBlockActive) {
        //note: red button
        //TODO: MAKE BUTTON ADJUST COLOR BASED ON socialBlockActive
        editHTML(blockBtn, "ui negative button", "Stop Timer")
        console.log("active1!!! UWUWUUAAA")

        //SHOW TIMER ON LAUNCH
        timer_script()
    }
});


//?--------------------------------------------------------PROCESS----------------------------------------------------------------//


//event listener for "block" button for socials
document.addEventListener("DOMContentLoaded", function() {

    //getting button
    var blockBtn = document.getElementById("socialMediaBlock"); //*BUTTON TO START TIMER
    var timer_input = document.getElementById("timeInputSocials"); //* INPUT BAR FOR TIME
    var display = document.getElementById("socialsTimerDisplay"); //* DISPLAY MODULE

    blockBtn.addEventListener('click', function() {
        //set button toggle in chrome storage as true
        chrome.storage.local.get('socialBlockActive', function(data) {
            if (data.socialBlockActive) {
                chrome.storage.local.set({'socialBlockActive': false}, function() {
                    editHTML(blockBtn, "ui positive button", "Start Timer") //CHANGE BUTTON TOGGLE STATE TO INACTIVE
                    clearInterval(socials_timer) //END TIMER
                    socials_reset_input(display) //RESET TIMER UI
                });
            } else {
                chrome.storage.local.set({'socialBlockActive': true}, function() {
                    editHTML(blockBtn, "ui negative button", "Stop Timer") //CHANGE BUTTON TOGGLE STATE TO ACTIVE
                    editHTML(timer_input, "ui input", "heheh") //CHANGE TIMER UI
                    timer_setup() //START TIMER
                });
            }
        });

    }, false);
}, false);