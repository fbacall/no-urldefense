const rewrite = async () => {
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
};

rewrite();
