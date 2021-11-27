
//html layout for blocked page, replaces body of page with this html
const generateHTML = (siteName) => {
    return `
    <h2 class="ui center aligned block blue icon header" style="width: 350px; height: 250px; margin-top: 15%">
    <i class="massive ban icon" style=" margin-top: 25%"></i>
    <div class="content">
      Blocked Website
      <div class="blue massive sub header"><b>` + siteName + `</b> has been blocked by Workflow Assistant.
    </h2>`
};

//standard semantic UI stylesheet
const generateSTYLE = () => {
    return '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">'
};

function checkIfArrayInHostname(array) {
    for (i = 0; i <= array.length - 1; i++) {
        if (window.location.hostname.includes(array[i])) {
            return true
        }
    }
}


//list of blocked socials, formatted as array
var socials = ["facebook", "twitter", "linkedin", "youtube", "pinterest", "instagram", "tumbler", 
               "flickr", "reddit", "snapchat", "whatsapp", "quora", "tiktok", "vimeo", "bizsugar", 
               "viber", "wechat" ]


var games = ["nintendo", "valve", "steam", "ea.com", "activision", "rockstargames", "ubisoft", 
             "sega", "naughtydog", "capcom", "mojang", "epicgames", "gamefreak", "gameloft", 
             "zenimax", "blizzard", "konami", "bethesda", "atari", "thatgamecompany", "beenox", 
             "popcap", "pokemon", "dishonored", "final-fantasy", "assassins-creed", "fallout", 
             "undertale", "leagueoflegends", "megaman", "inside", "contra", "residentevil", 
             "genshinimpact", "mihoyo", "GTA", "grandtheftauto", "persona", "fortnite", 
             "supersmash", "skyrim", "dota", "mariokart", "spelunky", "tetris", "2048", 
             "tictactoe", "minesweeper", "donkeykong", "pacman", "thesims", "reddeadredemption", 
             "splintercell", "mario", "silenthill", "masseffect", "callofduty", "riseofthetombraider", 
             "thewitness", "uncharted", "overwatch", "deuxex", "counterstrike", "csgo", "left4dead", 
             "leftfordead", "earthbound", "starcraft", "worldofwarcraft", "fallout", "bloodborne", 
             "shadowofthecolossus", "valorant", "apexlegends", "godofwar", "thewitcher", "bioshock", 
             "zelda", "minecraft", "doom", "streetfighter", "castlevania"] 


//check whether the current page is included in hostnames
if (checkIfArrayInHostname(socials)) {
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
}

if (checkIfArrayInHostname(games)) {
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