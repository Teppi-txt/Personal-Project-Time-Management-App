var timerDisplay = $("#timer_wb");
var settingsBtn = $("#settings_wb");

var menuBtns = {
    stop: $("#stop_wb"),
    pause: $("#pause_wb"),
    skip: $("#skip_wb")
}

var input = {
    workTime: 52 * 60000, //Note: 52 minutes converted to date.now() format, add user input here
    shortBreakTime: 17 * 60000,
    longBreakTime: 30 * 60000
}