jQuery(document).ready(function($) {
    // a selection of Instagram posts
    // eg. https://instagram.com/p/8gMTgjo6lK/
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
        ],
        instalinksrand = shuffle(instalinks),
        instgramelement = jQuery('#instgramelement');

    function getInstagramData(a) {
        jQuery.each(a, function(i, d) {
            jQuery.ajax({
                cache: false,
                dataType: "json", // or "jsonp" if we enabled it
                url: "php/instagram.php?media=" + d,
                success: function(data) {
                    var img = '<img src="' + data.entry_data.PostPage[0].media.display_src + '" alt="' + data.entry_data.PostPage[0].media.caption + '" />',
                    output = '<li data-id="' + i + '"><p class="num">' + pad(i + 1, 2, 0) + '</p>';
                    output += '<div class="image-box">';
                    output += '<a href="https://instagram.com/p/' + data.entry_data.PostPage[0].media.code + '" target="_blank">' + img + '</a>';
                    output += '</div>';
                    output += '<p class="desc">' + data.entry_data.PostPage[0].media.caption + '</p>';
                    output += '<p class="author"><strong>' + data.entry_data.PostPage[0].media.owner.username + '</strong> </p>';
                    output += '</li>';
                    instgramelement.append(output);
                },
                error: function(xhr, status, error) {
                    console.log('instagram code error: '+ error + '\n' + status);
                }
            }).promise().done(function() {
                sortinstalinks();
            });
            // how many items to return, count from 0
            return i < 4;
        });
    }

    function sortinstalinks() {
        instgramelement.children('li').sort(function(a, b) {
                var an = a.getAttribute('data-id'),
                    bn = b.getAttribute('data-id');

                if (an > bn) {
                    return 1;
                }
                if (an < bn) {
                    return -1;
                }
                return 0;
            })
            .detach().prependTo(instgramelement);
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

    getInstagramData(instalinksrand);
});
