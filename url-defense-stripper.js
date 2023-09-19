const rewrite = async () => {
    // Replace HTML links
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        if (link.href.startsWith('https://urldefense.com')) {
            // Re-write href
            const matches = link.href.match(/https:\/\/urldefense.com\/v.\/__(.+)__;.+/);
            if (matches && matches.length) {
                link.href = matches[1].replaceAll('*', '#'); // # gets replaced by *, reverse that (may catch legitimate *?)
            }

            // Re-write text ("blabla [some.domain.com]")
            const textMatches = link.innerText.match(/(.+) \[.+\]/);
            if (textMatches && textMatches.length) {
                link.innerText = textMatches[1];
            }
        }
    }

    // Replace plaintext links
    let text = document.body.innerHTML;
    const iter = text.matchAll(/https:\/\/urldefense.com\/v.\/__(.+)__;.+\$(<\/a>)?( \[.+\])?/g);
    let value;
    let modified = false;
    while (value = iter.next().value) {
        let replacement = value[1].replaceAll('*', '#');
        if (value[2]) // Replacing closing </a> if present
            replacement = replacement + value[2];
        text = text.replaceAll(value[0], replacement);
        modified = true;
    }

    if (modified) {
        document.body.innerHTML = text;
    }
};

rewrite();
