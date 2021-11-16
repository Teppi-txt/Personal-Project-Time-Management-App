var tab_list = $("[name='tab']");

//assign click events to all tabs
//tab_list.click();

//detect when an element is clicked on
tab_list.click(function(event) {
    //gets element that triggered the event
    var element = event.target
    var id = element.id
    var redirect_dict = {
        "homepage" : "main_menu/mainMenu.html",
        "site_blocker" : "site_blocker/blockerPage.html",
        "todo_page" : "todo_page/todoPage.html",
        "planner" : "todo_page/todoPage.html",
        "org_tech" : "organisation_techniques/orgTech.html"
    }
    console.log("tab clicked")
    //!CHECKS IF REDIRECT IS A DIFFERENT PAGE THAN CURRENT PAGE BY COMPARING IDS
    if (window.location.pathname !== "/" + redirect_dict[id]) {
        //changes extension window to desired tab
        //NOTE: name of element is directory path to the html file of that page
        console.log("redirected to: " + redirect_dict[id])
        chrome.storage.local.set({"lastOpenedWindow": redirect_dict[id]}, function() {})
        window.location.replace("../" + redirect_dict[id]); 
    } 
})