/**
 * Asynchronously fetches Instagram posts from a provided list of Instagram post IDs via HTTP using PHP without using Intagram API and appends them to an HTML tag. Skips invalid posts and timed out requests.
 * getInstagram(php, instalinks, target, num)
 * {php} {String} location of PHP file
 * {instalinks} {Array} Array of Instagram post IDs
 * {target} {String} HTML tag to append to
 * {num} {Number} number of Instagram posts to fetch.
 * 
 * @param  {String} {Array} {String} {Number}
 * @return nothing
 * @method getInstagram
 */

var getInstagram = function(php, instalinks, target, num, user) {
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
                if(!user){
                    req.open('GET', php + '?media=' + instalinks[index], true);
                } else {
                    console.log('reqListener user');
                    req.open('GET', php + '?user=' + user, true);
                }
                req.send();
            },
            reqListener = function() {
                if(!user){
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
                var shortcode_media = null;
                var instalinks = [];
                var entry_data = false;

                if(!user){
                    shortcode_media = data.entry_data.PostPage[0].graphql.shortcode_media;
                    countEl++;
                    var img = '<img src="' + data.entry_data.PostPage[0].graphql.shortcode_media.display_url + '" alt="' + shortcode_media.edge_media_to_caption.edges[0].node.text + '" />',
                        output = document.createElement("li");
                    output.setAttribute('data-id', countEl);
                    output.innerHTML = '<p class="num">' +
                        pad(countEl, 2, 0) +
                        '</p><div class="image-box"><a href="https://instagram.com/p/' +
                        shortcode_media.shortcode +
                        '" target="_blank">' +
                        img +
                        '</a></div><p class="desc">' +
                        shortcode_media.edge_media_to_caption.edges[0].node.text +
                        '</p><p class="author"><strong>' +
                        shortcode_media.owner.username +
                        '</strong></p>';
                    target.appendChild(output);
                } else {
                    edges = data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
                    for (var i = 0; i <= edges.length - 1; i++) {
                        instalinks.push(edges[i].node.shortcode);
                    }

                    instalinks = shuffle(instalinks);
                    window.getInstagram(php, instalinks, target, num, false);
                }
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
    };
