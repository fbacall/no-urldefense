const util = {
    _key: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",

    decode: function (str) {
        return atob(str.replace(/_/g, '/').replace(/-/g, '+'));
    },

    length: function (char) {
        const l = this._key.indexOf(char);
        return (l === -1) ? null : l + 2;
    },

    replaceSubs: function (url, key) {
        let subs = this.decode(key).split("");
        const iter = url.matchAll(/\*\*?([-_A-Za-z0-9])?/g);
        let drift = 0;
        let value
        while (value = iter.next().value) {
            const startIndex = value.index + drift;
            const endIndex = value.index + value[0].length + drift;
            const length = value[1] ? util.length(value[1]) : 1;
            const replacement = subs.splice(0, length).join("");

            url = url.slice(0, startIndex) + replacement + url.slice(endIndex, url.length);
            drift += (replacement.length - value[0].length);
        }

        return url;
    }
}

const rewrite = async () => {
    const urlDefenseMatch = "https://urldefense.com/v./__([^\\s]+)__;([^!]*)!!.+";
    const hrefMatch = new RegExp(urlDefenseMatch);
    const textMatch = new RegExp(urlDefenseMatch + "\\$(</a>)?( ?\\[.+\\])?", "g");

    // Replace HTML links
    const links = document.getElementsByTagName("a");
    for (let link of links) {
        if (link.href.startsWith("https://urldefense.com")) {
            // Re-write href
            const matches = link.href.match(hrefMatch);
            if (matches && matches.length) {
                link.href = util.replaceSubs(matches[1], matches[2]);
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
        let replacement = util.replaceSubs(value[1], value[2]);
        if (value[3]) { // Replacing closing </a> if present
            replacement = replacement + value[3];
        }
        text = text.replaceAll(value[0], replacement);
        modified = true;
    }

    if (modified) {
        document.body.innerHTML = text;
    }
};

rewrite();
