const rewrite = async () => {
    const urlDefenseMatch = "https://urldefense.com/v./__([^\\s]+)__;.+";
    const hrefMatch = new RegExp(urlDefenseMatch);
    const textMatch = new RegExp(urlDefenseMatch + "\\$(</a>)?( \\[.+\\])?", "g");

    // Replace HTML links
    const links = document.getElementsByTagName("a");
    for (let link of links) {
        if (link.href.startsWith("https://urldefense.com")) {
            // Re-write href
            const matches = link.href.match(hrefMatch);
            if (matches && matches.length) {
                link.href = matches[1].replaceAll("*", "#"); // # gets replaced by *, reverse that (may catch legitimate *?)
            }

            // Re-write link's inner contents to remove square bracket bit ("blabla [some.domain.com]")
            const innerMatches = link.innerHTML.match(/(.*) \[.+\]/);
            if (innerMatches && innerMatches.length) {
                link.innerHTML = innerMatches[1];
            }
        }
    }

    // Replace plaintext links
    let text = document.body.innerHTML;
    const iter = text.matchAll(textMatch);
    let value;
    let modified = false;
    while (value = iter.next().value) {
        let replacement = value[1].replaceAll("*", "#");
        if (value[2]) { // Replacing closing </a> if present
            replacement = replacement + value[2];
        }
        text = text.replaceAll(value[0], replacement);
        modified = true;
    }

    if (modified) {
        document.body.innerHTML = text;
    }
};

rewrite();
