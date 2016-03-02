function getInstagramData(a, target, num) {
    var count = num,
        countEl = 0;
    jQuery.each(a, function(i, d) {
        if (i < count) {
            jQuery.when(jQuery.ajax({
                dataType: "json",
                url: "php/instagram.php?media=" + d,
                cache: false,
                async: true,
                error: function(xhr, status, error) {
                    count = count + 1;
                    console.log(status + ' / ' + error + ' / ' + count);
                }
            })).then(function(data, textStatus, jqXHR) {
                console.log(i + ' / ' + textStatus + ' / ' + count);
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
                sortinstalinks();
            });
        } else {
            return;
        }
    });
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
        // a selection of Instagram posts
        // eg. https://instagram.com/p/8gMTgjo6lK/

        // links without errors

        var instalinks = [
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
        ];

        /*
                // links with errors
                var instalinks = [
                    'xxxxxx',
                    'xxxxxx',
                    'BBDNddZPKsx',
                    'xxxxxx',
                    'xxxxxx',
                    'xxxxxx',
                    'xxxxxx',
                    'BBEIIlioTSF',
                    'BA-vDsLKowA',
                    'BBGLtUCKo0S',
                    'BBAcH-LCEUD',
                    'xxxxxx',
                    'xxxxxx',
                    'xxxxxx',
                    'BAzlDkePKke'
                ];
        */
        // shuffle the links to that each time the page loads it shows different links.
        var instalinksrand = shuffle(instalinks);

        getInstagramData(instalinksrand, jQuery('#instgramelement'), 5);
    }

});
