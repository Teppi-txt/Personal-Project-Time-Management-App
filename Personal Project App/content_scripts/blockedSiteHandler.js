
//html layout for blocked page, replaces body of page with this html
const generateHTML = (siteName) => {
    return `
    <h2 class="ui center aligned block blue icon header" style="width: 350px; height: 250px; margin-top: 15%">
    <i class="massive ban icon" style=" margin-top: 25%"></i>
    <div class="content">
      Blocked Website
      <div class="blue massive sub header"><b>` + siteName + `</b> has been blocked by //APPNAME.
    </h2>`
};

//standard semantic UI stylesheet
const generateSTYLE = () => {
    return '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">'
};


//list of blocked socials, formatted as array
var socials = ["www.youtube.com", "www.instagram.com"] 
var games = ["osu.ppy.sh"] 


//check whether the current page is included in hostnames
if (socials.includes(window.location.hostname)) {
    //get current toggle variable from chrome storage
    chrome.storage.local.get("socialBlockActive", function(data) {
        //?logged socialBlockActive get
        console.log("Storage Get: socialBlockActive = " + data.socialBlockActive)

        //check if statement
        if (data.socialBlockActive) {
            console.log("Blocked " + window.location.hostname + " at " + Date.now())

            //block site by changing site html
            document.head.innerHTML = generateSTYLE(); //! DO NOT EDIT, DEFAULT SEMANTIC STYLE SHEET
            document.body.innerHTML = generateHTML(window.location.hostname);
        }
    });
} else if (games.includes(window.location.hostname)) {
    //get current toggle variable from chrome storage
    chrome.storage.local.get("gameBlockActive", function(data) {
        //?logged gameBlockActive get
        console.log("Storage Get: gameBlockActive = " + data.gameBlockActive)

        //check if statement
        if (data.gameBlockActive) {
            console.log("Blocked " + window.location.hostname + " at " + Date.now())

            //block site by changing site html
            document.head.innerHTML = generateSTYLE(); //! DO NOT EDIT, DEFAULT SEMANTIC STYLE SHEET
            document.body.innerHTML = generateHTML(window.location.hostname);
        }
    });
}

chrome.storage.local.get("blockedLinks", function(data) {
    if (data.blockedLinks.includes(window.location.hostname)) {
        chrome.storage.local.get("linkBlockActive", function(data) {
            //?logged linkBlockActive get
            console.log("Storage Get: linkBlockActive = " + data.linkBlockActive)
    
            //check if statement
            if (data.linkBlockActive) {
                console.log("User Blocked " + window.location.hostname + " at " + Date.now())
    
                //block site by changing site html
                document.head.innerHTML = generateSTYLE(); //! DO NOT EDIT, DEFAULT SEMANTIC STYLE SHEET
                document.body.innerHTML = generateHTML(window.location.hostname);
            }
        });
    }
});    