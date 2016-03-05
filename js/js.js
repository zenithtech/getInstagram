/**
 * Asynchronously fetches Instagram posts from a provided list of Instagram post IDs via HTTP using PHP without using Intagram API and appends them to an HTML tag. Skips invalid posts and timed out requests.
 * getInstagramData(php, a, target, num)
 * {php} {String} location of PHP file
 * {a} {Array} Array of Instagram post IDs
 * {target} {String} HTML tag to append to
 * {num} {Number} number of Instagram posts to fetch.
 * 
 * @param  {String} {Array} {String} {Number}
 * @return nothing
 * @method getInstagramData
 */
function getInstagramData(php, a, target, num) {
    var countEl = 0,
        index = 0,
        callInt = function() {
            jQuery.when(jQuery.ajax({
                dataType: 'json',
                url: php + '?media=' + a[index],
                cache: false,
                async: true,
                timeout: 5000, // skip in case the request is too slow
                error: function(xhr, status, error) {
                    console.log('Sorry, could not get post with ID: "' + a[index] + '", reason: ' + error + '. Skipping ... ');
                    if (index >= a.length) {
                        console.log('Sorry, found only ' + countEl + ' posts of ' + num + ' requested.' + ' Exiting.');
                    }
                    if (index < a.length) {
                        index++;
                        callInt();
                    }
                }
            })).then(function(data, textStatus, jqXHR) {
                countEl++;
                var img = '<img src="' + data.entry_data.PostPage[0].media.display_src + '" alt="' + data.entry_data.PostPage[0].media.caption + '" />',
                    output = '<li data-id="' + countEl + '"><p class="num">' + pad(countEl, 2, 0) + '</p>';
                output += '<div class="image-box">';
                output += '<a href="https://instagram.com/p/' + data.entry_data.PostPage[0].media.code + '" target="_blank">' + img + '</a>';
                output += '</div>';
                output += '<p class="desc">' + data.entry_data.PostPage[0].media.caption + '</p>';
                output += '<p class="author"><strong>' + data.entry_data.PostPage[0].media.owner.username + '</strong> </p>';
                output += '</li>';
                target.append(output);
            }).promise().done(function() {
                if (countEl >= num || index >= a.length) {
                    // sortinstalinks();
                    console.log('Complete. Found ' + countEl + ' posts of ' + num + ' requested.');
                } else {
                    index++;
                    callInt();
                }
            });
        };
    callInt();
}

function sortinstalinks() {
    jQuery('#instgramelement li').sort(function(a, b) {
        var an = a.getAttribute('data-id'),
            bn = b.getAttribute('data-id');
        if (an > bn) {
            return 1;
        }
        if (an < bn) {
            return -1;
        }
        return 0;
    }).detach().prependTo(jQuery('#instgramelement'));
}

// Usage: pad([number], [number], [string]) // pad(1, 2, 0)
function pad(a, s, d) {
    d = d || '0';
    a = a + '';
    return a.length >= s ? a : new Array(s - a.length + 1).join(d) + a;
}

function shuffle(array) {
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
}

jQuery(document).on({
    ready: function() {
        // Set a selection of Instagram posts by their IDs
        // eg. 8gMTgjo6lK from https://instagram.com/p/8gMTgjo6lK/

        // TEST: links with errors
        var instalinks = [
            'xxxxxx',
            'BA9M58hoTYL',
            'xxxxxx',
            'BA-vDsLKowA',
            'xxxxxx',
            'BAhlW4QvKhB',
            'BBGLtUCKo0S',
            'xxxxxx',
        ];


        // TEST: links without errors

        /*        var instalinks = [
                    'BBG2NsYkgVB',
                    'BBC3msDm3cc',
                    'BBDNddZPKsx',
                    'BAhlW4QvKhB',
                    'BAFhPC0mWwY',
                    'BAxb0t1BFf6',
                    'BADJZBgBFRO',
                    'BBEIIlioTSF',
                    'BA9M58hoTYL',
                    'BBGLtUCKo0S',
                    'BA-vDsLKowA',
                    'BBAcH-LCEUD',
                    'BBAolZ1iEb8',
                    '88qlkdiEfD',
                    'BAzlDkePKke'
                ];*/

        // Shuffle the links so that each time the page loads it shows different links from the selection.
        var instalinksrand = shuffle(instalinks);

        // Call the function
        getInstagramData("php/instagram.php", instalinks, jQuery('#instgramelement'), 5);
    }

});
