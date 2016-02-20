<?php
$http_origin = $_SERVER['HTTP_ORIGIN'];
/** restrict API to domain level **/
$domains_allowed = array('https://zenitht.com');
if(in_array( $http_origin, $domains_allowed )){
  header('Access-Control-Allow-Origin: $http_origin');
}

/** functions **/
// sanitize input
function sanitize_input($input){
    $input = trim($input);
    $input = stripslashes($input);
    $input = strip_tags($input);
    $input = htmlspecialchars($input);
    return $input;
};
// process data
function process_data($dataFile, $requestType){
    $data_length = strlen($dataFile);
    if( $data_length > 0 ){
        $start_position = strpos( $dataFile, '<script type="text/javascript">window._sharedData = ' ); // start position
        $trimmed_before = trim( substr($dataFile, $start_position) ); // trim preceding content
        $end_position = strpos( $trimmed_before, '</script>'); // end position        
        $trimmed = trim( substr( $trimmed_before, 0, $end_position) ); // trim content
        $jsondata = substr( $trimmed, 52, -1); // remove extra trailing ";"
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
        die("invalid $requestType");
    }
};

// process user input
$user  = sanitize_input( $_GET['user'] ); // instagram user name
$media = sanitize_input( $_GET['media'] ); // media shortcode

/***** set context *****/
$context = stream_context_create(array(
    'http' => array(
        'timeout' => 10 // in seconds
        )
    )
); 

/***** validate request type and return response *****/
// user, including last 20 media posts
if( !empty($user) && empty($media) ){
    $requestType = "user";
    $dataFile = @ file_get_contents("http://instagram.com/".$user,  NULL, $context);
    echo process_data($dataFile, $requestType);
}
// media
elseif( empty($user) && !empty($media) ){
    $requestType = "media";
    $dataFile = @ file_get_contents("http://instagram.com/p/".$media, NULL, $context);
    echo process_data($dataFile, $requestType);
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
    die("invalid parameters");
};
?>