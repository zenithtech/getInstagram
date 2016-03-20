/**
 * Asynchronously fetches Instagram posts from a provided list of Instagram post IDs via HTTP using PHP without using Intagram API and appends them to an HTML tag. Skips invalid posts and timed out requests.
 * getInstagramData(php, instalinks, target, num)
 * {php} {String} location of PHP file
 * {instalinks} {Array} Array of Instagram post IDs
 * {target} {String} HTML tag to append to
 * {num} {Number} number of Instagram posts to fetch.
 * 
 * @param  {String} {Array} {String} {Number}
 * @return nothing
 * @method getInstagramData
 */

var getInstagramData = function(php, instalinks, target, num) {
        var countEl = 0,
            index = 0,
            req = new XMLHttpRequest(),
            parseReq = function(xhr) {
                var reqData;
                if (!xhr.responseType || xhr.responseType === "text") {
                    reqData = xhr.responseText;
                } else if (xhr.responseType === "document") {
                    reqData = xhr.responseXML;
                } else {
                    reqData = xhr.response;
                }
                return reqData;
            },
            callInt = function() {
                req.open('GET', php + '?media=' + instalinks[index], true);
                req.send();
            },
            reqListener = function() {
                if (countEl < num || index < instalinks.length) {
                    if (index < instalinks.length) {
                        index++;
                        if (num > instalinks.length && index >= instalinks.length) {
                            console.log('Sorry, you requested ' + num + ' but supplied only ' + instalinks.length + '. Exiting.');
                            return false;
                        }
                        if (countEl >= num || index >= instalinks.length) {
                            if (index >= instalinks.length && countEl < num) {
                                console.log('Sorry, found only ' + countEl + ' posts of ' + num + ' requested.' + ' Exiting.');
                                return false;
                            } else {
                                console.log('Complete. Found ' + countEl + ' posts of ' + num + ' requested.');
                                return false;
                            }
                        }
                        callInt();
                    }
                }
            };

        req.timeout = 4000;
        req.addEventListener("load", reqListener);
        req.ontimeout = function() {
            console.log("Timed out");
            reqListener();
        };
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                var data = JSON.parse(parseReq(req));
                countEl++;
                var img = '<img src="' + data.entry_data.PostPage[0].media.display_src + '" alt="' + data.entry_data.PostPage[0].media.caption + '" />',
                    output = document.createElement("li");
                output.setAttribute('data-id', countEl);
                output.innerHTML = '<p class="num">' +
                    pad(countEl, 2, 0) +
                    '</p><div class="image-box"><a href="https://instagram.com/p/' +
                    data.entry_data.PostPage[0].media.code +
                    '" target="_blank">' +
                    img +
                    '</a></div><p class="desc">' +
                    data.entry_data.PostPage[0].media.caption +
                    '</p><p class="author"><strong>' +
                    data.entry_data.PostPage[0].media.owner.username +
                    '</strong></p>';
                target.appendChild(output);
            }
            if (req.readyState == 4 && req.status == 400) {
                console.log('Sorry, could not get post with ID: "' + instalinks[index] + '". Skipping ... ');
            }
        };
        callInt();
    },
    pad = function(a, s, d) {
        d = d || '0';
        a = a + '';
        return a.length >= s ? a : new Array(s - a.length + 1).join(d) + a;
    },
    shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    // Set a selection of Instagram posts by their IDs
    // eg. 8gMTgjo6lK from https://instagram.com/p/8gMTgjo6lK/
    // includes some bad requests for testing.
    instalinks = [
        'xxxxxx', // bad request
        'BA9M58hoTYL',
        'BA-vDsLKowA',
        'xxxxxx', // bad request
        'BAhlW4QvKhB',
        'BBGLtUCKo0S',
        'xxxxxx', // bad request
        'BBG2NsYkgVB',
        'BBC3msDm3cc',
        'xxxxxx', // bad request
        'BBDNddZPKsx',
        'BAFhPC0mWwY',
        'xxxxxx', // bad request
        'BAxb0t1BFf6',
        'BADJZBgBFRO',
        'xxxxxx', // bad request
        'BBEIIlioTSF',
        'BBAcH-LCEUD',
        'xxxxxx', // bad request
        '88qlkdiEfD',
        'BAzlDkePKke'
    ],
    // Shuffle the links so that they're in random order.
    instalinksrand = shuffle(instalinks);

(function() {
    // Call the getInstagramData function
    getInstagramData("php/instagram.php", instalinks, document.getElementById('instgramelement'), 5);
})();