var tab_list = $("[name='tab']");

//assign click events to all tabs
//tab_list.click();

//detect when an element is clicked on
tab_list.click(function(event) {
    //gets element that triggered the event
    var element = event.target
    console.log("tab clicked")
    //!CHECKS IF REDIRECT IS A DIFFERENT PAGE THAN CURRENT PAGE BY COMPARING IDS
    if (window.location.pathname !== "/" + element.id) {
        //changes extension window to desired tab
        //NOTE: name of element is directory path to the html file of that page
        console.log("redirected to: " + element.id)
        chrome.storage.local.set({"lastOpenedWindow": element.id}, function() {})
        window.location.replace("../" + element.id); 
    } 
})