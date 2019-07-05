<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Instagram via HTTP</title>
	<link rel="stylesheet" href="css/css.css">
</head>
<body>
	<ul id="instgramelement">
		<!-- echo the content here -->
	</ul>	
</body>

<script rel="text/javascript" src="js/getInstagram.js"></script>

<script type="text/javascript">
    // Set a selection of Instagram posts by their IDs
    // eg. 8gMTgjo6lK from https://instagram.com/p/8gMTgjo6lK/
    // includes some bad requests for testing.
    window.instalinks = [
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
        'BAxb0t1BFf6',
        'BADJZBgBFRO',
        'xxxxxx', // bad request
        'BBEIIlioTSF',
        'BBAcH-LCEUD',
        'xxxxxx', // bad request
        '88qlkdiEfD',
        'BAzlDkePKke'
    ];

    // Shuffle the links so that they're in random order.
    instalinksrand = shuffle(instalinks);

    // Generate from supplied list above, no limit
    // window.getInstagram("php/instagram.php", instalinks, document.getElementById('instgramelement'), 5, false);

    // Generate by user ID, maximum 12
    window.getInstagram("php/instagram.php", false, document.getElementById('instgramelement'), 12, 'nowserving');
</script>

</html>