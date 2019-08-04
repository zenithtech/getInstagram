<!DOCTYPE html>
<html lang="en">
    <head>
    	<meta charset="UTF-8">
    	<title>Instagram via HTTP</title>
    	<link rel="stylesheet" href="css/css.css" type="text/css" />
    </head>
    <body>
    	<ul id="instgramelement">
    		<!-- echo the content here -->
    	</ul>	
    </body>

    <script rel="text/javascript" src="js/getInstagram.js"></script>

    <script type="text/javascript">
        window.getInstagram(
          "php/instagram.php",
          false,
          document.getElementById('instgramelement'),
          12,
          'facebook'
        );
    </script>
</html>