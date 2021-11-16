var homepage_dir = "main_menu/mainMenu.html"
//console.log("app ran")

//get global "lastOpenedWindow" variable
chrome.storage.local.get("lastOpenedWindow", function(data) {

    //if user has clicked on a tab
    console.log(data.lastOpenedWindow)
    if (typeof data.lastOpenedWindow !== 'undefined') {
        console.log("redirected to: " + data.lastOpenedWindow)
        window.location.replace("../" + data.lastOpenedWindow);  
    } 
    else {
        chrome.storage.local.set({"lastOpenedWindow": homepage_dir}, function() {
        console.log("redirected to: " + homepage_dir)
        window.location.replace("../main_menu/mainMenu.html");
    })}
})  