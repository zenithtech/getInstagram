<?php
function theme_enqueue() {
  wp_enqueue_script( 'get-instagram-js', get_theme_file_uri( '/js/getInstagram.js' ), array( 'jquery' ), '1.0', true );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue' );

// start INSTAGRAM FUCNTION
function instagram_process_data($dataFile, $requestType){
    $data_length = strlen($dataFile);
    if( $data_length > 0 ){
        $start_position = strpos( $dataFile, '<script type="text/javascript">window._sharedData = ' );
        $trimmed_before = trim( substr($dataFile, $start_position) );
        $end_position = strpos( $trimmed_before, '</script>');    
        $trimmed = trim( substr( $trimmed_before, 0, $end_position) );
        $jsondata = substr( $trimmed, 52, -1);
        header("HTTP/1.0 200 OK");

        // JSONP response
        if(array_key_exists('callback', $_GET)){
            header('Content-Type: text/javascript; charset=utf8');
            $callback = $_GET['callback'];
            return $callback."(".$jsondata.");";
        }
        // JSON response
        else {
            header('Content-Type: application/json; charset=utf-8');
            return $jsondata;
        }
    } else {
        // invalid username or media
        header("HTTP/1.0 400 BAD REQUEST");
        header('Content-Type: text/html; charset=utf-8');
        die();
    }
};

add_action( 'wp_ajax_nopriv_get_instagram', 'get_instagram' );
add_action( 'wp_ajax_get_instagram', 'get_instagram' );
function get_instagram() {
  if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
    if(!empty($_GET['user'])) {
        $user  = sanitize_input( $_GET['user'] ); // instagram user name
    }
    if (!empty($_GET['media'])) {
        $media = sanitize_input( $_GET['media'] ); // media shortcode
    }

    /***** set context *****/
    $context = stream_context_create(array(
        'http' => array(
            'timeout' => 10 // in seconds
            )
        )
    ); 

    /***** validate request type and return response *****/
    // user
    if( !empty($user) && empty($media) ){
        $requestType = "user";
        $dataFile = @ file_get_contents("https://instagram.com/".$user,  NULL, $context);
        echo instagram_process_data($dataFile, $requestType);
    }
    // media
    elseif( empty($user) && !empty($media) ){
        $requestType = "media";
        $dataFile = @ file_get_contents("https://instagram.com/p/".$media, NULL, $context);
        echo instagram_process_data($dataFile, $requestType);
    }
    // invalid : two or more parameters were passed
    elseif( !empty($user) && !empty($media) ){
        header("HTTP/1.0 400 BAD REQUEST");
        header('Content-Type: text/html; charset=utf-8');
        die("only one parameter allowed");
    }
    // invalid : none or invalid parameters were passed
    elseif( empty($user) && empty($media) ){
        header("HTTP/1.0 400 BAD REQUEST");
        header('Content-Type: text/html; charset=utf-8');
        die();
    };
    die();
  }
}

function instagram_shortcode( $atts = [] ){
  $atts = array_change_key_case((array)$atts, CASE_LOWER);
  ob_start();

  include(dirname(__FILE__).'/inc/instagram.php');
  $html = ob_get_contents();
  ob_end_clean();
  return $html;
}
add_shortcode("instagram", "instagram_shortcode");
