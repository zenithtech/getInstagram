<?php
if ("POST" == $_SERVER["REQUEST_METHOD"]) {
    if (isset($_SERVER["HTTP_ORIGIN"])) {
        $address = "https://".$_SERVER["SERVER_NAME"];
        if (strpos($address, $_SERVER["HTTP_ORIGIN"]) !== 0) {
            exit("CSRF protection in POST request: detected invalid Origin header: ".$_SERVER["HTTP_ORIGIN"]);
        }
    }
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
        $start_position = strpos( $dataFile, '<script type="text/javascript">window._sharedData = ' );
        $trimmed_before = trim( substr($dataFile, $start_position) );
        $end_position = strpos( $trimmed_before, '</script>');     
        $trimmed = trim( substr( $trimmed_before, 0, $end_position) );
        $jsondata = substr( $trimmed, 52, -1);
        header("HTTP/1.0 200 OK");

        if(array_key_exists('callback', $_GET)){
            header('Content-Type: text/javascript; charset=utf8');
            $callback = $_GET['callback'];
            return $callback."(".$jsondata.");";
        }
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

if(!empty($_GET['user'])) {
    $user  = sanitize_input( $_GET['user'] );
}
if (!empty($_GET['media'])) {
    $media = sanitize_input( $_GET['media'] );
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
    echo process_data($dataFile, $requestType);
}
// media
elseif( empty($user) && !empty($media) ){
    $requestType = "media";
    $dataFile = @ file_get_contents("https://instagram.com/p/".$media, NULL, $context);
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
    die();
};
?>