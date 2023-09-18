/**
 * Tell Thunderbird that it should load our script
 * whenever a message is displayed
 */
messenger.messageDisplayScripts.register({
    js: [{ file: "url-defense-stripper.js" }]
});

// or composed
messenger.composeScripts.register({
    js: [{ file: "url-defense-stripper.js" }]
});
