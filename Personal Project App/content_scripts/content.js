console.log("tab opened: " + window.location.hostname)

chrome.storage.local.get('linkBlockActive', function(data) {
    console.log('linkBlockActive: ' + data.linkBlockActive)
});

chrome.storage.local.get('blockedLinks', function(data) {
    console.log('blocked links: ' + data.blockedLinks)
});